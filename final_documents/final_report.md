# Proje Raporu: Sıra-Bağımlı Hazırlık Süreli İlişkisiz Paralel Tezgah Çizelgeleme Problemi İçin AUGMECON Modeli ve Dinamik Dağıtım Kuralları

**Makale:** A multi-objective production scheduling model and dynamic dispatching rules for unrelated parallel machines with sequence-dependent set-up times
**Yazarlar:** Pham Duc Tai, Papimol Kongsri, Prasal Soeurn, Jirachai Buddhakulsomsiri
**Dergi:** Decision Analytics Journal 13 (2024) 100525

---

## ÖZET (Abstract)
Bu çalışma, tezgah ve iş sırası-bağımlı hazırlık sürelerine sahip ilişkisiz paralel tezgahlar için bir üretim çizelgelemesi sunmaktadır. Minimize edilecek sistem performans ölçütleri yayılma süresini (makespan), toplam teslim gecikmesi süresini (total tardiness) ve geciken iş sayısını (number of tardy jobs) içermektedir. Çalışmanın amacı, problemi büyük ölçekli olarak çözebilecek bir çözüm metodolojisi geliştirmektir. İlk olarak, problem bir karışık tamsayılı doğrusal programlama modeli olarak formüle edilmiştir. Küçük problem örnekleri için Pareto çözümleri bulmak üzere artırılmış $\epsilon$-kısıt yöntemi uygulanmıştır. Amaç, üç performans ölçütü arasındaki ödünleşimleri (trade-offs) dengeleyen Pareto çözümlerinin bu örnekler için bulunabileceğini göstermektir. Büyük problem örneklerini çözmek için dağıtım kuralı tabanlı sezgisel yöntemler geliştirilmiştir. Sezgiseller, bağımlı hazırlık süresini ele almak üzere tasarlanmış üç dağıtım kuralı içermektedir. Ek olarak, bu kurallar zamana dayalı bir kural değiştirme mekanizması kullanılarak altı farklı varyanta dönüştürülmüştür. Sezgiseller, endüstriyel bir kullanıcının aylık talep verilerinden türetilen iki talep senaryosunda, 244 ila 298 iş (job) içeren 18 problem örneği ile test edilmiştir. Her talep senaryosu altında, üç ölçüte göre en iyi performansı sağlayan bir sezgiseller kümesi tanımlanmıştır. Sezgiseller, en kısa tamamlanma zamanı ve teslim tarihi tabanlı kuralların kombinasyonlarını içerir. Son olarak, her ölçüte verilen ağırlık tarafından belirlenen ve bir sezgisel yöntemin diğerlerine tercih edildiği koşulları saptamak için çok kriterli bir karar verme analizi gerçekleştirilmiştir.

---

## 1. Giriş (Introduction)
Etkin üretim planlaması, özellikle karmaşık iş sıralama (job sequencing) ve çizelgeleme görevleriyle uğraşırken imalat sistemleri için kritiktir. Bu makale, söz konusu zorlukları özdeş olmayan tezgahları barındıran ve "ilişkisiz paralel tezgahlar" (unrelated parallel machines) olarak bilinen üretim sistemleri kapsamında ele almaktadır.

Problem, Tayland'daki en büyük çelik boru üreticisindeki gerçek bir problemden motive edilmiştir. Bu üretim sistemi, yetenekleri ve üretim hızları bakımından birbirinden farklılık gösteren çok sayıda tezgahtan oluşmakta olup; bunların paralel çalışması çizelgelemeye ekstra karmaşıklık katmaktadır. Her periyotta (ay), kendi üretim miktarı ve teslim tarihi (due date) olan ve işlenmesi gereken üretim siparişleri, yani işler (jobs) mevcuttur. Tüm işler, hiçbir iş önceliği olmaksızın her periyodun başında işlenebilir. Bu durum, bir işin farklı tezgahlarda farklı işlem sürelerine (processing times) sahip olabileceği anlamına gelmektedir.

