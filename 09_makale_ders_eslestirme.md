# Makale ↔ Ders Notları Eşleştirme Haritası

**Ders:** Üretimde Sıralama ve Çizelgeleme — Doç.Dr. Murat Baskak, İTÜ  
**Makale:** Tai et al. (2024), Decision Analytics Journal 13, 100525

---

## Hızlı Bağlantı Tablosu

| Makaledeki Kavram | Ders Bölümü | Ders Karşılığı |
|-------------------|-------------|----------------|
| Çizelgeleme problemi tanımı | **Bölüm 00, 01** | Üretim çizelgesi ve planlama faaliyetleri |
| Öncelik kuralları (SPT, EDD, LPT) | **Bölüm 04A** | Öncelik kuralları genel |
| SPT → SCT dönüşümü | **Bölüm 04B** | KİSÖ (SPT) kuralı, C* enküçükleme |
| EDD → SC-EDD dönüşümü | **Bölüm 04B** | Teslim tarihli durumlar |
| Tek tezgah formülleri | **Bölüm 04B** | n×1 sıralama yöntemleri |
| Paralel tezgah / ilişkisiz tezgah | **Bölüm 05** | Paralel tezgah sıralama algoritmaları |
| Yayılma Süresi (Cₘₐₓ) | **Bölüm 04A, 04B, 05** | Yayılma süresi (M) |
| Toplam tamamlanma zamanı | **Bölüm 04B** | C* (ortalama tamamlanma zamanı) |
| Toplam teslim gecikmesi süresi | **Bölüm 04B** | Teslim tarihli problemler, gecikme |
| Geciken iş sayısı (L) | **Bölüm 04B** | NT (geciken iş sayısı) |
| Gantt diyagramı | **Bölüm 04A** | Gantt diyagramı ile çizelgeleme |
| MILP modeli | **Bölüm 04A** | Matematiksel programlama yaklaşımı |
| Sezgisel yöntem | **Bölüm 04A** | Sezgisel yaklaşımlar |
| Akış tipi / sipariş tipi atölye | **Bölüm 06, 07** | Makale kapsamında değil (arka plan) |

---

## Bölüm Bölüm Detaylı Eşleştirme

---

### 📂 Bölüm 00 — Genel Sunum (10 sayfa)

**İçerik:** Dersin genel tanıtımı, sıralama ve çizelgelemenin üretim planlamadaki yeri.

**Makaledeki Karşılık:**
- Makalenin **Bölüm 1 (Giriş)** ile örtüşür
- "Üretim planlamanın önemi" — makalenin motivasyonu (Tayland çelik boru fabrikası)
- Çizelgelemenin karmaşıklığı → n! olasılık → sezgisele ihtiyaç

---

### 📂 Bölüm 01 — Üretim Çizelgesi (12 sayfa)

**İçerik:** Üretim planlama hiyerarşisi, çizelgeler, rotalama-yükleme-sıralama ilişkisi.

**Makaledeki Karşılık:**
- "Her ay işler dönem başında hazır" → **Statik çizelgeleme**
- "İşler teslim tarihli" → **Teslim tarihli problem** sınıfı
- Dönemsel (aylık) çizelgeleme yapısı → makaledeki "her üretim dönemi" kavramı

---

### 📂 Bölüm 02 — Rotalama (7 sayfa)

**İçerik:** İşin hangi tezgahtan geçeceğini belirleme.

**Makaledeki Karşılık:**
- Makalede rotalama **önceden belirlenmiş** — her iş hangi tezgahta yapılabileceğini NPⱼ,ₖ parametresi ile gösteriyor
- Bu bölüm makalenin **arka planı**, makale doğrudan çizelgelemeye odaklanıyor

---

### 📂 Bölüm 03 — İş Yükleme (104 sayfa)

**İçerik:** İşleri tezgahlara dağıtma (assignment), kapasite planlama, Gantt.

