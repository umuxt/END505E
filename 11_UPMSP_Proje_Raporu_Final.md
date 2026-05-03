# Proje Raporu: Sıra-Bağımlı Hazırlık Süreli İlişkisiz Paralel Makine Çizelgeleme Problemi İçin AUGMECON Modeli ve Dinamik Dağıtım Kuralları

**Makale:** A multi-objective production scheduling model and dynamic dispatching rules for unrelated parallel machines with sequence-dependent set-up times
**Yazarlar:** Pham Duc Tai, Papimol Kongsri, Prasal Soeurn, Jirachai Buddhakulsomsiri
**Dergi:** Decision Analytics Journal 13 (2024) 100525

---

## 1. Giriş (Introduction)

Etkin bir üretim planlaması, özellikle karmaşık iş sıralama (job sequencing) ve çizelgeleme görevleriyle uğraşırken üretim sistemleri için kritik bir öneme sahiptir. Bu makale, söz konusu zorlukları özdeş olmayan makineleri barındıran ve literatürde **"İlişkisiz Paralel Makineler (Unrelated Parallel Machines)"** olarak bilinen üretim sistemleri kapsamında ele almaktadır.

Problem, Tayland'daki en büyük çelik boru üreticisinin karşılaştığı gerçek bir problemden motive edilmiştir. Bu üretim sistemi, kapasiteleri ve üretim hızları bakımından birbirinden farklılık gösteren çok sayıda makineden oluşmakta olup; makinelerin paralel çalışması çizelgeleme sürecine ekstra bir karmaşıklık katmaktadır. Her periyotta (örneğin her ay), işlenecek üretim siparişlerini temsil eden işler (jobs) mevcuttur ve bu işlerin kendilerine has üretim miktarları ve teslim tarihleri (due dates) vardır. Tüm işler, periyodun başında hiçbir iş önceliği olmaksızın işlenmeye başlanabilir. Bu durum, bir işin farklı makinelerde farklı işlem sürelerine (processing times) sahip olabileceği anlamına gelmektedir.

Makinelerin hazırlık süreleri (setup times) problemi daha da karmaşıklaştırmaktadır. Spesifik olarak, bir işin hazırlık süresi, atandığı makineye ve kendinden önceki işin sırasına bağlıdır. Örneğin, birbirini takip eden iki iş farklı ürün ailelerine aitse, makinenin hazırlık süresi; aynı ürün ailesinden fakat farklı boyutlardaki iki işin birbirini takip etmesi durumuna göre çok daha uzun sürmektedir. Başka bir deyişle, bir işin hazırlık süresi sadece makineye değil, aynı zamanda o makinede kendisinden hemen önce işlenen işe de bağlıdır. Bu durum literatürde **"Makine ve Sıra-Bağımlı Hazırlık Süresi (Machine- and Sequence-Dependent Setup Time)"** olarak adlandırılmaktadır.

Her bir periyotta (örneğin üretim ayında), müşterilerden gelen siparişleri temsil eden işler, üretim ayının başından önce sisteme girilir; böylece bir sonraki ayın üretim çizelgesi henüz mevcut ay bitmeden planlanmış olur. Bunun bir sonucu olarak, her makinede planlanan ilk işin hazırlık (setup) işlemi üretim periyodu başlamadan önce tamamlanmış sayılır. Diğer bir ifadeyle, her bir üretim ayı için her makinedeki ilk işin hazırlık süresi sıfır olarak kabul edilmektedir.

Bu problem tipi, birden fazla ürün ailesinin aynı ilişkisiz makine seti üzerinde üretildiği birçok imalat endüstrisinde yaygın olarak görülmektedir. Çoğu durumda temel amaç, işlerin mümkün olan en erken sürede tamamlanmasını sağlayacak bir makine iş çizelgesi belirlemektir. Bu genellikle en son planlanan işin tamamlanma zamanı olan **Tamamlanma Zamanı (Makespan - $C_{max}$)** ile ölçülür.

