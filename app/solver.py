"""
solver.py
---------
Google OR-Tools CP-SAT çözücüsü ile UPMSP çözümü.

Matematiksel Model:
  - Karar: Her işi bir makineye ve sıralama pozisyonuna ata
  - Kısıt: Her iş tam olarak 1 makineye; işler üst üste binmesin
  - Hedef: W1*Cmax + W2*TotalTardiness + W3*NumTardy (Weighted Sum)

Çözüm süreci adım adım loglanır (SolutionCallback).
"""
from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Optional

from ortools.sat.python import cp_model


# ─── Veri Yapısı ────────────────────────────────────────────────────────────

@dataclass
class ProblemData:
    n: int          # iş sayısı
    m: int          # makine sayısı
    P: dict         # P[j][k] işlem süresi (int)
    S: dict         # S[i][j][k] hazırlık süresi (int) — i=-1 kukla iş
    D: dict         # D[j] teslim tarihi (float → *10 → int için scale)


@dataclass
class SolverConfig:
    W1: float = 0.5    # Cmax ağırlığı
    W2: float = 0.4    # Toplam Gecikme ağırlığı
    W3: float = 0.1    # Geciken İş Sayısı ağırlığı
    time_limit: int = 60   # saniye cinsinden zaman limiti
    scale: int = 100        # float→int ölçek çarpanı (CP-SAT integer ister)


@dataclass
class SolverResult:
    status: str
    Cmax: float
    total_tardiness: float
    num_tardy: int
    schedule: dict   # schedule[k] = [(job_id, start, end), ...]
    solve_time: float
    objective_value: float


# ─── Çözüm Adımı Loglaması ──────────────────────────────────────────────────

class StepLogger(cp_model.CpSolverSolutionCallback):
    """CP-SAT yeni bir iyileşme bulduğunda çağrılan callback."""

    def __init__(self, Cmax_var, tardiness_vars, n, scale):
        super().__init__()
        self._Cmax = Cmax_var
        self._tards = tardiness_vars
        self._n = n
        self._scale = scale
        self._step = 0
        self._start = time.time()

    def on_solution_callback(self):
        self._step += 1
        elapsed = time.time() - self._start
        cmax_val = self.Value(self._Cmax) / self._scale
        tard_val = sum(self.Value(t) for t in self._tards) / self._scale
        print(
            f"  [STEP {self._step:3d}]  t={elapsed:6.2f}s  |"
            f"  Cmax={cmax_val:7.2f}  |"
            f"  Toplam Gecikme={tard_val:8.2f}"
        )


# ─── Ana Çözücü ─────────────────────────────────────────────────────────────

