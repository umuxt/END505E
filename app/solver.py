"""
solver.py
---------
Google OR-Tools CP-SAT ile UPMSP Exact Çözücü.

Makale kısıtları:
  (2)+(3) : Her iş tam olarak 1 makineye atanır
  (4)+(5) : Akış dengesi — AddCircuit ile otomatik sağlanır
  (6)     : Cj ≥ Ci + Si,j,k + Pj,k  (sıra-bağımlı hazırlık)
  (9)     : NP[j][k]=0 → j işi k makinesine atanamaz
  (10)    : Cj ≥ 0
  (13)(14): ej+ = max(0, Cj − Dj)
  (16)(17): Uj ∈ {0,1}, ej+>0 ↔ Uj=1
"""
from __future__ import annotations

import time
from dataclasses import dataclass

from ortools.sat.python import cp_model


# ─── Veri Yapıları ───────────────────────────────────────────────────────────

@dataclass
class ProblemData:
    n:  int
    m:  int
    P:  dict   # P[j][k] → int
    S:  dict   # S[i][j][k] → float
    D:  dict   # D[j] → float
    NP: dict   # NP[j][k] → 0/1


@dataclass
class SolverConfig:
    W1: float = 0.5
    W2: float = 0.4
    W3: float = 0.1
    time_limit: int = 60
    scale: int = 100
    
    # Makaledeki M1-M3, M4 (AUGMECON) için eklenen parametreler
    obj_type: str = 'weighted'  # 'Cmax', 'T', 'L', veya 'weighted'
    T_bar: float | None = None  # (Kısıt 18)
    L_bar: int | None = None    # (Kısıt 19)

@dataclass
class SolverResult:
    status:           str
    Cmax:             float
    total_tardiness:  float
    num_tardy:        int
    schedule:         dict
    solve_time:       float
    objective_value:  float


# ─── Loglama ─────────────────────────────────────────────────────────────────

class StepLogger(cp_model.CpSolverSolutionCallback):
    def __init__(self, cmax_var, tard_vars, scale):
        super().__init__()
        self._cmax  = cmax_var
        self._tards = tard_vars
        self._scale = scale
        self._step  = 0
        self._t0    = time.time()

    def on_solution_callback(self):
        self._step += 1
        cmax = self.Value(self._cmax) / self._scale
        tard = sum(self.Value(t) for t in self._tards) / self._scale
        print(
            f"  [STEP {self._step:3d}]  t={time.time()-self._t0:6.2f}s  |"
            f"  Cmax={cmax:8.2f}  |  T (Total Tardiness)={tard:9.2f}"
        )


# ─── Ana Çözücü ──────────────────────────────────────────────────────────────

