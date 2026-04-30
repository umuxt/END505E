"""
main.py
-------
UPMSP Terminal Uygulaması — Ana Giriş Noktası

Kullanım:
  python app/main.py

Menü:
  1. Yeni veri seti oluştur (data_generator)
  2. Mevcut veri seti ile çöz (OR-Tools CP-SAT)
  3. Çıkış
"""
import os
import sys
import json

# ─── Proje kök dizinini sys.path'e ekle ──────────────────────────────────────
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from app.data_generator import (
    generate_problem, save_problem, load_problem, print_problem_summary
)
from app.solver import ProblemData, SolverConfig, SolverResult, solve

DATA_PATH = os.path.join(ROOT, "data", "seed_input.json")


# ─── Yardımcı Fonksiyonlar ──────────────────────────────────────────────────

def banner():
    print("""
╔══════════════════════════════════════════════════════════════╗
║       UPMSP — Eşisiz Paralel Makine Çizelgeleme Çözücüsü    ║
║       OR-Tools CP-SAT  |  END505E  |  Akademik Demo         ║
╚══════════════════════════════════════════════════════════════╝
""")


def menu():
    print("\n" + "─" * 60)
    print("  ANA MENÜ")
    print("─" * 60)
    print("  [1]  Yeni veri seti oluştur")
    print("  [2]  Mevcut veri seti ile çöz")
    print("  [3]  Çıkış")
    print("─" * 60)
    return input("  Seçiminiz: ").strip()


def ask_int(prompt: str, default: int) -> int:
    val = input(f"  {prompt} [{default}]: ").strip()
    return int(val) if val.isdigit() else default


def ask_float(prompt: str, default: float) -> float:
    val = input(f"  {prompt} [{default}]: ").strip()
    try:
        return float(val)
    except ValueError:
        return default


# ─── Sonuç Yazdırma ─────────────────────────────────────────────────────────

def print_results(result: SolverResult, problem: dict) -> None:
    n = problem["metadata"]["n"]
    m = problem["metadata"]["m"]
    D = problem["D"]

    print("\n" + "═" * 60)
    print("  ÇÖZÜM SONUÇLARI")
    print("═" * 60)
    print(f"  Durum           : {result.status}")
    print(f"  Çözüm Süresi    : {result.solve_time:.2f} saniye")
    print()
    print(f"  ┌─────────────────────────────────┐")
    print(f"  │  Cmax (Makespan)      : {result.Cmax:8.2f} │")
    print(f"  │  Toplam Gecikme (T)   : {result.total_tardiness:8.2f} │")
    print(f"  │  Geciken İş Sayısı(L): {result.num_tardy:8d} │")
    print(f"  └─────────────────────────────────┘")

    print("\n  ─── Makine Çizelgesi ─────────────────────────────────")
    for k in range(m):
        jobs = result.schedule.get(k, [])
        if not jobs:
            print(f"  Makine {k}:  (boş)")
            continue
        seq = "  ".join(
            f"[J{j}  {s:.1f}→{e:.1f}]" for j, s, e in jobs
        )
        print(f"  Makine {k}:  {seq}")

    print("\n  ─── İş Bazlı Gecikme Özeti ───────────────────────────")
    print(f"  {'İş':>4}  {'Bitiş':>8}  {'Termin':>8}  {'Gecikme':>10}  {'Durum':>10}")
    print("  " + "─" * 50)
    for k in range(m):
        for j, s, e in result.schedule.get(k, []):
            d   = float(D[str(j)])
            lat = max(0, e - d)
            status = "✗ GECİKTİ" if lat > 0 else "✓ Zamanında"
            print(f"  J{j:2d}  {e:8.2f}  {d:8.2f}  {lat:10.2f}  {status:>10}")

    print("═" * 60 + "\n")


# ─── Akış: Veri Oluştur ─────────────────────────────────────────────────────

def flow_generate():
    print("\n─── Yeni Veri Seti Oluştur ─────────────────────────────────")
    n    = ask_int("İş sayısı (n)", 6)
    m    = ask_int("Makine sayısı (m)", 3)
    seed = ask_int("Rastgele tohum (seed)", 42)

    problem = generate_problem(n, m, seed)
    save_problem(problem, DATA_PATH)
    print_problem_summary(problem)
    print("\n  [OK] Veri seti oluşturuldu. Şimdi 'Çöz' seçeneğiyle devam edebilirsiniz.")


# ─── Akış: Çöz ──────────────────────────────────────────────────────────────

def flow_solve():
    if not os.path.exists(DATA_PATH):
        print("\n  [HATA] Veri seti bulunamadı. Önce '1 - Yeni veri seti oluştur' seçeneğini kullanın.")
        return

    raw = load_problem(DATA_PATH)
    meta = raw["metadata"]
    n, m = meta["n"], meta["m"]
    print_problem_summary(raw)

    # Ağırlıkları sorgula
    print("\n  ─── Amaç Fonksiyonu Ağırlıkları ───────────────────────")
    print("  (Toplam = 1.0 olacak şekilde girin)")
    W1 = ask_float("W1 - Cmax ağırlığı", 0.5)
    W2 = ask_float("W2 - Toplam Gecikme (T) ağırlığı", 0.4)
    W3 = round(1.0 - W1 - W2, 4)
    print(f"  W3 - Geciken İş Sayısı (L) ağırlığı otomatik: {W3}")
    if W3 < 0:
        print("  [UYARI] W1+W2 > 1. W3 = 0.0 olarak alınacak, W1+W2 normalize edilecek.")
        total = W1 + W2
        W1 /= total; W2 /= total; W3 = 0.0

    tlimit = ask_int("Zaman limiti (saniye)", 60)

    # Problem verisini dönüştür
    P_int = {j: {k: raw["P"][str(j)][str(k)] for k in range(m)} for j in range(n)}
    S_int = {
        i: {j: {k: raw["S"][str(i)][str(j)][str(k)] for k in range(m)} for j in range(n)}
        for i in list(range(n)) + [-1]
    }
    D_float = {j: float(raw["D"][str(j)]) for j in range(n)}

    data = ProblemData(n=n, m=m, P=P_int, S=S_int, D=D_float)
    cfg  = SolverConfig(W1=W1, W2=W2, W3=W3, time_limit=tlimit)

    result = solve(data, cfg)
    print_results(result, raw)


# ─── Ana Döngü ──────────────────────────────────────────────────────────────

def main():
    banner()
    while True:
        choice = menu()
        if choice == "1":
            flow_generate()
        elif choice == "2":
            flow_solve()
        elif choice == "3":
            print("\n  İyi çalışmalar!\n")
            break
        else:
            print("  [!] Geçersiz seçim, tekrar deneyin.")


if __name__ == "__main__":
    main()
