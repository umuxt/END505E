"""
solver_milp.py
--------------
Makaledeki MILP (Karma Tam Sayılı Doğrusal Programlama) formülasyonunun 
birebir Python uygulaması.

Çözücü: OR-Tools Linear Solver (SCIP Backend)
Bu modül, makale denklemlerine (2-17) %100 sadık kalacak şekilde kurgulanmıştır.

Modellenen Denklemler:
  (1)  Min Cmax
  (2)  Her j işi tam olarak bir makineye ve bir öncüle atanır
  (3)  Her i işi tam olarak bir ardıla atanır
  (4)  Akış dengesi (Flow balance)
  (5)  Her makinede en fazla bir iş dizisi başlar
  (6)  Hazırlık süreli tamamlanma zamanı (Big-M kısıtı)
  (7)  C0 = 0 (Kukla iş zamanı)
  (8)  Cj <= Cmax
  (9)  NP[j][k] kısıtı (DÜZELTİLMİŞ: Her k için ayrı kısıt)
  (12) Min T (Toplam Gecikme)
  (13) Cj - Dj = ej+ - ej-
  (15) Min L (Geciken İş Sayısı)
  (16) ej+ <= V * Uj (DÜZELTİLMİŞ: Eşitsizlik yapıldı)
"""
from __future__ import annotations

import time
from dataclasses import dataclass
from ortools.linear_solver import pywraplp
from app.solver import ProblemData, SolverConfig, SolverResult

