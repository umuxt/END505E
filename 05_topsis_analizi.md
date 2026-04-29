# TOPSIS Yöntemi — Çok Kriterli Karar Analizi

## Amacı

Etkin öncelik kuralları arasından **karar vericinin ağırlıklarına göre en iyi kuralı** belirlemek.

> TOPSIS = Technique for Order Preference by Similarity to Ideal Solution (İdeal Çözüme Benzerliğe Göre Sıralama Tekniği)

---

## Genel Yapı

- **Alternatifler (a):** Öncelik kuralları (ör: SCT, SC-EDD, [SCT & SC-EDD: 450], ...)
- **Kriterler (b):** 3 performans ölçütü (Cₘₐₓ, T, L)
- **Ağırlıklar:** wC, wT, wL → wC + wT + wL = 1

---

## TOPSIS Adımları

### Adım 1: Performans Matrisi Oluştur

```
x_{a,b}:  a kuralının b ölçütündeki ortalama değeri
```

Tüm değerler "maliyet" niteliğindedir → düşük = iyi.

---

### Adım 2: Normalize Et

```
r_{a,b} = x̃_b / x_{a,b}

burada: x̃_b = min_a { x_{a,b} }  (b ölçütündeki en iyi değer)
```

Normalizasyon sonrası: **r_{a,b} ne kadar büyükse o kural o ölçütte o kadar iyidir.**

---

### Adım 3: İdeal Çözümleri Bul

```
v⁺_b = max_a { r_{a,b} }   (pozitif ideal — en iyi)
v⁻_b = min_a { r_{a,b} }   (negatif ideal — en kötü)
```

---

### Adım 4: İdeal Çözümlere Uzaklıkları Hesapla

**Pozitif idealden uzaklık:**
```
S⁺_a = √[ Σ_b  w_b · (r_{a,b} - v⁺_b)² ]
```

**Negatif idealden uzaklık:**
```
S⁻_a = √[ Σ_b  w_b · (r_{a,b} - v⁻_b)² ]
```

---

### Adım 5: Göreli Yakınlık Hesapla ve Sırala

```
C*_a = S⁻_a / (S⁺_a + S⁻_a)
```

- **C*_a ne kadar büyükse → kural o kadar iyidir**
- Maksimum C*_a → en iyi kural seçilir

---

## Sayısal Örnek (Düşük Talep Senaryosu)

İki kural karşılaştırılıyor:
- Kural 1 (a=1): [SC-EDD & SCT: 200]
- Kural 2 (a=2): [SCT & SC-EDD: 450]

Ağırlıklar: wC = 0.36, wT = 0.30, wL = 0.34

### Adım 1 — Performans değerleri:

| Kural (a) | Cₘₐₓ (b=1) | T (b=2) | L (b=3) |
|-----------|------------|---------|---------|
| 1 | 491.22 | 2429.83 | 41.09 |
| 2 | 452.94 | 3795.79 | 42.63 |

### Adım 2 — Normalizasyon:
x̃₁ = 452.94, x̃₂ = 2429.83, x̃₃ = 41.09

| Kural | r_{a,1} | r_{a,2} | r_{a,3} |
|-------|---------|---------|---------|
| 1 | 452.94/491.22 = 0.922 | 2429.83/2429.83 = 1.000 | 41.09/41.09 = 1.000 |
| 2 | 452.94/452.94 = 1.000 | 2429.83/3795.79 = 0.640 | 41.09/42.63 = 0.964 |

### Adım 3 — İdeal çözümler:
- v⁺ = [1.000, 1.000, 1.000]
- v⁻ = [0.922, 0.640, 0.964]

### Adım 4 — Uzaklıklar:

**Kural 1 için:**
```
S⁺₁ = √[ 0.36·(0.922-1)² + 0.30·(1-1)² + 0.34·(1-1)² ]
     = √[ 0.36·0.006084 ] = √0.00219 = 0.0468 ≈ 0.05
S⁻₁ = √[ 0.36·(0.922-0.922)² + 0.30·(1-0.64)² + 0.34·(1-0.964)² ]
     = √[ 0 + 0.30·0.1296 + 0.34·0.001296 ] = √[0.03888+0.000441] ≈ 0.20
```

**Kural 2 için:**
```
S⁺₂ = √[ 0.36·(1-1)² + 0.30·(0.64-1)² + 0.34·(0.964-1)² ]
     = √[ 0 + 0.30·0.1296 + 0.34·0.001296 ] ≈ 0.20
S⁻₂ = √[ 0.36·(1-0.922)² + 0.30·(0.64-0.64)² + 0.34·(0.964-0.964)² ]
     ≈ 0.05
```

### Adım 5 — Göreli yakınlık:
```
C*₁ = 0.20 / (0.05 + 0.20) = 0.80   ← Kural 1 (%80)
C*₂ = 0.05 / (0.20 + 0.05) = 0.20   ← Kural 2 (%20)
```

**Sonuç:** C*₁ > C*₂ → Bu ağırlık kombinasyonunda **[SC-EDD & SCT: 200] daha etkili.**

---

## Kural Seçim Koşulları (Tüm Ağırlık Kombinasyonları Denendi)

### Düşük Talep Senaryosu (2 kural):

[SCT & SC-EDD: 450] şu koşullarda daha etkin:
1. wC ≥ 0.88, wT = 0.04, wL ≤ 0.08
2. wC ≥ 0.70, wT = 0.03, wL ≤ 0.27
3. wC ≥ 0.53, wT = 0.02, wL ≤ 0.45
4. wC ≥ 0.36, wT = 0.01, wL ≤ 0.63

> **Diğer tüm durumlarda:** [SC-EDD & SCT: 200] daha etkin.
> **Ana mesaj:** wT ≥ 0.05 ise [SC-EDD & SCT: 200] her zaman baskın.

### Yüksek Talep Senaryosu (4 kural):

| Kural | En Etkin Olduğu Koşul |
|-------|----------------------|
| SCT | wC ve wL ağırlıklıysa (wT = 0.01, 0.22≤wC≤0.98) |
| [SC-EDD & SCT: 200] | wL çok ağırlıklıysa (wL ≥ 0.86) ve wC/wT küçük |
| [SCT & SC-EDD: 450] | wT orta düzeyde önemliyse (wT ≤ 0.50) |
| SC-EDD | wT > 0.50 ise |
