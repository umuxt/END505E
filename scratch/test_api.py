import requests

url = "http://127.0.0.1:8000/api/generate"
payload = {
    "n": 5,
    "m": 2,
    "seed": 42,
    "n_families": 2,
    "np_ratio": 0.5
}

try:
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.text}")
except Exception as e:
    print(f"Error: {e}")
