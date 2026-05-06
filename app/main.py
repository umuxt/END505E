"""
main.py
-------
UPMSP Terminal Uygulaması — Ana Giriş Noktası

Kullanım:
  python app/main.py
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
from app.solver_milp import solve_milp
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
║    UPMSP — İlişkisiz Paralel Makine Çizelgeleme Çözücüsü   ║
║    OR-Tools (CP-SAT & SCIP) + DDR Sezgisel + TOPSIS        ║
╚══════════════════════════════════════════════════════════════╝
""" + Colors.ENDC)


def menu():
    print("\n" + Colors.BLUE + "─" * 65 + Colors.ENDC)
    print(Colors.BOLD + "  ANA MENÜ" + Colors.ENDC)
    print(Colors.BLUE + "─" * 65 + Colors.ENDC)
    
    print(Colors.HEADER + "  [ BÜTÜNCÜL AKIŞLAR - DEMO ]" + Colors.ENDC)
    print("  [1]  " + Colors.YELLOW + Colors.BOLD + "Akademik Doğrulama Akışı (SCIP - Makale Denklemleri)" + Colors.ENDC)
    print("  [2]  " + Colors.GREEN + Colors.BOLD + "Endüstriyel Performans Akışı (CP-SAT - Hızlı Çözüm)" + Colors.ENDC)
    
    print(Colors.HEADER + "\n  [ VERİ YÖNETİMİ ]" + Colors.ENDC)
    print("  [3]  Yeni veri seti oluştur")
    
    print(Colors.HEADER + "\n  [ TEKİL ÇÖZÜCÜLER (EXACT) ]" + Colors.ENDC)
    print("  [4]  Akademik MILP Çöz (SCIP - %100 Makale Notasyonu)")
    print("  [5]  CP-SAT ile Hızlı Çöz (Constraint Programming)")
    
    print(Colors.HEADER + "\n  [ SEZGİSEL (DDR) TESTLERİ ]" + Colors.ENDC)
    print("  [6]  Tüm 39 Kural Konfigürasyonunu Çalıştır")
    print("  [7]  Tek Kural Seç ve Çalıştır (Adım Adım Log)")
    
    print(Colors.HEADER + "\n  [ KARAR ANALİZİ & RAPORLAMA ]" + Colors.ENDC)
    print("  [8]  TOPSIS & AUGMECON Analizi")
    print("  [9]  Raporu PDF Olarak Çıktı Al")
    
    print("\n  [0]  " + Colors.RED + "Çıkış" + Colors.ENDC)
    print(Colors.BLUE + "─" * 65 + Colors.ENDC)
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


# ─── Bütüncül Akış (Pipeline) ──────────────────────────────────────────────

