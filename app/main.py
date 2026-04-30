"""
main.py
-------
UPMSP Terminal Uygulaması — Ana Giriş Noktası

Kullanım:
  python app/main.py

Menü:
  1. Yeni veri seti oluştur
  2. OR-Tools CP-SAT ile tam çöz (exact)
  3. DDR sezgisel — tüm 39 kural
  4. DDR sezgisel — tek kural (adım adım log)
  5. TOPSIS analizi (DDR sonuçlarından en iyi kuralı seç)
  6. Çıkış
"""
import os
import sys
import json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if ROOT not in sys.path:
    sys.path.insert(0, ROOT)

from app.data_generator import (
    generate_problem, save_problem, load_problem, print_problem_summary
)
from app.solver import ProblemData, SolverConfig, SolverResult, solve
from app.ddr_heuristic import (
    run_ddr, run_all_rules, print_ddr_summary,
    RULE_SCT, RULE_SCLPT, RULE_SCEDD, COMBINED_PAIRS, TS_VALUES
)
from app.topsis import run_topsis, print_topsis_results

from app.augmecon import run_augmecon, ParetoSolution, select_best_pareto
from app.utils import Colors, print_gantt_chart

DATA_PATH = os.path.join(ROOT, "data", "seed_input.json")


# ─── Yardımcı ───────────────────────────────────────────────────────────────

def banner():
    print(Colors.CYAN + Colors.BOLD + """
╔══════════════════════════════════════════════════════════════╗
║    UPMSP — Eşisiz Paralel Makine Çizelgeleme Çözücüsü       ║
║    OR-Tools CP-SAT + DDR Sezgisel + TOPSIS | END505E        ║
╚══════════════════════════════════════════════════════════════╝
""" + Colors.ENDC)


def menu():
    print("\n" + Colors.BLUE + "─" * 62 + Colors.ENDC)
    print(Colors.BOLD + "  ANA MENÜ" + Colors.ENDC)
    print(Colors.BLUE + "─" * 62 + Colors.ENDC)
    print("  [0]  " + Colors.HEADER + Colors.BOLD + "Makale Akışı (Tüm Analizleri Tek Seferde Çalıştır)" + Colors.ENDC)
    print("  [1]  " + Colors.YELLOW + "Yeni veri seti oluştur" + Colors.ENDC)
    print("  [2]  " + Colors.GREEN + "OR-Tools CP-SAT ile Exact Çöz (MILP)" + Colors.ENDC)
    print("  [3]  " + Colors.CYAN + "DDR Sezgisel — Tüm 39 Kural Konfigürasyonu" + Colors.ENDC)
    print("  [4]  " + Colors.CYAN + "DDR Sezgisel — Tek Kural (Adım Adım Log)" + Colors.ENDC)
    print("  [5]  " + Colors.HEADER + "TOPSIS Analizi (DDR sonuçlarından en iyi kuralı seç)" + Colors.ENDC)
    print("  [6]  " + Colors.HEADER + "AUGMECON (ε-constraint ile Pareto Kümesi Çözümü)" + Colors.ENDC)
    print("  [7]  " + Colors.RED + "Çıkış" + Colors.ENDC)
    print(Colors.BLUE + "─" * 62 + Colors.ENDC)
    return input(Colors.BOLD + "  Seçiminiz: " + Colors.ENDC).strip()


def ask_int(prompt, default):
    val = input(f"  {prompt} [{default}]: ").strip()
    return int(val) if val.isdigit() else default


def ask_float(prompt, default):
    val = input(f"  {prompt} [{default}]: ").strip()
    try:
        return float(val)
    except ValueError:
        return default


def load_and_parse() -> tuple:
    """JSON yükler ve Python int anahtarlı dict'lere dönüştürür."""
    raw = load_problem(DATA_PATH)
    meta = raw["metadata"]
    n, m = meta["n"], meta["m"]

    P  = {j: {k: raw["P"][str(j)][str(k)]  for k in range(m)} for j in range(n)}
    S  = {i: {j: {k: raw["S"][str(i)][str(j)][str(k)] for k in range(m)} for j in range(n)}
          for i in list(range(n)) + [-1]}
    D  = {j: float(raw["D"][str(j)]) for j in range(n)}
    NP = {j: {k: raw.get("NP", {str(j): {str(k): 1 for k in range(m)}})[str(j)][str(k)]
               for k in range(m)} for j in range(n)}

    return raw, n, m, P, S, D, NP


# ─── Sonuç Tablosu (CP-SAT) ─────────────────────────────────────────────────

