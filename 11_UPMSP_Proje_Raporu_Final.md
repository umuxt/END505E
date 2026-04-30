# Proje Raporu: Sıra-Bağımlı Hazırlık Süreli İlişkisiz Paralel Makine Çizelgeleme Problemi İçin AUGMECON Modeli ve Dinamik Dağıtım Kuralları

*(Orijinal Makale: "An augmented ε-constraint model and dynamic dispatching rules for unrelated parallel machine scheduling with sequence-dependent setup times" - Decision Analytics Journal 13 (2024) 100525)*

---

## 1. Giriş (Introduction)

Modern üretim sistemlerinde rekabetçilik, sadece maliyet ve kalite ile değil, aynı zamanda müşteriye verilen "teslimat sözlerinin" ne kadar tutarlı yerine getirildiği ile ölçülmektedir. Zamanında teslimat (On-time delivery), bir işletmenin pazar itibarını koruması, müşteri sadakatini artırması ve gecikme cezalarından kaçınması için hayati bir unsurdur. Üretim süreçlerinin verimli bir şekilde yönetilmesi, özellikle karmaşık makine konfigürasyonlarında, stratejik bir karar destek mekanizması olan "üretim çizelgeleme" (production scheduling) ile mümkündür.

Bu çalışma, Tayland'daki bir çelik boru üreticisinin operasyonel verilerinden ve karşılaştığı zorluklardan esinlenmiştir. Söz konusu fabrikada, teknolojik özellikleri ve üretim hızları birbirinden farklı olan "ilişkisiz paralel makineler" (Unrelated Parallel Machines - UPM) bulunmaktadır. Bu makinelerde işlenen ürünler; boyut, et kalınlığı ve malzeme özelliklerine göre farklı "ürün ailelerine" ayrılmaktadır. Makineler bir üründen diğerine geçerken, eğer ürün ailesi değişiyorsa çok uzun süren; aynı aile içinde kalınıyorsa daha kısa süren "sıra-bağımlı hazırlık süreleri" (Sequence-Dependent Setup Times - SDST) ile karşılaşılmaktadır.

UPMSP (Unrelated Parallel Machine Scheduling Problem), SDST kısıtı ile birleştiğinde, tüm kombinasyonların hesaplanması imkansız hale gelen "NP-Zor" (NP-Hard) bir problem sınıfına girmektedir. Fabrika yönetimi, kaynak verimliliğini (makespan - Cₘₐₓ) optimize ederken, aynı zamanda müşteri memnuniyetini yansıtan toplam teslim gecikmesi süresini (T) ve geciken iş sayısını (L) da minimize etmek zorundadır. Bu rapor, bu karmaşık problemin çözümü için makalede önerilen matematiksel modelleri (MILP), AUGMECON metodolojisini ve Dinamik Dağıtım Kurallarını (DDR) en ince detayına kadar incelemektedir.

---

## 2. Literatür Analizi

Literatürde UPMSP problemi uzun süredir incelenmektedir, ancak sıra-bağımlı hazırlık süreleri ve çok amaçlı optimizasyonun bir arada ele alınması nispeten yenidir.

**Fanjul-Peyro (2020)**, sadece işlem sürelerine odaklanarak Cₘₐₓ minimizasyonu için güçlü matematiksel modeller geliştirmiştir. Ancak çelik boru üretimi gibi hazırlık sürelerinin (setup) toplam sürenin önemli bir kısmını oluşturduğu sektörlerde bu modeller eksik kalmaktadır. **Vallada ve Ruiz (2011)** ile **Gedik vd. (2018)**, SDST kısıtlarını modele dahil ederek literatürü bir adım ileri taşımışlardır. 

Teslimat tarihlerini odağa alan **Lin vd. (2011)** ve **Wang vd. (2020)** ise gecikme süreleri (T) üzerine yoğunlaşmışlardır. Bu makalenin temel farkı, literatürde genellikle ayrı ayrı ele alınan üç farklı hedefi (Cₘₐₓ, T, L) aynı anda optimize eden ve AUGMECON gibi ileri bir teknikle Pareto kümesi üreten bütünleşik bir yaklaşım sunmasıdır.

---

## 3. Problem Tanımı ve Notasyon

Problem, n adet işin m adet teknolojik olarak birbirinden farklı paralel makinede çizelgelenmesini kapsar. Tüm işler sıfır anında hazırdır ve her iş tam olarak bir makineye atanmalıdır.

### 3.1. Kümeler
- N: İş kümesi {1, 2, ..., n}
- N₀: Kukla iş "0"ı içeren genişletilmiş iş kümesi {0, 1, 2, ..., n}
- M: Makineler kümesi {1, 2, ..., m}
- K: Ürün aileleri kümesi

### 3.2. Parametreler
- Pⱼₖ: j işinin k makinesindeki işlem süresi.
- Sᵢⱼₖ: k makinesinde, i işinden hemen sonra j işi yapılacaksa gereken sıra-bağımlı hazırlık süresi.
- Dⱼ: j işinin teslim tarihi (due date).
- NPⱼₖ: Makine kısıtı göstergesi. Eğer j işi k makinesinde işlenemezse NPⱼₖ=0, aksi halde 1.
- V: Çok büyük pozitif bir sayı (Big-M).