def solve(data: ProblemData, cfg: SolverConfig) -> SolverResult:
    """
    CP-SAT modeli kurarak UPMSP problemini çözer.

    Model mimarisi:
      1. Her (j, k) çifti için bir IntervalVar → işin makine üzerindeki zaman dilimi
      2. Her iş için OptionalIntervalVar → işin o makinede YAPILIP YAPILMADIĞI
      3. NoOverlap kısıtı → bir makinede aynı anda 2 iş yapılamaz
      4. Sıra bağımlı hazırlık süresi → Circuit kısıtı yerine Big-M tarzı
         koşullu kısıtlar (arc seçimi)
      5. Amaç = W1*Cmax + W2*sum(tardiness_j) + W3*sum(U_j)  (tümü *scale integer)
    """
    n, m = data.n, data.m
    sc   = cfg.scale
    BIG  = int(sum(data.P[j][k] for j in range(n) for k in range(m)) * sc * 2)

    model = cp_model.CpModel()

    # ── Değişkenler ──────────────────────────────────────────────────────────

    # start_var[j][k] : j işinin k makinesindeki başlangıç zamanı (*scale)
    start_var  = {}
    end_var    = {}
    opt_intv   = {}   # OptionalInterval: j işi k makinesinde yapılıyorsa aktif
    assign_var = {}   # assign_var[j][k] ∈ {0,1} : j işi k'ya atandıysa 1

    for j in range(n):
        start_var[j]  = {}
        end_var[j]    = {}
        opt_intv[j]   = {}
        assign_var[j] = {}
        for k in range(m):
            dur = data.P[j][k] * sc
            a   = model.NewBoolVar(f"assign_j{j}_k{k}")
            s   = model.NewIntVar(0, BIG, f"start_j{j}_k{k}")
            e   = model.NewIntVar(0, BIG, f"end_j{j}_k{k}")
            iv  = model.NewOptionalIntervalVar(s, dur, e, a, f"intv_j{j}_k{k}")
            assign_var[j][k] = a
            start_var[j][k]  = s
            end_var[j][k]    = e
            opt_intv[j][k]   = iv

    print(f"\n[SOLVER] Değişkenler tanımlandı: {n*m*4} değişken")

    # ── Kısıt 1: Her iş TAM OLARAK 1 makineye atanır ────────────────────────
    for j in range(n):
        model.AddExactlyOne(assign_var[j][k] for k in range(m))
    print("[SOLVER] Kısıt 1: Atama kısıtları eklendi (her iş = 1 makine)")

    # ── Kısıt 2: Bir makinede aynı anda 2 iş olamaz (NoOverlap) ─────────────
    for k in range(m):
        model.AddNoOverlap([opt_intv[j][k] for j in range(n)])
    print("[SOLVER] Kısıt 2: NoOverlap kısıtları eklendi (çakışma engeli)")

    # ── Kısıt 3: Sıra-bağımlı hazırlık süreleri ─────────────────────────────
    # Eğer j işi k makinesinde i işinden SONRA geliyorsa:
    # start_j,k >= end_i,k + S[i][j][k]
    # "i işinden sonra j geldi" koşulunu order_var[i][j][k] ile modelliyoruz.
    print("[SOLVER] Kısıt 3: Hazırlık süresi kısıtları ekleniyor...")
    order_var = {}
    for k in range(m):
        for i in range(n):
            for j in range(n):
                if i == j:
                    continue
                sij = data.S[i][j][k] * sc
                b   = model.NewBoolVar(f"order_i{i}_j{j}_k{k}")
                order_var[(i, j, k)] = b
                # Eğer b=1 (i önce, j sonra, ikisi de k'da):
                # start_j >= end_i + S[i][j][k]
                # Eğer b=0: kısıt gevşek (BIG ile)
                model.Add(
                    start_var[j][k] >= end_var[i][k] + sij
                ).OnlyEnforceIf([b, assign_var[i][k], assign_var[j][k]])

                # Aynı makinede iki iş varsa biri önce olmak zorunda
                # (ya i-j ya da j-i)
                both_on_k = model.NewBoolVar(f"both_i{i}_j{j}_k{k}")
                model.AddBoolAnd([assign_var[i][k], assign_var[j][k]]).OnlyEnforceIf(both_on_k)
                model.AddBoolOr([assign_var[i][k].Not(), assign_var[j][k].Not()]).OnlyEnforceIf(both_on_k.Not())

    print("[SOLVER] Kısıt 3: Hazırlık süresi kısıtları eklendi")

    # ── Performans Değişkenleri ──────────────────────────────────────────────

    # C_j : j işinin tamamlanma zamanı
    C_j = []
    for j in range(n):
        cj = model.NewIntVar(0, BIG, f"C_j{j}")
        for k in range(m):
            model.Add(cj == end_var[j][k]).OnlyEnforceIf(assign_var[j][k])
        C_j.append(cj)

    # Cmax
    Cmax = model.NewIntVar(0, BIG, "Cmax")
    model.AddMaxEquality(Cmax, C_j)

    # Gecikme e_j+ = max(0, C_j - D_j)
    tards = []
    U_j   = []
    D_scaled = {j: int(data.D[j] * sc) for j in range(n)}

    for j in range(n):
        tard = model.NewIntVar(0, BIG, f"tard_j{j}")
        model.AddMaxEquality(tard, [C_j[j] - D_scaled[j], model.NewConstant(0)])
        tards.append(tard)

        # U_j: gecikiyor mu?
        uj = model.NewBoolVar(f"U_j{j}")
        model.Add(tard > 0).OnlyEnforceIf(uj)
        model.Add(tard == 0).OnlyEnforceIf(uj.Not())
        U_j.append(uj)

    total_tard = model.NewIntVar(0, BIG * n, "total_tard")
    model.Add(total_tard == sum(tards))

    num_tardy = model.NewIntVar(0, n, "num_tardy")
    model.Add(num_tardy == sum(U_j))

    print("[SOLVER] Performans değişkenleri tanımlandı (Cmax, Tardiness, U_j)")

    # ── Amaç Fonksiyonu: Ağırlıklı Toplam ──────────────────────────────────
    # Tam sayı ağırlıkları (100 ile çarpıyoruz)
    W1 = int(cfg.W1 * 100)
    W2 = int(cfg.W2 * 100)
    W3 = int(cfg.W3 * 100)
    model.Minimize(W1 * Cmax + W2 * total_tard + W3 * num_tardy * sc)
    print(f"[SOLVER] Amaç fonksiyonu kuruldu: W1={cfg.W1}×Cmax + W2={cfg.W2}×T + W3={cfg.W3}×L")

    # ── Çözücüyü Çalıştır ───────────────────────────────────────────────────
    solver = cp_model.CpSolver()
    solver.parameters.max_time_in_seconds = cfg.time_limit
    solver.parameters.log_search_progress = False

    callback = StepLogger(Cmax, tards, n, sc)

    print(f"\n[SOLVER] Çözüm aranıyor (max {cfg.time_limit}s)...")
    print("─" * 60)
    print(f"  {'ADIM':>5}  {'SÜRE':>8}  │  {'Cmax':>10}  │  {'Toplam Gecikme':>15}")
    print("─" * 60)

    t_start = time.time()
    status_code = solver.Solve(model, callback)
    t_elapsed = time.time() - t_start

    print("─" * 60)

    # ── Durum Çözümlemesi ────────────────────────────────────────────────────
    STATUS_MAP = {
        cp_model.OPTIMAL:    "OPTIMAL",
        cp_model.FEASIBLE:   "FEASIBLE",
        cp_model.INFEASIBLE: "INFEASIBLE",
        cp_model.UNKNOWN:    "UNKNOWN",
    }
    status = STATUS_MAP.get(status_code, "BILINMIYOR")

    if status_code not in (cp_model.OPTIMAL, cp_model.FEASIBLE):
        print(f"[SOLVER] ✗ Çözüm bulunamadı. Durum: {status}")
        return SolverResult(
            status=status, Cmax=0, total_tardiness=0,
            num_tardy=0, schedule={}, solve_time=t_elapsed, objective_value=0
        )

    # ── Sonuçları Derle ──────────────────────────────────────────────────────
    cmax_v   = solver.Value(Cmax) / sc
    tard_v   = solver.Value(total_tard) / sc
    ntardy_v = solver.Value(num_tardy)
    obj_v    = solver.ObjectiveValue()

    schedule = {k: [] for k in range(m)}
    for j in range(n):
        for k in range(m):
            if solver.Value(assign_var[j][k]) == 1:
                s = solver.Value(start_var[j][k]) / sc
                e = solver.Value(end_var[j][k]) / sc
                schedule[k].append((j, round(s, 2), round(e, 2)))

    # Her makine için işleri başlangıç zamanına göre sırala
    for k in range(m):
        schedule[k].sort(key=lambda x: x[1])

    print(f"\n[SOLVER] ✓ Durum: {status}  |  Süre: {t_elapsed:.2f}s")

    return SolverResult(
        status=status,
        Cmax=round(cmax_v, 2),
        total_tardiness=round(tard_v, 2),
        num_tardy=ntardy_v,
        schedule=schedule,
        solve_time=round(t_elapsed, 2),
        objective_value=round(obj_v, 2),
    )