def solve(data: ProblemData, cfg: SolverConfig) -> SolverResult:
    n, m = data.n, data.m
    sc   = cfg.scale

    eligible_p = [data.P[j][k] for j in range(n) for k in range(m)
                  if data.NP[j][k] == 1]
    
    # BIG-M hesaplaması (CP-SAT için integer olmalı)
    total_p = sum(eligible_p)
    total_s = sum(
        max(data.S[i][j][k] for k in range(m))
        for i in range(n) for j in range(n) if i != j
    )
    # CP-SAT için tüm zaman kısıtları integer olmalıdır.
    BIG = int((total_p + total_s) * sc * 2 + 1000)

    model = cp_model.CpModel()

    # ── assign_var[j][k]: j işi k makinesinde mi? ────────────────────────────
    assign = [[model.NewBoolVar(f"asgn_{j}_{k}") for k in range(m)] for j in range(n)]

    # Kısıt (9): NP[j][k]=0 → atanamaz
    for j in range(n):
        for k in range(m):
            if data.NP[j][k] == 0:
                model.Add(assign[j][k] == 0)

    # Kısıt (2)+(3): Her iş tam 1 makineye
    for j in range(n):
        model.AddExactlyOne(assign[j])

    # ── Zaman Değişkenleri ───────────────────────────────────────────────────
    start = [[model.NewIntVar(0, BIG, f"s_{j}_{k}") for k in range(m)] for j in range(n)]
    end_  = [[model.NewIntVar(0, BIG, f"e_{j}_{k}") for k in range(m)] for j in range(n)]

    # Atanmayan işlerin zamanı = 0
    for j in range(n):
        for k in range(m):
            model.Add(start[j][k] == 0).OnlyEnforceIf(assign[j][k].Not())
            model.Add(end_[j][k]   == 0).OnlyEnforceIf(assign[j][k].Not())

    # ── Kısıt (4, 5, 6): AddCircuit ile Akış Dengesi ve Sıra-Bağımlı Hazırlık ──
    DUMMY = n  # Düğüm 0..n-1: İşler, Düğüm n: Kukla (Başlangıç/Bitiş)
    
    for k in range(m):
        arcs = []

        # 1. DUMMY Self-Loop: Makine hiç iş almazsa
        b_dd = model.NewBoolVar(f"a_{k}_dd")
        arcs.append((DUMMY, DUMMY, b_dd))

        for j in range(n):
            # 2. İş Self-Loop: Eğer iş bu makineye atanmadıysa devreden çıkması için self-loop atmalı!
            b_self = model.NewBoolVar(f"a_{k}_{j}_{j}")
            arcs.append((j, j, b_self))
            
            # İşin bu makinede self-loop atması <=> İşin bu makineye ATANMAMASI
            model.Add(b_self == 1).OnlyEnforceIf(assign[j][k].Not())
            model.Add(b_self == 0).OnlyEnforceIf(assign[j][k])

            # 3. DUMMY -> j : j bu makinedeki İLK iş
            b_dj = model.NewBoolVar(f"a_{k}_d_{j}")
            arcs.append((DUMMY, j, b_dj))
            
            # Kısıt (5,6): Eğer j ilk iş ise, start >= S[-1][j][k]
            s_dummy = int(data.S[-1][j][k] * sc)
            model.Add(start[j][k] >= s_dummy).OnlyEnforceIf(b_dj)

            # 4. j -> DUMMY : j bu makinedeki SON iş
            b_jd = model.NewBoolVar(f"a_{k}_{j}_d")
            arcs.append((j, DUMMY, b_jd))

            # 5. i -> j : i işinden hemen sonra j işi (Sıra-bağımlı hazırlık)
            for i in range(n):
                if i == j: continue
                b_ij = model.NewBoolVar(f"a_{k}_{i}_{j}")
                arcs.append((i, j, b_ij))

                # Kısıt (6): Eğer i'den sonra j geliyorsa, start_j >= end_i + S[i][j]
                sij = int(data.S[i][j][k] * sc)
                model.Add(start[j][k] >= end_[i][k] + sij).OnlyEnforceIf(b_ij)

        # CP-SAT devreyi kurar
        model.AddCircuit(arcs)

    # ── Performans Değişkenleri ───────────────────────────────────────────────
    C_j = [model.NewIntVar(0, BIG, f"C_{j}") for j in range(n)]
    for j in range(n):
        # C_j = Σ_k C_{j,k}
        model.Add(C_j[j] == sum(end_[j][k] for k in range(m)))

        for k in range(m):
            # Eğer iş k makinesindeyse, bitiş = başlama + işlem süresi
            p_jk = int(data.P[j][k] * sc)
            model.Add(end_[j][k] == start[j][k] + p_jk).OnlyEnforceIf(assign[j][k])

    Cmax = model.NewIntVar(0, BIG, "Cmax")
    model.AddMaxEquality(Cmax, C_j)

    D_sc  = {j: int(data.D[j] * sc) for j in range(n)}
    tards = []
    U_j   = []
    for j in range(n):
        tard = model.NewIntVar(0, BIG, f"tard_{j}")
        model.AddMaxEquality(tard, [C_j[j] - D_sc[j], model.NewConstant(0)])
        tards.append(tard)
        
        uj = model.NewBoolVar(f"U_{j}")
        # Kısıt (16): ej+ ≤ V × Uj
        model.Add(tard <= BIG * uj)
        model.Add(tard > 0).OnlyEnforceIf(uj)
        model.Add(tard == 0).OnlyEnforceIf(uj.Not())
        U_j.append(uj)

    total_tard = model.NewIntVar(0, BIG * n, "TotalTard")
    model.Add(total_tard == sum(tards))
    num_tardy = model.NewIntVar(0, n, "NumTardy")
    model.Add(num_tardy == sum(U_j))

    # ── Kısıt (18) ve (19): AUGMECON sınır kısıtları ─────────────────────────
    if cfg.T_bar is not None:
        model.Add(total_tard <= int(cfg.T_bar * sc))
    if cfg.L_bar is not None:
        model.Add(num_tardy <= cfg.L_bar)

    # ── Amaç ─────────────────────────────────────────────────────────────────
    if cfg.obj_type == 'Cmax':
        model.Minimize(Cmax)
    elif cfg.obj_type == 'T':
        model.Minimize(total_tard)
    elif cfg.obj_type == 'L':
        model.Minimize(num_tardy)
    else:  # 'weighted'
        W1, W2, W3 = int(cfg.W1 * 1000), int(cfg.W2 * 1000), int(cfg.W3 * 1000)
        model.Minimize(W1 * Cmax + W2 * total_tard + W3 * num_tardy * sc)

    # ── Çöz ──────────────────────────────────────────────────────────────────
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = cfg.time_limit
    solver.parameters.num_search_workers  = 8

    cb = StepLogger(Cmax, tards, sc)
    
    t0 = time.time()
    status_code = solver.Solve(model, cb)
    elapsed = time.time() - t0
    
    STATUS_MAP = {
        cp_model.OPTIMAL:    "OPTIMAL",
        cp_model.FEASIBLE:   "FEASIBLE",
        cp_model.INFEASIBLE: "INFEASIBLE",
        cp_model.UNKNOWN:    "UNKNOWN",
    }
    status = STATUS_MAP.get(status_code, "BİLİNMİYOR")

    if status_code not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        return SolverResult(status=status, Cmax=0, total_tardiness=0,
                            num_tardy=0, schedule={}, solve_time=round(elapsed, 2),
                            objective_value=0)

    cmax_v   = solver.Value(Cmax) / sc
    tard_v   = solver.Value(total_tard) / sc
    ntardy_v = solver.Value(num_tardy)

    schedule = {k: [] for k in range(m)}
    for j in range(n):
        for k in range(m):
            if solver.Value(assign[j][k]) == 1:
                s = solver.Value(start[j][k]) / sc
                e = solver.Value(end_[j][k])  / sc
                schedule[k].append((j, round(s, 2), round(e, 2)))

    for k in range(m):
        schedule[k].sort(key=lambda x: x[1])

    # Normalize objective value
    obj_val = solver.ObjectiveValue()
    if cfg.obj_type == 'weighted':
        obj_val /= 1000.0
    obj_val /= sc

    return SolverResult(
        status=status,
        Cmax=round(cmax_v, 2),
        total_tardiness=round(tard_v, 2),
        num_tardy=ntardy_v,
        schedule=schedule,
        solve_time=round(elapsed, 2),
        objective_value=round(obj_val, 2),
    )


