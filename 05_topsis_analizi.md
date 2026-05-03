# Çok Kriterli Karar Verme: TOPSIS Analizi

Bu bölüm, Pareto çözümler kümesi veya farklı dağıtım kuralları arasından karar vericinin ağırlıklarına en uygun olanın seçilmesi için kullanılan **TOPSIS (Technique for Order of Preference by Similarity to Ideal Solution)** yöntemini detaylandırır.

## 1. TOPSIS Yönteminin Adımları

Makalede kullanılan TOPSIS süreci 5 temel adımdan oluşur:

### Adım 1: Karar Matrisinin Oluşturulması
Her bir alternatif (Pareto çözümü veya kural) için 3 performans kriteri ($C_{max}, T, L$) baz alınarak bir matris oluşturulur.

### Adım 2: Normalizasyon
Kriter değerlerini 0 ile 1 arasına çekmek için kullanılır. Makalede tüm kriterler "maliyet" (ne kadar az o kadar iyi) odaklı olduğu için min-max normalizasyonu tercih edilmiştir:
- **Formül:** $r_{ij} = \frac{\min(x_{ij})}{x_{ij}}$ (Bu formül makalede maliyet kriterlerini faydaya dönüştürmek için kullanılmıştır).

### Adım 3: Ağırlıklı Normalize Matris
Karar vericinin atadığı ağırlıklar ($w_j$) her bir normalize değerle çarpılır:
- $v_{ij} = w_j \times r_{ij}$

### Adım 4: İdeal ve Anti-İdeal Çözümlerin Belirlenmesi
- **Pozitif İdeal Çözüm ($A^+$):** Her kriterdeki en yüksek normalize değerlerin kümesi.
- **Negatif İdeal Çözüm ($A^-$):** Her kriterdeki en düşük normalize değerlerin kümesi.

### Adım 5: Yakınlık Katsayısının ($CC_i$) Hesaplanması
Her bir alternatifin ideal çözüme olan bağıl yakınlığı hesaplanır.
- $CC_i = \frac{D_i^-}{D_i^+ + D_i^-}$
- **Karar:** $CC_i$ değeri 1'e en yakın olan alternatif, "en iyi" uzlaşmacı çözüm olarak seçilir.

---

## 2. Ağırlık Senaryoları ve Karar Verme

Makale, karar vericinin stratejik önceliklerine göre üç ana senaryo üzerinde durmaktadır:

1.  **Üretim Odaklı (Production-oriented):** $C_{max}$ (Makespan) ağırlığı yüksek tutulur. Amaç makine kullanım verimliliğidir.
2.  **Müşteri Odaklı (Customer-oriented):** $T$ (Toplam gecikme) ve $L$ (Geciken iş sayısı) ağırlığı yüksek tutulur. Amaç teslimat taahhütlerine uymaktır.
3.  **Dengeli (Balanced):** Tüm kriterlere yakın ağırlıklar verilir.

> **Ajan Notu (Karar Analisti):** TOPSIS analizi, Pareto kümesindeki "uç" çözümler yerine, tüm hedefler arasında matematiksel olarak en dengeli olanı seçmemize olanak tanır. Özellikle büyük ölçekli problemlerde DDR kurallarının performansını sıralamak için vazgeçilmez bir araçtır.
