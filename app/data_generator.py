"""
data_generator.py
-----------------
UPMSP problemi için makale uyumlu rastgele veri üretici.

Makaledeki gerçek veri yapısına uygunluk:
  - Ürün ailesi (product family) tabanlı hazırlık süreleri:
      Aynı aileden → kısa hazırlık [S_MIN_SAME, S_MAX_SAME]
      Farklı aileden → uzun hazırlık [S_MIN_DIFF, S_MAX_DIFF]
  - NP[j][k] makine uygunluk matrisi (bazı işler bazı makinelerde yapılamaz)
  - İşlem süreleri: eşisiz (unrelated) → makineye göre değişir
  - Teslim tarihleri: toplam yük bazlı slack faktörü

Parametreler:
  n (int)         : İş (job) sayısı
  m (int)         : Makine sayısı
  n_families (int): Ürün ailesi sayısı
  seed (int)      : Rastgele tohum
  np_ratio (float): Makinede yapılamayan iş oranı (0 = kısıt yok, 0.2 = %20 kısıtlı)
"""
import json
import random
import os


# ─── Makale Uyumlu Dağılım Aralıkları ──────────────────────────────────────
P_MIN, P_MAX           = 5,  50    # İşlem süresi (saat)
S_MIN_SAME, S_MAX_SAME = 1,  5     # Aynı ürün ailesinden hazırlık süresi (kısa)
S_MIN_DIFF, S_MAX_DIFF = 5,  20    # Farklı ürün ailesinden hazırlık süresi (uzun)
D_SLACK_MIN            = 1.2       # Teslim tarihi slack katsayısı (alt)
D_SLACK_MAX            = 2.0       # Teslim tarihi slack katsayısı (üst)
# ─────────────────────────────────────────────────────────────────────────────


def generate_problem(n: int, m: int, seed: int = 42,
                     n_families: int = 3, np_ratio: float = 0.0) -> dict:
    """
    Rastgele bir UPMSP problemi üretir.

    Args:
        n          : İş sayısı
        m          : Makine sayısı
        seed       : Rastgele sayı tohumu
        n_families : Ürün ailesi sayısı (hazırlık süresini belirler)
        np_ratio   : Makine kısıtı oranı (0.0 = kısıtsız, 0.2 = %20 kısıtlı)

    Returns:
        dict: Problem verisi (P, S, D, NP, family, metadata)
    """
    rng = random.Random(seed)

    print(f"\n[GEN] Rastgele problem üretiliyor...")
    print(f"      n={n} iş  |  m={m} makine  |  seed={seed}")
    print(f"      Ürün ailesi sayısı: {n_families}  |  Makine kısıtı oranı: {np_ratio:.0%}")
    print(f"      İşlem süresi: U[{P_MIN},{P_MAX}]  |  "
          f"Hazırlık (aynı aile): U[{S_MIN_SAME},{S_MAX_SAME}]  |  "
          f"Hazırlık (farklı aile): U[{S_MIN_DIFF},{S_MAX_DIFF}]")

    # ── Ürün Ailesi Ataması ─────────────────────────────────────────────────
    # Her işe rastgele bir aile atanır
    family = {j: rng.randint(0, n_families - 1) for j in range(n)}
    print(f"[GEN]  ✓ Ürün ailesi atamaları yapıldı  ({n_families} aile)")

    # ── Makine Uygunluk Matrisi: NP[j][k] ───────────────────────────────────
    # NP[j][k] = 1 → j işi k makinesinde yapılabilir
    # NP[j][k] = 0 → j işi k makinesinde yapılamaz (kısıtlı)
    # Önemli: Her iş en az 1 makinede yapılabilmeli!
    NP = {}
    for j in range(n):
        NP[j] = {}
        eligible = list(range(m))
        # Zorunlu en az 1 makine kalsın
        forced_k = rng.choice(eligible)
        for k in range(m):
            if k == forced_k:
                NP[j][k] = 1
            else:
                NP[j][k] = 0 if rng.random() < np_ratio else 1

    np_count = sum(1 for j in range(n) for k in range(m) if NP[j][k] == 0)
    print(f"[GEN]  ✓ Makine uygunluk matrisi NP[j][k] oluşturuldu  "
          f"({np_count}/{n*m} kısıt var)")

    # ── İşlem Süreleri: P[j][k] ─────────────────────────────────────────────
    # j işinin k makinesindeki işlem süresi (Unrelated → her makine farklı)
    # NP[j][k]=0 olan makinelere çok büyük süre atıyoruz (pratik engelleyici)
    P = {}
    BIG_P = 9999  # yapılamayan işi temsil eder
    for j in range(n):
        P[j] = {}
        for k in range(m):
            if NP[j][k] == 1:
                P[j][k] = rng.randint(P_MIN, P_MAX)
            else:
                P[j][k] = BIG_P  # kullanılmayacak ama veri tutarlılığı için

    print(f"[GEN]  ✓ İşlem süreleri P[j][k] üretildi  ({n}×{m} = {n*m} değer)")

    # ── Hazırlık Süreleri: S[i][j][k] ───────────────────────────────────────
    # Aile tabanlı: aynı aileden kısa, farklı aileden uzun
    # Kukla iş (-1) için hazırlık = 0
    S = {}
    for i in range(n):
        S[i] = {}
        for j in range(n):
            S[i][j] = {}
            for k in range(m):
                if i == j:
                    S[i][j][k] = 0
                elif family[i] == family[j]:
                    S[i][j][k] = rng.randint(S_MIN_SAME, S_MAX_SAME)
                else:
                    S[i][j][k] = rng.randint(S_MIN_DIFF, S_MAX_DIFF)

    # Kukla iş (indeks: -1) hazırlık = 0
    S[-1] = {}
    for j in range(n):
        S[-1][j] = {}
        for k in range(m):
            S[-1][j][k] = 0

    print(f"[GEN]  ✓ Hazırlık süreleri S[i][j][k] üretildi  "
          f"(aile bazlı: aynı={S_MIN_SAME}-{S_MAX_SAME}, farklı={S_MIN_DIFF}-{S_MAX_DIFF})")

    # ── Teslim Tarihleri: D[j] ───────────────────────────────────────────────
    # D_j = slack × (toplam ortalama yük / makine sayısı)
    # Sadece yapılabilir (NP=1) işlem sürelerini kullan
    eligible_p = [P[j][k] for j in range(n) for k in range(m) if NP[j][k] == 1]
    avg_p = sum(eligible_p) / len(eligible_p) if eligible_p else 20
    D = {}
    for j in range(n):
        slack = rng.uniform(D_SLACK_MIN, D_SLACK_MAX)
        D[j] = round(slack * avg_p * n / m, 2)

    print(f"[GEN]  ✓ Teslim tarihleri D[j] üretildi  (ortalama yapılabilir P={avg_p:.1f})")

    problem = {
        "metadata": {
            "n": n,
            "m": m,
            "seed": seed,
            "n_families": n_families,
            "np_ratio": np_ratio,
            "jobs":     list(range(n)),
            "machines": list(range(m)),
        },
        "family": {str(j): family[j] for j in range(n)},
        "NP": {str(j): {str(k): NP[j][k] for k in range(m)} for j in range(n)},
        "P":  {str(j): {str(k): P[j][k]  for k in range(m)} for j in range(n)},
        "S": {
            str(i): {str(j): {str(k): S[i][j][k] for k in range(m)} for j in range(n)}
            for i in list(range(n)) + [-1]
        },
        "D": {str(j): D[j] for j in range(n)},
    }

    return problem


