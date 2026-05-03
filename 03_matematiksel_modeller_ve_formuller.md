# Matematiksel Modeller ve Formüller

Bu bölüm, makalede sunulan Karmaşık Tamsayılı Doğrusal Programlama (MILP) modellerinin teknik detaylarını ve her bir kısıtın mantıksal açıklamasını içerir.

## Notasyonlar

### İndeksler
- $i, j$: İş indeksleri ($N = \{1, 2, ..., n\}$; $N_0 = \{0\} \cup N$ dummy iş dahil).
- $k$: Makine indeksi ($M = \{1, 2, ..., m\}$).

### Parametreler
- $P_{j,k}$: $j$ işinin $k$ makinesindeki işlem süresi.
- $S_{i,j,k}$: $k$ makinesinde $i$ işinden hemen sonra $j$ işi işleneceğinde gereken hazırlık süresi.
- $D_j$: $j$ işinin teslim tarihi (due date).
- $V$: Çok büyük bir sayı (Big-M katsayısı).
- $NP_{j,k}$: $j$ işinin $k$ makinesinde işlenebilirliğini gösteren kısıt durumu (1 ise işlenebilir, 0 ise işlenemez).

### Karar Değişkenleri
- $X_{i,j,k}$: Eğer $j$ işi $k$ makinesinde $i$ işinden hemen sonra planlanmışsa 1, aksi halde 0.
- $C_j$: $j$ işinin tamamlanma zamanı (saat).
- $C_{max}$: Tamamlanma zamanı (Makespan - tüm işlerin maksimum tamamlanma zamanı).
- $e^+_j$: $j$ işinin teslim gecikmesi (tardiness) süresi.
- $e^-_j$: $j$ işinin erken bitme (earliness) süresi.
- $U_j$: $j$ işi gecikmişse 1, aksi halde 0 (binary gösterge).

---

## M1 — Tamamlanma Zamanını (Makespan) En Küçükle

### Amaç Fonksiyonu
**(1)** `Minimize Cₘₐₓ`
> **Mantık:** Tüm işlerin en geç biteninin tamamlanma zamanını minimize ederek toplam üretim süresini (makespan) en kısa tutmayı amaçlar.

### Kısıtlar

**(2)** `Σₖ∈M  Σᵢ∈N₀, i≠j  Xᵢ,ⱼ,ₖ = 1      ∀j ∈ N`
> **Açıklama:** Her $j$ işinin tam olarak bir önceki işi olmasını sağlar. Yani her iş mutlaka bir makineye atanmalı ve bir sıraya yerleştirilmelidir.

**(3)** `Σₖ∈M  Σⱼ∈N₀, j≠i  Xᵢ,ⱼ,ₖ = 1      ∀i ∈ N`
> **Açıklama:** Her $i$ işinin tam olarak bir sonraki işi olmasını sağlar.

**(4)** `Σⱼ∈N₀,j≠i  Xᵢ,ⱼ,ₖ - Σₕ∈N₀,h≠i  Xₕ,ᵢ,ₖ = 0      ∀k ∈ M, ∀i ∈ N`
> **Açıklama:** Akış dengesi kısıtıdır. Eğer bir iş bir makineye girmişse (bir önceki iş olarak atanmışsa), o makineden çıkmalıdır (bir sonraki işin öncülü olmalıdır).

**(5)** `Σⱼ∈N  X₀,ⱼ,ₖ ≤ 1      ∀k ∈ M`
> **Açıklama:** Her makinenin en fazla bir kukla iş (0) ile başlayabileceğini belirtir. Bu, makine başına tek bir iş dizisi (sequence) başlatılmasını garanti eder.

**(6)** `Cⱼ - Cᵢ + V·(1 - Xᵢ,ⱼ,ₖ) ≥ Sᵢ,ⱼ,ₖ + Pⱼ,ₖ      ∀i ∈ N₀, ∀j ∈ N: i≠j, ∀k ∈ M`
> **Açıklama:** Tamamlanma zamanı hesaplama ve çakışma önleme kısıtıdır. Eğer $j$ işi $i$ işinden sonra geliyorsa ($X_{i,j,k}=1$), $j$'nin bitişi en az ($i$'nin bitişi + hazırlık süresi + işlem süresi) kadar olmalıdır. $X_{i,j,k}=0$ ise Big-M ($V$) sayesinde kısıt etkisizleşir.

**(7)** `C₀ = 0`
> **Açıklama:** Kukla başlangıç işinin tamamlanma zamanını 0'a sabitler.

**(8)** `Cⱼ ≤ Cₘₐₓ      ∀j ∈ N`
> **Açıklama:** $C_{max}$ değişkenini tüm işlerin tamamlanma zamanlarının en büyüğüne eşit veya ondan büyük olmaya zorlar.