Karmaşıklık, tezgah hazırlık süreleri ile daha da artmaktadır. Spesifik olarak, bir işin hazırlık süresi atandığı tezgaha ve sırasına bağlıdır. Örneğin, birbirine bitişik iki iş farklı ürün ailelerindeyse, hazırlık süresi, aynı aileden olup farklı boyutlarda olmalarına göre daha uzundur. Yani bir iş için hazırlık süresi sadece tezgaha değil, aynı zamanda o tezgahtaki bir önceki işe de bağlıdır. Bu durum tezgah ve sıra-bağımlı hazırlık süresi (machine- and sequence-dependent setup time) olarak bilinir.

Her periyotta (yani üretim ayında), müşterilerden gelen siparişleri temsil eden işler, periyodun başından önce verilir ki böylece üretim çizelgelemesi bir önceki periyot sırasında yapılabilir. Bunun bir sonucu olarak, her bir tezgahta planlanan ilk işin hazırlık işlemi periyodun başlangıcından önce gerçekleştirilir. Başka bir deyişle, her bir üretim ayı için her tezgahtaki ilk işin hazırlık süresi sıfır olarak kabul edilmektedir.

Bu problem aynı zamanda, aynı ilişkisiz tezgah seti üzerinde üretilecek birkaç ürün ailesinin bulunduğu birçok imalat sanayisinde de yaygın olarak görülmektedir. Çoğu durumda temel amaç, her bir tezgah için işlerin olabildiğince erken tamamlanmasını sağlayacak bir iş çizelgesi belirlemektir. Bu genellikle en son çizelgelenen işin tamamlanma zamanı (completion time) olan yayılma süresi (makespan - $C_{max}$) ile ölçülür *(Derse Not: 'Makespan' için ders notlarındaki 'yayılma süresi' ifadesi, belirli bir anı gösteren 'tamamlanma zamanı' kavramıyla karıştırılmaması için özel olarak tercih edilmiştir)*. Ayrıca, bu işlerin genellikle birbirinden farklı, söz verilmiş teslim tarihleri vardır. Teslim tarihlerinin ne ölçüde karşılandığını ölçmek için her bir işin teslim gecikmesi süresi (tardiness) ve geciken iş sayısı (number of tardy jobs) hesaplanır. Uygulamada yayılma süresini, toplam teslim gecikmesi süresini ve geciken iş sayısını en aza indirmek birbiriyle çatışan hedeflerdir. Dolayısıyla, üretim verimliliği sürdürülürken müşteri memnuniyetinden de ödün vermemek adına bu performans ölçütleri arasında denge kurmak bir planlamacının en büyük çıkarınadır. Zaman çizelgeleme literatüründe bu üç performans ölçütü arasındaki ödünleşimler iyi bilinmesine rağmen, çalışılan bu problem için söz konusu ölçütler arasında bir denge kuran çözüm sunmaya çalışan hiçbir çalışma olmamıştır.

Bu çalışma literatüre üç temel katkı yapmaktadır.
- İlk olarak, tezgah ve sıra-bağımlı hazırlık sürelerine sahip ilişkisiz paralel tezgah çizelgeleme problemi için bir karışık tamsayılı doğrusal programlama (MILP) modeli geliştirilmiştir. Model, yayılma süresini en aza indirme olan orijinal amaç fonksiyonuna, toplam teslim gecikmesi süresini ve toplam geciken iş sayısını da dâhil etmek üzere Avalos-Rosales ve diğerleri [1] tarafından yapılan çalışmadan uyarlanmıştır. Dahası, bu üç ölçüt arasında uzlaşmacı (compromise) çözümler bulmak için artırılmış $\epsilon$-kısıt (AUGMECON) yöntemi uygulanmıştır. Önerilen modelin uygulaması küçük problem örnekleri kullanılarak gösterilmiştir. Bu katkı, mevcut modellerin hazırlık sürelerini basitleştirdiği veya ilişkisiz paralel tezgahlar için tek amaçlı optimizasyona odaklandığı literatürdeki bir boşluğu doldurmaktadır.
- İkinci olarak, büyük problem örnekleri için dinamik dağıtım kuralı tabanlı sezgiseller (DDR) tasarlanmıştır. Spesifik olarak, literatürde yaygın olarak kullanılan en kısa işlem süresi (SPT), en erken teslim tarihi (EDD) ve en uzun işlem süresi (LPT) olmak üzere üç tekli dağıtım kuralı, tezgah ve sıra-bağımlı hazırlık sürelerini dikkate alacak şekilde değiştirilmiştir. Bu modifikasyon, sıra-bağımlı hazırlık süreli çizelgeleme problemleri için tasarlanmış üç yeni dağıtım kuralı ile sonuçlanmıştır. Buna ek olarak, bu üç kural, kural değiştirme zamanlarını (rule switching times) barındıran altı dağıtım kuralına birleştirilmiştir. Çizelgeleme süreci sırasında dağıtım kurallarının değiştirilmesine izin veren bu mekanizma, özellikle uygulama kolaylığı nedeniyle sadece bu çalışmada değil, aynı zamanda genel olarak çizelgeleme problemlerinde de oldukça etkilidir.
- Üçüncü olarak, etkili kurallar kümesine dayanarak her kuralın hangi koşullarda en etkili olduğunu daha da netleştirmek için kapsamlı bir çok kriterli karar verme analizi gerçekleştirilmiştir. Bu koşullar, bir karar vericinin üç performans ölçütüne atadığı göreceli önem ağırlıkları ile belirlenir. Bu yaklaşımın çok amaçlı bir çizelgeleme problemi için gerçekleştirilen kendi türünün ilk örneği olduğuna inanılmaktadır. Bu yöntemin faydası, birden fazla amacı olan diğer çizelgeleme problemi ortamlarında da araştırılabilir.

