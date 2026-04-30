"""
topsis.py
---------
TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)
Makaledeki Bölüm 4.2'deki yöntemi birebir uygular.

Adımlar (Makale ile birebir):
  1. Performans matrisi: x_{a,b} — a kuralının b ölçütündeki değeri
  2. Normalize et: r_{a,b} = x̃_b / x_{a,b}   (x̃_b = min_a { x_{a,b} })
  3. İdeal çözümler: v+_b = max_a{r_{a,b}}, v-_b = min_a{r_{a,b}}
  4. Uzaklıklar:
       S+_a = sqrt[ Σ_b  w_b · (r_{a,b} - v+_b)² ]
       S-_a = sqrt[ Σ_b  w_b · (r_{a,b} - v-_b)² ]
  5. Göreli yakınlık: C*_a = S-_a / (S+_a + S-_a)
  6. Sırala: C*_a büyük → daha iyi kural

Kriterler (b): Cmax (b=1), T (b=2), L (b=3)  — hepsi maliyet (düşük = iyi)
"""
from __future__ import annotations

import math
from dataclasses import dataclass


@dataclass
class TOPSISResult:
    rule_name:   str
    Cmax:        float
    total_tard:  float
    num_tardy:   int
    r:           list[float]   # normalize değerleri [r1, r2, r3]
    S_pos:       float         # pozitif ideal uzaklık
    S_neg:       float         # negatif ideal uzaklık
    C_star:      float         # göreli yakınlık skoru
    rank:        int


def run_topsis(candidates: list[dict],
               wC: float = 1/3, wT: float = 1/3, wL: float = 1/3
               ) -> list[TOPSISResult]:
    """
    TOPSIS analizi çalıştırır.

    Args:
        candidates: [{"name": ..., "Cmax": ..., "T": ..., "L": ...}, ...]
        wC, wT, wL: Ağırlıklar (wC + wT + wL = 1)

    Returns:
        TOPSISResult listesi (skor büyükten küçüğe sıralı)
    """
    n = len(candidates)
    if n == 0:
        return []

    # Normalize et: toplam ağırlık = 1
    total_w = wC + wT + wL
    wC /= total_w; wT /= total_w; wL /= total_w
    weights = [wC, wT, wL]

    # ── Adım 1: Performans matrisi ───────────────────────────────────────────
    x = [[c["Cmax"], c["T"], c["L"]] for c in candidates]

    # ── Adım 2: Normalizasyon  r_{a,b} = x̃_b / x_{a,b} ─────────────────────
    # x̃_b = min_a { x_{a,b} }  (her kriterdeki en iyi değer)
    x_tilde = [min(x[a][b] for a in range(n)) for b in range(3)]

    # Sıfır bölme koruma: tüm değerler 0 ise r=1
    r = []
    for a in range(n):
        row = []
        for b in range(3):
            if x[a][b] == 0:
                row.append(1.0)
            elif x_tilde[b] == 0:
                row.append(0.0)
            else:
                row.append(x_tilde[b] / x[a][b])
        r.append(row)

    # ── Adım 3: İdeal çözümler ───────────────────────────────────────────────
    v_pos = [max(r[a][b] for a in range(n)) for b in range(3)]  # pozitif ideal
    v_neg = [min(r[a][b] for a in range(n)) for b in range(3)]  # negatif ideal

    # ── Adım 4: Uzaklıklar ───────────────────────────────────────────────────
    S_pos_list, S_neg_list = [], []
    for a in range(n):
        s_p = math.sqrt(sum(weights[b] * (r[a][b] - v_pos[b])**2 for b in range(3)))
        s_n = math.sqrt(sum(weights[b] * (r[a][b] - v_neg[b])**2 for b in range(3)))
        S_pos_list.append(s_p)
        S_neg_list.append(s_n)

    # ── Adım 5: Göreli yakınlık ──────────────────────────────────────────────
    C_star = []
    for a in range(n):
        denom = S_pos_list[a] + S_neg_list[a]
        C_star.append(S_neg_list[a] / denom if denom > 0 else 0.0)

    # ── Adım 6: Sırala ───────────────────────────────────────────────────────
    order  = sorted(range(n), key=lambda a: -C_star[a])
    ranks  = [0] * n
    for rank_pos, a in enumerate(order):
        ranks[a] = rank_pos + 1

    results = []
    for a in range(n):
        results.append(TOPSISResult(
            rule_name  = candidates[a]["name"],
            Cmax       = candidates[a]["Cmax"],
            total_tard = candidates[a]["T"],
            num_tardy  = int(candidates[a]["L"]),
            r          = [round(r[a][b], 4) for b in range(3)],
            S_pos      = round(S_pos_list[a], 4),
            S_neg      = round(S_neg_list[a], 4),
            C_star     = round(C_star[a], 4),
            rank       = ranks[a],
        ))

    results.sort(key=lambda x: x.rank)
    return results


def print_topsis_results(results: list[TOPSISResult],
                         wC: float, wT: float, wL: float) -> None:
    """TOPSIS sonuç tablosunu terminale basar."""
    print("\n" + "═" * 90)
    print("  TOPSIS ANALİZ SONUÇLARI")
    print(f"  Ağırlıklar: wCmax={wC:.2f}  wT={wT:.2f}  wL={wL:.2f}")
    print("═" * 90)
    print(
        f"  {'Sıra':>4}  {'Kural':<35}  {'Cmax':>8}  {'T':>9}  {'L':>4}"
        f"  {'r1':>6}  {'r2':>6}  {'r3':>6}  {'S+':>7}  {'S-':>7}  {'C*':>7}"
    )
    print("─" * 90)
    for r in results:
        medal = " ← EN İYİ" if r.rank == 1 else ""
        print(
            f"  {r.rank:>4}  {r.rule_name:<35}  {r.Cmax:>8.2f}  {r.total_tard:>9.2f}"
            f"  {r.num_tardy:>4}  {r.r[0]:>6.3f}  {r.r[1]:>6.3f}  {r.r[2]:>6.3f}"
            f"  {r.S_pos:>7.4f}  {r.S_neg:>7.4f}  {r.C_star:>7.4f}{medal}"
        )
    print("═" * 90)
    if results:
        best = results[0]
        print(f"\n  ✓ En iyi kural: [{best.rule_name}]  C*={best.C_star:.4f}\n")