**Makaledeki Karşılık:**
- Makalede "hangi iş hangi tezgaha" kararı → bu bölümün konusu
- Makaledeki Xᵢ,ⱼ,ₖ değişkeni = bir işin bir tezgaha atanması (yükleme kararı)
- **Fark:** Makale yükleme + sıralama kararını **aynı anda** veriyor (entegre model)

**Uygulama İle Bağlantı (Gantt Diyagramı):**
- Dersin 3. bölümünde işlenen **Gantt Diyagramı** ile iş yükleme takibi, projemizde geliştirilen **Zaman Dilimli Gantt Şeması** ile endüstriyel boyuta taşınmıştır.
- Dersteki manuel çizim mantığı, büyük ölçekli (250 iş) veriler için otomatik ve parçalı (chunked) bir raporlama motoruna dönüştürülmüştür.

---

### 📂 Bölüm 04A — İş Sıralama Temel Bilgiler (48 sayfa)

**İçerik:** Öncelik kuralları, problem sınıflandırması (α|β|γ notasyonu), Gantt diyagramı, temel formüller.

**Makaledeki Doğrudan Karşılıklar:**

| Ders Kavramı | Makale Karşılığı |
|---|---|
| Öncelik kuralı (dispatching rule) | SCT, SC-LPT, SC-EDD kuralları |
| Sıralama problemi sınıflandırması | α=P (parallel, unrelated) \| β=S_ij \| γ=Cmax, ΣTj, ΣUj |
| Gantt diyagramı | Şekil 2 (tezgah başına iş sırası) |
| Sezgisel vs. kesin yöntem | MILP (kesin) vs. DDR (sezgisel) |

> ⭐ **Bu bölüm makalenin metodolojisini doğrudan besliyor.**

---

### 📂 Bölüm 04B — Tek Tezgah Sıralama Yöntemleri (90 sayfa)

**İçerik:** SPT, EDD, WSPT, Moore algoritması, gecikme formülleri.

**Makaledeki Doğrudan Karşılıklar:**

| Ders Kavramı | Makale Karşılığı |
|---|---|
| KİSÖ / SPT (Kısa İşlem Süresi Önce) | **SCT** kuralının temeli |
| EÖT / EDD (En Önce Teslim) | **SC-EDD** kuralının temeli |
| UÖT / LPT (Uzun İşlem Süresi Önce) | **SC-LPT** kuralının temeli |
| Yayılma süresi M / C_max | **Cₘₐₓ** (Tamamlanma zamanı) |
| Ortalama tamamlanma zamanı C* | C_j (iş bazında tamamlanma zamanı) |
| Gecikme T_j = max(C_j - d_j, 0) | **eⱼ⁺** (gecikme değişkeni) |
| Geciken iş sayısı N_T | **L = Σ Uⱼ** |
| Moore algoritması | Makale bunu kullanmıyor; MILP ve DDR kullanıyor |

> ⭐ **Derste öğrenilen formüller birebir makalede karşımıza çıkıyor.**  
> Özellikle: `Cⱼ - Dⱼ = eⱼ⁺ - eⱼ⁻` (kısıt 13) = dersin gecikme/erken tanımı

**Derste Kullanılan Notasyon → Makale Notasyonu:**

| Ders | Makale | Açıklama |
|------|--------|----------|
| pᵢ | Pⱼ,ₖ | İşlem süresi (tezgaha bağlı) |
| dᵢ | Dⱼ | Teslim tarihi |
| Cᵢ | Cⱼ | Tamamlanma zamanı |
| M | Cₘₐₓ | Tamamlanma zamanı (yayılma süresi) |
| Tᵢ | eⱼ⁺ | Gecikme süresi |
| NT | L = Σ Uⱼ | Geciken iş sayısı |
| — | Sᵢ,ⱼ,ₖ | Hazırlık süresi (ders genelde sabit ya da 0 alır) |

---

### 📂 Bölüm 05 — Paralel Tezgah Sıralama (87 sayfa)

**İçerik:** Özdeş/aynı/ilişkisiz paralel tezgahlar, McNaughton, Hu algoritması.