Bu kâğıdın geri kalan kısmı aşağıdaki gibi düzenlenmiştir. İlgili literatür, araştırma boşlukları ve bu araştırmanın katkıları Bölüm 2'de tartışılmaktadır. Matematiksel model Bölüm 3'te formüle edilmiş olup sezgiseller Bölüm 4'te oluşturulmuştur. Hesaplamalı çalışma ve sonuçları Bölüm 5'te tartışılmaktadır. Araştırmanın sonuçları Bölüm 6'da özetlenmiştir.

---

## 2. Literatür Taraması (Literature Review)

Paralel tezgahlardaki üretim çizelgeleme problemleri çok sayıda çalışmada araştırılmıştır. Bu problemler; paralel tezgah sınıflandırması, hazırlık süresi, sistem performans ölçütleri ve çözüm yöntemleri gibi çeşitli kriterler kullanılarak kategorize edilebilir. Paralel tezgahlar özdeş (identical), tekdüze (uniform) ve ilişkisiz (unrelated) olarak sınıflandırılabilir. Özdeş paralel tezgahlar, bir işin işlem süresinin aynı üretim hızına sahip her tezgah için aynı olduğu anlamına gelir [2–9]. Farklı işlem süreleri ve üretim hızlarına sahip tekdüze tezgahlara ilişkin çalışmalar Li vd. [10] ve Zandi vd. [11] çalışmalarında bulunabilir. İlişkisiz paralel tezgahlar ise farklı üretim hızlarına ve tezgahlara özgü kısıtlamalara sahiptir; bu da her işin sadece bazı belirli tezgahlar tarafından işlenebileceği anlamına gelir [1,12–21].

Hazırlık süresi (setup time), bir sonraki görevi işlemek üzere kaynakları hazırlamak için gereken süredir [22]. Sıra-bağımsız (sequence-independent), sıra-bağımlı (sequence-dependent) ve tezgah-bağımlı (machine-dependent) olarak sınıflandırılır. Sıra-bağımsız hazırlık süresi, hazırlık süresinin işe veya tezgaha bakılmaksızın sabit olduğu anlamına gelir [18,23,24]. Sıra-bağımlı hazırlık süresi, tezgahtaki bir önceki işe bağlıdır [12,19,25–30]. Başka bir deyişle, sıra-bağımlı hazırlık süreleri, bir tezgah üzerinde birbirine bitişik (adjacent) iki işten oluşan bir çift tarafından belirlenir. Tezgah-bağımlı hazırlık süresi ise, bir işi işlemek üzere atanan tezgaha bağlıdır [1,26,28,30,31].

Çizelgeleme çözümlerinin performansını ölçmek için yayılma süresi (makespan), toplam teslim gecikmesi süresi (total tardiness) ve geciken iş sayısı (number of tardy jobs) dâhil olmak üzere çeşitli kriterler kullanılır [32,33]. Yayılma süresini en aza indirmeye odaklanan çalışmalar Avalos-Rosales vd. [1], Arroyo vd. [20], Soper [21], Ezugwu [31], Shchepin ve Vakhania [34] ve Lee vd. [35] tarafından yürütülmüştür. Toplam gecikme süresini en aza indirmeye yönelik araştırmalar Logendran vd. [12] ve Yin vd. [36] çalışmalarını içerir. Son olarak, Su vd. [18] geciken iş sayısını en aza indirmektedir.

