# Proje Raporu: Sıra-Bağımlı Hazırlık Süreli İlişkisiz Paralel Makine Çizelgeleme Problemi İçin AUGMECON Modeli ve Dinamik Dağıtım Kuralları

*(Orijinal Makale: "An augmented ε-constraint model and dynamic dispatching rules for unrelated parallel machine scheduling with sequence-dependent setup times" - Decision Analytics Journal 13 (2024) 100525)*

---

## 1. Giriş (Introduction)

Pek çok üretim sisteminde müşteriler, rekabetçi bir ortamda tedarikçilerin performansını değerlendirirken fiyat, kalite ve teslimat gibi farklı unsurları göz önünde bulundururlar. Zamanında teslimat, iyi bir itibar kazanmak ve daha fazla kâr elde etmek için hayati bir faktördür. Müşteri memnuniyetini maksimize etmek isteyen üreticiler, iyi çizelgeleme planları ile siparişleri zamanında tamamlamaya odaklanırlar. Aksi takdirde geciken teslimatlar; müşteri şikayetleri, gelir kaybı ve sipariş iptalleri ile sonuçlanır. Bu nedenle üretim ve sipariş işlem operasyonlarında etkinlik büyük bir önem taşır. Üretim çizelgeleme (production scheduling), işletmelerin stratejik amaçları doğrultusunda karar verme yeteneklerini yönlendiren kritik bir işlevdir. Bu bağlamda, makine çizelgeleme problemleri akademisyenlerin dikkatini çeken en zorlayıcı araştırma alanlarından biridir.

Tek makine (single machine), paralel makine (parallel machine), akış tipi atölye (flow shop) ve atölye tipi (job shop) gibi çeşitli üretim konfigürasyonları bulunmaktadır. Bunlar arasında paralel makine konfigürasyonları endüstriyel ortamlarda oldukça yaygındır ve ilişkisiz paralel makine (unrelated parallel machine) konfigürasyonu ise en karmaşık durumlardan birini temsil eder. İlişkisiz paralel makine çizelgeleme probleminde (UPMSP), işlerin işlem süreleri (processing times) atandıkları makinelere göre farklılık gösterir. Ayrıca, UPMSP dahilinde makine hazırlık süreleri (setup times) bağımsız (sequence-independent) veya sıra-bağımlı (sequence-dependent) olarak ikiye ayrılır. Üretim süreçlerinde makine üzerindeki bir önceki işten bir sonraki işe geçiş için gereken işlem, alet veya araç değişiklikleri sıra-bağımlı hazırlık süresi olarak adlandırılır. UPMSP, sıra-bağımlı hazırlık süreleriyle birlikte hesaplamalı olarak NP-Zor (NP-Hard) problem sınıfına girer.

Araştırmacılar, gerçek üretim sistemlerinin çoklu performans ölçütlerini optimize etme gerekliliğinden yola çıkarak, çizelgeleme problemlerinde çok amaçlı optimizasyonu (multi-objective optimization) ele almaktadır. Bu çalışmada UPMSP, gerçek bir sanayi uygulamasından—Tayland'daki bir çelik boru üreticisinden—esinlenerek ele alınmıştır. Bu gerçek vakada, makine hızları ve özellikleri farklılık göstermektedir. Ayrıca, çelik boru ürünleri farklı boyut, malzeme ve et kalınlığına sahip ürün aileleri altında sınıflandırılmaktadır. Ürün değişimi olduğunda, hazırlık süresi hem önceki ürüne hem de atanan makineye bağlı olarak önemli ölçüde değişmektedir. Çelik boru üretiminde yöneticiler, makine kullanım oranını maksimize etmek için üretim tamamlanma zamanını (makespan) en aza indirmeyi hedeflerken, teslimat performansını artırmak için ise toplam teslim gecikmesi süresini (total tardiness) ve geciken iş sayısını (number of tardy jobs) aynı anda minimize etmeye çalışmaktadır. 

Makale kapsamında önerilen çözümler şunlardır:
1. UPMSP için üç farklı amacı (tamamlanma zamanı, toplam teslim gecikmesi süresi ve geciken iş sayısı) optimize eden bir Karışık Tam Sayılı Doğrusal Programlama (MILP) modeli.
2. Bu üç amaca yönelik Pareto-optimal (ödünleşimli) çözümleri elde edebilmek için Geliştirilmiş ε-Kısıt (AUGMECON) metodolojisi.
3. Büyük ölçekli ve endüstriyel veriler içeren senaryolarda hızlı ve etkili sonuçlar üretebilmek için üç ana öncelik kuralının kombinasyonuyla elde edilen Zaman-Tetiklemeli Dinamik Dağıtım (DDR) sezgisel kuralları ve bu kuralların TOPSIS yöntemiyle analizi.

*(Uygulama Notu: Yukarıda bahsedilen MILP modelleri ve 39 farklı DDR sezgisel algoritması tarafımızca Python programlama dili (OR-Tools CP-SAT) kullanılarak eksiksiz biçimde kodlanmış, makaledeki sayısal örneklerin tamamen doğrulanabildiği gözlemlenmiştir.)*

---

## 2. İlgili Literatür (Literature Review)

İlişkisiz paralel makine çizelgeleme (UPMSP) problemleri literatürde geniş çapta ele alınmıştır. Fanjul-Peyro vd. (2017) ve Fanjul-Peyro (2020), tamamlanma zamanı minimizasyonu için matematiksel modeller (MILP) önermişlerdir. Benzer şekilde, Vallada ve Ruiz (2011) ile Gedik vd. (2018) sıra-bağımlı hazırlık süreli UPMSP durumlarını incelemiştir. Teslimat performansı odaklı çalışmalarda ise, Lin vd. (2011) ve Wang vd. (2020) teslim gecikmesi sürelerini en aza indirmeye çalışmışlardır. 

