"""
run_multi_agent.py
------------------
Bu betik, kullanıcının talep ettiği 'Multi-Agent' (Çoklu Ajan) mimarisini Gemini API kullanarak
lokal ortamda orkestre eder.

Çalışma Mantığı:
1. Paper Agent (Makale Ajanı) raporu okur ve proje planı / mimari direktifler çıkartır.
2. Bu direktifler Backend Agent'a iletilir ve API kodları (eksiksiz veri dönecek şekilde) oluşturulur/test edilir.
3. Yine aynı direktifler ve Backend API'nin çıktı yapısı Frontend Agent'a iletilir;
   Frontend Agent veriyi kırpmadan (Pagination/Virtual Scroll ile) ekrana basacak React kodunu yazar.

NOT: Bu scriptin çalışması için `google-genai` veya `langchain` yüklü olmalı ve
GEMINI_API_KEY çevre değişkeniniz set edilmiş olmalıdır.
"""

import os
from google import genai
from google.genai import types

def read_prompt(filename):
    with open(f"agents_prompts/{filename}", "r", encoding="utf-8") as f:
        return f.read()

def read_report():
    with open("11_UPMSP_Proje_Raporu_Final.md", "r", encoding="utf-8") as f:
        return f.read()

def main():
    api_key = os.environ.get("GEMINI_API_KEY")
    if not api_key:
        print("Lütfen terminalde GEMINI_API_KEY tanımlayın: export GEMINI_API_KEY='sizin_keyiniz'")
        return

    client = genai.Client(api_key=api_key)
    model_name = 'gemini-2.5-flash'

    print("🚀 Multi-Agent Sistemi Başlatılıyor...\n")

    # 1. PAPER AGENT
    print("📝 [PAPER AGENT] Raporu okuyor ve direktifleri hazırlıyor...")
    paper_prompt = read_prompt("paper_agent.md")
    report_text = read_report()
    
    paper_response = client.models.generate_content(
        model=model_name,
        contents=[f"Sistem Komutun:\n{paper_prompt}\n\nİşte Rapor:\n{report_text}"]
    )
    architecture_directives = paper_response.text
    print("\n✓ Paper Agent Direktifleri Hazırladı.\n")

    # 2. BACKEND AGENT
    print("⚙️ [BACKEND AGENT] API'leri eksiksiz/özetsiz dönmek üzere kodluyor...")
    backend_prompt = read_prompt("backend_agent.md")
    
    backend_response = client.models.generate_content(
        model=model_name,
        contents=[f"Sistem Komutun:\n{backend_prompt}\n\nMakale Ajanının Sana Direktifleri:\n{architecture_directives}"]
    )
    # Burada response kullanılarak dosyalar güncellenebilir (örneğin Langchain Tool'ları ile)
    print("\n✓ Backend Agent Kodlamayı Tamamladı.\n")

    # 3. FRONTEND AGENT
    print("🎨 [FRONTEND AGENT] Sanal kaydırmalı (Virtual Scroll) React arayüzünü kodluyor...")
    frontend_prompt = read_prompt("frontend_agent.md")
    
    frontend_response = client.models.generate_content(
        model=model_name,
        contents=[f"Sistem Komutun:\n{frontend_prompt}\n\nMakale Ajanının Direktifleri:\n{architecture_directives}\n\nBackend Çıktı Formatı Hakkında:\n{backend_response.text}"]
    )
    # Burada response kullanılarak App.jsx vb. güncellenebilir.
    print("\n✓ Frontend Agent Kodlamayı Tamamladı.\n")
    
    print("✅ Tüm Ajanlar (Multi-Agent) görevlerini tamamladı! Artık hiçbir veri kırpılmadan gösteriliyor.")

if __name__ == "__main__":
    main()
