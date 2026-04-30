"""
ddr_heuristic.py
----------------
Dinamik Dağıtım Kuralları (DDR) — Makaledeki sezgisel algoritmanın
birebir Python uygulaması.

Makale Bölüm 4 / Algorithm 1'e göre:

Üç temel kural:
  SCT    : min_{j∈Nj, k∈Mj}  (S_i,j,k + P_j,k)         — En kısa toplam süre
  SC-LPT : j* = argmax P_j,k  →  min_k (S_i,j*,k + P_j*,k)  — En uzun iş önce
  SC-EDD : j* = argmin D_j    →  min_k (S_i,j*,k + P_j*,k)  — En erken termin önce

Altı kombine kural:
  [R1 & R2 : ts]  → ts zamanına kadar R1, sonra R2

Tüm kural seti (39 konfigürasyon):
  3 tek kural + 6 kombine × 6 ts değeri = 39

Algoritma:
  1. Ni = {dummy}, Nj = {tüm işler}
  2. Her makine için son tamamlanma zamanını tut: machine_end[k]
  3. Her makine için son işi tut: last_job[k]
  4. Kurala göre (j*, k*) seç
  5. j*'yi k*'ye ata: machine_end[k*] += S[last_job[k*]][j*][k*] + P[j*][k*]
  6. Nj'den j* çıkar, Ni'ye ekle
  7. Kural değiştirme: max{machine_end[k]} > ts ise kural değişir
  8. Nj boşalana kadar devam et
"""
from __future__ import annotations

import time
from dataclasses import dataclass, field
from typing import Optional


# ─── Kural Sabitleri ────────────────────────────────────────────────────────
RULE_SCT    = "SCT"
RULE_SCLPT  = "SC-LPT"
RULE_SCEDD  = "SC-EDD"

# Makaledeki kural değiştirme zamanları (saat)
TS_VALUES = [200, 250, 300, 350, 400, 450]

# Tüm 6 kombine kural çifti
COMBINED_PAIRS = [
    (RULE_SCT,   RULE_SCLPT),
    (RULE_SCLPT, RULE_SCT),
    (RULE_SCT,   RULE_SCEDD),
    (RULE_SCEDD, RULE_SCT),
    (RULE_SCLPT, RULE_SCEDD),
    (RULE_SCEDD, RULE_SCLPT),
]


# ─── Sonuç Yapısı ────────────────────────────────────────────────────────────

@dataclass
class DDRResult:
    rule_name:        str
    Cmax:             float
    total_tardiness:  float
    num_tardy:        int
    schedule:         dict   # schedule[k] = [(job_id, start, end), ...]
    solve_time:       float


# ─── Yardımcı: (j*, k*) seçimi ──────────────────────────────────────────────

def _select_sct(remaining: set, eligible: dict, machine_end: dict,
                last_job: dict, P: dict, S: dict, m: int) -> tuple[int, int]:
    """
    SCT: Tüm (j, k) çiftlerinden  min(S[last_job[k]][j][k] + P[j][k])  seçer.
    Tie-break: iş indeksi küçük olan.
    """
    best_val = float("inf")
    best_j, best_k = -1, -1
    for j in remaining:
        for k in range(m):
            if k not in eligible.get(j, set()):
                continue
            prev = last_job[k]  # -1 = dummy
            val = S[prev][j][k] + P[j][k]
            if val < best_val or (val == best_val and j < best_j):
                best_val = val
                best_j, best_k = j, k
    return best_j, best_k


def _select_sclpt(remaining: set, eligible: dict, machine_end: dict,
                  last_job: dict, P: dict, S: dict, m: int) -> tuple[int, int]:
    """
    SC-LPT:
      1. j* = argmax_{j∈Nj, k∈Mj}  P[j][k]   (en uzun işlem süreli iş)
      2. k* = argmin_{k∈Mj*}  (S[last[k]][j*][k] + P[j*][k])
    """
    # Adım 1: En uzun P[j][k] — tüm uygun (j,k) çiftlerinde
    best_p = -1
    best_j = -1
    for j in remaining:
        for k in eligible.get(j, set()):
            if P[j][k] > best_p or (P[j][k] == best_p and j < best_j):
                best_p = P[j][k]
                best_j = j

    # Adım 2: j* için en iyi makine
    best_val = float("inf")
    best_k   = -1
    for k in eligible.get(best_j, set()):
        prev = last_job[k]
        val  = S[prev][best_j][k] + P[best_j][k]
        if val < best_val:
            best_val = val
            best_k   = k

    return best_j, best_k