def print_cpsat_results(result: SolverResult, raw: dict) -> None:
    n = raw["metadata"]["n"]
    m = raw["metadata"]["m"]
    D = raw["D"]

    print("\n" + "═" * 62)
    print("  CP-SAT ÇÖZÜM SONUÇLARI")
    print("═" * 62)
    print(f"  Durum           : {result.status}")
    print(f"  Çözüm Süresi    : {result.solve_time:.2f} saniye")
    print()
    print(f"  ┌──────────────────────────────────┐")
    print(f"  │  Cmax (Makespan)      : {result.Cmax:9.2f} │")
    print(f"  │  Toplam Gecikme (T)   : {result.total_tardiness:9.2f} │")
    print(f"  │  Geciken İş Sayısı(L) : {result.num_tardy:9d} │")
    print(f"  └──────────────────────────────────┘")

    print("\n  ─── Makine Çizelgesi ─────────────────────────────────")
    for k in range(m):
        jobs = result.schedule.get(k, [])
        if not jobs:
            print(f"  Makine {k}:  (boş)")
            continue
        seq = "  ".join(f"[J{j}  {s:.1f}→{e:.1f}]" for j, s, e in jobs)
        print(f"  Makine {k}:  {seq}")

    print("\n  ─── İş Bazlı Gecikme ─────────────────────────────────")
    print(f"  {'İş':>4}  {'Bitiş':>8}  {'Termin':>8}  {'Gecikme':>10}  {'Durum':>10}")
    print("  " + "─" * 50)
    for k in range(m):
        for j, s, e in result.schedule.get(k, []):
            d   = float(D[str(j)])
            lat = max(0.0, e - d)
            st  = "✗ GECİKTİ" if lat > 0 else "✓ Zamanında"
            print(f"  J{j:2d}  {e:8.2f}  {d:8.2f}  {lat:10.2f}  {st:>10}")
    print("═" * 62 + "\n")


# ─── Akış 0: Tam Makale Akışı ────────────────────────────────────────────────

def flow_full_pipeline():
    print(Colors.HEADER + Colors.BOLD + "\n" + "═" * 70)
    print("  MAKALE AKIŞI: BÜTÜNCÜL TEST (TAM OTOMASYON)")
    print("═" * 70 + Colors.ENDC)
    print("  Bu akış, makaledeki deneysel prosedürü baştan sona uygular:")
    print("  1. Veri üretimi (Makine sayısı ve iş sayısı)")
    print("  2. DDR (39 Kural) testleri")
    print("  3. TOPSIS ile En İyi DDR Kuralının Seçilmesi")
    print("  4. AUGMECON ile Pareto Kümesinin Çıkarılması (Küçük problemler için)")
    print("  5. Formül (20) ile Nihai Pareto Seçimi\n")
    
    n          = ask_int("İş sayısı (n)", 10)
    m          = ask_int("Makine sayısı (m)", 3)
    seed       = ask_int("Rastgele tohum (seed)", 42)
    n_families = ask_int("Ürün ailesi sayısı", 3)
    np_ratio   = ask_float("Makine kısıtı oranı (0.0=kısıtsız)", 0.0)
    
    print("\n" + Colors.CYAN + "  [AŞAMA 1] Veri Üretiliyor..." + Colors.ENDC)
    problem = generate_problem(n, m, seed, n_families, np_ratio)
    save_problem(problem, DATA_PATH)
    
    raw, n, m, P, S, D, NP = load_and_parse()
    data = ProblemData(n=n, m=m, P=P, S=S, D=D, NP=NP)
    print_problem_summary(raw)
    
    print("\n" + Colors.CYAN + "  [AŞAMA 2] DDR Sezgisel Algoritmaları Çalıştırılıyor (39 Kural)..." + Colors.ENDC)
    ddr_results = run_all_rules(n, m, P, S, D, NP, verbose=False)
    print_ddr_summary(ddr_results)
    
    print("\n" + Colors.CYAN + "  [AŞAMA 3] TOPSIS Analizi (Ağırlıklar wC=0.34, wT=0.33, wL=0.33)..." + Colors.ENDC)
    candidates = [
        {"name": r.rule_name, "Cmax": r.Cmax, "T": r.total_tardiness, "L": r.num_tardy}
        for r in ddr_results
    ]
    topsis_results = run_topsis(candidates, 0.334, 0.333, 0.333)
    print_topsis_results(topsis_results, 0.334, 0.333, 0.333)
    
    if n <= 15:
        print("\n" + Colors.CYAN + "  [AŞAMA 4] Problem boyutu küçük (n<=15), AUGMECON çalıştırılıyor..." + Colors.ENDC)
        pareto_set = run_augmecon(data, time_limit=30, grid_T=4, grid_L=4)
        if pareto_set:
            print("\n" + Colors.CYAN + "  [AŞAMA 5] Nihai Pareto Seçimi (Formül 20)" + Colors.ENDC)
            select_best_pareto(pareto_set, 0.5, 0.4, 0.1)
    else:
        print("\n" + Colors.YELLOW + "  [BİLGİ] İş sayısı büyük (n>15), Exact AUGMECON testi atlandı." + Colors.ENDC)
        
    print(Colors.GREEN + Colors.BOLD + "\n  ✓ BÜTÜNCÜL TEST TAMAMLANDI." + Colors.ENDC)