Tek amaçlı optimizasyonun yanı sıra, ilişkisiz paralel tezgah çizelgeleme alanında yıllar içinde farklı hedefleri de dikkate alan ufuk açıcı katkılar ortaya çıkmıştır. Chyu ve Chang [25], iş sırasına ve tezgaha bağlı hazırlık sürelerini ele alarak toplam ağırlıklı akış süresi ve toplam ağırlıklı gecikmenin en aza indirilmesini araştırmaktadır. Lin vd. [13], yayılma süresi, toplam ağırlıklı tamamlanma zamanı ve toplam ağırlıklı gecikme dâhil olmak üzere kritik çizelgeleme hedeflerini hedefleyerek bu araştırmayı genişletmektedir. Torabi vd. [26], toplam ağırlıklı akış süresi, toplam ağırlıklı gecikme ve tezgah yük değişiminin minimizasyonunu araştırmaktadır. Nikabadi ve Naderi [27], yayılma süresini, geciken iş sayısını, erken bitme ve gecikmeyi eşzamanlı olarak en aza indirmektedir. Daha sonraki bir çalışmada, Wang ve Alidaee [28], ilişkisiz paralel tezgahlarda sipariş kabulü ve çizelgeleme konusunu ele alarak, toplam iş yükünü ve tezgah sabit maliyetlerini en aza indiren çok amaçlı bir karışık tamsayılı doğrusal programlama modeli sunmaktadır. Farmand vd. [37], özdeş paralel tezgah çizelgelemesi ile tedarik zinciri yönetimini bütünleştiren iki amaçlı bir model geliştirmektedir. Model, hem zaman tabanlı hem de maliyet tabanlı performans ölçütlerini minimize etmeyi amaçlamaktadır. Zaman tabanlı ölçüt, toplam ağırlıklı gecikme ve operasyon süresinden oluşurken; maliyet tabanlı ölçüt, geciken siparişler için ceza, erken bitirme ve parti teslimat maliyetini içerir. Son olarak, Yepes-Borrero vd. [30] yayılma süresini ve ihtiyaç duyulan maksimum kaynak sayısını minimize eden iki amaçlı bir model formüle etmektedir.

Yöntembilim (methodology) açısından, karışık tamsayılı doğrusal programlama (MILP) modelleri sadece küçük problem örneklerini çözebilmektedir. Bu nedenle, birçok araştırmacı büyük ölçekli problemleri çözmek için sezgisel yöntemler (heuristics) geliştirmiştir. İlişkisiz paralel tezgahlar için popüler sezgiseller arasında genetik algoritma [1,13,14,18] ve benzetimli tavlama algoritması (simulated algorithm) [17,18] bulunmaktadır. Literatür taramalarında bulunan diğer sezgisel yöntemler arasında dal ve sınır (branch and bound) [19], iterated greedy [20,30,38], polinomsal zamanlı yaklaşım şeması (PTAS) [15], üç fazlı yöntem [29] ve bileşik dağıtım kuralı [19] yer alır. Yin vd. [36], iterated greedy algoritmasını kendi çizelgeleme problemlerine uyarlamıştır. Ek olarak, Chyu ve Chang [25], iş sırasına ve tezgaha bağlı hazırlık sürelerini içeren iki amaçlı (toplam ağırlıklı akış süresi ve ağırlıklı gecikme) çizelgeleme problemi için bir Pareto evrimsel yaklaşımı sunmaktadır. Lin vd. [13], Chyu ve Chang'ın çalışmasını [25] genişleterek çizelgeleme problemlerinde çok amaçlı (yayılma süresi, ağırlıklı tamamlanma zamanı ve ağırlıklı gecikme dâhil) çözümler bulmak üzere genetik algoritmayı modifiye etmiştir. Torabi vd. [26] çok amaçlı parçacık sürüsü optimizasyonu (MOPSO) önermiş, Nikabadi ve Naderi [27] ise çok amaçlı genetik algoritma (MOGA) ve benzetimli tavlama (SA) kullanmıştır. Wang ve Alidaee [28], liste çizelgeleme tabanlı çok amaçlı partenogenetik algoritma (LS-MPGA) geliştirmiştir. Benzer şekilde Bektur ve Sarac [29], hazırlık süreli değiştirilmiş görünür gecikme maliyeti (ATCS) dağıtım kurallarından elde edilen başlangıç çözümünü kullanan benzetimli tavlama ve Tabu Arama olmak üzere iki sezgisel yöntem önermektedir. Farmand vd. [37], özdeş paralel tezgahlar ve tedarik zinciri entegrasyonu problemi için MOPSO ve NSGA-II gibi meta-sezgisel algoritmaları benimsemiştir. Son olarak Krim vd. [39] ise farklı komşuluk yapıları ve çözüm uzaylarından yararlanan, tabu arama tabanlı iki yeni meta-sezgisel yöntem önermektedir.