def _select_scedd(remaining: set, eligible: dict, machine_end: dict,
                  last_job: dict, P: dict, S: dict, D: dict, m: int) -> tuple[int, int]:
    """
    SC-EDD:
      1. j* = argmin_{j∈Nj}  D[j]   (en erken termin)
      2. k* = argmin_{k∈Mj*}  (S[last[k]][j*][k] + P[j*][k])
    """
    # Adım 1: En erken teslim tarihi
    best_d = float("inf")
    best_j = -1
    for j in remaining:
        if D[j] < best_d or (D[j] == best_d and j < best_j):
            best_d = D[j]
            best_j = j

    # Adım 2: j* için en iyi makine
    best_val = float("inf")
    best_k   = -1
    for k in eligible.get(best_j, set()):
        prev = last_job[k]
        val  = S[prev][best_j][k] + P[best_j][k]
        if val < best_val:
            best_val = val
            best_k   = k

    return best_j, best_k


def _apply_rule(rule: str, remaining: set, eligible: dict, machine_end: dict,
                last_job: dict, P: dict, S: dict, D: dict, m: int) -> tuple[int, int]:
    """Verilen kurala göre (j*, k*) döndür."""
    if rule == RULE_SCT:
        return _select_sct(remaining, eligible, machine_end, last_job, P, S, m)
    elif rule == RULE_SCLPT:
        return _select_sclpt(remaining, eligible, machine_end, last_job, P, S, m)
    elif rule == RULE_SCEDD:
        return _select_scedd(remaining, eligible, machine_end, last_job, P, S, D, m)
    raise ValueError(f"Bilinmeyen kural: {rule}")


# ─── Tek Çalıştırma ─────────────────────────────────────────────────────────

def run_ddr(n: int, m: int, P: dict, S: dict, D: dict, NP: dict,
            rule1: str, rule2: Optional[str] = None, ts: float = float("inf"),
            verbose: bool = False) -> DDRResult:
    """
    DDR algoritmasını bir kural konfigürasyonu için çalıştırır.

    Args:
        n, m      : İş ve makine sayısı
        P, S, D   : Problem parametreleri (int anahtarlar)
        NP        : NP[j][k] uygunluk matrisi
        rule1     : İlk kural
        rule2     : İkinci kural (None ise tek kural)
        ts        : Kural değiştirme zamanı (saat)
        verbose   : Adım adım log
    """
    t0 = time.time()

    # Her iş için uygun makineler kümesi
    eligible = {j: {k for k in range(m) if NP[j][k] == 1} for j in range(n)}

    # Makine durumu
    machine_end = {k: 0.0 for k in range(m)}   # her makinenin şu anki bitiş zamanı
    last_job    = {k: -1  for k in range(m)}    # her makinenin son işi (-1=kukla)

    # Çizelge kaydı
    schedule = {k: [] for k in range(m)}

    remaining = set(range(n))
    current_rule = rule1
    switched     = False

    rule_name = rule1 if rule2 is None else f"[{rule1} & {rule2}: {int(ts)}]"

    if verbose:
        print(f"\n  [DDR] {rule_name} başlatıldı")
        print(f"  {'Adım':>4}  {'Kural':>20}  {'J*':>4}  {'K*':>4}  {'Bitiş':>8}  {'Mevcut max':>12}")
        print("  " + "─" * 60)

    step = 0
    while remaining:
        step += 1

        # Kural değiştirme kontrolü (Makale: max{C_{j,k}: j∈Ni} > ts)
        if rule2 and not switched:
            if max(machine_end.values()) > ts:
                current_rule = rule2
                switched     = True
                if verbose:
                    print(f"  *** Kural değişti: {rule1} → {rule2} (ts={ts}) ***")

        # (j*, k*) seç
        j_star, k_star = _apply_rule(
            current_rule, remaining, eligible, machine_end, last_job, P, S, D, m
        )

        if j_star == -1 or k_star == -1:
            # Çözüm bulunamadı (uygun makine yok) — geçilecek iş yok
            break

        # j*'yi k*'ye ata
        prev          = last_job[k_star]
        setup_time    = S[prev][j_star][k_star]
        proc_time     = P[j_star][k_star]
        start_time    = machine_end[k_star] + setup_time
        end_time      = start_time + proc_time

        schedule[k_star].append((j_star, round(start_time, 2), round(end_time, 2)))
        machine_end[k_star] = end_time
        last_job[k_star]    = j_star
        remaining.discard(j_star)

        if verbose:
            print(f"  {step:4d}  {current_rule:>20}  J{j_star:2d}  M{k_star:2d}  "
                  f"{end_time:8.2f}  {max(machine_end.values()):12.2f}")

    # ── Performans Metrikleri ─────────────────────────────────────────────────
    Cmax = max(machine_end.values()) if machine_end else 0.0

    total_tard = 0.0
    num_tardy  = 0
    for k_sched, jobs in schedule.items():
        for j, s, e in jobs:
            tard = max(0.0, e - D[j])
            total_tard += tard
            if tard > 0:
                num_tardy += 1

    elapsed = time.time() - t0

    return DDRResult(
        rule_name=rule_name,
        Cmax=round(Cmax, 2),
        total_tardiness=round(total_tard, 2),
        num_tardy=num_tardy,
        schedule=schedule,
        solve_time=round(elapsed, 4),
    )