def flow_pipeline(solver_mode="academic"):
    """
    Belirlenen çözücü moduna göre (Academic veya Performance) tüm süreci koşturur.
    """
    mode_name = "AKADEMİK DOĞRULAMA (SCIP)" if solver_mode == "academic" else "ENDÜSTRİYEL PERFORMANS (CP-SAT)"
    solver_func = solve_milp if solver_mode == "academic" else solve

    print(Colors.HEADER + Colors.BOLD + "\n" + "═" * 70)
    print(f"  MAKALE AKIŞI: {mode_name}")
    print("═" * 70 + Colors.ENDC)
    
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
    
    print("\n" + Colors.CYAN + "  [AŞAMA 3] TOPSIS Analizi (Scenario C: wC=0.34, wT=0.33, wL=0.33)..." + Colors.ENDC)
    candidates = [
        {"name": r.rule_name, "Cmax": r.Cmax, "T": r.total_tardiness, "L": r.num_tardy}
        for r in ddr_results
    ]
    topsis_results = run_topsis(candidates, 0.34, 0.33, 0.33, mode=solver_mode)
    print_topsis_results(topsis_results, 0.34, 0.33, 0.33)
    
    # Küçük problemlerde AUGMECON
    if n <= 15:
        print("\n" + Colors.CYAN + f"  [AŞAMA 4] Problem boyutu küçük (n<=15), {mode_name} (AUGMECON) çalıştırılıyor..." + Colors.ENDC)
        pareto_set = run_augmecon(data, time_limit=30, grid_T=4, grid_L=4, solver_func=solver_func)
        if pareto_set:
            print("\n" + Colors.CYAN + "  [AŞAMA 5] Nihai Pareto Seçimi (Scenario C & Formül 20)" + Colors.ENDC)
            best_sol = select_best_pareto(pareto_set, 0.34, 0.33, 0.33)
            if best_sol:
                print_gantt_chart(best_sol.schedule, best_sol.Cmax)
    else:
        print("\n" + Colors.YELLOW + f"  [BİLGİ] İş sayısı büyük (n>15), Exact {mode_name} testi atlandı." + Colors.ENDC)
        print(Colors.CYAN + "  [AŞAMA 4] TOPSIS Kazananı İçin Gantt Şeması Çiziliyor..." + Colors.ENDC)
        if topsis_results:
            best_rule_name = topsis_results[0].rule_name
            best_ddr = next((r for r in ddr_results if r.rule_name == best_rule_name), None)
            if best_ddr:
                print_gantt_chart(best_ddr.schedule, best_ddr.Cmax)
        
    # PDF içeriği için sonuçları metin olarak topla
    best_rule_name = topsis_results[0].rule_name
    best_ddr = next((r for r in ddr_results if r.rule_name == best_rule_name), None)
    
    extra_pdf_content = f"## Seçilen En İyi Kural: {best_rule_name}\n\n"
    extra_pdf_content += "### Performans Değerleri:\n"
    extra_pdf_content += f"- Makespan: {best_ddr.Cmax}\n- Toplam Gecikme: {best_ddr.total_tardiness}\n- Geciken İş Sayısı: {best_ddr.num_tardy}\n\n"
    extra_pdf_content += "### Tam Gantt Şeması (Yüksek Çözünürlük):\n\n```text\n"
    extra_pdf_content += get_gantt_str(best_ddr.schedule, best_ddr.Cmax, width=120)
    extra_pdf_content += "\n```\n"

    print(Colors.GREEN + Colors.BOLD + f"\n  ✓ {mode_name} TAMAMLANDI." + Colors.ENDC)

    # ─── Post-Run Menü ───────────────────────────────────────────────────────
    print("\n" + Colors.CYAN + "─" * 45 + Colors.ENDC)
    print(Colors.BOLD + "  AKIŞ TAMAMLANDI. Ne yapmak istersiniz?" + Colors.ENDC)
    print("  [1] Analiz Sonuçlarını PDF Raporuna Dönüştür")
    print("  [2] Ana Menüye Dön")
    print("  [0] Uygulamadan Çık")
    print(Colors.CYAN + "─" * 45 + Colors.ENDC)
    
    choice = input(Colors.BOLD + "  Seçiminiz: " + Colors.ENDC).strip()
    if choice == "1":
        flow_export_pdf(extra_content=extra_pdf_content)
        input(Colors.YELLOW + "\n  Devam etmek için ENTER tuşuna basın..." + Colors.ENDC)
    elif choice == "0":
        print("\n  İyi çalışmalar!\n")
        sys.exit(0)


# ─── Diğer Akışlar ─────────────────────────────────────────────────────────

def flow_generate():
    print("\n─── Yeni Veri Seti Oluştur ─────────────────────────────")
    n = ask_int("İş sayısı (n)", 8); m = ask_int("Makine sayısı (m)", 3)
    problem = generate_problem(n, m, ask_int("Tohum", 42), ask_int("Aile", 3), ask_float("Kısıt", 0.0))
    save_problem(problem, DATA_PATH)
    print("\n  [OK] Veri oluşturuldu.")

def flow_solver_single(mode="performance"):
    if not os.path.exists(DATA_PATH): return print("  [HATA] Veri yok.")
    raw, n, m, P, S, D, NP = load_and_parse()
    data = ProblemData(n=n, m=m, P=P, S=S, D=D, NP=NP)
    W1 = ask_float("W1-Cmax", 0.5); W2 = ask_float("W2-T", 0.4); W3 = round(1.0-W1-W2, 4)
    res = (solve_milp if mode=="academic" else solve)(data, SolverConfig(W1, W2, W3, ask_int("Saniye", 120)))
    if res.status in ("OPTIMAL", "FEASIBLE"): print_gantt_chart(res.schedule, res.Cmax)

