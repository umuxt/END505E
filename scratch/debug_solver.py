import sys
import os

# Root dizini ekle
sys.path.insert(0, os.path.abspath(os.curdir))

from app.data_generator import generate_problem
from app.ddr_heuristic import run_all_rules

def test_debug():
    try:
        print("1. Problem üretiliyor (n=10, m=3)...")
        n, m, seed = 10, 3, 42
        problem = generate_problem(n, m, seed)
        
        print("2. Veri yapıları hazırlanıyor...")
        P  = {int(j): {int(k): problem["P"][str(j)][str(k)] for k in range(m)} for j in range(n)}
        S  = {int(i): {int(j): {int(k): problem["S"][str(i)][str(j)][str(k)] for k in range(m)} for j in range(n)}
              for i in list(range(n)) + [-1]}
        D  = {int(j): float(problem["D"][str(j)]) for j in range(n)}
        NP = {int(j): {int(k): problem["NP"][str(j)][str(k)] for k in range(m)} for j in range(n)}
        
        print("3. DDR Kuralları çalıştırılıyor (Paralel)...")
        results = run_all_rules(n, m, P, S, D, NP, verbose=False)
        
        print(f"4. Başarılı! {len(results)} kural çözüldü.")
        print(f"Örnek Cmax: {results[0].Cmax}")
        
    except Exception as e:
        import traceback
        print("\n!!! HATA YAKALANDI !!!")
        print(traceback.format_exc())

if __name__ == "__main__":
    test_debug()
