"""
augmecon.py
-----------
AUGMECON (ε-constraint) Yöntemi ile Pareto Optimal Çözümlerin Üretilmesi.
Makaledeki Bölüm 3.4 ve M4 modelinin birebir Python uyarlamasıdır.

Adımlar:
1. M1, M2 ve M3 ayrı ayrı çözülerek Ödeme Tablosu (Payoff Table) oluşturulur.
2. Hedef 2 (T) ve Hedef 3 (L) için alt ve üst sınırlar belirlenir.
3. (T_bar, L_bar) grid noktaları oluşturulur.
4. M4 (Min Cmax), (18) T <= T_bar ve (19) L <= L_bar kısıtlarıyla çözülür.
5. Baskılanmayan (non-dominated) çözümler Pareto kümesine eklenir.
"""
from __future__ import annotations

import time
from dataclasses import dataclass
from app.solver import ProblemData, SolverConfig, solve, SolverResult


@dataclass
class ParetoSolution:
    id: int
    Cmax: float
    T: float
    L: int
    schedule: dict
    T_bar_used: float
    L_bar_used: int


def is_dominated(sol1: ParetoSolution, sol2: ParetoSolution) -> bool:
    """
    sol1, sol2 tarafından baskılanıyor mu? (sol2, sol1'den her açıdan daha iyi veya eşit mi?)
    Minimizasyon problemi: Cmax, T, L (düşük olan iyidir)
    """
    if (sol2.Cmax <= sol1.Cmax and sol2.T <= sol1.T and sol2.L <= sol1.L):
        # Eğer sol2 en az bir kriterde kesin olarak daha iyiyse
        if (sol2.Cmax < sol1.Cmax or sol2.T < sol1.T or sol2.L < sol1.L):
            return True
    return False