**(9)** `Σᵢ∈N₀,i≠j  Xᵢ,ⱼ,ₖ ≤ NPⱼ,ₖ      ∀j ∈ N, ∀k ∈ M`
> **Ajan Notu (Matematikçi & Yöneylemci):** Orijinal makalede burada $k$ üzerinden toplam alınmıştır ancak sağ tarafta $NP_{j,k}$ serbest bırakılmıştır. Doğrusu budur: Her makine için işin uygunluğu ($NP_{j,k}$) ayrı kontrol edilmelidir. Bu kısıt, işin sadece yetkin makinelere atanmasını sağlar.

**(10)** `Cⱼ ≥ 0      ∀j ∈ N`
> **Açıklama:** Tamamlanma zamanlarının negatif olamayacağını belirtir.

**(11)** `Xᵢ,ⱼ,ₖ ∈ {0, 1}      ∀i ∈ N₀, ∀j ∈ N₀: i≠j, ∀k ∈ M`
> **Açıklama:** Atama değişkeninin ikili (binary) olduğunu tanımlar.

---

## M2 — Toplam Teslim Gecikmesi Süresini En Küçükle

### Amaç Fonksiyonu
**(12)** `Minimize T = Σⱼ∈N  eⱼ⁺`
> **Mantık:** Müşteri memnuniyetini maksimize etmek için tüm işlerin toplam gecikme süresini minimize eder.

### Kısıtlar: (2)–(11) kısıtlarına ek olarak:

**(13)** `Cⱼ - Dⱼ = eⱼ⁺ - eⱼ⁻      ∀j ∈ N`
> **Açıklama:** Teslim tarihi ($D_j$) ile gerçekleşen bitiş ($C_j$) arasındaki farkı hesaplar. Eğer $C_j > D_j$ ise gecikme ($e_j^+$) pozitif olur, aksi halde erken bitme ($e_j^-$) pozitif olur.

**(14)** `eⱼ⁺, eⱼ⁻ ≥ 0      ∀j ∈ N`
> **Açıklama:** Gecikme ve erken bitme sürelerinin negatif olamayacağını tanımlar.

---

## M3 — Geciken İş Sayısını En Küçükle

### Amaç Fonksiyonu
**(15)** `Minimize L = Σⱼ∈N  Uⱼ`
> **Mantık:** Gecikme süresinin miktarından bağımsız olarak, sadece toplamda kaç adet işin geç kaldığını minimize etmeyi hedefler.

### Kısıtlar: (2)–(11) + (13)–(14) kısıtlarına ek olarak:

**(16)** `eⱼ⁺ ≤ V × Uⱼ      ∀j ∈ N`
> **Açıklama:** Gecikme süresi ile ikili gösterge ($U_j$) arasındaki ilişkiyi kurar. Eğer gecikme ($e_j^+$) 0'dan büyükse, $U_j$ mutlaka 1 olmak zorundadır.
> **Ajan Notu (Yöneylemci):** Orijinal metindeki `=` hatası `≤` olarak düzeltilmiştir. Eşitlik durumunda gecikme süresi yapay olarak $V$ sabitine eşitlenirdi, bu da modelin doğruluğunu bozardı.

**(17)** `Uⱼ ∈ {0, 1}      ∀j ∈ N`
> **Açıklama:** Geciken iş göstergesinin ikili (binary) olduğunu tanımlar.

---

## M4 — Üç Ölçüt için Uzlaşı Çözümleri (Pareto)

### Amaç Fonksiyonları
```
Min f₁ = Cₘₐₓ
Min f₂ = T
Min f₃ = L
```
> **Mantık:** Bu üç çatışan hedefi (makespan, gecikme süresi, geciken iş sayısı) aynı anda minimize etmeye çalışır.

### Kısıtlar: (2)–(11), (13)–(14), (16)–(17)

---

## AUGMECON Yöntemi ve Normalizasyon

M4 modelini çözmek için kullanılan **Artırılmış ε-kısıt (AUGMECON)** yöntemi, bir amacı ana hedef seçerken diğerlerini kısıt olarak ekler:

**(18)** `Σⱼ∈N  eⱼ⁺ ≤ T̄` (Toplam gecikme üst sınırı)
**(19)** `Σⱼ∈N  Uⱼ ≤ L̄` (Geciken iş sayısı üst sınırı)

### Normalizasyon (Min-Max)
Farklı birimlerdeki (saat vs. adet) amaçları karşılaştırmak için kullanılır:
**(20)** `x̃ᵢ = (xᵢ - minᵢ{xᵢ}) / (maxᵢ{xᵢ} - minᵢ{xᵢ})`
> **Mantık:** Tüm değerleri 0-1 arasına çekerek karar vericinin belirlediği ağırlıklarla ($W$) çarpılmasına olanak tanır.
