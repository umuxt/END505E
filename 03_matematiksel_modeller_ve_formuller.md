# Matematiksel Modeller ve Formüller

## M1 — Tamamlanma Zamanını (Makespan) En Küçükle

### Amaç Fonksiyonu

**(1)** `Minimize Cₘₐₓ`

Tüm işlerin en geç tamamlanma zamanını minimize et.

---

### Kısıtlar

**(2)** Her j işinin tam olarak bir önceki işi vardır (bir makineye atanır):

```
Σₖ∈M  Σᵢ∈N₀, i≠j  Xᵢ,ⱼ,ₖ = 1      ∀j ∈ N
```

**(3)** Her i işinin tam olarak bir sonraki işi vardır:

```
Σₖ∈M  Σⱼ∈N₀, j≠i  Xᵢ,ⱼ,ₖ = 1      ∀i ∈ N
```

**(4)** Akış dengesi — her makine ve her iş için giriş = çıkış:

```
Σⱼ∈N₀,j≠i  Xᵢ,ⱼ,ₖ  -  Σₕ∈N₀,h≠i  Xₕ,ᵢ,ₖ  = 0      ∀k ∈ M, ∀i ∈ N
```

**(5)** Her makinede en fazla bir işle başlanır (kukla iş 0'dan):

```
Σⱼ∈N  X₀,ⱼ,ₖ ≤ 1      ∀k ∈ M
```

**(6)** Tamamlanma zamanı hesabı — önceki işin tamamlanma zamanı + hazırlık süresi + işlem süresi (Big-M kısıtı):

```
Cⱼ - Cᵢ + V·(1 - Xᵢ,ⱼ,ₖ) ≥ Sᵢ,ⱼ,ₖ + Pⱼ,ₖ      ∀i ∈ N₀, ∀j ∈ N: i≠j, ∀k ∈ M
```

> **Açıklama:** Eğer j işi, k makinesinde i işinden hemen sonra gelmiyorsa (Xᵢ,ⱼ,ₖ=0), büyük V sayısı kısıtı etkisiz kılar. Eğer geliyorsa (Xᵢ,ⱼ,ₖ=1), Cⱼ ≥ Cᵢ + Sᵢ,ⱼ,ₖ + Pⱼ,ₖ zorlanır.

**(7)** Kukla işin tamamlanma zamanı = 0:

```
C₀ = 0
```

**(8)** Tamamlanma zamanı (makespan) tanımı:

```
Cⱼ ≤ Cₘₐₓ      ∀j ∈ N
```

**(9)** Makine kısıtı — j işi kısıtlı makinede çizelgelenemesin:

```
Σₖ∈M  Σᵢ∈N₀,i≠j  Xᵢ,ⱼ,ₖ ≤ NPⱼ,ₖ      ∀j ∈ N
```

**(10)** Tamamlanma zamanları negatif olamaz:

```
Cⱼ ≥ 0      ∀j ∈ N
```

**(11)** İkili değişken tanımı:

```
Xᵢ,ⱼ,ₖ ∈ {0, 1}      ∀i ∈ N₀, ∀j ∈ N₀: i≠j, ∀k ∈ M
```

---

## M2 — Toplam Teslim Gecikmesi Süresini En Küçükle

M1'e ek olarak eⱼ⁺ (gecikme) ve eⱼ⁻ (erken bitme) değişkenleri eklenir.

### Amaç Fonksiyonu

**(12)** `Minimize T = Σⱼ∈N  eⱼ⁺`

Toplam teslim gecikmesi süresini minimize et.

### Kısıtlar: (2)–(10) + aşağıdakiler

**(13)** Gecikme ve erken bitme farkı:

```
Cⱼ - Dⱼ = eⱼ⁺ - eⱼ⁻      ∀j ∈ N
```

> **Açıklama:** Eğer Cⱼ > Dⱼ → iş geç teslim (eⱼ⁺ > 0, eⱼ⁻ = 0). Eğer Cⱼ < Dⱼ → iş erken bitti (eⱼ⁻ > 0, eⱼ⁺ = 0).

**(14)** Gecikme ve erken bitme negatif olamaz:

```
eⱼ⁺, eⱼ⁻ ≥ 0      ∀j ∈ N
```

---

## M3 — Geciken İş Sayısını En Küçükle

M1'e ek olarak Uⱼ (geç iş göstergesi) değişkeni eklenir.

### Amaç Fonksiyonu

**(15)** `Minimize L = Σⱼ∈N  Uⱼ`

Geciken iş sayısını minimize et.

### Kısıtlar: (2)–(10) + (13)–(14) + aşağıdakiler

**(16)** Gecikme ile geç iş göstergesi ilişkisi:

```
eⱼ⁺ = V × Uⱼ      ∀j ∈ N
```

> **Açıklama:** Uⱼ=1 ise iş geç → eⱼ⁺ = V (büyük sayı, yani gecikmeli). Uⱼ=0 ise iş zamanında → eⱼ⁺ = 0.  
> *Not: Bu kısıt, M2'nin (13) ile birlikte kullanılır.*

**(17)** İkili değişken tanımı:

```
Uⱼ ∈ {0, 1}      ∀j ∈ N
```

---

## M4 — Üç Ölçüt için Uzlaşı Çözümleri (Pareto)

### Amaç Fonksiyonları (üçü birden):

```
Min f₁ = Cₘₐₓ
Min f₂ = T  = Σ eⱼ⁺
Min f₃ = L  = Σ Uⱼ
```

### Kısıtlar: (2)–(11), (13)–(14), (16)–(17)

---

## AUGMECON Yöntemi (M4'ü Çözmek İçin)

Çok amaçlı modelde tek bir optimal çözüm bulunamaz (çatışan hedefler). Bu nedenle **ε-kısıt yöntemi** kullanılır.

### Adımlar:

**Adım 1:** f₂ ve f₃ amaç fonksiyonları kısıt haline getirilir:

**(18)**
```
Σⱼ∈N  eⱼ⁺  ≤  T̄       (T̄ = kabul edilebilir toplam gecikme süresi üst sınırı)
```

**(19)**
```
Σⱼ∈N  Uⱼ   ≤  L̄       (L̄ = kabul edilebilir geciken iş sayısı üst sınırı)
```

**Adım 2:** M1, M2, M3 çözülerek **ödeme tablosu** (payoff table) oluşturulur. Her ölçütün en iyi ve en kötü değeri belirlenir.

**Adım 3:** f₂ ve f₃ için aralıklar hesaplanır ve grid noktaları belirlenir.

**Adım 4:** M4, T̄ ve L̄ kombinasyonlarının her biri için çözülür.

**Adım 5:** Baskılanmayan (non-dominated) çözümler → **Pareto çözüm kümesi**

---

## Min-Max Normalizasyonu (Pareto Çözümden Seçim İçin)

**(20)** Karar vericinin ağırlıklı seçimi için normalize etme formülü:

```
x̃ᵢ = (xᵢ - minᵢ{xᵢ}) / (maxᵢ{xᵢ} - minᵢ{xᵢ})
```

> **Açıklama:** x̃ᵢ normalize edilmiş değer (0–1 arası). Karar verici her ölçüte ağırlık (W) atar: WCmax, WT, WL. Toplam normalize puan = WCmax·x̃(Cmax) + WT·x̃(T) + WL·x̃(L). En düşük puanlı Pareto çözümü seçilir.

### Örnek (P1 için):
- WCmax = 0.5, WT = 0.4, WL = 0.1 atandığında
- **Çözüm 6** seçildi: Cmax = 72.14, T = 39.21, L = 3
