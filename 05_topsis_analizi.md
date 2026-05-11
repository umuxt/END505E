# Çok Kriterli Karar Verme: TOPSIS Analizi

Bu bölüm, Pareto çözümler kümesi veya farklı dağıtım kuralları arasından karar vericinin ağırlıklarına en uygun olanın seçilmesi için kullanılan **TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution)** yöntemini detaylandırır.

## 1. TOPSIS Yönteminin Adımları

Makalede kullanılan TOPSIS süreci 5 temel adımdan oluşur:

### Adım 1: Karar Matrisinin Oluşturulması
Her bir alternatif (Pareto çözümü veya kural) için 3 performans kriteri (Cₘₐₓ, T, L) baz alınarak bir matris oluşturulur.

### Adım 2: Normalizasyon
Bu aşamada makalede iki ayrı kullanım vardır:
- Küçük ölçekli Pareto çözümü seçiminde min-max normalizasyonu kullanılır.
- DDR kurallarını TOPSIS ile sıralarken ise maliyet kriterleri için oran tabanlı normalizasyon kullanılır:
- **Formül:** rᵢⱼ = \tilde{x}ⱼ / xᵢⱼ, burada \tilde{x}ⱼ = minᵢ{xᵢⱼ}.

### Adım 3: Ağırlıklı Normalize Matris
Karar vericinin atadığı ağırlıklar (wⱼ) her bir normalize değerle çarpılır:
- vᵢⱼ = wⱼ × rᵢⱼ

### Adım 4: İdeal ve Anti-İdeal Çözümlerin Belirlenmesi
- **Pozitif İdeal Çözüm (A⁺):** Her kriterdeki en yüksek normalize değerlerin kümesi.
- **Negatif İdeal Çözüm (A⁻):** Her kriterdeki en düşük normalize değerlerin kümesi.

### Adım 5: Yakınlık Katsayısının (CCᵢ) Hesaplanması
Her bir alternatifin ideal çözüme olan bağıl yakınlığı hesaplanır.
- CCᵢ = dᵢ⁻ / (dᵢ⁺ + dᵢ⁻)
- **Karar:** CCᵢ değeri 1'e en yakın olan alternatif, "en iyi" uzlaşmacı çözüm olarak seçilir.

---

## 2. Ağırlık Senaryoları ve Karar Verme

Makale, karar vericinin stratejik önceliklerine göre üç ana senaryo üzerinde durmaktadır:

1.  **Üretim Odaklı (Production-oriented):** Cₘₐₓ (Yayılma Süresi) ağırlığı yüksek tutulur. Amaç tezgah kullanım verimliliğidir.
2.  **Müşteri Odaklı (Customer-oriented):** T (Toplam gecikme) ve L (Geciken iş sayısı) ağırlığı yüksek tutulur. Amaç teslimat taahhütlerine uymaktır.
3.  **Dengeli (Balanced):** Tüm kriterlere yakın ağırlıklar verilir.

> **Analitik Not:** TOPSIS analizi, Pareto kümesindeki "uç" çözümler yerine, tüm hedefler arasında matematiksel olarak en dengeli olanı seçmemize olanak tanır. Özellikle büyük ölçekli problemlerde DDR kurallarının performansını sıralamak için vazgeçilmez bir araçtır.