Paralel tezgah çizelgeleme konusundaki ilgili literatüre genel bir bakış Tablo 1'de sunulmaktadır.

**[BURAYA TABLO 1 GÖRSELİ EKLENECEK - A summary of relevant research work]**

Tablo 1'e göre, hiçbir araştırma, tezgah ve sıra-bağımlı hazırlık sürelerine sahip ilişkisiz paralel tezgah üretim sistemlerinde yayılma süresi, toplam teslim gecikmesi süresi ve geciken iş sayısı çoklu amaç fonksiyonlarına sahip bir çizelgeleme problemini incelememiştir. Bu araştırma boşluğundan motive olan bu çalışma, aşağıdaki hususları ele almayı amaçlamaktadır:
* Yayılma süresi, toplam teslim gecikmesi süresi ve geciken iş sayısı arasındaki en iyi ödünleşimleri (trade-offs) temsil eden Pareto çözümlerini sağlayabilen çok amaçlı bir MILP modelinin formülasyonu.
* Pratik bir problemden uyarlanan sayısal bir deney vasıtasıyla MILP modelinin kapasitesinin ve sınırlarının incelenmesi.
* Matematiksel modele ek olarak, farklı dinamik dağıtım kuralı tabanlı sezgisel yöntemlerin (DDR) önerilmesi, oluşturulması ve denenmesi. Buradaki amaç, makul bir süre içinde yüksek kaliteli çözümler bulabilen alternatif bir yaklaşım sunmaktır. Bu durum, özellikle ilişkisiz paralel tezgah sistemlerine sahip olan endüstrilerin, iyi üretim çizelgeleri oluşturmak için minimum zaman harcayan bir çizelgeleme yöntemine duyduğu ihtiyaçla örtüşmektedir.
* Bildiğimiz kadarıyla, ATCS dağıtım kuralında sıra-bağımlı hazırlık süresini dâhil eden Bektur ve Sarac [29] tarafından yapılmış önceki tek bir çalışma bulunmaktadır. Sadece bir tek dağıtım kuralı oluşturmak yerine, bizim çalışmamız pratikte yaygın olarak uygulanan üç farklı kuralı modifiye etmektedir.

> **(Ek Not: Literatürdeki Modelleme Yaklaşımlarının Özeti)**
> *(Derse Not: Makalede bahsi geçen kritik iki çalışmanın modelleme yaklaşımlarının netleştirilmesi)*
> 1. **Avalos-Rosales vd. (2015):** Bu çalışma (Makalenin M1 modelinin temeli), hazırlık sürelerinin hem tezgaha hem de sıraya bağlı olduğu ilişkisiz paralel tezgah problemini ele alır. Yayılma süresini (Makespan) minimize etmek için saf bir MILP (Karışık Tamsayılı Doğrusal Programlama) kurgulamıştır. Büyük ölçekli problemleri çözmek için Genetik Algoritma (GA) ve Memetik Algoritma (MA) gibi popülasyon temelli meta-sezgiseller geliştirmişlerdir. Bizim çalışmamız ise bu modeli çok amaçlı hale (Gecikme süresi ve Geciken İş Sayısı dâhil) getirmiştir.
> 2. **Bektur ve Sarac (2019):** Makalenin sezgisel yaklaşımına (DDR) ilham veren bu çalışma, toplam ağırlıklı teslim gecikmesini (weighted tardiness) minimize etmeyi hedefler. Model olarak bir MILP sunmuş, büyük problemlerde Tabu Arama (TS) ve Benzetimli Tavlama (SA) kullanmıştır. En büyük farkı, çözüm aramaya başlarken oluşturdukları başlangıç çözümünü **ATCS (Apparent Tardiness Cost with Setups)** adı verilen ve hazırlık sürelerini dikkate alan spesifik bir sezgisel dağıtım kuralıyla başlatmış olmalarıdır. Bizim çalışmamız ise tek bir kural yerine SPT, EDD ve LPT'yi modifiye ederek dinamik kurallar tasarlamıştır.

