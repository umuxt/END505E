# Sunum Hazırlama Rehberi (15-20 Dakika - Detaylı Akış)

Bu rehber, ders hocasının 6 maddelik şartnamesine %100 uyumlu, 15-20 dakikalık bir sunum için tasarlanmış 22 slaytlık bir plandır.

---

## Genel Kurallar
- **Format:** Sadece PowerPoint (.pptx).
- **Görsel:** Formülleri metin olarak yazmayın, makaleden kesip resim olarak yapıştırın.
- **Dil:** Formül altındaki açıklamalar ve sunum dili tamamen Türkçe.
- **Terminoloji:** "Tamamlanma Zamanı", "Yayılma Süresi", "Teslim Gecikmesi Süresi" gibi dersteki terimleri kullanın.

---

## Slayt Detayları

### BÖLÜM 1: GİRİŞ VE KİMLİK (2 Slayt)
- **Slayt 1: Kapak** (Hocanın şartı: Ders adı, makale İng/Tr başlıkları, numara, ad-soyad, fotoğraf).
- **Slayt 2: Makale Tanıtımı** (Hocanın şartı: Orijinal makale başlığı, dergi künyesi ekran görüntüsü).

### BÖLÜM 2: PROBLEMİN TANIMI VE ÖNEMİ (3 Slayt)
- **Slayt 3: Endüstriyel Motivasyon:** Tayland'daki çelik boru fabrikası örneği. Karmaşık makine yapısı ve yüksek hazırlık süreleri.
- **Slayt 4: UPMSP ve SDST Kavramları:** "İlişkisiz Paralel Makineler" ve "Sıra-Bağımlı Hazırlık Süreleri"nin üretimdeki karşılığı.
- **Slayt 5: Amaçlar (Objectives):** Çatışan 3 hedefin tanıtımı:
    1. Yayılma Süresi ($C_{max}$) - Verimlilik.
    2. Toplam Teslim Gecikmesi Süresi ($T$) - Müşteri Memnuniyeti.
    3. Geciken İş Sayısı ($L$) - Güvenilirlik.

### BÖLÜM 3: MATEMATİKSEL MODEL - MILP (6 Slayt)
- **Slayt 6: İndeksler ve Parametreler:** $i, j, k, P_{j,k}, S_{i,j,k}, D_j, V, NP_{j,k}$. (Zaman ve Süre ayrımına dikkat ederek açıkla).
- **Slayt 7: M1 Modeli (Yayılma Süresi):** [Denklem 1 resmi] + Türkçe açıklama.
- **Slayt 8: Temel Atama Kısıtları:** [Denklem 2, 3, 4 resimleri] + Akış dengesi ve tekil atama mantığı.
- **Slayt 9: Hazırlık Süreli Zaman Kısıtı:** [Denklem 6 resmi] + Big-M mantığının ve $S_{i,j,k}$'nın modele yedirilmesinin anlatımı.
- **Slayt 10: M2 & M3 Modelleri (Gecikme ve İş Sayısı):** [Denklem 12-16 resimleri] + Gecikme ($e_j^+$) ve Geciken İş ($U_j$) değişkenleri.
- **Slayt 11: Analitik Denetim (Hata Düzeltme):** Makaledeki Denklem 9 ve 16'daki hataları ve yaptığımız düzeltmeleri (Eşitlik -> Eşitsizlik) teknik olarak açıkla. (Hocanın ilgisini çekecek kısımdır).

### BÖLÜM 4: SEZGİSEL YÖNTEM - DDR (5 Slayt)
- **Slayt 12: Neden Sezgisel?** MILP'in 10 işten sonra tıkanması ve gerçek dünyadaki 250+ işlik ihtiyaç.
- **Slayt 13: Modifiye Dağıtım Kuralları:** SCT (Shortest Completion Time), SC-EDD ve SC-LPT.
- **Slayt 14: Algoritma Akış Şeması:** [Figür 1 resmi] + Adım adım (Step 0-6) sürecin anlatımı.
- **Slayt 15: Kural Değiştirme Mantığı ($t_s$):** Üretimin belirli bir AN'ında strateji değiştirmenin mantığı (Dinamik yaklaşım).
- **Slayt 16: DDR Algoritmasının Teorik Hatası:** Makaledeki kümülatif zaman formülü eksikliği ve bizim "Ajan Notu" ile yaptığımız düzeltme.

### BÖLÜM 5: SAYISAL ÖRNEK VE TOPSIS (4 Slayt)
- **Slayt 17: Sayısal Örnek Verileri:** [Tablo 2-3 resimleri]. 2 makine 5 işlik senaryo.
- **Slayt 18: Çözüm Süreci:** DDR'ın adım adım atamaları ve final çizelgesi.
- **Slayt 19: TOPSIS Metodolojisi:** [TOPSIS formül resimleri]. Çok Kriterli Karar Verme adımları.
- **Slayt 20: Karar Verici Senaryoları:** Üretim odaklı ağırlıklar vs. Müşteri odaklı ağırlıklar sonucu seçilen kurallar.

### BÖLÜM 6: HESAPLAMALI SONUÇLAR VE KAPANIŞ (2 Slayt)
- **Slayt 21: MILP vs DDR Performansı:** [Tablo 12 özeti]. Sezgisellerin hızı ve Pareto çözümlerine yakınlığı (%95+).
- **Slayt 22: Genel Değerlendirme ve Sonuç:** Çalışmanın endüstriyel esnekliği ve hibrit kuralların başarısı.

---

## Anlatım İçin Anahtar İpuçları
1.  **Zaman/Süre Farkı:** Anlatırken "Cj işin tamamlanma zamanıdır (AN), Pjk ise işlem süresidir (ARALIK)" vurgusunu en az bir kez yapın.
2.  **Özet Anlatım:** Slaytlara uzun metinler yazmayın. Formül altındaki açıklamalar tek cümlelik ve net olsun.
3.  **Algı Kolaylığı:** Karmaşık tablolar yerine, o tabloların bize ne söylediğini (örn: "SCT Makespan'de daha iyi") vurgulayın.