Ancak işlerin genellikle birbirinden farklı, müşteriye söz verilmiş teslim tarihleri vardır. Teslim tarihlerine ne ölçüde uyulduğunu ölçmek için, her bir işin **Teslim Gecikmesi Süresi (Tardiness - $T$)** ve **Geciken İş Sayısı (Number of Tardy Jobs - $L$)** hesaplanır. Uygulamada; tamamlanma zamanını, toplam teslim gecikmesini ve geciken iş sayısını minimize etmek birbirleriyle çatışan (conflicting) hedeflerdir. Bu nedenle, üretim verimliliğini korurken müşteri memnuniyetinden de ödün vermemek adına bu performans ölçütleri arasında bir denge kurmak planlamacının en büyük faydasıdır. Zaman çizelgeleme literatüründe bu üç performans ölçütü arasındaki ödünleşimler (trade-offs) iyi bilinmesine rağmen, bugüne kadar incelenen bu problem türünde söz konusu üç ölçüt arasında denge kuran bir çözüm sunmaya çalışan hiçbir çalışma olmamıştır.

Bu çalışma literatüre **üç temel katkı** sağlamaktadır:

1.  **Karmaşık Tamsayılı Doğrusal Programlama (MILP) Modelinin Geliştirilmesi:** Makine ve sıra-bağımlı hazırlık sürelerine sahip ilişkisiz paralel makine çizelgeleme problemi için bir MILP modeli geliştirilmiştir. Model, *Avalos-Rosales ve diğerleri (2015)* tarafından yapılan çalışmadan uyarlanarak, sadece tamamlanma zamanını (makespan) minimize eden orijinal amaç fonksiyonuna; toplam teslim gecikmesini (total tardiness) ve toplam geciken iş sayısını (total number of tardy jobs) dâhil edecek şekilde genişletilmiştir. Ayrıca, bu üç ölçüt arasında uzlaşmacı çözümler bulmak amacıyla **Artırılmış $\epsilon$-kısıt (AUGMECON)** yöntemi uygulanmıştır. Önerilen modelin uygulanabilirliği küçük problem örnekleri kullanılarak gösterilmiştir. Bu katkı, literatürdeki mevcut modellerin ya hazırlık sürelerini basitleştirdiği ya da ilişkisiz paralel makineler için tek amaçlı optimizasyona odaklandığı boşluğu doldurmaktadır.
2.  **Dinamik Dağıtım Kuralı Tabanlı Sezgisel Yöntemlerin (DDR) Tasarımı:** Büyük problem örnekleri için dinamik dağıtım kurallarına dayalı sezgisel yöntemler tasarlanmıştır. Özellikle; literatürde yaygın olarak kullanılan En Kısa İşlem Süresi (SPT), En Erken Teslim Tarihi (EDD) ve En Uzun İşlem Süresi (LPT) gibi tekli dağıtım kuralları, makine ve sıra-bağımlı hazırlık sürelerini dikkate alacak şekilde modifiye edilmiştir. Bu modifikasyon, sıra-bağımlı hazırlık süreli çizelgeleme problemleri için özel olarak tasarlanmış üç yeni dağıtım kuralı ortaya çıkarmıştır. Buna ek olarak, bu üç kural, kural değiştirme zamanlarını (rule switching times) barındıran altı farklı dağıtım kuralı kombinasyonuna dönüştürülmüştür. Çizelgeleme süreci sırasında kuralların değiştirilmesine olanak tanıyan bu mekanizma, özellikle uygulama kolaylığı sayesinde sadece bu çalışmada değil, genel çizelgeleme problemlerinde de son derece etkilidir.
3.  **Çok Kriterli Karar Verme Analizi (MCDM):** Etkili kurallar setine dayanarak, her bir kuralın hangi koşullarda en etkili olduğunu belirlemek amacıyla kapsamlı bir çok kriterli karar verme analizi (TOPSIS vb.) gerçekleştirilmiştir. Bu koşullar, bir karar vericinin (yöneticinin) üç performans ölçütüne atadığı göreceli önem ağırlıkları ile belirlenir. Bu yaklaşımın, çok amaçlı bir çizelgeleme problemi için gerçekleştirilen kendi türünün ilk örneği olduğuna inanılmaktadır. Bu yöntemin faydası, birden fazla amacı olan diğer çizelgeleme problemi ortamlarında da araştırılabilir.

---

## 2. Literatür Taraması (Literature Review)

