import sys
import os
import re

# Root dizini ekle
sys.path.insert(0, os.path.abspath(os.curdir))

from app.data_generator import generate_problem
from app.ddr_heuristic import run_ddr

def test_single_api_logic():
    print("Simülasyon: solve_single_ddr")
    rule_name = "[SCT & SC-EDD: 200]" # Frontend'den gelen örnek
    print(f"Gelen Kural: {rule_name}")
    
    try:
        # Regex testi
        parts = re.findall(r"\[(.*) & (.*): (\d+)\]", rule_name)
        if parts:
            r1, r2, ts = parts[0]
            print(f"Regex Başarılı: r1={r1}, r2={r2}, ts={ts}")
        else:
            print("Regex Başarısız! Format uymuyor.")
            return

        # Problem üretimi ve veri hazırlığı (Aynen api/index.py'deki gibi)
        n, m, seed = 10, 3, 42
        problem = generate_problem(n, m, seed)
        P  = {int(j): {int(k): problem["P"][str(j)][str(k)] for k in range(m)} for j in range(n)}
        S  = {int(i): {int(j): {int(k): problem["S"][str(i)][str(j)][str(k)] for k in range(m)} for j in range(n)}
              for i in list(range(n)) + [-1]}
        D  = {int(j): float(problem["D"][str(j)]) for j in range(n)}
        NP = {int(j): {int(k): problem["NP"][str(j)][str(k)] for k in range(m)} for j in range(n)}

        print("Çözücü çalıştırılıyor...")
        res = run_ddr(n, m, P, S, D, NP, r1, r2, float(ts))
        print(f"Çözüm Başarılı! Cmax: {res.Cmax}")

    except Exception as e:
        import traceback
        print("\n!!! HATA !!!")
        print(traceback.format_exc())

if __name__ == "__main__":
    test_single_api_logic()