# ─── Tüm 39 Kural Konfigürasyonunu Çalıştır ─────────────────────────────────

def run_all_rules(n: int, m: int, P: dict, S: dict, D: dict, NP: dict,
                  ts_values: list = TS_VALUES,
                  verbose: bool = False) -> list[DDRResult]:
    """
    Makaledeki 39 kural konfigürasyonunu çalıştırır ve sonuçları döndürür.

    Returns:
        List[DDRResult] sıralı liste
    """
    results = []

    # 3 tek kural
    for rule in [RULE_SCT, RULE_SCLPT, RULE_SCEDD]:
        r = run_ddr(n, m, P, S, D, NP, rule, verbose=verbose)
        results.append(r)

    # 6 × 6 = 36 kombine kural
    for r1, r2 in COMBINED_PAIRS:
        for ts in ts_values:
            r = run_ddr(n, m, P, S, D, NP, r1, r2, ts, verbose=verbose)
            results.append(r)

    return results


from app.utils import Colors

def print_ddr_summary(results: list[DDRResult]) -> None:
    """Tüm kural sonuçlarını tablo olarak basar."""
    print("\n" + Colors.CYAN + "═" * 72 + Colors.ENDC)
    print(Colors.BOLD + "  DDR KURAL SONUÇLARI (39 Konfigürasyon)" + Colors.ENDC)
    print(Colors.CYAN + "═" * 72 + Colors.ENDC)
    print(f"  {Colors.BOLD}{'Kural':<35}  {'Cmax':>8}  {'Toplam T':>10}  {'L':>4}  {'Süre(s)':>8}{Colors.ENDC}")
    print(Colors.BLUE + "─" * 72 + Colors.ENDC)

    best_cmax = min(r.Cmax            for r in results)
    best_tard = min(r.total_tardiness for r in results)
    best_l    = min(r.num_tardy       for r in results)

    for r in results:
        cmax_mark = Colors.GREEN + " ★" + Colors.ENDC if r.Cmax            == best_cmax else "  "
        tard_mark = Colors.GREEN + " ★" + Colors.ENDC if r.total_tardiness == best_tard else "  "
        l_mark    = Colors.GREEN + " ★" + Colors.ENDC if r.num_tardy       == best_l    else "  "
        print(
            f"  {r.rule_name:<35}"
            f"  {r.Cmax:>8.2f}{cmax_mark}"
            f"  {r.total_tardiness:>10.2f}{tard_mark}"
            f"  {r.num_tardy:>4}{l_mark}"
            f"  {r.solve_time:>8.4f}"
        )

    print(Colors.CYAN + "═" * 72 + Colors.ENDC)
    print(f"  {Colors.GREEN}★{Colors.ENDC} = bu ölçütte en iyi değer")
    print()