Paralel makinelerdeki üretim çizelgeleme problemleri çok sayıda çalışmada araştırılmıştır. Bu problemler; paralel makine sınıflandırması, hazırlık süresi, sistem performans ölçütleri ve çözüm yöntemleri gibi çeşitli kriterler kullanılarak kategorize edilebilir. Paralel makineler özdeş (identical), tekdüze (uniform) ve ilişkisiz (unrelated) olarak sınıflandırılabilir. Özdeş paralel makineler, bir işin işlem süresinin aynı üretim hızına sahip her makine için aynı olduğu anlamına gelir [2–9]. Farklı işlem süreleri ve üretim hızlarına sahip tekdüze makinelere ilişkin çalışmalar Li vd. [10] ve Zandi vd. [11] çalışmalarında bulunabilir. İlişkisiz paralel makineler ise farklı üretim hızlarına ve makinelere özgü kısıtlamalara sahiptir; bu da her işin sadece bazı belirli makineler tarafından işlenebileceği anlamına gelir [1,12–21].

Hazırlık süresi (setup time), bir sonraki görevi işlemek üzere kaynakları hazırlamak için gereken süredir [22]. Sıra-bağımsız (sequence-independent), sıra-bağımlı (sequence-dependent) ve makine-bağımlı (machine-dependent) olarak sınıflandırılır. Sıra-bağımsız hazırlık süresi, hazırlık süresinin işe veya makineye bakılmaksızın sabit olduğu anlamına gelir [18,23,24]. Sıra-bağımlı hazırlık süresi, makinedeki bir önceki işe bağlıdır [12,19,25–30]. Başka bir deyişle, sıra-bağımlı hazırlık süreleri, bir makine üzerinde birbirine bitişik (adjacent) iki işten oluşan bir çift tarafından belirlenir. Makine-bağımlı hazırlık süresi ise, bir işi işlemek üzere atanan makineye bağlıdır [1,26,28,30,31].

Çizelgeleme çözümlerinin performansını ölçmek için tamamlanma zamanı (makespan), toplam teslim gecikmesi (total tardiness) ve geciken iş sayısı (number of tardy jobs) dahil olmak üzere çeşitli kriterler kullanılır [32,33]. Tamamlanma zamanını en aza indirmeye odaklanan çalışmalar Avalos-Rosales vd. [1], Arroyo vd. [20], Soper [21], Ezugwu [31], Shchepin ve Vakhania [34] ve Lee vd. [35] tarafından yürütülmüştür. Toplam gecikmeyi en aza indirmeye yönelik araştırmalar Logendran vd. [12] ve Yin vd. [36] çalışmalarını içerir. Son olarak, Su vd. [18] geciken iş sayısını en aza indirmektedir.

Tek amaçlı optimizasyonun yanı sıra, ilişkisiz paralel makine çizelgeleme alanında yıllar içinde farklı hedefleri de dikkate alan ufuk açıcı katkılar ortaya çıkmıştır. Chyu ve Chang [25], iş sırasına ve makineye bağlı hazırlık sürelerini ele alarak toplam ağırlıklı akış süresi ve toplam ağırlıklı gecikmenin en aza indirilmesini araştırmaktadır. Lin vd. [13], tamamlanma zamanı, toplam ağırlıklı tamamlanma zamanı ve toplam ağırlıklı gecikme dâhil olmak üzere kritik çizelgeleme hedeflerini hedefleyerek bu araştırmayı genişletmektedir. Torabi vd. [26], toplam ağırlıklı akış süresi, toplam ağırlıklı gecikme ve makine yük değişiminin minimizasyonunu araştırmaktadır. Nikabadi ve Naderi [27], tamamlanma zamanı, geciken iş sayısı, erken bitme ve gecikmeyi eşzamanlı olarak en aza indirmektedir. Daha sonraki bir çalışmada, Wang ve Alidaee [28], ilişkisiz paralel makinelerde sipariş kabulü ve çizelgeleme konusunu ele alarak, toplam iş yükünü ve makine sabit maliyetlerini en aza indiren çok amaçlı bir karışık tamsayılı doğrusal programlama modeli sunmaktadır. Farmand vd. [37], özdeş paralel makine çizelgelemesi ile tedarik zinciri yönetimini bütünleştiren iki amaçlı bir model geliştirmektedir. Model, hem zaman tabanlı hem de maliyet tabanlı performans ölçütlerini minimize etmeyi amaçlamaktadır. Zaman tabanlı ölçüt, toplam ağırlıklı gecikme ve operasyon süresinden oluşurken; maliyet tabanlı ölçüt, geciken siparişler için ceza, erken bitirme ve parti teslimat maliyetini içerir. Son olarak, Yepes-Borrero vd. [30] tamamlanma zamanını ve ihtiyaç duyulan maksimum kaynak sayısını minimize eden iki amaçlı bir model formüle etmektedir.