---

## 3. Model Geliştirme (Model Development)

### 3.1. Problem Tanımı (Problem Statement)
Bu çalışma, tezgah ve sıra-bağımlı hazırlık sürelerine sahip ilişkisiz paralel tezgah çizelgeleme problemini ele almaktadır. Problemin tanımları aşağıdaki gibidir:
- Her periyotta (örneğin bir ay) işlenecek $n$ adet iş (job) bulunmaktadır. Her iş, gerekli üretim miktarı ve teslim tarihinden (due date) oluşur.
- Tüm işler her periyodun başında üretim için serbest bırakılır, yani tüm işlerin serbest bırakılma zamanı (release time) aynıdır. İşlerin önem derecelerine göre birbirlerine karşı herhangi bir önceliği yoktur.
- Üretim sistemi $m$ adet ilişkisiz paralel tezgahtan oluşmaktadır.
- Bir işin bir tezgahtaki işlem süresi, iş-tezgah çiftine bağlıdır.
- Her tezgah, tüm işlerin sadece belirli bir alt kümesini işleyebilir. Bir tezgahın işleyemediği işler için işlem süreleri çok büyük bir değere atanır.
- Hazırlık süresi tezgaha ve sıraya bağlıdır; yani bir işin hazırlık süresi, belirli bir tezgahta kendinden önceki iş ve kendisinden oluşan bir iş çifti tarafından belirlenir.

### 3.2. Matematiksel Modeller (Mathematical Models)
Problem, her biri yayılma süresi (makespan), toplam teslim gecikmesi süresi (total tardiness) ve geciken iş sayısı (number of tardy jobs) dâhil olmak üzere üç sistem performans ölçütünden birini minimize eden üç ayrı MILP modeli olarak formüle edilmiştir. MILP modelleri, farklı sistem ölçütlerine göre problemlerin karakteristiklerini incelemek için kullanılır. Bu, optimizasyon probleminin dört küçük problem örneği kullanılarak çözülmesiyle gerçekleştirilir. Buna ek olarak, üç ölçüt arasında uzlaşmacı (compromise) çözümler arayan dördüncü bir model formüle edilmiştir. Üç ölçüt arasındaki ödünleşim (trade-off) incelenerek Pareto çözümleri tanımlanmaktadır. Modelin indeksleri, parametreleri ve karar değişkenleri şunlardır:

**İndeksler (Index):**
- $i, j$: İş indeksleri, burada $N$ işler kümesini ifade eder ($N = \{1, 2, ..., n\}$) ve $N_0$ ise 0 numaralı kukla (dummy) işi de içeren işler kümesidir ($N_0 = \{0\} \cup N$).
- $k$: Tezgah indeksi, burada $M$ tezgahlar kümesini ifade eder ($k \in M = \{1, 2, ..., m\}$). Ayrıca her tezgah farklı bir iş kümesini işleyebildiğinden, herhangi bir verilen $j$ işi sadece $M$'nin bir alt kümesi olan $M_j$ tarafından işlenebilir. Yani $M = M_1 \cup M_2 ... \cup M_n$'dir.

**Parametreler (Parameter):**
- $P_{j,k}$: $j$ işinin $k$ tezgahındaki işlem süresi (processing time)
- $S_{i,j,k}$: $k$ tezgahı, önceki işi $i$ iken $j$ işini işlemek üzere hazırlandığında gereken hazırlık süresi (setup time)
- $D_j$: $j$ işinin teslim tarihi (due date)
- $V$: Çok büyük bir değer (Big-M katsayısı)
- $NP_{j,k}$: $j$ işinin, eğer 1'e eşitse $k$ tezgahında işlenebileceğini, aksi takdirde işlenemeyeceğini gösteren kısıtlama koşulu.