def save_problem(problem: dict, path: str = "data/seed_input.json") -> None:
    """Problemi JSON dosyasına kaydeder."""
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(problem, f, indent=2, ensure_ascii=False)
    print(f"[GEN]  ✓ Problem '{path}' dosyasına kaydedildi.")


def load_problem(path: str = "data/seed_input.json") -> dict:
    """JSON dosyasından problem yükler."""
    with open(path, "r", encoding="utf-8") as f:
        data = json.load(f)
    m_data = data["metadata"]
    print(f"[LOAD] Problem '{path}' yüklendi.")
    print(f"       n={m_data['n']} iş  |  m={m_data['m']} makine  |  "
          f"seed={m_data['seed']}  |  {m_data.get('n_families','-')} aile  |  "
          f"NP kısıtı={m_data.get('np_ratio',0):.0%}")
    return data


def print_problem_summary(problem: dict) -> None:
    """Üretilen problemin özet tablosunu terminale basar."""
    meta = problem["metadata"]
    n, m = meta["n"], meta["m"]
    P    = problem["P"]
    D    = problem["D"]
    NP   = problem.get("NP", {str(j): {str(k): 1 for k in range(m)} for j in range(n)})
    fam  = problem.get("family", {str(j): 0 for j in range(n)})

    print("\n" + "─" * 68)
    print("  PROBLEM ÖZETİ")
    print("─" * 68)

    # İşlem Süreleri ve Uygunluk Tablosu
    header = f"  {'İş':>4} Aile |" + "".join(f" M{k:2d}(NP) |" for k in range(m)) + " D_j"
    print(f"\n  İşlem Süreleri P[j][k]  (NP=0: makine kısıtlı):")
    print("  " + "─" * (len(header) - 2))
    print(header)
    print("  " + "─" * (len(header) - 2))
    for j in range(n):
        fam_j = fam.get(str(j), "-")
        row = f"  J{j:2d}  F{fam_j}  |"
        for k in range(m):
            p_val = P[str(j)][str(k)]
            np_val = NP[str(j)][str(k)]
            if np_val == 0:
                row += f"   -- (0) |"
            else:
                row += f"  {p_val:3d}  (1) |"
        row += f"  {float(D[str(j)]):7.1f}"
        print(row)
    print("  " + "─" * (len(header) - 2))
    print("─" * 68)
