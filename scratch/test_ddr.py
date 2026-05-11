import requests
import json

BASE_URL = "http://localhost:5173/api" # Vite proxy üzerinden veya doğrudan backend portu (8000?)

def test_ddr():
    # 1. Veri üret
    gen_payload = {
        "n": 8,
        "m": 3,
        "seed": 42,
        "n_families": 3,
        "np_ratio": 0.0,
        "scenario": "high"
    }
    print("--- Veri Üretiliyor ---")
    # Not: Terminalde backend'in 8000 portunda çalıştığını varsayıyorum. 
    # Eğer Vite proxy kullanıyorsak 5173.
    # Genelde local testlerde 8000 daha garanti.
    try:
        res = requests.post("http://localhost:8000/api/generate", json=gen_payload)
        data = res.json()
        print("Üretim Başarılı")
    except Exception as e:
        print(f"Hata: {e}")
        return

    # 2. Tekli DDR kuralı test et (Standart)
    print("\n--- Standart DDR Test (SCT) ---")
    sct_payload = {
        **gen_payload,
        "rule_name": "SCT"
    }
    res = requests.post("http://localhost:8000/api/solve_single_ddr", json=sct_payload)
    print(f"SCT Sonuç: {res.status_code}")
    if res.status_code == 200:
        print(res.json()["result"]["Cmax"])
    else:
        print(res.text)

    # 3. Hibrit DDR kuralı test et
    print("\n--- Hibrit DDR Test ([SCT & SC-LPT: 200]) ---")
    hybrid_payload = {
        **gen_payload,
        "rule_name": "[SCT & SC-LPT: 200]"
    }
    res = requests.post("http://localhost:8000/api/solve_single_ddr", json=hybrid_payload)
    print(f"Hibrit Sonuç: {res.status_code}")
    if res.status_code == 200:
        print(res.json()["result"]["Cmax"])
    else:
        print(res.text)

if __name__ == "__main__":
    test_ddr()
