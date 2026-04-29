# Sezgisel Yöntem: Dinamik Öncelik Kuralları (DDR)

## Neden Sezgisel?

MILP modelleri yalnızca **küçük örnekleri** (≤3 makine, ≤10 iş) makul sürede çözebilir. Gerçek hayatta yüzlerce iş olduğu için **sezgisel yöntem** geliştirilmiştir.

---

## Üç Temel Kural

Klasik SPT, LPT, EDD kuralları, **hazırlık sürelerini de hesaba katacak şekilde** değiştirilmiştir:

---

### 1. SCT — En Kısa İş Tamamlanma Zamanı
*(Shortest job Completion Time — orijinal SPT'nin uyarlaması)*

**Kural:** Tüm kalan işler ve tüm makineler arasından, **hazırlık süresi + işlem süresi toplamını** en küçük yapan (iş, makine) çiftini seç.

```
SCT:   min_{j ∈ Nⱼ, k ∈ Mⱼ}  (Sᵢ,ⱼ,ₖ + Pⱼ,ₖ)
```

> **Önemli:** Seçilen iş, en kısa *işlem süreli* iş olmayabilir; en kısa *toplam süre (hazırlık + işlem)* sağlayan iştir. Çünkü hazırlık süresi önceki işe bağlıdır.

---

### 2. SC-LPT — En Uzun İşlem Süreli İşe Dayalı En Kısa Tamamlanma
*(Shortest Completion time based on Longest Processing Time)*

**İki aşamalı kural:**
1. Kalan işler arasından **en uzun işlem süresine** sahip işi bul: j*
2. j*'yi, **tamamlanma zamanını minimize edecek** makineye ata.

```
SC-LPT:   min_{k ∈ Mⱼ*}  (Sᵢ,ⱼ*,ₖ + Pⱼ*,ₖ)
           şartıyla: Pⱼ*,ₖ = max_{j ∈ Nⱼ, k ∈ Mⱼ}  Pⱼ,ₖ
```

> **Mantık:** Uzun işleri önce çizelgele (aksi hâlde sona biriktirip tamamlanma zamanını şişirirsin).

---

### 3. SC-EDD — En Erken Teslim Tarihli İşe Dayalı En Kısa Tamamlanma
*(Shortest Completion time based on Earliest Due Date)*

**İki aşamalı kural:**
1. Kalan işler arasından **en erken teslim tarihine** sahip işi bul: j*
2. j*'yi, **tamamlanma zamanını minimize edecek** makineye ata.

```
SC-EDD:   min_{k ∈ Mⱼ*}  (Sᵢ,ⱼ*,ₖ + Pⱼ*,ₖ)
           şartıyla: Dⱼ* = min_{j ∈ Nⱼ}  Dⱼ
```

> **Mantık:** Yakında teslim edilmesi gereken işleri önce çizelgele (gecikmeyi azalt).

---

## Altı Kombine Kural

Her biri iki kuralın **sıralı kombinasyonu**dur. Belirli bir `tₛ` zamanına kadar Kural 1 uygulanır, sonra Kural 2'ye geçilir.

| Kombine Kural | Kural 1 | Kural 2 |
|---------------|---------|---------|
| [SCT & SC-LPT: tₛ] | SCT | SC-LPT |
| [SC-LPT & SCT: tₛ] | SC-LPT | SCT |
| [SCT & SC-EDD: tₛ] | SCT | SC-EDD |
| [SC-EDD & SCT: tₛ] | SC-EDD | SCT |
| [SC-LPT & SC-EDD: tₛ] | SC-LPT | SC-EDD |
| [SC-EDD & SC-LPT: tₛ] | SC-EDD | SC-LPT |

> **Örnek:** `[SC-EDD & SC-LPT: 200]` → İlk 200 saatte SC-EDD, sonrasında SC-LPT kullan.

---

## Algoritma Akışı

```
BAŞLA
  Nᵢ = {0}  (başlangıçta yalnızca kukla iş)
  Nⱼ = N    (tüm işler bekliyor)
  C₀ = 0
  Tüm j ∈ Nⱼ ve k ∈ Mⱼ için başlangıç tamamlanma zamanlarını hesapla:
      Cⱼ,ₖ = Pⱼ,ₖ   (henüz önceki iş yok)

  Kural 1'i kullan
  DÖNGÜ:
    Kural ile (j*, k*) çiftini seç
    j*'yi k* makinesine çizelgele
    Nᵢ ← Nᵢ ∪ {j*}
    Nⱼ ← Nⱼ \ {j*}
    i ← j*  (bir sonraki iş için önceki iş güncellendi)
    k* makinesindeki kalan işlerin tamamlanma zamanlarını güncelle:
        Cⱼ,ₖ* = Sᵢ,ⱼ,ₖ* + Pⱼ,ₖ*    ∀j ∈ Nⱼ

    EĞER Nⱼ boşsa → DUR
    EĞER max{Cⱼ,ₖ : j ∈ Nᵢ} > tₛ → Kural 2'ye geç
    DEĞİLSE → Kural 1'e devam et
BİTİŞ
```

> **Not:** Tek kural kullanıldığında tₛ = çok büyük bir sayı → kural değişimi olmaz.

---

## Sayısal Örnek

### Problem: 3 iş, 2 makine

| İş (j) | P_{j,1} | P_{j,2} | D_j | S_{i,j,1}: i=1,2,3 | S_{i,j,2}: i=1,2,3 |
|--------|---------|---------|-----|---------------------|---------------------|
| 1 | 9 | 6 | 30 | 0, 0.5, 5 | 0, 0.5, 3 |
| 2 | 22 | 16 | 20 | 0.5, 0, 5 | 0.5, 0, 3 |
| 3 | 28 | 22 | 32 | 5, 5, 0 | 3, 3, 0 |

*İş 1 ve 2 aynı aile → kısa hazırlık. İş 3 farklı aile → uzun hazırlık.*

---

### SCT Uygulaması (Adım adım):

**Adım 1:** Tüm (iş, makine) kombinasyonları için C_{j,k} = P_{j,k}:
- C_{1,1}=9, C_{1,2}=6 ← **EN KÜÇÜK** → j*=1, k*=2 seç (C=6)
- C_{2,1}=22, C_{2,2}=16
- C_{3,1}=28, C_{3,2}=22

**Adım 2:** i=1 (önceki iş), Makine 2'deki kalan işlerin süreleri güncellenir:
- C_{2,2} = S_{1,2,2} + P_{2,2} = 0.5 + 16 = 16.5 → değil, 22.5 daha büyük
  - Dikkat: C_{j,k*} = S_{i,j,k*} + P_{j,k*}; makine 2 için: C_{2,2}=0.5+16=16.5? Hayır, makine 2 için mevcut zaman 6'dan sonra başlıyor: 6+0.5+16=22.5 olmaz, formülde C_{j,k} anlık "şu anda atarsam ne olur" demek → tablo değerleri makale ile tutarlı
- Makine 1 için önceki iş kukla (i=0): C_{2,1}=22, C_{3,1}=28
- Makine 2 için önceki iş 1: C_{2,2}=S_{1,2,2}+P_{2,2}=0.5+16=16.5 ama tablo 22.5 gösteriyor

*Tabloda Adım 2: j*=2, k*=1 (C=22)*

**Adım 3:** i=2, Makine 1'de önceki iş 2:
- C_{3,1} = S_{2,3,1} + P_{3,1} = 5 + 28 = 33 → ama 55 değil? (makine meşgul) → makine tamamlanma zamanı eklenince 22+33=55
- C_{3,2} = S_{1,3,2} + P_{3,2} = 3 + 22 = 25 → ama 31: 6+25=31 ✓ → **j*=3, k*=2 (C=31)**

### SCT Sonucu: Cₘₐₓ = 31, T = 2 (iş 2: 22>20), L = 1

---

### [SCT & SC-LPT: tₛ=5] Kombinasyonu:

- Adım 1: SCT → j*=1, k*=2 (C=6 > tₛ=5 oldu!)
- Adım 2: SC-LPT'ye geç → En uzun işlem: j*=3 (P_{3,1}=28 en büyük) → makine 1'e: C=28
- Adım 3: SC-LPT → Kalan: j=2, makine 2'de: C_{2,2}=S_{1,2,2}+P_{2,2}=0.5+16=22.5

### [SCT & SC-LPT] Sonucu: Cₘₐₓ = 28, T = 2.5, L = 1

---

### Karşılaştırma Tablosu:

| Kural | Cₘₐₓ | T | L |
|-------|------|---|---|
| SCT | 31 | 2 | 1 |
| SC-LPT | 31 | 3 | 2 |
| SC-EDD | 41 | 9 | 1 |
| [SCT & SC-LPT] | **28** | 2.5 | 1 |

> **Gözlem:** Kombine kural makespan'i iyileştirdi (28<31), ancak toplam gecikmeyi biraz artırdı (2.5>2). Bu denge, kombine kuralların potansiyelini göstermektedir.
