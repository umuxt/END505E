"""
data_generator.py
-----------------
UPMSP (Unrelated Parallel Machine Scheduling Problem) için
makaledeki veri dağılımlarına uygun rastgele problem örnekleri üretir.

Parametreler:
  n (int)    : İş (job) sayısı
  m (int)    : Makine sayısı
  seed (int) : Tekrarlanabilirlik için rastgele tohum (seed)

Üretilen veriler data/seed_input.json dosyasına kaydedilir.
"""
import json
import random
import os
from pathlib import Path


# ─── Makale Uyumlu Dağılım Aralıkları ──────────────────────────────────────
# Makalede kullanılan P1–P5 problem örneklerine benzer aralıklar
P_MIN, P_MAX   = 5,  50   # İşlem süresi (saat)
S_MIN, S_MAX   = 1,  20   # Hazırlık süresi (saat)
D_SLACK_MIN    = 1.2       # Teslim tarihi gerilimi (slack) alt katsayısı
D_SLACK_MAX    = 2.0       # Teslim tarihi gerilimi (slack) üst katsayısı
# ─────────────────────────────────────────────────────────────────────────────


def generate_problem(n: int, m: int, seed: int = 42) -> dict:
    """
    Rastgele bir UPMSP problemi üretir.

    Args:
        n    : İş sayısı (jobs)
        m    : Makine sayısı (machines)
        seed : Rastgele sayı tohumu

    Returns:
        dict : Problem verisi (P, S, D, metadata)
    """
    rng = random.Random(seed)

    print(f"\n[GEN] Rastgele problem üretiliyor...")
    print(f"      n={n} iş  |  m={m} makine  |  seed={seed}")
    print(f"      İşlem süresi aralığı : U[{P_MIN}, {P_MAX}]")
    print(f"      Hazırlık süresi aralığı: U[{S_MIN}, {S_MAX}]")

    # ── İşlem Süreleri: P[j][k] ─────────────────────────────────────────────
    # j işinin k makinesindeki işlem süresi (Unrelated → her makine farklı hız)
    P = {}
    for j in range(n):
        P[j] = {}
        for k in range(m):
            P[j][k] = rng.randint(P_MIN, P_MAX)

    print(f"[GEN]  ✓ İşlem süreleri P[j][k] üretildi  ({n}×{m} = {n*m} değer)")

    # ── Hazırlık Süreleri: S[i][j][k] ───────────────────────────────────────
    # k makinesinde i işinden sonra j işi gelince gereken hazırlık süresi
    # S[i][j][k] = 0  eğer i == j
    S = {}
    for i in range(n):         # önceki iş (kukla iş 0 dahil, Python'da -1 kullanacağız)
        S[i] = {}
        for j in range(n):
            S[i][j] = {}
            for k in range(m):
                if i == j:
                    S[i][j][k] = 0
                else:
                    S[i][j][k] = rng.randint(S_MIN, S_MAX)

    # Kukla iş (index: -1, "başlangıç") için hazırlık = 0
    S[-1] = {}
    for j in range(n):
        S[-1][j] = {}
        for k in range(m):
            S[-1][j][k] = 0

    print(f"[GEN]  ✓ Hazırlık süreleri S[i][j][k] üretildi  ({(n+1)}×{n}×{m} = {(n+1)*n*m} değer)")

    # ── Teslim Tarihleri: D[j] ───────────────────────────────────────────────
    # D_j = slack × ortalama_işlem_süresi (makale yaklaşımı)
    avg_p = sum(P[j][k] for j in range(n) for k in range(m)) / (n * m)
    D = {}
    for j in range(n):
        slack = rng.uniform(D_SLACK_MIN, D_SLACK_MAX)
        D[j] = round(slack * avg_p * n / m, 2)

    print(f"[GEN]  ✓ Teslim tarihleri D[j] üretildi  (ortalama P={avg_p:.1f})")

    problem = {
        "metadata": {
            "n": n,
            "m": m,
            "seed": seed,
            "jobs":     list(range(n)),
            "machines": list(range(m)),
        },
        "P": {str(j): {str(k): P[j][k] for k in range(m)} for j in range(n)},
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
    print(f"[LOAD] Problem '{path}' yüklendi.")
    m = data["metadata"]
    print(f"       n={m['n']} iş  |  machines={m['m']} makine  |  seed={m['seed']}")
    return data


def print_problem_summary(problem: dict) -> None:
    """Üretilen problemin özet tablosunu terminale basar."""
    meta = problem["metadata"]
    n, m = meta["n"], meta["m"]
    P = problem["P"]
    D = problem["D"]

    print("\n" + "─" * 60)
    print("  PROBLEM ÖZETİ")
    print("─" * 60)

    # İşlem Süreleri Tablosu
    header = "  İş  |" + "".join(f" M{k:2d} |" for k in range(m))
    print(f"\n  İşlem Süreleri P[j][k]:")
    print("  " + "─" * (len(header) - 2))
    print(header)
    print("  " + "─" * (len(header) - 2))
    for j in range(n):
        row = f"  J{j:2d}  |" + "".join(f"  {P[str(j)][str(k)]:2d} |" for k in range(m))
        print(row)
    print("  " + "─" * (len(header) - 2))

    # Teslim Tarihleri
    print(f"\n  Teslim Tarihleri D[j]:")
    d_row = "  " + "  ".join(f"J{j}: {D[str(j)]:6.1f}" for j in range(n))
    print(d_row)
    print("─" * 60)