def run_augmecon(data: ProblemData, time_limit: int = 60,
                 grid_T: int = 4, grid_L: int = 4) -> list[ParetoSolution]:
    """
    AUGMECON yöntemini çalıştırarak Pareto çözüm kümesini döndürür.
    """
    print("\n" + "═" * 70)
    print("  AUGMECON (ε-constraint) YÖNTEMİ BAŞLIYOR (M4 Pareteo Analizi)")
    print("═" * 70)

    # ── ADIM 1: Payoff Table (Ödeme Tablosu) ─────────────────────────────
    print("\n  [ADIM 1] M1, M2, M3 Çözülüyor (Ödeme Tablosu İçin)...")

    # M1: Min Cmax
    print("\n  >> M1: Min Cmax çözülüyor...")
    cfg1 = SolverConfig(obj_type='Cmax', time_limit=time_limit)
    res1 = solve(data, cfg1)
    if res1.status not in ("OPTIMAL", "FEASIBLE"):
        print("  [HATA] M1 çözülemedi, AUGMECON iptal ediliyor.")
        return []

    # M2: Min T
    print("\n  >> M2: Min T çözülüyor...")
    cfg2 = SolverConfig(obj_type='T', time_limit=time_limit)
    res2 = solve(data, cfg2)
    if res2.status not in ("OPTIMAL", "FEASIBLE"):
        print("  [HATA] M2 çözülemedi, AUGMECON iptal ediliyor.")
        return []

    # M3: Min L
    print("\n  >> M3: Min L çözülüyor...")
    cfg3 = SolverConfig(obj_type='L', time_limit=time_limit)
    res3 = solve(data, cfg3)
    if res3.status not in ("OPTIMAL", "FEASIBLE"):
        print("  [HATA] M3 çözülemedi, AUGMECON iptal ediliyor.")
        return []

    print("\n  ─── ÖDEME TABLOSU (Payoff Table) ────────────")
    print("  Model │    Cmax    │     T      │  L  ")
    print("  ──────┼────────────┼────────────┼─────")
    print(f"  M1    │  {res1.Cmax:8.2f}* │ {res1.total_tardiness:8.2f}   │ {res1.num_tardy:3d} ")
    print(f"  M2    │  {res2.Cmax:8.2f}   │ {res2.total_tardiness:8.2f}*  │ {res2.num_tardy:3d} ")
    print(f"  M3    │  {res3.Cmax:8.2f}   │ {res3.total_tardiness:8.2f}   │ {res3.num_tardy:3d}*")
    print("  ─────────────────────────────────────────────")

    # ── ADIM 2: Sınırların Belirlenmesi ───────────────────────────────────
    T_min = res2.total_tardiness
    T_max = max(res1.total_tardiness, res2.total_tardiness, res3.total_tardiness)
    
    L_min = res3.num_tardy
    L_max = max(res1.num_tardy, res2.num_tardy, res3.num_tardy)

    print(f"\n  [ADIM 2] Sınırlar (Aralıklar):")
    print(f"    T_bar aralığı: [{T_min:.2f}, {T_max:.2f}]")
    print(f"    L_bar aralığı: [{L_min}, {L_max}]")

    # ── ADIM 3: Grid (Izgara) Noktaları ───────────────────────────────────
    T_step = (T_max - T_min) / max(1, grid_T - 1)
    T_grid = [round(T_min + i * T_step, 2) for i in range(grid_T)]
    
    L_step = (L_max - L_min) / max(1, grid_L - 1)
    L_grid = [int(round(L_min + i * L_step)) for i in range(grid_L)]
    # Mükerrer L değerlerini kaldır
    L_grid = sorted(list(set(L_grid)))

    print(f"\n  [ADIM 3] Grid Noktaları:")
    print(f"    T_bar = {T_grid}")
    print(f"    L_bar = {L_grid}")

    # ── ADIM 4: M4'ün Çözülmesi (Iteratif ε-Constraint) ───────────────────
    print(f"\n  [ADIM 4] M4 Modeli Iteratif Çözülüyor ({len(T_grid) * len(L_grid)} iterasyon)...")
    
    pareto_candidates = []
    # Zaten çözülen ideal noktaları ekleyelim
    pareto_candidates.append(ParetoSolution(0, res1.Cmax, res1.total_tardiness, res1.num_tardy, res1.schedule, T_max, L_max))
    pareto_candidates.append(ParetoSolution(0, res2.Cmax, res2.total_tardiness, res2.num_tardy, res2.schedule, T_max, L_max))
    pareto_candidates.append(ParetoSolution(0, res3.Cmax, res3.total_tardiness, res3.num_tardy, res3.schedule, T_max, L_max))

    iter_count = 0
    t_start = time.time()

    for l_bar in L_grid:
        for t_bar in T_grid:
            iter_count += 1
            print(f"\n  Iterasyon {iter_count}/{len(T_grid)*len(L_grid)}: T_bar={t_bar:.2f}, L_bar={l_bar}...")
            
            # Daha önce daha iyi bir sınırla aynı L_bar'da çözüm bulup bulmadığımıza bakabiliriz
            # Ancak kapsamlılık için her noktayı çözelim.
            cfg_m4 = SolverConfig(obj_type='Cmax', time_limit=time_limit, T_bar=t_bar, L_bar=l_bar)
            
            res_m4 = solve(data, cfg_m4)
            
            if res_m4.status in ("OPTIMAL", "FEASIBLE"):
                print(f"    ✓ Çözüm bulundu: Cmax={res_m4.Cmax:.2f}, T={res_m4.total_tardiness:.2f}, L={res_m4.num_tardy}")
                sol = ParetoSolution(
                    id=0,
                    Cmax=res_m4.Cmax,
                    T=res_m4.total_tardiness,
                    L=res_m4.num_tardy,
                    schedule=res_m4.schedule,
                    T_bar_used=t_bar,
                    L_bar_used=l_bar
                )
                pareto_candidates.append(sol)
            else:
                print(f"    ✗ Infeasible / Zaman aşımı")

    print(f"\n  Toplam Geçen Süre: {time.time()-t_start:.2f} sn.")

    # ── ADIM 5: Non-dominated (Baskılanmayan) Çözümleri Ayıkla ────────────
    print("\n  [ADIM 5] Pareto Kümesi (Non-dominated) Çıkarılıyor...")
    
    pareto_set: list[ParetoSolution] = []
    
    for i, c_cand in enumerate(pareto_candidates):
        is_dom = False
        for j, o_cand in enumerate(pareto_candidates):
            if i == j: continue
            if is_dominated(c_cand, o_cand):
                is_dom = True
                break
        
        # Eğer kimse tarafından baskılanmıyorsa ve henüz listede yoksa ekle
        if not is_dom:
            # Aynı (Cmax, T, L) değerlerine sahip başka çözüm var mı diye bak
            duplicate = False
            for p in pareto_set:
                if p.Cmax == c_cand.Cmax and p.T == c_cand.T and p.L == c_cand.L:
                    duplicate = True
                    break
            if not duplicate:
                c_cand.id = len(pareto_set) + 1
                pareto_set.append(c_cand)

    print("\n" + "═" * 50)
    print(f"  PARETO KÜMESİ ({len(pareto_set)} Çözüm)")
    print("═" * 50)
    print("  Çözüm │    Cmax    │     T      │  L  ")
    print("  ──────┼────────────┼────────────┼─────")
    for p in sorted(pareto_set, key=lambda x: x.Cmax):
        print(f"   #{p.id:2d}  │  {p.Cmax:8.2f}  │ {p.T:8.2f}   │ {p.L:3d} ")
    print("  ──────────────────────────────────────────\n")

    return pareto_set