**Makaledeki Doğrudan Karşılıklar:**

| Ders Kavramı | Makale Karşılığı |
|---|---|
| Özdeş paralel tezgah | Makale'de **yok** (daha basit durum) |
| **İlişkisiz paralel tezgah** | **Makalenin tam problemi** — Pⱼ,ₖ tezgaha göre farklı |
| Yayılma Süresi alt sınırı formülü | Makale bu sınırı M1 modeliyle kesin hesaplıyor |
| Sıralama algoritmaları | Makalede MILP + SCT/SC-LPT/SC-EDD |
| NT azaltma | Makale M3 ile formal model, DDR ile sezgisel |

> ⭐ **Bu bölüm makalenin problem ortamının dersdeki karşılığı.**  
> "İlişkisiz paralel tezgah" derste teorik olarak işleniyor; makale bunu gerçek veriyle çözüyor.

**Kritik Fark — Derste vs. Makalede:**

| Konu | Derste | Makalede |
|------|--------|---------|
| Tezgah türü | Özdeş veya eşit hızlı | **İlişkisiz** (her iş her tezgahta farklı hız) |
| Hazırlık süresi | Genelde 0 | **Tezgah + sıra bağımlı** Sᵢ,ⱼ,ₖ |
| Hedef sayısı | Tek | **Üç hedef** (Cₘₐₓ, T, L) |
| Yöntem | Algoritma (McNaughton vb.) | MILP + Sezgisel (DDR) |

---

### 📂 Bölüm 06 — Akış Tipi Atölye (101 sayfa)

**İçerik:** Her iş aynı tezgah sırasından geçer (Flow shop). Johnson kuralı vb.

**Makaledeki Karşılık:**
- Makale **akış tipi değil** — her iş herhangi bir tezgaha gidebiliyor
- Bu bölüm makalenin **alternatif problem türü** olarak bağlamını anlamak için faydalı

---

### 📂 Bölüm 07 — Sipariş Tipi Atölye (46 sayfa)

**İçerik:** Her işin kendi rotası var (Job shop). NP-hard, karmaşık.

**Makaledeki Karşılık:**
- Makale **job shop değil** — her iş **tek bir tezgaha** gidiyor (bir operasyonlu)
- Bu bölüm de bağlam için, makale kapsamında doğrudan kullanılmıyor

---

## Makaledeki Formüller → Ders Formülleriyle Karşılaştırma

| Makale Formülü | Ders Formülü | Açıklama |
|----------------|--------------|----------|
| Min Cₘₐₓ (1) | M = max{Cᵢ} | Yayılma süresi minimizasyonu |
| Min T = Σeⱼ⁺ (12) | Min ΣTᵢ | Toplam gecikme minimizasyonu |
| Min L = ΣUⱼ (15) | Min NT | Geciken iş sayısı minimizasyonu |
| Cⱼ - Dⱼ = eⱼ⁺ - eⱼ⁻ (13) | Tᵢ = max(Cᵢ-dᵢ, 0) | Gecikme tanımı |
| SCT: min(Sᵢⱼₖ + Pⱼₖ) | SPT: min(pᵢ) | Kısa süre önce (hazırlık süresi eklendi) |
| SC-EDD: argmin Dⱼ | EDD: argmin dᵢ | En erken teslim tarihi önce |

---

## Eğitim Sırası Önerisi

Makaleyi tam anlamak için ders bölümlerini şu sırayla bilmek gerekiyor:

```
Bölüm 04A (Temel kavramlar, öncelik kuralları)
    ↓
Bölüm 04B (Tek tezgah formülleri — SPT, EDD, gecikme)
    ↓
Bölüm 05 (Paralel tezgah — ilişkisiz tezgah)
    ↓
Makale (Bu iki bölümü birleştirip hazırlık süresi + çok hedef ekliyor)
```

Bölüm 06 ve 07 → makalenin **kapsamı dışında** kalan problem türleri, bağlam için.