# ─── Akış 1: Veri Üret ──────────────────────────────────────────────────────

def flow_generate():
    print("\n─── Yeni Veri Seti Oluştur ─────────────────────────────")
    n          = ask_int("İş sayısı (n)", 8)
    m          = ask_int("Makine sayısı (m)", 3)
    seed       = ask_int("Rastgele tohum (seed)", 42)
    n_families = ask_int("Ürün ailesi sayısı", 3)
    np_ratio   = ask_float("Makine kısıtı oranı (0.0=kısıtsız, 0.2=%20)", 0.0)

    problem = generate_problem(n, m, seed, n_families, np_ratio)
    save_problem(problem, DATA_PATH)
    print_problem_summary(problem)
    print("\n  [OK] Veri oluşturuldu.")


# ─── Akış 2: CP-SAT Çöz ─────────────────────────────────────────────────────

def flow_cpsat():
    if not os.path.exists(DATA_PATH):
        print("  [HATA] Önce veri seti oluşturun (Menü 1).")
        return

    raw, n, m, P, S, D, NP = load_and_parse()
    print_problem_summary(raw)

    print("\n  ─── Amaç Fonksiyonu Ağırlıkları ─────────────────────")
    W1 = ask_float("W1 - Cmax ağırlığı", 0.5)
    W2 = ask_float("W2 - Toplam Gecikme (T) ağırlığı", 0.4)
    W3 = round(max(0.0, 1.0 - W1 - W2), 4)
    print(f"  W3 - Geciken İş Sayısı (L) → {W3}")
    tlimit = ask_int("Zaman limiti (saniye)", 120)

    data   = ProblemData(n=n, m=m, P=P, S=S, D=D, NP=NP)
    cfg    = SolverConfig(W1=W1, W2=W2, W3=W3, time_limit=tlimit)
    result = solve(data, cfg)
    print_cpsat_results(result, raw)
    if result.status in ("OPTIMAL", "FEASIBLE"):
        print_gantt_chart(result.schedule, result.Cmax)


# ─── Akış 3: DDR Tüm Kurallar ───────────────────────────────────────────────

def flow_ddr_all():
    if not os.path.exists(DATA_PATH):
        print("  [HATA] Önce veri seti oluşturun (Menü 1).")
        return

    raw, n, m, P, S, D, NP = load_and_parse()
    print_problem_summary(raw)

    print("\n  [DDR] 39 kural konfigürasyonu çalıştırılıyor...")
    results = run_all_rules(n, m, P, S, D, NP, verbose=False)
    print_ddr_summary(results)

    # Sonuçları kaydet (TOPSIS için)
    ddr_cache = os.path.join(ROOT, "data", "ddr_results.json")
    cache_data = [
        {"name": r.rule_name, "Cmax": r.Cmax, "T": r.total_tardiness, "L": r.num_tardy}
        for r in results
    ]
    with open(ddr_cache, "w") as f:
        json.dump(cache_data, f, indent=2)
    print(f"  [OK] DDR sonuçları '{ddr_cache}' dosyasına kaydedildi (TOPSIS için).")


# ─── Akış 4: DDR Tek Kural (Verbose) ────────────────────────────────────────