### 3.3. Karar Değişkenleri
- Xᵢⱼₖ: Eğer k makinesinde j işi, i işinden hemen sonra yapılıyorsa 1, aksi halde 0 olan ikili değişken.
- Cⱼ: j işinin tamamlanma zamanı.
- Cₘₐₓ: Maksimum tamamlanma zamanı (Makespan).
- eⱼ⁺: j işinin teslim gecikmesi (tardiness) miktarı.
- eⱼ⁻: j işinin teslim tarihinden erken bitme (earliness) miktarı.
- Uⱼ: Eğer j işi gecikmişse (Cⱼ > Dⱼ) 1, aksi halde 0 olan ikili değişken.

---

## 4. Matematiksel Modeller (MILP)

### 4.1. M1 Modeli: Maksimum Tamamlanma Zamanı (Cₘₐₓ) Minimizasyonu

**Amaç Fonksiyonu:**
Minimize Cₘₐₓ

**Kısıtlar:**
(2)  Σₖ Σᵢ Xᵢⱼₖ = 1      ∀j ∈ N
(3)  Σₖ Σⱼ Xᵢⱼₖ = 1      ∀i ∈ N
(4)  Σⱼ Xᵢⱼₖ - Σₕ Xₕᵢₖ = 0      ∀k ∈ M, ∀i ∈ N
(5)  Σⱼ X₀ⱼₖ ≤ 1      ∀k ∈ M
(6)  Cⱼ - Cᵢ + V · (1 - Xᵢⱼₖ) ≥ Sᵢⱼₖ + Pⱼₖ      ∀i, j, k
(7)  C₀ = 0
(8)  Cⱼ ≤ Cₘₐₓ      ∀j ∈ N
(9)  Σₖ Σᵢ Xᵢⱼₖ ≤ NPⱼₖ      ∀j ∈ N
(10) Cⱼ ≥ 0,  Xᵢⱼₖ ∈ {0, 1}

### 4.2. Çok Amaçlı Yapı ve AUGMECON — Mavrotas (2009)
Müşteri memnuniyetini (T = Σ eⱼ⁺) ve geciken iş sayısını (L = Σ Uⱼ) aynı anda yönetmek için AUGMECON kullanılır. Mavrotas'ın 2009 yılında önerdiği bu yöntem, klasik ε-kısıt yöntemindeki "zayıf Pareto" sorunlarını, amaç fonksiyonuna çok küçük bir ε terimi ekleyerek ve lexicographic optimizasyon ile ödeme tablosu oluşturarak çözer.

---

## 5. Sezgisel Yöntem: Dinamik Dağıtım Kuralları (DDR)

### 5.1. SCT (Shortest Completion Time)
İşlem süresi ile birlikte hazırlık süresini de minimize eder:
min (Sᵢⱼₖ + Pⱼₖ)

### 5.2. SC-LPT ve SC-EDD
Bu kurallar, en uzun işlem süreli (LPT) veya en erken teslim tarihli (EDD) işi seçip, onu en iyi tamamlanma zamanı sağlayan makineye atarlar:
SC-LPT: min (Sᵢⱼ*ₖ + Pⱼ*ₖ)   şartıyla: Pⱼ* = max Pⱼ
SC-EDD: min (Sᵢⱼ*ₖ + Pⱼ*ₖ)   şartıyla: Dⱼ* = min Dⱼ

---

## 6. Karar Analizi: TOPSIS — Hwang ve Yoon (1981)

**TOPSIS Adımları:**
1. **Normalizasyon:** Performans değerleri hayali bir "en iyi" değere bölünerek normalize edilir (rₐ,₆).
2. **Ağırlıklandırma:** Yöneticinin stratejik ağırlıkları (w_C, w_T, w_L) ile çarpılır.
3. **İdeal Uzaklıklar:** Pozitif ideal (S⁺) ve Negatif ideal (S⁻) hayali çözümlere olan uzaklıklar hesaplanır.
4. **Göreli Yakınlık (C*):** C* = S⁻ / (S⁺ + S⁻) skoru en yüksek olan kural seçilir.

---

## 7. Hesaplamalı Çalışma ve Uygulama Kanıtı

Rapor kapsamında geliştirdiğimiz Python (Google OR-Tools CP-SAT) uygulaması, makaledeki MTZ kısıtlarını (Denklem 6) ve AUGMECON iterasyonlarını tam sadakatle koşturmuştur. Gantt şemasında gözlemlenen pembe bloklar (SDST), işlerin önüne tam olarak makaledeki mantıkla yerleşmiştir.

---

## 8. Sonuç

Bu çalışma, sıra-bağımlı hazırlık sürelerinin (SDST) ve çoklu hedeflerin (Cₘₐₓ, T, L) yönetildiği UPMSP problemi için uçtan uca bir çözüm sunmaktadır. AUGMECON ile kesin çözümler, DDR ve TOPSIS ile ise endüstriyel hızda pratik kararlar üretilmektedir.