Yöntembilim (methodology) açısından, karmaşık tamsayılı doğrusal programlama (MILP) modelleri sadece küçük problem örneklerini çözebilmektedir. Bu nedenle, birçok araştırmacı büyük ölçekli problemleri çözmek için sezgisel yöntemler (heuristics) geliştirmiştir. İlişkisiz paralel makineler için popüler sezgiseller arasında genetik algoritma [1,13,14,18] ve benzetimli tavlama algoritması (simulated algorithm) [17,18] bulunmaktadır. Literatür taramalarında bulunan diğer sezgisel yöntemler arasında dal ve sınır (branch and bound) [19], iterated greedy [20,30,38], polinomsal zamanlı yaklaşım şeması (PTAS) [15], üç fazlı yöntem [29] ve bileşik dağıtım kuralı [19] yer alır. Yin vd. [36], iterated greedy algoritmasını kendi çizelgeleme problemlerine uyarlamıştır. Ek olarak, Chyu ve Chang [25], iş sırasına ve makineye bağlı hazırlık sürelerini içeren iki amaçlı (toplam ağırlıklı akış süresi ve ağırlıklı gecikme) çizelgeleme problemi için bir Pareto evrimsel yaklaşımı sunmaktadır. Lin vd. [13], Chyu ve Chang'ın çalışmasını [25] genişleterek çizelgeleme problemlerinde çok amaçlı (tamamlanma zamanı, ağırlıklı tamamlanma zamanı ve ağırlıklı gecikme dâhil) çözümler bulmak üzere genetik algoritmayı modifiye etmiştir. Torabi vd. [26] çok amaçlı parçacık sürüsü optimizasyonu (MOPSO) önermiş, Nikabadi ve Naderi [27] ise çok amaçlı genetik algoritma (MOGA) ve benzetimli tavlama (SA) kullanmıştır. Benzer şekilde Bektur ve Sarac [29], hazırlık süreli değiştirilmiş görünür gecikme maliyeti (ATCS) dağıtım kurallarından elde edilen başlangıç çözümünü kullanan benzetimli tavlama ve Tabu Arama olmak üzere iki sezgisel yöntem önermektedir. Krim vd. [39] ise farklı komşuluk yapıları ve çözüm uzaylarından yararlanan, tabu arama tabanlı iki yeni meta-sezgisel yöntem önermektedir.

Paralel makine çizelgeleme konusundaki ilgili literatüre genel bir bakış **Tablo 1**'de sunulmaktadır.

**[BURAYA TABLO 1 GÖRSELİ EKLENECEK - A summary of relevant research work]**
*(Not: Tabloda yazarlar, problem karakteristiği, performans ölçütleri ve çözüm yöntemleri özetlenmiştir. Çalışmamız matrisin en altında tüm bu özellikleri birleştiren tek çalışma olarak gösterilmektedir.)*

Tablo 1'e göre, hiçbir araştırma, makine ve sıra-bağımlı hazırlık sürelerine sahip ilişkisiz paralel makine üretim sistemlerinde tamamlanma zamanı, toplam gecikme ve geciken iş sayısı çoklu amaç fonksiyonlarına sahip bir çizelgeleme problemini incelememiştir. Bu araştırma boşluğundan motive olan bu çalışma, aşağıdaki hususları ele almayı amaçlamaktadır:
*   Tamamlanma zamanı, toplam gecikme ve geciken iş sayısı arasındaki en iyi ödünleşimleri (trade-offs) temsil eden Pareto çözümlerini sağlayabilen çok amaçlı bir MILP modelinin formülasyonu.
*   Pratik bir problemden uyarlanan sayısal bir deney vasıtasıyla MILP modelinin kapasitesinin ve sınırlarının incelenmesi.
*   Matematiksel modele ek olarak, farklı dinamik dağıtım kuralı tabanlı sezgisel yöntemlerin (DDR) önerilmesi, oluşturulması ve denenmesi. Buradaki amaç, makul bir süre içinde yüksek kaliteli çözümler bulabilen alternatif bir yaklaşım sunmaktır. Bu durum, özellikle ilişkisiz paralel makine sistemlerine sahip olan endüstrilerin, iyi üretim çizelgeleri oluşturmak için minimum zaman harcayan bir çizelgeleme yöntemine duyduğu ihtiyaçla örtüşmektedir.
*   Bildiğimiz kadarıyla, ATCS dağıtım kuralında sıra-bağımlı hazırlık süresini dâhil eden Bektur ve Sarac [29] tarafından yapılmış önceki tek bir çalışma bulunmaktadır. Sadece bir tek dağıtım kuralı oluşturmak yerine, bizim çalışmamız pratikte yaygın olarak uygulanan üç farklı kuralı modifiye etmektedir.

