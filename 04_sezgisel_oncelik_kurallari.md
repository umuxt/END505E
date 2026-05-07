# Dinamik Dağıtım Kuralları (DDR) ve Sezgisel Yöntemler

Bu bölüm, büyük ölçekli problemlerin makul sürelerde çözülmesi için geliştirilen Dinamik Dağıtım Kurallarını (Dynamic Dispatching Rules - DDR) ve kural değiştirme (rule-switching) mantığını içerir.

## 1. Modifiye Edilmiş Dağıtım Kuralları

İlişkisiz paralel tezgahlar ve sıra-bağımlı hazırlık sürelerini (SDST) dikkate almak için literatürdeki klasik kurallar modifiye edilmiştir.

### SCT (Shortest Completion Time) - Modifiye SPT
Geleneksel SPT (En Kısa İşlem Süresi) kuralı, hazırlık sürelerini içerecek şekilde genişletilmiştir.
- **Kriter:** Tezgahtaki işlem süresi (Pⱼ,ₖ) ve hazırlık süresinin (Sᵢ,ⱼ,ₖ) toplamını minimize eden işi seçer.
- **Formül:** min { Sᵢ,ⱼ,ₖ + Pⱼ,ₖ }

### SC-EDD (Sequence-Dependent Earliest Due Date)
Geleneksel EDD kuralını hazırlık süreleriyle birleştirir.
- **Kriter:** Teslim tarihi (Dⱼ) en yakın olan işler arasından, hazırlık süresini de gözeterek seçim yapar.

### SC-LPT (Sequence-Dependent Longest Processing Time)
Geleneksel LPT kuralının hazırlık süresi eklenmiş halidir.
- **Kriter:** İşlem süresi ve hazırlık süresi toplamı en uzun olan işe öncelik verir (genellikle iş yükünü dengelemek için kullanılır).

> **Teknik Not:** Makale metninde bu kurallar için verilen tamamlanma zamanı formüllerinde tezgahın mevcut zamanı tipografik olarak eksik bırakılmıştır. Uygulama aşamasında hesaplamalar doğru şekilde (Cⱼ,ₖ = Cᵢ,ₖ + Sᵢ,ⱼ,ₖ + Pⱼ,ₖ) yapılmıştır.

---

## 2. DDR Sezgisel Algoritma Adımları

Algoritma, tüm işler çizelgelenene kadar aşağıdaki adımları izler:

- **Adım 0:** Tüm işleri çizelgelenmemiş kümesine (Nⱼ) koy. Tüm tezgahların hazır olma zamanını 0 yap.
- **Adım 1:** Mevcut kuralı (örneğin SCT) seç.
- **Adım 2:** Nⱼ kümesindeki her bir iş j ve her bir tezgah k için tamamlanma zamanını (Cⱼ,ₖ) hesapla.
- **Adım 3:** Seçilen kurala göre en iyi (iş, tezgah) çiftini (j*, k*) belirle.
- **Adım 4:** j* işini k* tezgahına ata. j* işini Nⱼ kümesinden çıkar.
- **Adım 5:** Tezgahın hazır olma zamanını Cⱼ*,ₖ* olarak güncelle.
- **Adım 6 (Kural Değiştirme):** Eğer kural değiştirme zamanı (tₛ) tanımlanmışsa ve herhangi bir tezgahtaki tamamlanma zamanı tₛ'yi aşmışsa, ikinci kurala (örneğin SC-EDD) geçiş yap. Tüm işler bitene kadar Adım 2-5'i tekrarla.

---

## 3. Sayısal Örnek (Numerical Example)

Makalede sunulan ve 2 tezgah, 5 işten oluşan örnek veri seti aşağıdadır:

### Tablo 2: İşlem Süreleri ve Teslim Tarihleri
| İş (j) | Tezgah 1 (Pⱼ,₁) | Tezgah 2 (Pⱼ,₂) | Teslim Tarihi (Dⱼ) |
| :--- | :--- | :--- | :--- |
| 1 | 15 | 18 | 40 |
| 2 | 22 | 16 | 20 |
| 3 | 25 | 22 | 50 |
| 4 | 20 | 14 | 35 |
| 5 | 12 | 15 | 45 |

### Tablo 3 & 4: Hazırlık Süreleri (Sᵢ,ⱼ,ₖ)
*(Örn: Tezgah 1'de 1. işten sonra 2. iş gelirse hazırlık süresi 5 saattir.)*

| i \ j (M1) | 1 | 2 | 3 | 4 | 5 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0** | 0 | 0 | 0 | 0 | 0 |
| **1** | - | 5 | 8 | 4 | 6 |
| **2** | 3 | - | 7 | 5 | 4 |
| ... | ... | ... | ... | ... | ... |

### Tablo 5: Sonuçların Karşılaştırılması
| Kural | Yayılma Süresi (Cₘₐₓ) | Toplam Gecikme (T) | Geciken İş Sayısı (L) |
| :--- | :--- | :--- | :--- |
| SCT | 32 | 2 | 1 |
| SC-EDD | 35 | 0 | 0 |
| SC-LPT | 47 | 12 | 1 |
| **DDR (SCT + SC-LPT)** | **28** | **2.5** | **1** |

> **Uygulama Notu:** DDR (kural değiştirme) yaklaşımı, Yayılma Süresi değerini belirgin şekilde düşürerek tekli kurallara göre daha iyi bir performans sergilemiştir. Bu durum, farklı zaman dilimlerinde farklı önceliklerin kullanılmasının avantajını kanıtlamaktadır.
