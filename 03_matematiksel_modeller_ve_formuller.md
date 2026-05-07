# Matematiksel Modeller ve Formüller

Bu bölüm, makalede sunulan Karmaşık Tamsayılı Doğrusal Programlama (MILP) modellerinin teknik detaylarını ve her bir kısıtın mantıksal açıklamasını içerir.

## Notasyonlar

### İndeksler
- i, j: İş indeksleri (N = {1, 2, ..., n}; N₀ = {0} ∪ N dummy iş dahil).
- k: Tezgah indeksi (M = {1, 2, ..., m}).

### Parametreler
- Pⱼ,ₖ: j işinin k tezgahındaki işlem süresi.
- Sᵢ,ⱼ,ₖ: k tezgahında i işinden hemen sonra j işi işleneceğinde gereken hazırlık süresi.
- Dⱼ: j işinin teslim tarihi (due date).
- V: Çok büyük bir sayı (Big-M katsayısı).
- NPⱼ,ₖ: j işinin k tezgahında işlenebilirliğini gösteren kısıt durumu (1 ise işlenebilir, 0 ise işlenemez).

### Karar Değişkenleri
- Xᵢ,ⱼ,ₖ: Eğer j işi k tezgahında i işinden hemen sonra planlanmışsa 1, aksi halde 0.
- Cⱼ: j işinin tamamlanma zamanı (saat).
- Cₘₐₓ: Tamamlanma zamanı (Yayılma Süresi - tüm işlerin maksimum tamamlanma zamanı).
- eⱼ⁺: j işinin teslim gecikmesi (tardiness) süresi.
- eⱼ⁻: j işinin erken bitme (earliness) süresi.
- Uⱼ: j işi gecikmişse 1, aksi halde 0 (binary gösterge).

---

## M1 — Tamamlanma Zamanını (Yayılma Süresi) En Küçükle

### Amaç Fonksiyonu
**(1)** `Minimize Cₘₐₓ`
> **Mantık:** Tüm işlerin en geç biteninin tamamlanma zamanını minimize ederek toplam üretim süresini (makespan) en kısa tutmayı amaçlar.

### Kısıtlar

**(2)** `Σₖ∈M  Σᵢ∈N₀, i≠j  Xᵢ,ⱼ,ₖ = 1      ∀j ∈ N`
> **Açıklama:** Her j işinin tam olarak bir önceki işi olmasını sağlar. Yani her iş mutlaka bir tezgaha atanmalı ve bir sıraya yerleştirilmelidir.

**(3)** `Σₖ∈M  Σⱼ∈N₀, j≠i  Xᵢ,ⱼ,ₖ = 1      ∀i ∈ N`
> **Açıklama:** Her i işinin tam olarak bir sonraki işi olmasını sağlar.

**(4)** `Σⱼ∈N₀,j≠i  Xᵢ,ⱼ,ₖ - Σₕ∈N₀,h≠i  Xₕ,ᵢ,ₖ = 0      ∀k ∈ M, ∀i ∈ N`
> **Açıklama:** Akış dengesi kısıtıdır. Eğer bir iş bir tezgaha girmişse (bir önceki iş olarak atanmışsa), o tezgahtaksı çıkmalıdır (bir sonraki işin öncülü olmalıdır).

**(5)** `Σⱼ∈N  X₀,ⱼ,ₖ ≤ 1      ∀k ∈ M`
> **Açıklama:** Her tezgahın en fazla bir kukla iş (0) ile başlayabileceğini belirtir. Bu, tezgah başına tek bir iş dizisi (sequence) başlatılmasını garanti eder.

**(6)** `Cⱼ - Cᵢ + V·(1 - Xᵢ,ⱼ,ₖ) ≥ Sᵢ,ⱼ,ₖ + Pⱼ,ₖ      ∀i ∈ N₀, ∀j ∈ N: i≠j, ∀k ∈ M`
> **Açıklama:** Tamamlanma zamanı hesaplama ve çakışma önleme kısıtıdır. Eğer j işi i işinden sonra geliyorsa (Xᵢ,ⱼ,ₖ=1), j'nin bitişi en az (i'nin bitişi + hazırlık süresi + işlem süresi) kadar olmalıdır. Xᵢ,ⱼ,ₖ=0 ise Big-M (V) sayesinde kısıt etkisizleşir.

**(7)** `C₀ = 0`
> **Açıklama:** Kukla başlangıç işinin tamamlanma zamanını 0'a sabitler.

**(8)** `Cⱼ ≤ Cₘₐₓ      ∀j ∈ N`
> **Açıklama:** Cₘₐₓ değişkenini tüm işlerin tamamlanma zamanlarının en büyüğüne eşit veya ondan büyük olmaya zorlar.

**(9)** `Σᵢ∈N₀,i≠j  Xᵢ,ⱼ,ₖ ≤ NPⱼ,ₖ      ∀j ∈ N, ∀k ∈ M`
> **Analitik Not:** Orijinal makalede burada k üzerinden toplam alınmıştır ancak sağ tarafta NPⱼ,ₖ parametresi serbest bırakılmıştır. Doğrusu budur: Her tezgah için işin uygunluğu (NPⱼ,ₖ) ayrı kontrol edilmelidir. Bu kısıt, işin sadece yetkin tezgahlara atanmasını sağlar.

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
> **Açıklama:** Teslim tarihi (Dⱼ) ile gerçekleşen bitiş (Cⱼ) arasındaki farkı hesaplar. Eğer Cⱼ > Dⱼ ise gecikme (eⱼ⁺) pozitif olur, aksi halde erken bitme (eⱼ⁻) pozitif olur.

**(14)** `eⱼ⁺, eⱼ⁻ ≥ 0      ∀j ∈ N`
> **Açıklama:** Gecikme ve erken bitme sürelerinin negatif olamayacağını tanımlar.

---

## M3 — Geciken İş Sayısını En Küçükle

### Amaç Fonksiyonu
**(15)** `Minimize L = Σⱼ∈N  Uⱼ`
> **Mantık:** Gecikme süresinin miktarından bağımsız olarak, sadece toplamda kaç adet işin geç kaldığını minimize etmeyi hedefler.

### Kısıtlar: (2)–(11) + (13)–(14) kısıtlarına ek olarak:

**(16)** `eⱼ⁺ ≤ V × Uⱼ      ∀j ∈ N`
> **Açıklama:** Gecikme süresi ile ikili gösterge (Uⱼ) arasındaki ilişkiyi kurar. Eğer gecikme (eⱼ⁺) 0'dan büyükse, Uⱼ mutlaka 1 olmak zorundadır.
> **Analitik Not:** Orijinal metindeki "=" hatası "≤" olarak düzeltilmiştir. Eşitlik durumunda gecikme süresi yapay olarak V sabitine eşitlenirdi, bu da modelin doğruluğunu bozardı.

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
> **Mantık:** Tüm değerleri 0-1 arasına çekerek karar vericinin belirlediği ağırlıklarla (W) çarpılmasına olanak tanır.