---

## 3. Model Geliştirme (Model Development)

### 3.1. Problem Tanımı (Problem Statement)
Bu çalışma, makine ve sıra-bağımlı hazırlık sürelerine sahip ilişkisiz paralel makine çizelgeleme problemini ele almaktadır. Problemin tanımları aşağıdaki gibidir:
- Her periyotta (örneğin bir ay) işlenecek $n$ adet iş bulunmaktadır. Her iş, gerekli üretim miktarı ve teslim tarihinden oluşur.
- Tüm işler her periyodun başında üretim için serbest bırakılır, yani tüm işlerin serbest bırakılma zamanı (release time) aynıdır. İşlerin önem derecelerine göre birbirlerine karşı herhangi bir önceliği yoktur.
- Üretim sistemi $m$ adet ilişkisiz paralel makineden oluşmaktadır.
- Bir işin bir makinedeki işlem süresi, iş-makine çiftine bağlıdır.
- Her makine, tüm işlerin sadece belirli bir alt kümesini işleyebilir. Bir makinenin işleyemediği işler için işlem süreleri çok büyük bir değere atanır.
- Hazırlık süresi makineye ve sıraya bağlıdır; yani bir işin hazırlık süresi, belirli bir makinede kendinden önceki iş ve kendisinden oluşan bir iş çifti tarafından belirlenir.

### 3.2. Matematiksel Modeller (Mathematical Models)
Problem, her biri tamamlanma zamanı (makespan), toplam teslim gecikmesi (total tardiness) ve geciken iş sayısı (number of tardy jobs) dâhil olmak üzere üç sistem performans ölçütünden birini minimize eden üç ayrı MILP (Karmaşık Tamsayılı Doğrusal Programlama) modeli olarak formüle edilmiştir. MILP modelleri, farklı sistem ölçütlerine göre problemlerin karakteristiklerini incelemek için kullanılır. Bu 3 model 4 küçük problem örneği kullanılarak çözülmüş ve sistem davranışı test edilmiştir. Buna ek olarak, üç ölçüt arasında uzlaşmacı (compromise) çözümler arayan dördüncü bir model (M4) formüle edilmiştir. Üç ölçüt arasındaki ödünleşim (trade-off) incelenerek Pareto çözümleri tanımlanmaktadır. Modelin indeksleri, parametreleri ve karar değişkenleri şunlardır:

**İndeksler:**
- $i, j$: İş indeksleri. $N$, işler kümesini ifade eder ($N = \{1, 2, ..., n\}$). $N_0$ ise 0 numaralı kukla (dummy) işi de içeren işler kümesidir ($N_0 = \{0\} \cup N$).
- $k$: Makine indeksi. $M$, makineler kümesidir ($M = \{1, 2, ..., m\}$). Ayrıca her makine farklı bir iş kümesini işleyebildiğinden, herhangi bir $j$ işi sadece $M$'nin bir alt kümesi olan $M_j$ makinelerinde işlenebilir. Yani $M = M_1 \cup M_2 ... \cup M_n$'dir.

**Parametreler:**
- $P_{j,k}$: $j$ işinin $k$ makinesindeki işlem süresi.
- $S_{i,j,k}$: $k$ makinesinde, $i$ işinden hemen sonra $j$ işi işleneceğinde makinenin ihtiyaç duyduğu hazırlık süresi.
- $D_j$: $j$ işinin teslim tarihi (due date).
- $V$: Çok büyük bir sayı (Big-M katsayısı).
- $NP_{j,k}$: $j$ işinin $k$ makinesinde işlenip işlenemeyeceğini gösteren kısıtlama durumu (Eğer işlenebilirse 1, aksi halde 0).

