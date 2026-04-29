# Notasyon ve Parametreler

> **Hocamızın notasyonuyla eşleştirme:** Makalede kullanılan semboller ile derste kullanılan standart notasyon arasındaki uyum burada gösterilmektedir.

---

## İndeksler

| Sembol | Açıklama |
|--------|----------|
| i, j | İş (job) indeksleri |
| N | Tüm işlerin kümesi: N = {1, 2, …, n} |
| N₀ | Kukla iş (0) dahil işler kümesi: N₀ = {0} ∪ N |
| k | Makine indeksi |
| M | Tüm makineler kümesi: M = {1, 2, …, m} |
| Mⱼ | j işini işleyebilen makineler alt kümesi |

---

## Parametreler

| Sembol | Açıklama | Derste Kullanılan Karşılık |
|--------|----------|---------------------------|
| Pⱼ,ₖ | j işinin k makinesindeki **işlem süresi** (saat) | pⱼ |
| Sᵢ,ⱼ,ₖ | k makinesinde i işinden sonra j işi geldiğinde gereken **hazırlık süresi** | sᵢⱼ |
| Dⱼ | j işinin **teslim tarihi** (saat) | dⱼ |
| V | Büyük sayı (Big-M yöntemi) | M |
| NPⱼ,ₖ | j işinin k makinesinde işlenip işlenemeyeceği (1=evet, 0=hayır) | — |

---

## Karar Değişkenleri

| Sembol | Tür | Açıklama |
|--------|-----|----------|
| Xᵢ,ⱼ,ₖ | İkili (0/1) | k makinesinde i işinden hemen sonra j işi çizelgeleniyorsa 1, değilse 0 |
| Cⱼ | Sürekli (≥0) | j işinin **tamamlanma zamanı** (saat) |
| Cₘₐₓ | Sürekli (≥0) | **Tamamlanma zamanı** = tüm işlerin en geç tamamlanma zamanı |
| eⱼ⁺ | Sürekli (≥0) | j işinin **gecikmesi** (saat): max(Cⱼ - Dⱼ, 0) |
| eⱼ⁻ | Sürekli (≥0) | j işinin **erken bitmesi** (saat): max(Dⱼ - Cⱼ, 0) |
| Uⱼ | İkili (0/1) | j işi geç kalıyorsa 1, değilse 0 |

---

## Performans Ölçütleri

| Sembol | Türkçe | İngilizce | Formül |
|--------|--------|-----------|--------|
| Cₘₐₓ | Tamamlanma zamanı | Makespan | max{Cⱼ}, j ∈ N |
| T | Toplam teslim gecikmesi süresi | Total tardiness | Σ eⱼ⁺ |
| L | Geciken iş sayısı | Number of tardy jobs | Σ Uⱼ |

---

## Sezgisel için Ek Notasyon

| Sembol | Açıklama |
|--------|----------|
| Nᵢ | Çizelgelenmiş işler kümesi |
| Nⱼ | Kalan (henüz çizelgelenmemiş) işler kümesi; N = Nᵢ ∪ Nⱼ |
| Pⱼ*,ₖ | Seçilen j* işinin k makinesindeki işlem süresi |
| Sᵢ,ⱼ*,ₖ | Seçilen j* işinin k makinesindeki hazırlık süresi (önceki iş i) |
| Dⱼ* | Seçilen j* işinin teslim tarihi |
| Cⱼ,ₖ | j işinin k makinesinde tamamlanma zamanı |
| tₛ | Kural değiştirme zamanı (rule-switching time) |

---

## Zaman ve Süre Kavramları Notu

> ⚠️ **Hocamızın vurguladığı fark:**
> - **Zaman** (time): Belirli bir anı gösterir → Cⱼ = j işinin tamamlandığı AN
> - **Süre** (duration): Bir sürecin ne kadar sürdüğünü gösterir → Pⱼ,ₖ = işlem SÜRESİ, Sᵢ,ⱼ,ₖ = hazırlık SÜRESİ

Makalede "completion time" → **tamamlanma zamanı**, "processing time" → **işlem süresi**, "setup time" → **hazırlık süresi**, "tardiness" → **teslim gecikmesi süresi** olarak çevrilmelidir.