# ─── AUGMECON: Artırılmış ε-Kısıt Yöntemi ──────────────────────────────────

def solve_augmecon(data: ProblemData, time_limit: int = 8, grid_T: int = 5, grid_L: int | None = None) -> dict:
    """
    Rapor Bölüm 3.2.4 & 5.1.2: AUGMECON Yöntemi
    ─────────────────────────────────────────────
    Adım 1: Payoff tablosunu hesapla (M1, M2, M3)
    Adım 2: T ve L aralıklarını hesapla, grid noktaları belirle
    Adım 3: Her ε noktasında T ≤ T̄ ve L ≤ L̄ kısıtları altında Cmax minimize et
    Adım 4: Non-dominated (Pareto) çözümleri filtrele
    Adım 5: Pareto cephesini ve grid bilgisini döndür
    """
    # --- Adım 1: Payoff Table ---
    cfg_m1 = SolverConfig(obj_type='Cmax', time_limit=time_limit)
    cfg_m2 = SolverConfig(obj_type='T',    time_limit=time_limit)
    cfg_m3 = SolverConfig(obj_type='L',    time_limit=time_limit)

    r_m1 = solve(data, cfg_m1)
    r_m2 = solve(data, cfg_m2)
    r_m3 = solve(data, cfg_m3)

    payoff = {
        'M1': {'Cmax': r_m1.Cmax, 'T': r_m1.total_tardiness, 'L': r_m1.num_tardy},
        'M2': {'Cmax': r_m2.Cmax, 'T': r_m2.total_tardiness, 'L': r_m2.num_tardy},
        'M3': {'Cmax': r_m3.Cmax, 'T': r_m3.total_tardiness, 'L': r_m3.num_tardy},
    }

    # --- Adım 2: Grid aralıkları (Rapor: 20 adım T için, L için tam sayı aralığı) ---
    T_min = min(payoff['M1']['T'], payoff['M2']['T'], payoff['M3']['T'])
    T_max = max(payoff['M1']['T'], payoff['M2']['T'], payoff['M3']['T'])
    L_min = min(payoff['M1']['L'], payoff['M2']['L'], payoff['M3']['L'])
    L_max = max(payoff['M1']['L'], payoff['M2']['L'], payoff['M3']['L'])

    # T grid: grid_T adım
    if T_max > T_min:
        T_step = (T_max - T_min) / max(grid_T - 1, 1)
        T_grid = [round(T_min + i * T_step, 2) for i in range(grid_T)]
    else:
        T_grid = [T_max]

    # L grid: her tam sayı değeri (L aralığı genellikle küçüktür)
    L_vals = list(range(int(L_min), int(L_max) + 1)) if grid_L is None else list(range(int(L_min), int(L_min) + grid_L))

    total_iters = len(T_grid) * len(L_vals)

    # --- Adım 3 & 4: Her grid noktasında çöz, Pareto filtrele ---
    all_solutions = []
    for L_bar in L_vals:
        for T_bar in T_grid:
            cfg = SolverConfig(
                obj_type='Cmax',
                time_limit=time_limit,
                T_bar=T_bar,
                L_bar=L_bar
            )
            r = solve(data, cfg)
            if r.status in ('OPTIMAL', 'FEASIBLE'):
                all_solutions.append({
                    'Cmax': r.Cmax,
                    'T':    r.total_tardiness,
                    'L':    r.num_tardy,
                    'eps_T': T_bar,
                    'eps_L': L_bar,
                })

    # --- Non-dominated filtresi (Pareto) ---
    def is_dominated(sol, others):
        for other in others:
            if other is sol:
                continue
            if (other['Cmax'] <= sol['Cmax'] and
                other['T']    <= sol['T'] and
                other['L']    <= sol['L'] and
                (other['Cmax'] < sol['Cmax'] or other['T'] < sol['T'] or other['L'] < sol['L'])):
                return True
        return False

    pareto = [s for s in all_solutions if not is_dominated(s, all_solutions)]

    # Tekrarlananları kaldır (aynı Cmax/T/L tripleti)
    seen = set()
    unique_pareto = []
    for s in pareto:
        key = (s['Cmax'], s['T'], s['L'])
        if key not in seen:
            seen.add(key)
            unique_pareto.append(s)

    # Cmax'a göre sırala
    unique_pareto.sort(key=lambda x: x['Cmax'])

    return {
        'payoff': payoff,
        'grid_info': {
            'T_min': T_min, 'T_max': T_max,
            'L_min': L_min, 'L_max': L_max,
            'T_steps': len(T_grid), 'L_steps': len(L_vals),
            'total_iterations': total_iters,
        },
        'pareto_solutions': unique_pareto,
        'all_solutions_count': len(all_solutions),
    }