**Karar Değişkenleri:**
- $X_{i,j,k}$: Eğer $j$ işi $k$ makinesinde $i$ işinden hemen sonra planlanmışsa 1, aksi halde 0 değerini alan ikili (binary) değişken.
- $C_j$: $j$ işinin tamamlanma zamanı (saat).
- $C_{max}$: Tamamlanma zamanı (Tüm işler içindeki maksimum tamamlanma zamanı) (saat).
- $e^+_j$: $j$ işinin teslim gecikmesi (tardiness) (saat).
- $e^-_j$: $j$ işinin erken bitme (earliness) süresi (saat).
- $U_j$: $j$ işi gecikmişse 1, aksi halde 0 değerini alan ikili değişken.

#### 3.2.1. Tamamlanma Zamanını Minimize Et (M1 Modeli)
Bu MILP modeli Avalos-Rosales vd. [1] ile Kongsri ve Buddhakulsomsiri [40] çalışmalarından uyarlanmıştır. M1 olarak adlandırılmaktadır.

**[BURAYA DENKLEM 1 GÖRSELİ EKLENECEK - Amaç Fonksiyonu]**
Minimize $C_{max}$ (1)

**Kısıtlar:**
**[BURAYA DENKLEM 2 VE 3 GÖRSELLERİ EKLENECEK]**
Denklem (2) ve (3), her işin yalnızca tek bir önceki işi ve tam olarak tek bir sonraki işi olmasını sağlar.

**[BURAYA DENKLEM 4 GÖRSELİ EKLENECEK]**
Denklem (4), her makinedeki her iş için akış dengesini (flow balance) temsil eder.

**[BURAYA DENKLEM 5 GÖRSELİ EKLENECEK]**
Denklem (5), her makinenin bir kukla iş (dummy job) ile başlaması gerektiğini belirtir.

**[BURAYA DENKLEM 6 GÖRSELİ EKLENECEK]**
Denklem (6), her işin tamamlanma zamanını; önceki işin tamamlanma zamanı, hazırlık süresi ve işin işlem süresi üzerinden hesaplar.

**[BURAYA DENKLEM 7 VE 8 GÖRSELLERİ EKLENECEK]**
Denklem (7), kukla işin tamamlanma zamanının 0 olduğunu gösterir. Denklem (8), tüm işlerin tamamlanma zamanları üzerinden makinespan'ı ($C_{max}$) belirler.

**[BURAYA DENKLEM 9 GÖRSELİ EKLENECEK]**
Denklem (9), eğer bir kısıtlama varsa $j$ işinin makinede işlenemeyeceğini belirler. 
*(Ajan Notu: Orijinal makalede $k$ indisi sol tarafta toplam sembolündeyken sağ tarafta $NP_{j,k}$ içinde kalmıştır. Bu boyutsal bir tipografik hatadır. Doğrusu: $\sum_{i} X_{i,j,k} \leq NP_{j,k} \quad \forall j \in N, \forall k \in M$)*

**[BURAYA DENKLEM 10 VE 11 GÖRSELLERİ EKLENECEK]**
Son olarak, Denklem (10)-(11) karar değişkenlerinin türlerini belirler.

#### 3.2.2. Toplam Gecikmeyi Minimize Et (M2 Modeli)
Minimum toplam gecikmeye sahip bir iş çizelgesi oluşturmak için M1 modeli, ek karar değişkenleri ve kısıtlar getirilerek M2 olarak adlandırılan başka bir modele dönüştürülmüştür. Özellikle, $j$ işinin sırasıyla gecikmesini ve erken bitmesini temsil eden $e^+_j$ ve $e^-_j$ olmak üzere iki değişken M2'ye dâhil edilmiştir. Toplam gecikmeyi en aza indirmek için amaç fonksiyonu Denklem (12) ile ifade edilmiştir. Ayrıca, $e^+_j$ ve $e^-_j$'nin değerleri ve türleri sırasıyla (13) ve (14) kısıtlarıyla belirlenmiştir.

**[BURAYA DENKLEM 12 GÖRSELİ EKLENECEK]**
Minimize $T = \sum_{j \in N} e^+_j$ (12)