**Karar Değişkenleri (Decision Variable):**
- $X_{i,j,k}$: Eğer $j$ işi $k$ tezgahında $i$ işinden sonra çizelgelenmişse 1, aksi halde 0 değerini alan ikili (binary) değişken.
- $C_j$: $j$ işinin tamamlanma zamanı (saat) (completion time)
- $C_{max}$: Yayılma süresi (Tüm $j \in N$ işleri içindeki maksimum tamamlanma zamanı) (saat) (makespan)
- $e^+_j$: $j$ işinin teslim gecikmesi süresi (saat) (tardiness)
- $e^-_j$: $j$ işinin erken bitme süresi (saat) (earliness)
- $U_j$: Eğer $j$ işi gecikmişse 1, aksi halde 0 değerini alan ikili değişken.

#### 3.2.1. Yayılma Süresini Minimize Etme (Minimize makespan)
Bu MILP Avalos-Rosales vd. [1] ve Kongsri ve Buddhakulsomsiri [40] tarafından benimsenmiştir. M1 olarak adlandırılmaktadır.

**[BURAYA DENKLEM 1 GÖRSELİ EKLENECEK - Amaç Fonksiyonu]**

Kısıtlar (Subject to):
**[BURAYA DENKLEM 2 VE 3 GÖRSELLERİ EKLENECEK]**
**[BURAYA DENKLEM 4 VE 5 GÖRSELLERİ EKLENECEK]**
**[BURAYA DENKLEM 6 VE 7 GÖRSELLERİ EKLENECEK]**
**[BURAYA DENKLEM 8 VE 9 GÖRSELLERİ EKLENECEK]**
**[BURAYA DENKLEM 10 VE 11 GÖRSELLERİ EKLENECEK]**