def flow_ddr_single():
    if not os.path.exists(DATA_PATH):
        print("  [HATA] Önce veri seti oluşturun (Menü 1).")
        return

    raw, n, m, P, S, D, NP = load_and_parse()

    print("\n  Kural seçin:")
    print("  [1] SCT    [2] SC-LPT    [3] SC-EDD")
    print("  [4] SCT & SC-LPT    [5] SCT & SC-EDD")
    print("  [6] SC-LPT & SCT   [7] SC-EDD & SCT")
    print("  [8] SC-LPT & SC-EDD  [9] SC-EDD & SC-LPT")
    choice = input("  Seçiminiz [1]: ").strip() or "1"

    single_rules = {
        "1": (RULE_SCT,   None,       float("inf")),
        "2": (RULE_SCLPT, None,       float("inf")),
        "3": (RULE_SCEDD, None,       float("inf")),
        "4": (RULE_SCT,   RULE_SCLPT, None),
        "5": (RULE_SCT,   RULE_SCEDD, None),
        "6": (RULE_SCLPT, RULE_SCT,   None),
        "7": (RULE_SCEDD, RULE_SCT,   None),
        "8": (RULE_SCLPT, RULE_SCEDD, None),
        "9": (RULE_SCEDD, RULE_SCLPT, None),
    }

    r1, r2, ts = single_rules.get(choice, (RULE_SCT, None, float("inf")))
    if ts is None:
        ts = ask_float("Kural değiştirme zamanı ts (saat)", 300.0)

    result = run_ddr(n, m, P, S, D, NP, r1, r2, ts, verbose=True)

    print(f"\n  ─── Sonuç ────────────────────────────────────────")
    print(f"  Kural   : {result.rule_name}")
    print(f"  Cmax    : {result.Cmax:.2f}")
    print(f"  Toplam T: {result.total_tardiness:.2f}")
    print(f"  L       : {result.num_tardy}")
    for k, jobs in result.schedule.items():
        seq = "  ".join(f"[J{j} {s:.1f}→{e:.1f}]" for j, s, e in jobs)
        print(f"  Makine {k}: {seq if seq else '(boş)'}")
        
    print_gantt_chart(result.schedule, result.Cmax)


# ─── Akış 5: TOPSIS ─────────────────────────────────────────────────────────

def flow_topsis():
    ddr_cache = os.path.join(ROOT, "data", "ddr_results.json")
    if not os.path.exists(ddr_cache):
        print("  [HATA] DDR sonuçları bulunamadı. Önce Menü 3'ü çalıştırın.")
        return

    with open(ddr_cache) as f:
        candidates = json.load(f)

    print(f"\n  {len(candidates)} kural bulundu.")
    print("  ─── TOPSIS Ağırlıkları ────────────────────────────")
    wC = ask_float("wCmax", 0.333)
    wT = ask_float("wT (Toplam Gecikme)", 0.333)
    wL = round(max(0.0, 1.0 - wC - wT), 4)
    print(f"  wL (Geciken İş Sayısı) → {wL}")

    results = run_topsis(candidates, wC, wT, wL)
    print_topsis_results(results, wC, wT, wL)


# ─── Akış 6: AUGMECON ───────────────────────────────────────────────────────

def flow_augmecon():
    if not os.path.exists(DATA_PATH):
        print("  [HATA] Önce veri seti oluşturun (Menü 1).")
        return

    raw, n, m, P, S, D, NP = load_and_parse()
    data = ProblemData(n=n, m=m, P=P, S=S, D=D, NP=NP)

    print("\n  ─── AUGMECON Parametreleri ────────────────────────")
    tlimit = ask_int("Tekil model zaman limiti (saniye)", 30)
    g_T    = ask_int("T için grid adım sayısı", 4)
    g_L    = ask_int("L için grid adım sayısı", 4)
    
    pareto_set = run_augmecon(data, time_limit=tlimit, grid_T=g_T, grid_L=g_L)

    if pareto_set:
        print("\n  ─── Formül (20): Nihai Pareto Seçimi ──────────────")
        wC = ask_float("Cmax Ağırlığı (wC)", 0.5)
        wT = ask_float("Toplam Gecikme Ağırlığı (wT)", 0.4)
        wL = ask_float("Geciken İş Sayısı Ağırlığı (wL)", 0.1)
        
        select_best_pareto(pareto_set, wC, wT, wL)


# ─── Ana Döngü ──────────────────────────────────────────────────────────────

def main():
    banner()
    while True:
        choice = menu()
        if   choice == "0": flow_full_pipeline()
        elif choice == "1": flow_generate()
        elif choice == "2": flow_cpsat()
        elif choice == "3": flow_ddr_all()
        elif choice == "4": flow_ddr_single()
        elif choice == "5": flow_topsis()
        elif choice == "6": flow_augmecon()
        elif choice == "7":
            print("\n  İyi çalışmalar!\n")
            break
        else:
            print("  [!] Geçersiz seçim.")


if __name__ == "__main__":
    main()