def flow_ddr_all():
    if not os.path.exists(DATA_PATH): return
    raw, n, m, P, S, D, NP = load_and_parse()
    results = run_all_rules(n, m, P, S, D, NP, verbose=False)
    print_ddr_summary(results)
    with open(os.path.join(ROOT, "data", "ddr_results.json"), "w") as f:
        json.dump([{"name": r.rule_name, "Cmax": r.Cmax, "T": r.total_tardiness, "L": r.num_tardy} for r in results], f, indent=2)

def flow_ddr_single():
    raw, n, m, P, S, D, NP = load_and_parse()
    print("\n  [1] SCT [2] SC-LPT [3] SC-EDD [4-9] Kombinasyonlar...")
    choice = input("  Seçim: ").strip() or "1"
    single_rules = {"1":(RULE_SCT,None,None),"2":(RULE_SCLPT,None,None),"3":(RULE_SCEDD,None,None)} # Basitleştirildi
    r1, r2, ts = single_rules.get(choice, (RULE_SCT, RULE_SCEDD, 300.0))
    res = run_ddr(n, m, P, S, D, NP, r1, r2, ts if ts else 300, verbose=True)
    print_gantt_chart(res.schedule, res.Cmax)

def flow_topsis_augmecon():
    raw, n, m, P, S, D, NP = load_and_parse()
    data = ProblemData(n=n, m=m, P=P, S=S, D=D, NP=NP)
    # TOPSIS Check
    ddr_cache = os.path.join(ROOT, "data", "ddr_results.json")
    if os.path.exists(ddr_cache):
        with open(ddr_cache) as f: candidates = json.load(f)
        print_topsis_results(run_topsis(candidates, 0.34, 0.33, 0.33, mode="academic"), 0.34, 0.33, 0.33)
    # AUGMECON Check
    run_augmecon(data, solver_func=solve)

def flow_export_pdf(extra_content: str = ""):
    print("\n  ─── PDF Üretiliyor ───────────────────────────────────────")
    report_file = os.path.join(ROOT, "11_UPMSP_Proje_Raporu_Final.md")
    temp_file = os.path.join(ROOT, "11_TEMP_REPORT.md")
    
    if not os.path.exists(report_file): return print(f"  [HATA] '{report_file}' yok.")

    with open(report_file, "r") as f: content = f.read()
    with open(temp_file, "w") as f:
        f.write(content)
        if extra_content:
            f.write("\n\n---\n# EK: Deneysel Analiz Çıktıları\n" + extra_content)
    
    ret = os.system(f"npx md-to-pdf \"{temp_file}\"")
    if ret == 0:
        pdf_file = temp_file.replace(".md", ".pdf")
        final_pdf = report_file.replace(".md", ".pdf")
        if os.path.exists(final_pdf): os.remove(final_pdf)
        os.rename(pdf_file, final_pdf)
        if os.path.exists(temp_file): os.remove(temp_file)
        print(f"\n  [OK] PDF başarıyla oluşturuldu: {final_pdf}")
    else: print(f"\n  [HATA] PDF başarısız.")


# ─── Ana Döngü ──────────────────────────────────────────────────────────────

def main():
    banner()
    while True:
        choice = menu()
        if   choice == "1": flow_pipeline(solver_mode="academic")
        elif choice == "2": flow_pipeline(solver_mode="performance")
        elif choice == "3": flow_generate()
        elif choice == "4": flow_solver_single(mode="academic")
        elif choice == "5": flow_solver_single(mode="performance")
        elif choice == "6": flow_ddr_all()
        elif choice == "7": flow_ddr_single()
        elif choice == "8": flow_topsis_augmecon()
        elif choice == "9": flow_export_pdf()
        elif choice == "0":
            print("\n  İyi çalışmalar!\n")
            break
        else:
            print("  [!] Geçersiz seçim.")

if __name__ == "__main__":
    main()
