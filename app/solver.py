"""
solver.py
---------
Google OR-Tools CP-SAT ile UPMSP Exact Çözücü.

Makale kısıtları:
  (2)+(3) : Her iş tam olarak 1 makineye atanır
  (4)+(5) : Akış dengesi — NoOverlap ile otomatik sağlanır
  (6)     : Cj ≥ Ci + Si,j,k + Pj,k  (sıra-bağımlı hazırlık)
  (9)     : NP[j][k]=0 → j işi k makinesine atanamaz
  (10)    : Cj ≥ 0
  (13)(14): ej+ = max(0, Cj − Dj)
  (16)(17): Uj ∈ {0,1}, ej+>0 ↔ Uj=1

Kısıt (6) modelleme yaklaşımı:
  Sıra-bağımlı hazırlık için "rank-based" yardımcı değişken:
    pos[j][k]: j işinin k makinesindeki sırası (0 = bu makinede yok)
  Eğer j ve i aynı k makinesinde ve pos[i][k] + 1 == pos[j][k] ise
    start[j][k] ≥ end_[i][k] + S[i][j][k]
  Bu, makalede açıklanan Big-M kısıtının CP-SAT uyarlamasıdır.

  NOT: Büyük problemlerde AddCircuit daha güçlüdür, ancak assign_var
  etkileşimi CP-SAT'ta nazik yapılandırma gerektirir. Bu implementasyonda
  OptionalIntervalVar + NoOverlap + koşullu hazırlık kısıtlarını kullanıyoruz;
  bu, tüm makale kısıtlarını eksiksiz karşılar.
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
    S:  dict   # S[i][j][k] → int  (i=-1: kukla)
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
            f"  Cmax={cmax:8.2f}  |  Toplam Gecikme={tard:9.2f}"
        )


# ─── Ana Çözücü ──────────────────────────────────────────────────────────────

def solve(data: ProblemData, cfg: SolverConfig) -> SolverResult:
    n, m = data.n, data.m
    sc   = cfg.scale

    eligible_p = [data.P[j][k] for j in range(n) for k in range(m)
                  if data.NP[j][k] == 1]
    BIG = (sum(eligible_p) + sum(
        max(data.S[i][j][k] for k in range(m))
        for i in range(n) for j in range(n) if i != j
    )) * sc * 2 + 1

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
    print("[SOLVER] Kısıt (2)+(3)+(9): Atama + NP kısıtları eklendi")

    # ── Zaman Değişkenleri ───────────────────────────────────────────────────
    start = [[model.NewIntVar(0, BIG, f"s_{j}_{k}") for k in range(m)] for j in range(n)]
    end_  = [[model.NewIntVar(0, BIG, f"e_{j}_{k}") for k in range(m)] for j in range(n)]

    # Atanmayan işlerin zamanı = 0
    for j in range(n):
        for k in range(m):
            model.Add(start[j][k] == 0).OnlyEnforceIf(assign[j][k].Not())
            model.Add(end_[j][k]   == 0).OnlyEnforceIf(assign[j][k].Not())

    # ── Kısıt (4, 5, 6): AddCircuit ile Akış Dengesi ve Sıra-Bağımlı Hazırlık ──
    # Makaledeki X_{i,j,k} değişkenleri AddCircuit içindeki arc'lara eşittir.
    DUMMY = n  # Düğüm 0..n-1: İşler, Düğüm n: Kukla (Başlangıç/Bitiş)
    
    arc_lit: list[dict] = [{} for _ in range(m)]

    for k in range(m):
        arcs = []

        # 1. DUMMY Self-Loop: Makine hiç iş almazsa
        b = model.NewBoolVar(f"a_{k}_dd")
        arc_lit[k][(DUMMY, DUMMY)] = b
        arcs.append((DUMMY, DUMMY, b))

        for j in range(n):
            # 2. İş Self-Loop: Eğer iş bu makineye atanmadıysa devreden çıkması için self-loop atmalı!
            b_self = model.NewBoolVar(f"a_{k}_{j}_{j}")
            arc_lit[k][(j, j)] = b_self
            arcs.append((j, j, b_self))
            
            # İşin bu makinede self-loop atması <=> İşin bu makineye ATANMAMASI
            model.Add(b_self == 1).OnlyEnforceIf(assign[j][k].Not())
            model.Add(b_self == 0).OnlyEnforceIf(assign[j][k])

            # 3. DUMMY -> j : j bu makinedeki İLK iş
            b_dj = model.NewBoolVar(f"a_{k}_d_{j}")
            arc_lit[k][(DUMMY, j)] = b_dj
            arcs.append((DUMMY, j, b_dj))
            
            # Kısıt (5,6): Eğer j ilk iş ise, start >= S[-1][j][k]
            s_dummy = data.S[-1][j][k] * sc
            model.Add(start[j][k] >= s_dummy).OnlyEnforceIf(b_dj)
            model.Add(end_[j][k] == start[j][k] + data.P[j][k] * sc).OnlyEnforceIf(b_dj)

            # 4. j -> DUMMY : j bu makinedeki SON iş
            b_jd = model.NewBoolVar(f"a_{k}_{j}_d")
            arc_lit[k][(j, DUMMY)] = b_jd
            arcs.append((j, DUMMY, b_jd))

            # 5. i -> j : i işinden hemen sonra j işi (Sıra-bağımlı hazırlık)
            for i in range(n):
                if i == j: continue
                b_ij = model.NewBoolVar(f"a_{k}_{i}_{j}")
                arc_lit[k][(i, j)] = b_ij
                arcs.append((i, j, b_ij))

                # Kısıt (6): Eğer i'den sonra j geliyorsa, start_j >= end_i + S[i][j]
                sij = data.S[i][j][k] * sc
                model.Add(start[j][k] >= end_[i][k] + sij).OnlyEnforceIf(b_ij)
                model.Add(end_[j][k] == start[j][k] + data.P[j][k] * sc).OnlyEnforceIf(b_ij)

        # CP-SAT devreyi kurar
        model.AddCircuit(arcs)

    print("[SOLVER] Kısıt (4)+(5)+(6): AddCircuit ile Sıra-Bağımlı Hazırlık eklendi")

    # ── Performans Değişkenleri ───────────────────────────────────────────────
    C_j = [model.NewIntVar(0, BIG, f"C_{j}") for j in range(n)]
    for j in range(n):
        for k in range(m):
            model.Add(C_j[j] == end_[j][k]).OnlyEnforceIf(assign[j][k])

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
        model.Add(tard > 0).OnlyEnforceIf(uj)
        model.Add(tard == 0).OnlyEnforceIf(uj.Not())
        U_j.append(uj)

    total_tard = model.NewIntVar(0, BIG * n, "TotalTard")
    model.Add(total_tard == sum(tards))
    num_tardy = model.NewIntVar(0, n, "NumTardy")
    model.Add(num_tardy == sum(U_j))
    print("[SOLVER] Performans değişkenleri tanımlandı (Cmax, ej+, Uj)")

    # ── Kısıt (18) ve (19): AUGMECON sınır kısıtları ─────────────────────────
    if cfg.T_bar is not None:
        model.Add(total_tard <= int(cfg.T_bar * sc))
        print(f"[SOLVER] Kısıt (18): Toplam Gecikme ≤ {cfg.T_bar}")
    if cfg.L_bar is not None:
        model.Add(num_tardy <= cfg.L_bar)
        print(f"[SOLVER] Kısıt (19): Geciken İş Sayısı ≤ {cfg.L_bar}")

    # ── Amaç ─────────────────────────────────────────────────────────────────
    if cfg.obj_type == 'Cmax':
        model.Minimize(Cmax)
        print("[SOLVER] Amaç (M1): Min Cmax")
    elif cfg.obj_type == 'T':
        model.Minimize(total_tard)
        print("[SOLVER] Amaç (M2): Min T (Toplam Gecikme)")
    elif cfg.obj_type == 'L':
        model.Minimize(num_tardy)
        print("[SOLVER] Amaç (M3): Min L (Geciken İş Sayısı)")
    else:  # 'weighted'
        W1 = int(cfg.W1 * 1000)
        W2 = int(cfg.W2 * 1000)
        W3 = int(cfg.W3 * 1000)
        model.Minimize(W1 * Cmax + W2 * total_tard + W3 * num_tardy * sc)
        print(f"[SOLVER] Amaç: Min {cfg.W1}·Cmax + {cfg.W2}·T + {cfg.W3}·L")

    # ── Çöz ──────────────────────────────────────────────────────────────────
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = cfg.time_limit
    solver.parameters.log_search_progress = False
    solver.parameters.num_search_workers  = 8

    cb = StepLogger(Cmax, tards, sc)

    print(f"\n[SOLVER] Çözüm aranıyor (max {cfg.time_limit}s, 8 worker)...")
    print("─" * 65)
    print(f"  {'ADIM':>5}  {'SÜRE':>8}  │  {'Cmax':>10}  │  {'Toplam Gecikme':>16}")
    print("─" * 65)

    t0          = time.time()
    status_code = solver.Solve(model, cb)
    elapsed     = time.time() - t0
    print("─" * 65)

    STATUS_MAP = {
        cp_model.OPTIMAL:    "OPTIMAL",
        cp_model.FEASIBLE:   "FEASIBLE",
        cp_model.INFEASIBLE: "INFEASIBLE",
        cp_model.UNKNOWN:    "UNKNOWN",
    }
    status = STATUS_MAP.get(status_code, "BİLİNMİYOR")

    if status_code not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        print(f"[SOLVER] ✗ {status}")
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

    print(f"\n[SOLVER] ✓ {status}  Cmax={cmax_v:.2f}  T={tard_v:.2f}  L={ntardy_v}  ({elapsed:.2f}s)")

    return SolverResult(
        status=status,
        Cmax=round(cmax_v, 2),
        total_tardiness=round(tard_v, 2),
        num_tardy=ntardy_v,
        schedule=schedule,
        solve_time=round(elapsed, 2),
        objective_value=round(solver.ObjectiveValue(), 2),
    )