def select_best_pareto(pareto_set: list[ParetoSolution], 
                       wC: float, wT: float, wL: float) -> ParetoSolution | None:
    """
    Formül (20): Pareto kümesinden Min-Max normalizasyonu ve ağırlıklarla 
    en iyi uzlaşı çözümünü (Best Compromise Solution) seçer.
    """
    if not pareto_set:
        return None
        
    if len(pareto_set) == 1:
        return pareto_set[0]

    # Min ve Max değerleri bul
    cmax_vals = [p.Cmax for p in pareto_set]
    t_vals    = [p.T for p in pareto_set]
    l_vals    = [p.L for p in pareto_set]
    
    min_C, max_C = min(cmax_vals), max(cmax_vals)
    min_T, max_T = min(t_vals), max(t_vals)
    min_L, max_L = min(l_vals), max(l_vals)
    
    best_sol = None
    best_score = float("inf")
    
    # Ağırlıkları normalize et (toplamı 1 olsun)
    tot_w = wC + wT + wL
    if tot_w > 0:
        wC, wT, wL = wC/tot_w, wT/tot_w, wL/tot_w
    else:
        wC, wT, wL = 1/3, 1/3, 1/3
        
    print("\n" + "─" * 70)
    print("  FORMÜL (20): MİN-MAX NORMALİZASYONU İLE PARETO SEÇİMİ")
    print(f"  Kullanılan Ağırlıklar: wCmax={wC:.2f}, wT={wT:.2f}, wL={wL:.2f}")
    print("─" * 70)
    print("  Çözüm │ Normalize Cmax │ Normalize T │ Normalize L │ Toplam Skor ")
    print("  ──────┼────────────────┼─────────────┼─────────────┼─────────────")

    for p in sorted(pareto_set, key=lambda x: x.Cmax):
        # Min-Max Normalizasyon
        norm_C = (p.Cmax - min_C) / (max_C - min_C) if max_C > min_C else 0.0
        norm_T = (p.T - min_T) / (max_T - min_T) if max_T > min_T else 0.0
        norm_L = (p.L - min_L) / (max_L - min_L) if max_L > min_L else 0.0
        
        # Skor (En düşük olan en iyi)
        score = wC * norm_C + wT * norm_T + wL * norm_L
        
        mark = ""
        if score < best_score:
            best_score = score
            best_sol = p
            mark = " ← MEVCUT EN İYİ"
            
        print(f"   #{p.id:2d}  │ {norm_C:14.3f} │ {norm_T:11.3f} │ {norm_L:11.3f} │ {score:11.3f}{mark}")
        
    print("─" * 70)
    if best_sol:
        print(f"  ✓ SEÇİLEN NİHAİ UZLAŞI ÇÖZÜMÜ: Çözüm #{best_sol.id}")
        print(f"    (Cmax={best_sol.Cmax:.2f}, T={best_sol.T:.2f}, L={best_sol.L})")
    
    return best_sol