Modelde amaç fonksiyonu (1) yayılma süresini en aza indirir. Kısıtlar (2) ve (3), her işin yalnızca tek bir önceki işi ve tam olarak tek bir ardıl işi olmasını sağlar. Kısıt (4), her bir tezgahtaki her işin akış dengesini temsil eder. Kısıt (5), her tezgahın bir kukla iş (dummy job) ile başlaması gerektiğini belirtir. Kısıt (6), her işin tamamlanma zamanını, önceki işin tamamlanma zamanı, hazırlık süresi ve işin işlem süresi üzerinden hesaplar. Kısıt (7), kukla işin tamamlanma zamanının 0 olduğunu gösterir. Kısıt (8), tüm işlerin tamamlanma zamanlarından yayılma süresini belirler. Kısıt (9), eğer bir kısıtlaması varsa $j$ işinin $m$ tezgahında işlenemeyeceğini belirler *(Derse Not: Orijinal metinde denklem 9'un açıklamasında dizgisel bir hata yapılarak '$k$ tezgahı' yerine yanlışlıkla '$m$ tezgahı' yazılmıştır, ayrıca $k$ indisinin denklemin solundaki toplam sembolüyle çakışması şeklinde yapısal bir hata mevcuttur)*. Son olarak, Kısıt (10)–(11) karar değişkenlerinin türlerini belirler.

#### 3.2.2. Toplam Teslim Gecikmesi Süresini Minimize Etme (Minimize the total tardiness)
Minimum toplam teslim gecikmesi süresine sahip bir iş çizelgesi oluşturmak için M1, ek karar değişkenleri ve kısıtlar getirilerek M2 olarak adlandırılan başka bir modele dönüştürülmüştür. Spesifik olarak, $j$ işinin sırasıyla teslim gecikmesi süresini ve erken bitme süresini temsil eden $e^+_j$ ve $e^-_j$ olmak üzere iki değişken M2'ye dâhil edilmiştir. Toplam teslim gecikmesi süresini en aza indirmeye yönelik amaç fonksiyonu Denklem (12) ile ifade edilmektedir. Ayrıca, $e^+_j$ ve $e^-_j$'nin değerleri ve türleri sırasıyla (13) ve (14) kısıtlarıyla belirlenmiştir.

**[BURAYA DENKLEM 12 GÖRSELİ EKLENECEK - Amaç Fonksiyonu]**

Kısıtlar (Subject to):
(2)–(10)
**[BURAYA DENKLEM 13 VE 14 GÖRSELLERİ EKLENECEK]**

#### 3.2.3. Geciken İş Sayısını Minimize Etme (Minimize the number of tardy jobs)
M2'ye benzer şekilde, bu bölümdeki M3 olarak adlandırılan model, $j$ işinin gecikip gecikmediğini göstermek için bir $U_j$ ikili karar değişkeni eklenerek M1'den türetilmiştir. M3 aşağıdaki gibi formüle edilmiştir:

**[BURAYA DENKLEM 15 GÖRSELİ EKLENECEK - Amaç Fonksiyonu]**

Kısıtlar (Subject to):
**[BURAYA DENKLEM 16 VE 17 GÖRSELLERİ EKLENECEK]**

Amaç fonksiyonu (15) geciken iş sayısını en aza indirir. Ek kısıtlar (16) ve (17) sırasıyla her bir işin gecikme durumunu ve ek karar değişkeninin türünü belirtir *(Derse Not: Denklem 16'da eşitlik kullanılması teorik olarak kusurludur; bir Big-M (V) kısıtı gereği $e^+_j \leq V \times U_j$ şeklinde eşitsizlik olması gerekir, çeviride makalenin orijinali korunmuştur)*.

#### 3.2.4. Üç Performans Ölçütü Arasındaki Uzlaşmacı Çözümleri Belirleme (Determine compromise solutions among the three performance measures)
Uzlaşmacı (compromise) çözümler bulmak için, çok amaçlı model (M4) aşağıdaki gibi formüle edilmiştir:

**[BURAYA M4 AMAÇ FONKSİYONLARI GÖRSELİ EKLENECEK ($f_1, f_2, f_3$)]**

Kısıtlar (Subject to):
Kısıtlar (2)–(11), (13)–(14), ve (16)–(17)

Çok amaçlı model, birkaç amaç fonksiyonunun aynı anda optimize edilmesini içerdiğinden, birbiriyle çatışan tüm hedefler için optimal olan tek bir çözüm elde etmek genellikle imkansızdır. Sonuç olarak, bu problemlerle başa çıkmak için yaygın olarak benimsenen yaklaşım $\epsilon$-kısıt yöntemidir. Bu teknik, amaçlar arasında dengeli bir uzlaşma sağlanabilmesi için hedefler arasındaki etkileşimlerin araştırılmasını kolaylaştırır [41]. Bu çalışmada, üretim çizelgeleme problemi için önerilen çok amaçlı modeli ele almak üzere $\epsilon$-kısıt yönteminin artırılmış (augmented) bir versiyonunu (AUGMECON) [42] kullanıyoruz. AUGMECON yöntemi, çok amaçlı problemlerde verimli Pareto-optimal, baskılanmayan (non-dominated) çözümler üretmek üzere tasarlanmıştır ve pareto optimal sonuçlar üretmedeki etkinliği kanıtlanmıştır [43]. Bu yöntemin detaylı açıklaması için okuyucular Mavrotas'a [42] yönlendirilmektedir.

AUGMECON yöntemi aşağıdaki adımlar kullanılarak M4'e uygulanır:
**Adım 1:** $f_2$ ve $f_3$ amaç fonksiyonlarını Kısıt (18) ve (19) olarak ayarlayın.
**[BURAYA DENKLEM 18 VE 19 GÖRSELLERİ EKLENECEK]**
Burada $T$, belirlenen kabul edilebilir toplam teslim gecikmesi süresini; $L$, belirlenen kabul edilebilir geciken iş sayısını gösterir ve bunlar M4'ün ek parametreleridir.
**Adım 2:** $C_{max}, T$ ve $L$'nin mümkün olan en iyi ve en kötü değerlerini elde etmek için M1, M2 ve M3'ü çözerek ödeme tablosunu (payoff table) oluşturun.
**Adım 3:** $f_2$ ve $f_3$ için aralığı (range) hesaplayın. Her aralık birkaç kılavuz (grid) noktası içerir.
**Adım 4:** M4, $T$ ve $L$ aralıklarındaki her kılavuz noktası kombinasyonu için çözülür.
**Adım 5:** Üç amaç fonksiyonuna göre baskılanmayan (non-dominant) çözümler olan Pareto çözümlerini belirleyin.
