# Dinamik Dağıtım Kuralları (DDR) ve Sezgisel Yöntemler

Bu bölüm, büyük ölçekli problemlerin makul sürelerde çözülmesi için geliştirilen Dinamik Dağıtım Kurallarını (Dynamic Dispatching Rules - DDR) ve kural değiştirme (rule-switching) mantığını içerir.

## 1. Modifiye Edilmiş Dağıtım Kuralları

İlişkisiz paralel makineler ve sıra-bağımlı hazırlık sürelerini (SDST) dikkate almak için literatürdeki klasik kurallar modifiye edilmiştir.

### SCT (Shortest Completion Time) - Modifiye SPT
Geleneksel SPT (En Kısa İşlem Süresi) kuralı, hazırlık sürelerini içerecek şekilde genişletilmiştir.
- **Kriter:** Makinedeki işlem süresi ($P_{j,k}$) ve hazırlık süresinin ($S_{i,j,k}$) toplamını minimize eden işi seçer.
- **Formül:** $\min \{ S_{i,j,k} + P_{j,k} \}$

### SC-EDD (Sequence-Dependent Earliest Due Date)
Geleneksel EDD kuralını hazırlık süreleriyle birleştirir.
- **Kriter:** Teslim tarihi ($D_j$) en yakın olan işler arasından, hazırlık süresini de gözeterek seçim yapar.

### SC-LPT (Sequence-Dependent Longest Processing Time)
Geleneksel LPT kuralının hazırlık süresi eklenmiş halidir.
- **Kriter:** İşlem süresi ve hazırlık süresi toplamı en uzun olan işe öncelik verir (genellikle iş yükünü dengelemek için kullanılır).

> **Ajan Notu (Matematikçi):** Makale metninde bu kurallar için verilen tamamlanma zamanı formüllerinde ($C_{j,k} = S_{i,j,k} + P_{j,k}$) makinenin mevcut zamanı ($C_{i,k}$) tipografik olarak eksik bırakılmıştır. Ancak sayısal örneklerde hesaplamalar doğru şekilde ($C_{j,k} = C_{i,k} + S_{i,j,k} + P_{j,k}$) yapılmıştır. Kodlamada bu toplamsal yapı kullanılmalıdır.

---

## 2. DDR Sezgisel Algoritma Adımları

Algoritma, tüm işler çizelgelenene kadar aşağıdaki adımları izler:

- **Adım 0:** Tüm işleri çizelgelenmemiş kümesine ($N_j$) koy. Tüm makinelerin hazır olma zamanını 0 yap.
- **Adım 1:** Mevcut kuralı (örneğin SCT) seç.
- **Adım 2:** $N_j$ kümesindeki her bir iş $j$ ve her bir makine $k$ için tamamlanma zamanını ($C_{j,k}$) hesapla.
- **Adım 3:** Seçilen kurala göre en iyi (iş, makine) çiftini ($j^*, k^*$) belirle.
- **Adım 4:** $j^*$ işini $k^*$ makinesine ata. $j^*$ işini $N_j$ kümesinden çıkar.
- **Adım 5:** Makinenin hazır olma zamanını $C_{j^*, k^*}$ olarak güncelle.
- **Adım 6 (Kural Değiştirme):** Eğer kural değiştirme zamanı ($t_s$) tanımlanmışsa ve herhangi bir makinedeki tamamlanma zamanı $t_s$'yi aşmışsa, ikinci kurala (örneğin SC-EDD) geçiş yap. Tüm işler bitene kadar Adım 2-5'i tekrarla.

---

## 3. Sayısal Örnek (Numerical Example)

Makalede sunulan ve 2 makine, 5 işten oluşan örnek veri seti aşağıdadır:

### Tablo 2: İşlem Süreleri ve Teslim Tarihleri
| İş (j) | Makine 1 ($P_{j,1}$) | Makine 2 ($P_{j,2}$) | Teslim Tarihi ($D_j$) |
| :--- | :--- | :--- | :--- |
| 1 | 15 | 18 | 40 |
| 2 | 22 | 16 | 20 |
| 3 | 25 | 22 | 50 |
| 4 | 20 | 14 | 35 |
| 5 | 12 | 15 | 45 |

### Tablo 3 & 4: Hazırlık Süreleri ($S_{i,j,k}$)
*(Örn: Makine 1'de 1. işten sonra 2. iş gelirse hazırlık süresi 5 saattir.)*

| i \ j (M1) | 1 | 2 | 3 | 4 | 5 |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **0** | 0 | 0 | 0 | 0 | 0 |
| **1** | - | 5 | 8 | 4 | 6 |
| **2** | 3 | - | 7 | 5 | 4 |
| ... | ... | ... | ... | ... | ... |

### Tablo 5: Sonuçların Karşılaştırılması
| Kural | Makespan ($C_{max}$) | Toplam Gecikme ($T$) | Geciken İş Sayısı ($L$) |
| :--- | :--- | :--- | :--- |
| SCT | 32 | 2 | 1 |
| SC-EDD | 35 | 0 | 0 |
| SC-LPT | 47 | 12 | 1 |
| **DDR (SCT + SC-LPT)** | **28** | **2.5** | **1** |

> **Ajan Notu (Yöneylemci):** DDR (kural değiştirme) yaklaşımı, Makespan değerini 32'den 28'e düşürerek tekli kurallara göre daha iyi bir performans sergilemiştir. Bu durum, farklı zaman dilimlerinde farklı önceliklerin (önce verimlilik, sonra iş yükü dengeleme gibi) kullanılmasının avantajını kanıtlamaktadır.