Bu modelde (2)-(10) kısıtlarına ek olarak aşağıdaki kısıtlar eklenir:
**[BURAYA DENKLEM 13 VE 14 GÖRSELLERİ EKLENECEK]**

#### 3.2.3. Geciken İş Sayısını Minimize Et (M3 Modeli)
M2'ye benzer şekilde, bu bölümdeki M3 olarak adlandırılan model, $j$ işinin gecikip gecikmediğini göstermek için $U_j$ ikili karar değişkeni eklenerek M1'den türetilmiştir. M3 aşağıdaki gibi formüle edilmiştir:

**[BURAYA DENKLEM 15 GÖRSELİ EKLENECEK]**
Minimize $L = \sum_{j \in N} U_j$ (15)

Bu modelde (2)-(10) kısıtlarına ek olarak aşağıdaki kısıtlar eklenir:
**[BURAYA DENKLEM 16 VE 17 GÖRSELLERİ EKLENECEK]**
Amaç fonksiyonu (15) geciken iş sayısını en aza indirir. Ek kısıtlar (16) ve (17) sırasıyla her bir işin gecikme durumunu ve ek karar değişkeninin türünü belirler.
*(Ajan Notu: Orijinal metinde OCR veya dizgi hatası sebebiyle $e^+_j = V \times U_j$ yazılmış olsa da Doğrusal Programlama standartlarında $e^+_j \leq V \times U_j$ olmalıdır, aksi halde işin gecikme miktarı her koşulda sonsuza veya sıfıra eşitlenmeye çalışılır.)*

#### 3.2.4. Üç Performans Ölçütü Arasındaki Uzlaşmacı Çözümleri Belirle (M4 Modeli ve AUGMECON)
Uzlaşmacı (compromise) çözümler bulmak için çok amaçlı M4 modeli aşağıdaki gibi formüle edilmiştir:
**[BURAYA M4 AMAÇ FONKSİYONLARI GÖRSELİ EKLENECEK]**
Min $f_1 = C_{max}$
Min $f_2 = T$
Min $f_3 = L$
Kısıtlar: (2)–(11), (13)–(14), ve (16)–(17)

Çok amaçlı model, birkaç amaç fonksiyonunun aynı anda optimize edilmesini içerdiğinden, birbiriyle çatışan tüm amaçlar için optimal olan tek bir çözüm elde etmek genellikle imkânsızdır. Sonuç olarak, bu problemlerle başa çıkmak için yaygın olarak benimsenen yaklaşım $\epsilon$-kısıt yöntemidir. Bu teknik, aralarında dengeli bir uzlaşma sağlanabilmesi için amaçlar arasındaki etkileşimlerin araştırılmasını kolaylaştırır [41]. Bu çalışmada, çok amaçlı modele yönelik tasarlanan **Artırılmış $\epsilon$-kısıt (AUGMECON)** yöntemi [42] kullanılmıştır. AUGMECON yöntemi, çok amaçlı problemlerde verimli, Pareto-optimal, baskılanmayan (non-dominated) çözümler üretmek üzere tasarlanmıştır [43]. Bu yöntemin M4 modeline uygulanması şu 5 adımdan oluşur:

**Adım 1:** $f_2$ ve $f_3$ amaç fonksiyonlarını Kısıt (18) ve (19) olarak ayarlayın:
**[BURAYA DENKLEM 18 VE 19 GÖRSELLERİ EKLENECEK]**
Burada $T$, kabul edilebilir toplam gecikmeyi; $L$, kabul edilebilir geciken iş sayısını gösterir ve M4'ün ek parametreleridir.

**Adım 2:** $C_{max}$, $T$ ve $L$'nin mümkün olan en iyi ve en kötü değerlerini elde etmek için M1, M2 ve M3'ü çözerek ödeme tablosunu (payoff table) oluşturun.

**Adım 3:** $f_2$ ve $f_3$ için aralığı (range) hesaplayın. Her aralık birkaç grid noktası (kesişim noktası) içerir.

**Adım 4:** M4 modelini, $T$ ve $L$ aralıklarındaki grid noktalarının her bir kombinasyonu için çözün.

**Adım 5:** Üç amaç fonksiyonuna göre baskılanmayan (non-dominant) çözümler olan Pareto çözümlerini belirleyin.