def solve_milp(data: ProblemData, cfg: SolverConfig) -> SolverResult:
    n, m = data.n, data.m
    
    # SCIP çözücüsünü başlat
    solver = pywraplp.Solver.CreateSolver('SCIP')
    if not solver:
        print("[HATA] SCIP çözücü bulunamadı.")
        return SolverResult("ERROR", 0, 0, 0, {}, 0, 0)

    # ── Big-M (V) Değerinin Sıkı (Tight) Hesaplanması ────────────────────────
    # Sayısal kararlılık için V, mümkün olan en küçük üst sınır olmalıdır.
    V = sum(max(data.P[j][k] for k in range(m)) for j in range(n)) 
    V += sum(max(data.S[i][j][k] for k in range(m)) for i in range(-1, n) for j in range(n) if i != j)
    V = V * 1.5 # Güvenlik payı

    # ── Karar Değişkenleri ───────────────────────────────────────────────────
    # X[i][j][k]: i işinden sonra j işi k makinesinde geliyorsa 1 (Makale: X_ijk)
    # i = -1 (veya n) kukla başlangıç işini temsil eder (Makale: job 0)
    X = {}
    nodes = list(range(n)) + [n] # n is the dummy node (Makale'deki 0)
    
    for i in nodes:
        for j in range(n):
            if i == j: continue
            for k in range(m):
                X[i, j, k] = solver.BoolVar(f'X_{i}_{j}_{k}')

    # C[j]: j işinin tamamlanma zamanı (Makale: C_j)
    C = [solver.NumVar(0, V, f'C_{j}') for j in range(n)]
    C_dummy = solver.NumVar(0, 0, 'C_dummy') # C0 = 0 (Kısıt 7)

    # Cmax: Yayılma süresi (Makale: Cmax)
    Cmax = solver.NumVar(0, V, 'Cmax')

    # e_plus[j]: Gecikme süresi (Makale: ej+)
    e_plus = [solver.NumVar(0, V, f'e_plus_{j}') for j in range(n)]
    # e_minus[j]: Erken bitme süresi (Makale: ej-)
    e_minus = [solver.NumVar(0, V, f'e_minus_{j}') for j in range(n)]

    # U[j]: Geciken iş göstergesi (Makale: Uj)
    U = [solver.BoolVar(f'U_{j}') for j in range(n)]

    # ── Kısıtlar ─────────────────────────────────────────────────────────────

    # (2) Her j işinin tam olarak bir öncülü vardır (bir makineye atanır)
    for j in range(n):
        solver.Add(solver.Sum(X[i, j, k] for i in nodes if i != j for k in range(m)) == 1)

    # (3) Her i işinin tam olarak bir ardılı vardır
    for i in range(n):
        solver.Add(solver.Sum(X[i, j, k] for j in nodes if j != i for k in range(m)) == 1)
        # Not: j=n (dummy) ardıl olabilir, bu makinenin son işi demektir.
        # X[i, n, k] değişkenini de eklememiz gerekiyor.
        for k in range(m):
            if (i, n, k) not in X:
                X[i, n, k] = solver.BoolVar(f'X_{i}_{n}_{k}')

    # (4) Akış Dengesi (Flow Balance)
    for k in range(m):
        for i in range(n):
            # Giren arklar = Çıkan arklar
            solver.Add(
                solver.Sum(X[h, i, k] for h in nodes if h != i) == 
                solver.Sum(X[i, j, k] for j in nodes if j != i)
            )

    # (5) Her makinede en fazla bir iş dizisi başlar (Dummy 0'dan çıkanlar)
    for k in range(m):
        solver.Add(solver.Sum(X[n, j, k] for j in range(n)) <= 1)

    # (6) Tamamlanma Zamanı ve Hazırlık Süresi (Big-M)
    for i in nodes:
        for j in range(n):
            if i == j: continue
            for k in range(m):
                ci = C[i] if i < n else C_dummy
                sij = data.S[i if i < n else -1][j][k]
                pjk = data.P[j][k]
                # Cj - Ci + V(1 - Xijk) >= Sijk + Pjk
                solver.Add(C[j] - ci + V * (1 - X[i, j, k]) >= sij + pjk)

    # (8) Yayılma Süresi Tanımı
    for j in range(n):
        solver.Add(C[j] <= Cmax)

    # (9) Makine Uygunluğu (NP[j][k]) - DÜZELTİLMİŞ
    # Eğer NP[j][k] = 0 ise, j işi k makinesine atanamaz.
    for j in range(n):
        for k in range(m):
            if data.NP[j][k] == 0:
                # O makineye ait tüm giriş arklarını 0 yap
                solver.Add(solver.Sum(X[i, j, k] for i in nodes if i != j) == 0)

    # (13) Teslim Tarihi ve Gecikme İlişkisi
    for j in range(n):
        solver.Add(C[j] - data.D[j] == e_plus[j] - e_minus[j])

    # (16) Geciken İş Göstergesi (Big-M) - DÜZELTİLMİŞ (<=)
    for j in range(n):
        solver.Add(e_plus[j] <= V * U[j])

    # ── AUGMECON Sınırları (18 & 19) ─────────────────────────────────────────
    if cfg.T_bar is not None:
        solver.Add(solver.Sum(e_plus) <= cfg.T_bar)
    if cfg.L_bar is not None:
        solver.Add(solver.Sum(U) <= cfg.L_bar)

    # ── Amaç Fonksiyonu ──────────────────────────────────────────────────────
    if cfg.obj_type == 'Cmax':
        solver.Minimize(Cmax)
    elif cfg.obj_type == 'T':
        solver.Minimize(solver.Sum(e_plus))
    elif cfg.obj_type == 'L':
        solver.Minimize(solver.Sum(U))
    else: # Weighted
        solver.Minimize(cfg.W1 * Cmax + cfg.W2 * solver.Sum(e_plus) + cfg.W3 * solver.Sum(U))

    # ── Çöz ──────────────────────────────────────────────────────────────────
    solver.set_time_limit(cfg.time_limit * 1000)
    
    print(f"\n[MILP-SCIP] Çözüm aranıyor (max {cfg.time_limit}s)...")
    t0 = time.time()
    status = solver.Solve()
    elapsed = time.time() - t0

    STATUS_MAP = {
        pywraplp.Solver.OPTIMAL: "OPTIMAL",
        pywraplp.Solver.FEASIBLE: "FEASIBLE",
        pywraplp.Solver.INFEASIBLE: "INFEASIBLE",
        pywraplp.Solver.NOT_SOLVED: "UNKNOWN",
    }
    res_status = STATUS_MAP.get(status, "ERROR")

    if status not in (pywraplp.Solver.OPTIMAL, pywraplp.Solver.FEASIBLE):
        return SolverResult(res_status, 0, 0, 0, {}, round(elapsed, 2), 0)

    # Sonuçları Topla
    cmax_v = Cmax.solution_value()
    t_v = sum(ep.solution_value() for ep in e_plus)
    l_v = int(sum(uj.solution_value() for uj in U) + 0.5)

    schedule = {k: [] for k in range(m)}
    for k in range(m):
        for j in range(n):
            # Eğer j işi k makinesine atanmışsa (herhangi bir i'den j'ye ark varsa)
            is_on_machine = sum(X[i, j, k].solution_value() for i in nodes if i != j)
            if is_on_machine > 0.5:
                # Başlama zamanını bul: start = end - process_time
                e = C[j].solution_value()
                s = e - data.P[j][k]
                schedule[k].append((j, round(s, 2), round(e, 2)))

    for k in range(m):
        schedule[k].sort(key=lambda x: x[1])

    print(f"[MILP-SCIP] ✓ {res_status}  Cmax={cmax_v:.2f}  T={t_v:.2f}  L={l_v}  ({elapsed:.2f}s)")

    return SolverResult(
        status=res_status,
        Cmax=round(cmax_v, 2),
        total_tardiness=round(t_v, 2),
        num_tardy=l_v,
        schedule=schedule,
        solve_time=round(elapsed, 2),
        objective_value=round(solver.Objective().Value(), 2)
    )