Yazarlar literatürdeki çoğu çalışmanın ya yalnızca tamamlanma zamanı (makespan) ya da tekil teslimat hedeflerine odaklandığını belirtmektedir. Gerçekte ise yöneticiler kaynak verimliliği (makespan) ve müşteri memnuniyetini (teslimat hedefleri) eşzamanlı olarak değerlendirmek zorundadır. Çok amaçlı UPMSP üzerine bazı araştırmalar mevcut olsa da (örneğin Afzalirad ve Rezaeian, 2016; Zheng vd., 2020), üç amacı (tamamlanma zamanı, toplam gecikme süresi, geciken iş sayısı) aynı anda ele alan, ürün ailesi bağımlı ve makine kısıtlı (machine eligibility restrictions) kapsamlı bir yapı literatürde bulunmamaktadır.

*(Word dosyanızda bu bölümün sonuna orijinal makaledeki Tablo 1'i (Literature review summary) eklemeniz tavsiye edilir.)*

---

## 3. Problem Tanımı ve Formülasyon (Problem Description and Formulation)

Bu çalışmada incelenen Sıra-Bağımlı Hazırlık Süreli UPMSP problemi, $n$ adet bağımsız işin ( $j = 1, 2, ..., n$ ) $m$ adet paralel makinede ( $k = 1, 2, ..., m$ ) işlenmesini kapsar. Tüm işler sıfır anında üretime hazırdır. 

**Varsayımlar:**
1. Her iş aynı anda yalnızca bir makinede işlenebilir.
2. Her makine aynı anda en fazla bir işi işleyebilir.
3. Makineler farklı teknolojik özelliklere sahip olduğu için her makine her işi yapamayabilir (makine uygunluk / kısıt matrisi $NP_{j,k}$).
4. İşlem süreleri $P_{j,k}$ makineye göre farklılık gösterir.
5. İşlerin önceliği yoktur (preemption yasaktır), başlayan bir iş kesintiye uğratılamaz.
6. Hazırlık süreleri $S_{i,j,k}$ makineye ve bir önceki işin hangi ürün ailesinden geldiğine göre değişir.

### Matematiksel Modeller (MILP)

**Notasyonlar (Parametreler):**
*   $n$: İş sayısı
*   $m$: Makine sayısı
*   $P_{j,k}$: $j$ işinin $k$ makinesindeki işlem süresi
*   $S_{i,j,k}$: $k$ makinesinde $i$ işinden sonra $j$ işi yapıldığında gereken sıra-bağımlı hazırlık süresi
*   $D_j$: $j$ işinin teslim tarihi (Due date)
*   $NP_{j,k}$: $j$ işinin $k$ makinesinde yapılabilirliği (1 ise yapılabilir, 0 ise yapılamaz)
*   $M$: Çok büyük pozitif bir sayı (Big-M)

**Karar Değişkenleri:**
*   $X_{i,j,k}$: $k$ makinesinde $j$ işi, $i$ işinden hemen sonra işleniyorsa 1, aksi halde 0.
*   $C_j$: $j$ işinin tamamlanma zamanı (Completion time)
*   $C_{max}$: Maksimum tamamlanma zamanı (Makespan)
*   $E_j, T_j$: Sırasıyla $j$ işinin erken bitme (Earliness) ve gecikme (Tardiness) süreleri
*   $U_j$: $j$ işi gecikmişse 1, aksi halde 0.

*(Word raporunda bu bölüme orijinal makaledeki Denklem 1 ile Denklem 11 arasındaki M1 Modelinin formüllerini ekran görüntüsü/resim olarak ekleyiniz. Formül açıklamaları aşağıdadır:)*

*   **Denklem 1:** Tamamlanma zamanını (Makespan) en küçüklemeyi hedefler.
*   **Denklem 2 & 3:** Her işin tam olarak bir makineye atanmasını ve eğer makinede kısıtlıysa (NP=0) o makineye atanamamasını sağlar.
*   **Denklem 4 & 5:** Makinelerdeki akış dengesini kurar (bir iş makineye giriyorsa çıkmak zorundadır). İşlem sırasını başlatmak için $0$ numaralı kukla iş (Dummy Job) kullanılır.
*   **Denklem 6:** Big-M kısıtı. Bir işin tamamlanma zamanını kendisinden önceki işin tamamlanma zamanı, hazırlık süresi ve kendi işlem süresi cinsinden hesaplar. Alt-döngü (subtour) oluşmasını engeller.
*   **Denklem 12:** İkinci Model (M2). Toplam gecikme süresini (Total Tardiness) minimize eder.
*   **Denklem 13:** Teslim tarihi kısıtı ($C_j + E_j - T_j = D_j$).
*   **Denklem 15:** Üçüncü Model (M3). Geciken iş sayısını (Number of Tardy Jobs) minimize eder.

### Geliştirilmiş ε-Kısıt Yöntemi (AUGMECON - Model M4)
Gerçek dünya problemlerinde birden fazla amaç fonksiyonu genelde birbiriyle çatışır. AUGMECON, amaç fonksiyonlarından birini (örneğin M1 - Cmax) birincil amaç olarak bırakırken, diğerlerini (Toplam Gecikme ve Geciken İş Sayısı) eşitsizlik kısıtı olarak modele ekler. Algoritma adım adım bu kısıtların sınırlarını ($T_{bar}$ ve $L_{bar}$) daraltarak tam bir **Pareto Kümesi (Pareto Front)** elde edilmesini sağlar. Elde edilen tüm optimal ve ödünleşimli çözümler içerisinden karar vericinin tercihine göre (Min-Max Normalizasyon Formül 20 kullanılarak) nihai bir çözüm seçilir.
