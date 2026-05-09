# Proje Raporu: Sıra-Bağımlı Hazırlık Süreli İlişkisiz Paralel Tezgah Çizelgeleme Problemi İçin AUGMECON Modeli ve Dinamik Dağıtım Kuralları

**Makale:** A multi-objective production scheduling model and dynamic dispatching rules for unrelated parallel machines with sequence-dependent set-up times
**Yazarlar:** Pham Duc Tai, Papimol Kongsri, Prasal Soeurn, Jirachai Buddhakulsomsiri
**Dergi:** Decision Analytics Journal 13 (2024) 100525

---

## ÖZET (Abstract)
Bu çalışma, tezgah ve iş sırası-bağımlı hazırlık sürelerine sahip ilişkisiz paralel tezgahlar için bir üretim çizelgelemesi sunmaktadır. Minimize edilecek sistem performans ölçütleri yayılma süresini (makespan), toplam teslim gecikmesi süresini (total tardiness) ve geciken iş sayısını (number of tardy jobs) içermektedir. Çalışmanın amacı, problemi büyük ölçekli olarak çözebilecek bir çözüm metodolojisi geliştirmektir. İlk olarak, problem bir karışık tamsayılı doğrusal programlama modeli olarak formüle edilmiştir. Küçük problem örnekleri için Pareto çözümleri bulmak üzere artırılmış $\epsilon$-kısıt yöntemi uygulanmıştır. Amaç, üç performans ölçütü arasındaki ödünleşimleri (trade-offs) dengeleyen Pareto çözümlerinin bu örnekler için bulunabileceğini göstermektir. Büyük problem örneklerini çözmek için dağıtım kuralı tabanlı sezgisel yöntemler geliştirilmiştir. Geliştirilen bu sezgisel yöntemler, bağımlı hazırlık süresini ele almak üzere tasarlanmış üç dağıtım kuralı içermektedir. Ek olarak, bu kurallar zamana dayalı bir kural değiştirme mekanizması kullanılarak altı farklı varyanta dönüştürülmüştür. Önerilen yöntemler, endüstriyel bir kullanıcının aylık talep verilerinden türetilen iki talep senaryosunda, 244 ila 298 iş (job) içeren 18 problem örneği ile test edilmiştir. Her talep senaryosu altında, üç ölçüte göre en iyi performansı sağlayan bir sezgisel yöntemler kümesi tanımlanmıştır. Bu yöntemler, en kısa tamamlanma zamanı ve teslim tarihi tabanlı kuralların kombinasyonlarını içerir. Son olarak, her ölçüte verilen ağırlık tarafından belirlenen ve bir sezgisel yöntemin diğerlerine tercih edildiği koşulları saptamak için çok kriterli bir karar verme analizi gerçekleştirilmiştir.

---

## 1. Giriş (Introduction)
Etkin üretim planlaması, özellikle karmaşık iş sıralama (job sequencing) ve çizelgeleme görevleriyle uğraşırken imalat sistemleri için kritiktir. Bu makale, söz konusu zorlukları özdeş olmayan tezgahları barındıran ve "ilişkisiz paralel tezgahlar" (unrelated parallel machines) olarak bilinen üretim sistemleri kapsamında ele almaktadır.

Problem, Tayland'daki en büyük çelik boru üreticisindeki gerçek bir problemden motive edilmiştir. Bu üretim sistemi, yetenekleri ve üretim hızları bakımından birbirinden farklılık gösteren çok sayıda tezgahtan oluşmakta olup; bunların paralel çalışması çizelgelemeye ekstra karmaşıklık katmaktadır. Her periyotta (ay), kendi üretim miktarı ve teslim tarihi (due date) olan ve işlenmesi gereken üretim siparişleri, yani işler (jobs) mevcuttur. Tüm işler, hiçbir iş önceliği olmaksızın her periyodun başında işlenebilir. Bu durum, bir işin farklı tezgahlarda farklı işlem sürelerine (processing times) sahip olabileceği anlamına gelmektedir.

Karmaşıklık, tezgah hazırlık süreleri ile daha da artmaktadır. Spesifik olarak, bir işin hazırlık süresi atandığı tezgaha ve sırasına bağlıdır. Örneğin, birbirine bitişik iki iş farklı ürün ailelerindeyse, hazırlık süresi, aynı aileden olup farklı boyutlarda olmalarına göre daha uzundur. Yani bir iş için hazırlık süresi sadece tezgaha değil, aynı zamanda o tezgahtaki bir önceki işe de bağlıdır. Bu durum tezgah ve sıra-bağımlı hazırlık süresi (machine- and sequence-dependent setup time) olarak bilinir.

Her periyotta (yani üretim ayında), müşterilerden gelen siparişleri temsil eden işler, periyodun başından önce verilir ki böylece üretim çizelgelemesi bir önceki periyot sırasında yapılabilir. Bunun bir sonucu olarak, her bir tezgahta planlanan ilk işin hazırlık işlemi periyodun başlangıcından önce gerçekleştirilir. Başka bir deyişle, her bir üretim ayı için her tezgahtaki ilk işin hazırlık süresi sıfır olarak kabul edilmektedir.

Bu problem aynı zamanda, aynı ilişkisiz tezgah seti üzerinde üretilecek birkaç ürün ailesinin bulunduğu birçok imalat sanayisinde de yaygın olarak görülmektedir. Çoğu durumda temel amaç, her bir tezgah için işlerin olabildiğince erken tamamlanmasını sağlayacak bir iş çizelgesi belirlemektir. Bu genellikle en son çizelgelenen işin tamamlanma zamanı (completion time) olan yayılma süresi (makespan - $C_{max}$) ile ölçülür *(Derse Not: 'Makespan' için ders notlarındaki 'yayılma süresi' ifadesi, belirli bir anı gösteren 'tamamlanma zamanı' kavramıyla karıştırılmaması için özel olarak tercih edilmiştir)*. Ayrıca, bu işlerin genellikle birbirinden farklı, söz verilmiş teslim tarihleri vardır. Teslim tarihlerinin ne ölçüde karşılandığını ölçmek için her bir işin teslim gecikmesi süresi (tardiness) ve geciken iş sayısı (number of tardy jobs) hesaplanır. Uygulamada yayılma süresini, toplam teslim gecikmesi süresini ve geciken iş sayısını en aza indirmek birbiriyle çatışan hedeflerdir. Dolayısıyla, üretim verimliliği sürdürülürken müşteri memnuniyetinden de ödün vermemek adına bu performans ölçütleri arasında denge kurmak bir planlamacının en büyük çıkarınadır. Zaman çizelgeleme literatüründe bu üç performans ölçütü arasındaki ödünleşimler iyi bilinmesine rağmen, çalışılan bu problem için söz konusu ölçütler arasında bir denge kuran çözüm sunmaya çalışan hiçbir çalışma olmamıştır.

Bu çalışma literatüre üç temel katkı yapmaktadır.
- İlk olarak, tezgah ve sıra-bağımlı hazırlık sürelerine sahip ilişkisiz paralel tezgah çizelgeleme problemi için bir karışık tamsayılı doğrusal programlama (MILP) modeli geliştirilmiştir. Model, yayılma süresini en aza indirme olan orijinal amaç fonksiyonuna, toplam teslim gecikmesi süresini ve toplam geciken iş sayısını da dâhil etmek üzere Avalos-Rosales ve diğerleri [1] tarafından yapılan çalışmadan uyarlanmıştır. Dahası, bu üç ölçüt arasında uzlaşmacı (compromise) çözümler bulmak için artırılmış $\epsilon$-kısıt (AUGMECON) yöntemi uygulanmıştır. Önerilen modelin uygulaması küçük problem örnekleri kullanılarak gösterilmiştir. Bu katkı, mevcut modellerin hazırlık sürelerini basitleştirdiği veya ilişkisiz paralel tezgahlar için tek amaçlı optimizasyona odaklandığı literatürdeki bir boşluğu doldurmaktadır.
- İkinci olarak, büyük problem örnekleri için dinamik dağıtım kuralı tabanlı sezgisel yöntemler (DDR) tasarlanmıştır. Spesifik olarak, literatürde yaygın olarak kullanılan en kısa işlem süresi (SPT), en erken teslim tarihi (EDD) ve en uzun işlem süresi (LPT) olmak üzere üç tekli dağıtım kuralı, tezgah ve sıra-bağımlı hazırlık sürelerini dikkate alacak şekilde değiştirilmiştir. Bu modifikasyon, sıra-bağımlı hazırlık süreli çizelgeleme problemleri için tasarlanmış üç yeni dağıtım kuralı ile sonuçlanmıştır. Buna ek olarak, bu üç kural, kural değiştirme zamanlarını (rule switching times) barındıran altı dağıtım kuralına birleştirilmiştir. Çizelgeleme süreci sırasında dağıtım kurallarının değiştirilmesine izin veren bu mekanizma, özellikle uygulama kolaylığı nedeniyle sadece bu çalışmada değil, aynı zamanda genel olarak çizelgeleme problemlerinde de oldukça etkilidir.
- Üçüncü olarak, etkili kurallar kümesine dayanarak her kuralın hangi koşullarda en etkili olduğunu daha da netleştirmek için kapsamlı bir çok kriterli karar verme analizi gerçekleştirilmiştir. Bu koşullar, bir karar vericinin üç performans ölçütüne atadığı göreceli önem ağırlıkları ile belirlenir. Bu yaklaşımın çok amaçlı bir çizelgeleme problemi için gerçekleştirilen kendi türünün ilk örneği olduğuna inanılmaktadır. Bu yöntemin faydası, birden fazla amacı olan diğer çizelgeleme problemi ortamlarında da araştırılabilir.

Bu kâğıdın geri kalan kısmı aşağıdaki gibi düzenlenmiştir. İlgili literatür, araştırma boşlukları ve bu araştırmanın katkıları Bölüm 2'de tartışılmaktadır. Matematiksel model Bölüm 3'te formüle edilmiş olup sezgisel yöntemler Bölüm 4'te oluşturulmuştur. Hesaplamalı çalışma ve sonuçları Bölüm 5'te tartışılmaktadır. Araştırmanın sonuçları Bölüm 6'da özetlenmiştir.

---

## 2. Literatür Taraması (Literature Review)

Paralel tezgahlardaki üretim çizelgeleme problemleri çok sayıda çalışmada araştırılmıştır. Bu problemler; paralel tezgah sınıflandırması, hazırlık süresi, sistem performans ölçütleri ve çözüm yöntemleri gibi çeşitli kriterler kullanılarak kategorize edilebilir. Paralel tezgahlar özdeş (identical), tekdüze (uniform) ve ilişkisiz (unrelated) olarak sınıflandırılabilir. Özdeş paralel tezgahlar, bir işin işlem süresinin aynı üretim hızına sahip her tezgah için aynı olduğu anlamına gelir [2–9]. Farklı işlem süreleri ve üretim hızlarına sahip tekdüze tezgahlara ilişkin çalışmalar Li vd. [10] ve Zandi vd. [11] çalışmalarında bulunabilir. İlişkisiz paralel tezgahlar ise farklı üretim hızlarına ve tezgahlara özgü kısıtlamalara sahiptir; bu da her işin sadece bazı belirli tezgahlar tarafından işlenebileceği anlamına gelir [1,12–21].

Hazırlık süresi (setup time), bir sonraki görevi işlemek üzere kaynakları hazırlamak için gereken süredir [22]. Sıra-bağımsız (sequence-independent), sıra-bağımlı (sequence-dependent) ve tezgah-bağımlı (machine-dependent) olarak sınıflandırılır. Sıra-bağımsız hazırlık süresi, hazırlık süresinin işe veya tezgaha bakılmaksızın sabit olduğu anlamına gelir [18,23,24]. Sıra-bağımlı hazırlık süresi, tezgahtaki bir önceki işe bağlıdır [12,19,25–30]. Başka bir deyişle, sıra-bağımlı hazırlık süreleri, bir tezgah üzerinde birbirine bitişik (adjacent) iki işten oluşan bir çift tarafından belirlenir. Tezgah-bağımlı hazırlık süresi ise, bir işi işlemek üzere atanan tezgaha bağlıdır [1,26,28,30,31].

Çizelgeleme çözümlerinin performansını ölçmek için yayılma süresi (makespan), toplam teslim gecikmesi süresi (total tardiness) ve geciken iş sayısı (number of tardy jobs) dâhil olmak üzere çeşitli kriterler kullanılır [32,33]. Yayılma süresini en aza indirmeye odaklanan çalışmalar Avalos-Rosales vd. [1], Arroyo vd. [20], Soper [21], Ezugwu [31], Shchepin ve Vakhania [34] ve Lee vd. [35] tarafından yürütülmüştür. Toplam gecikme süresini en aza indirmeye yönelik araştırmalar Logendran vd. [12] ve Yin vd. [36] çalışmalarını içerir. Son olarak, Su vd. [18] geciken iş sayısını en aza indirmektedir.

Tek amaçlı optimizasyonun yanı sıra, ilişkisiz paralel tezgah çizelgeleme alanında yıllar içinde farklı hedefleri de dikkate alan ufuk açıcı katkılar ortaya çıkmıştır. Chyu ve Chang [25], iş sırasına ve tezgaha bağlı hazırlık sürelerini ele alarak toplam ağırlıklı akış süresi ve toplam ağırlıklı gecikmenin en aza indirilmesini araştırmaktadır. Lin vd. [13], yayılma süresi, toplam ağırlıklı tamamlanma zamanı ve toplam ağırlıklı gecikme dâhil olmak üzere kritik çizelgeleme hedeflerini hedefleyerek bu araştırmayı genişletmektedir. Torabi vd. [26], toplam ağırlıklı akış süresi, toplam ağırlıklı gecikme ve tezgah yük değişiminin minimizasyonunu araştırmaktadır. Nikabadi ve Naderi [27], yayılma süresini, geciken iş sayısını, erken bitme ve gecikmeyi eşzamanlı olarak en aza indirmektedir. Daha sonraki bir çalışmada, Wang ve Alidaee [28], ilişkisiz paralel tezgahlarda sipariş kabulü ve çizelgeleme konusunu ele alarak, toplam iş yükünü ve tezgah sabit maliyetlerini en aza indiren çok amaçlı bir karışık tamsayılı doğrusal programlama modeli sunmaktadır. Farmand vd. [37], özdeş paralel tezgah çizelgelemesi ile tedarik zinciri yönetimini bütünleştiren iki amaçlı bir model geliştirmektedir. Model, hem zaman tabanlı hem de maliyet tabanlı performans ölçütlerini minimize etmeyi amaçlamaktadır. Zaman tabanlı ölçüt, toplam ağırlıklı gecikme ve operasyon süresinden oluşurken; maliyet tabanlı ölçüt, geciken siparişler için ceza, erken bitirme ve parti teslimat maliyetini içerir. Son olarak, Yepes-Borrero vd. [30] yayılma süresini ve ihtiyaç duyulan maksimum kaynak sayısını minimize eden iki amaçlı bir model formüle etmektedir.

Metodoloji (methodology) açısından, karışık tamsayılı doğrusal programlama (MILP) modelleri sadece küçük problem örneklerini çözebilmektedir. Bu nedenle, birçok araştırmacı büyük ölçekli problemleri çözmek için sezgisel yöntemler (heuristics) geliştirmiştir. İlişkisiz paralel tezgahlar için popüler sezgisel algoritmalar arasında genetik algoritma [1,13,14,18] ve benzetimli tavlama algoritması (simulated annealing) [17,18] bulunmaktadır. Literatür taramalarında bulunan diğer sezgisel yöntemler arasında dal ve sınır (branch and bound) [19], iterated greedy [20,30,38], polinomsal zamanlı yaklaşım şeması (PTAS) [15], üç fazlı yöntem [29] ve bileşik dağıtım kuralı [19] yer alır. Yin vd. [36], iterated greedy algoritmasını kendi çizelgeleme problemlerine uyarlamıştır. Ek olarak, Chyu ve Chang [25], iş sırasına ve tezgaha bağlı hazırlık sürelerini içeren iki amaçlı (toplam ağırlıklı akış süresi ve ağırlıklı gecikme) çizelgeleme problemi için bir Pareto evrimsel yaklaşımı sunmaktadır. Lin vd. [13], Chyu ve Chang'ın çalışmasını [25] genişleterek çizelgeleme problemlerinde çok amaçlı (yayılma süresi, ağırlıklı tamamlanma zamanı ve ağırlıklı gecikme dâhil) çözümler bulmak üzere genetik algoritmayı modifiye etmiştir. Torabi vd. [26] çok amaçlı parçacık sürüsü optimizasyonu (MOPSO) önermiş, Nikabadi ve Naderi [27] ise çok amaçlı genetik algoritma (MOGA) ve benzetimli tavlama (SA) kullanmıştır. Wang ve Alidaee [28], liste çizelgeleme tabanlı çok amaçlı partenogenetik algoritma (LS-MPGA) geliştirmiştir. Benzer şekilde Bektur ve Sarac [29], hazırlık süreli değiştirilmiş görünür gecikme maliyeti (ATCS) dağıtım kurallarından elde edilen başlangıç çözümünü kullanan benzetimli tavlama ve Tabu Arama olmak üzere iki sezgisel yöntem önermektedir. Farmand vd. [37], özdeş paralel tezgahlar ve tedarik zinciri entegrasyonu problemi için MOPSO ve NSGA-II gibi meta-sezgisel algoritmaları benimsemiştir. Son olarak Krim vd. [39] ise farklı komşuluk yapıları ve çözüm uzaylarından yararlanan, tabu arama tabanlı iki yeni meta-sezgisel yöntem önermektedir.

Paralel tezgah çizelgeleme konusundaki ilgili literatüre genel bir bakış Tablo 1'de sunulmaktadır.

**[BURAYA TABLO 1 GÖRSELİ EKLENECEK - A summary of relevant research work]**

Tablo 1'e göre, hiçbir araştırma, tezgah ve sıra-bağımlı hazırlık sürelerine sahip ilişkisiz paralel tezgah üretim sistemlerinde yayılma süresi, toplam teslim gecikmesi süresi ve geciken iş sayısı çoklu amaç fonksiyonlarına sahip bir çizelgeleme problemini incelememiştir. Bu araştırma boşluğundan motive olan bu çalışma, aşağıdaki hususları ele almayı amaçlamaktadır:
* Yayılma süresi, toplam teslim gecikmesi süresi ve geciken iş sayısı arasındaki en iyi ödünleşimleri (trade-offs) temsil eden Pareto çözümlerini sağlayabilen çok amaçlı bir MILP modelinin formülasyonu.
* Pratik bir problemden uyarlanan sayısal bir deney vasıtasıyla MILP modelinin kapasitesinin ve sınırlarının incelenmesi.
* Matematiksel modele ek olarak, farklı dinamik dağıtım kuralı tabanlı sezgisel yöntemlerin (DDR) önerilmesi, oluşturulması ve denenmesi. Buradaki amaç, makul bir süre içinde yüksek kaliteli çözümler bulabilen alternatif bir yaklaşım sunmaktır. Bu durum, özellikle ilişkisiz paralel tezgah sistemlerine sahip olan endüstrilerin, iyi üretim çizelgeleri oluşturmak için minimum zaman harcayan bir çizelgeleme yöntemine duyduğu ihtiyaçla örtüşmektedir.
* Bildiğimiz kadarıyla, ATCS dağıtım kuralında sıra-bağımlı hazırlık süresini dâhil eden Bektur ve Sarac [29] tarafından yapılmış önceki tek bir çalışma bulunmaktadır. Sadece bir tek dağıtım kuralı oluşturmak yerine, bizim çalışmamız pratikte yaygın olarak uygulanan üç farklı kuralı modifiye etmektedir.

> **(Ek Not: Literatürdeki Modelleme Yaklaşımlarının Özeti)**
> *(Derse Not: Makalede bahsi geçen kritik iki çalışmanın modelleme yaklaşımlarının netleştirilmesi)*
> 1. **Avalos-Rosales vd. (2015):** Bu çalışma (Makalenin M1 modelinin temeli), hazırlık sürelerinin hem tezgaha hem de sıraya bağlı olduğu ilişkisiz paralel tezgah problemini ele alır. Yayılma süresini (Makespan) minimize etmek için saf bir MILP (Karışık Tamsayılı Doğrusal Programlama) kurgulamıştır. Büyük ölçekli problemleri çözmek için Genetik Algoritma (GA) ve Memetik Algoritma (MA) gibi popülasyon temelli meta-sezgisel yöntemler geliştirmişlerdir. Bizim çalışmamız ise bu modeli çok amaçlı hale (Gecikme süresi ve Geciken İş Sayısı dâhil) getirmiştir.
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

---

## 4. Dinamik Dağıtım Kuralı Tabanlı Sezgisel Yöntemler (Dynamic dispatching rule based heuristics)

Önceki bölümde sunulan MILP modelleri ile yalnızca küçük problem örnekleri çözülebildiği için, bu bölümde gerçek problemleri doğru bir şekilde temsil eden büyük ölçekli problem örneklerini çözmek üzere dinamik dağıtım kurallarını (dynamic dispatching rules) uygulayan sezgisel yöntemler (heuristics) geliştirilmiştir. Önerilen sezgisel yöntemlerimiz; en kısa işlem süresi (SPT), en uzun işlem süresi (LPT) ve en erken teslim tarihi (EDD) dahil olmak üzere yaygın olarak benimsenen dağıtım kurallarından yararlanmaktadır. Bu kurallar problemin karakteristiklerini, yani sıra- ve tezgah-bağımlı hazırlık sürelerini ve ilişkisiz paralel tezgahları dikkate alacak şekilde değiştirilmiştir. Değiştirilmiş kurallar sırasıyla SCT, SC-LPT ve SC-EDD olarak adlandırılmaktadır. Açıklamaları aşağıdaki gibidir:

**Notasyon (Notation):**
- $N_i$: Çizelgelenmiş işler kümesi (a set of scheduled jobs)
- $N_j$: Kalan işler kümesi, $N = N_i \cup N_j$ (a set of remaining jobs)
- $M_j$: $j$ işini işleyebilen tezgahlar kümesi (a set of machines that can process job $j$)
- $P_{j^*,k}$: Seçilen $j$ işinin $k$ tezgahındaki işlem süresi (saat)
- $S_{i,j^*,k}$: $k$ tezgahı seçilen $j$ işini işlemek üzere hazırlandığında ve önceki iş $i$ olduğunda gereken hazırlık süresi (saat)
- $D_{j^*}$: Seçilen $j$ işinin teslim tarihi (saat)
- $C_{j,k}$: $j$ işi $k$ tezgahında işlendiğinde tamamlanma zamanı (saat)

**SCT (En Kısa İş Tamamlanma Zamanı - shortest job completion time):** Bu kural, işlenecek bir sonraki $j \in N_j$ işini ve bu işi işleyecek $k \in M_j$ tezgahını, $j$ işinin tamamlanma zamanı minimize edilecek şekilde eşzamanlı olarak seçer; yani,
SCT: $\min_{j \in N_j, k \in M_j} (S_{i,j,k} + P_{j,k})$. Çoğu durumda, seçilen $k$ tezgahının $i$ işini ( $j$ işinin öncülünü) işlediğine dikkat edin. Bu durum, $j$ işinin $k$ tezgahındaki hazırlık süresi $S_{i,j,k}$'yi etkiler. Başka bir deyişle, seçilen $j$ işi en kısa işlem süresine sahip iş olmayabilir; bunun yerine, birleştirilmiş hazırlık ve işlem süreleri toplamı en kısa olan iş olabilir.

**SC-LPT (En Uzun İşlem Süresine Dayalı En Kısa İş Tamamlanma Zamanı - shortest job completion time based on the longest processing time):** Bu kural, ilk olarak en uzun işlem süresine sahip olan bir sonraki $j \in N_j$ işini seçer, örneğin $j^*$ işi. Sonra, $S_{i,j^*,k}$ hazırlık süresini dikkate alarak $j^*$ işini işleyecek $k \in M_{j^*}$ tezgahını seçer ki bu iş ve tezgah seçimi $j$ işi için en kısa tamamlanma zamanını versin. Diğer bir deyişle kural şu şekilde ifade edilir:
SC-LPT: $\min_{k \in M_{j^*}} (S_{i,j^*,k} + P_{j^*,k})$ şartıyla $[ P_{j^*,k} = \max_{j \in N_j, k \in M_j} P_{j,k} ]$.

**SC-EDD (En Erken Teslim Tarihine Dayalı En Kısa İş Tamamlanma Zamanı - shortest job completion time based on the earliest due date):** Bu kural, ilk olarak en erken teslim tarihine sahip olan bir sonraki $j \in N_j$ işini seçer, örneğin $j^*$ işi. Daha sonra, seçilen $k$ tezgahının bir önceki $i$ işini işlediği göz önüne alındığında, $j^*$ işi için en kısa tamamlanma zamanını verecek bir $k \in M_j$ tezgahı seçilir. Yani,
SC-EDD: $\min_{k \in M_{j^*}} (S_{i,j^*,k} + P_{j^*,k})$ şartıyla $[ D_{j^*} = \min_{j \in N_j, k \in M_j} D_j ]$.

Yukarıda bahsedilen kurallara ek olarak, altı adet kombine kural geliştirilmiştir. Her biri, belirlenmiş bir kural değiştirme zamanı (rule-switching time) $t_s$ ile ardışık (sequentially) olarak uygulanan bir çift kuraldan oluşur. Örneğin, [SC-EDD & SC-LPT: 200] kombine kuralı, önce SC-EDD kuralını kullanarak işleri çizer. En son çizelgelenen işin tamamlanma zamanı $t_s = 200$ saati aştığında, kalan tüm işler çizelgelenene kadar SC-LPT kuralını kullanmaya geçiş yapar. Altı kombine kural şunları içerir: [SCT & SC-LPT: $t_s$], [SC-LPT & SCT: $t_s$], [SCT & SC-EDD: $t_s$], [SC-EDD & SCT: $t_s$], [SC-LPT & SC-EDD: $t_s$] ve [SC-EDD & SC-LPT: $t_s$]. Her bir kuralın adımları şu şekilde ifade edilmektedir:

Şekil 1'deki çizime göre, algoritma ilk olarak $N_i = \{0\}, N_j = N$ ve parametreleri $P_{j,k}, S_{i,j,k}$ ve $D_j$ olarak ayarlar. Daha sonra, kukla işin tamamlanma zamanını $C_0 = 0$ olarak belirler ve tüm olası tezgahlardaki tüm işler için tamamlanma zamanını $C_{j,k} = P_{j,k}, \forall j \in N_j, \forall k \in M_j$ hesaplar. Sonrasında, algoritma Kural 1'i kullanmaya başlar. $j^*$ işi $k^*$ tezgahında planlandıktan sonra şunlar güncellenir: çizelgelenmiş işler listesi $N_i$ ve kalan işler listesi $N_j$. Ek olarak, $i = j^*$ olarak ayarlanır ve $k^*$ tezgahında işlenebilecek kalan tüm işlerin tamamlanma zamanları güncellenir; yani $C_{j,k^*} = S_{i,j,k^*} + P_{j,k^*}, \forall j \in N_j$, çünkü bu tezgahta işlenecek bir sonraki iş $i = j^*$ işini takip edecektir. Bundan sonra, tüm işlerin planlanıp planlanmadığı kontrol edilir, yani $N_j$ boş mu? Eğer durum buysa, algoritma durur. Aksi takdirde, planlanan işin maksimum tamamlanma zamanının ($C_{j,k}, \forall j \in N_i, \forall k \in M_j$) kural değiştirme zamanı $t_s$'yi aşıp aşmadığı kontrol edilir. Eğer aşmıyorsa, Kural 1 ile devam edilir. Aksi takdirde, Kural 2'ye geçilir ve kalan tüm işler planlanana kadar devam edilir. Yalnızca tek bir kural mevcut olduğunda, $t_s$'nin büyük bir değere ayarlandığına ve bunun da kural değişikliğine yol açmadığına dikkat edin. Algoritma Python programlama dili kullanılarak uygulanmıştır.

**[BURAYA ŞEKİL 1 GÖRSELİ EKLENECEK - Flow chart of the dynamic dispatching rule algorithm]**

**Sayısal Örnek (Numerical Example)**
Önceki bölümde geliştirilen dağıtım kurallarını göstermek için sayısal bir örnek sağlanmıştır. Sıra-bağımlı hazırlık süresine sahip iki ilişkisiz paralel tezgah tarafından işlenecek üç iş olduğunu varsayalım. Her işin işlem süreleri, hazırlık süreleri ve teslim tarihleri Tablo 2'de listelenmiştir. 1. ve 2. işler aynı iş ailesinde olduğundan, biri diğerini takip ettiğinde hazırlık süreleri nispeten kısadır. Öte yandan 3. iş, 1. ve 2. işlerden farklı bir iş ailesindendir; bu nedenle 1. veya 2. iş, 3. işi takip ettiğinde veya ondan önce geldiğinde hazırlık süreleri daha uzundur.
Tek bir dağıtım kuralının (SCT) adımları örnek olarak aşağıda açıklanırken, SC-LPT ve SC-EDD kullanımı adımları Ek A'da gösterilmiştir.

**[BURAYA TABLO 2 GÖRSELİ EKLENECEK - Numerical example data]**

**SCT:** Bu kural, iş tamamlanma zamanını temel kriter olarak dikkate alır. Kural, Tablo 3'te sunulduğu gibi ilerler.

**[BURAYA TABLO 3 GÖRSELİ EKLENECEK - Steps of SCT]**

Tablo 3'ten görüleceği üzere, Adım 1'de İş 1, 2. tezgah için en düşük tamamlanma zamanını sağlar. Bu nedenle, 6 saatlik bir tamamlanma zamanı ile seçilir. Adım 2'de, tezgah 2 üzerindeki 2. ve 3. işlerin hazırlık ve tamamlanma zamanları, daha önce tezgah 2'de planlanmış olan İş 1'i yansıtacak şekilde güncellenir. Bu, en iyi seçenek olarak 22 saatlik en düşük tamamlanma zamanı ile 2. işi 1. tezgahta planlama kararına yol açar. Adım 3'te İş 3'ün 1. tezgahtaki hazırlık zamanı ve tamamlanma zamanı güncellendikten sonra, İş 3, 31 saatlik bir tamamlanma zamanı veren 2. tezgahta işlenmek üzere seçilir. Bu çizelge 31 saatlik bir yayılma süresiyle (makespan), 2 saatlik bir toplam teslim gecikmesi süresiyle ve sadece 2. işin gecikmesiyle sonuçlanmıştır.

Sıradaki örnek olarak, SCT kuralı ile başlayan ve 5 saat sonra SC-LPT kuralına geçen kombine kurallardan biri olan [SCT & SC-LPT: $t_s = 5$] açıklanmıştır. Kural, Tablo 4'te sunulduğu gibi ilerler.

**[BURAYA TABLO 4 GÖRSELİ EKLENECEK - Steps of SCT & SC-LPT: $t_s= 5$]**

İlk olarak, Adım 1'de SCT kuralı kullanılarak, 6 saatlik tamamlanma süresi ile 2. tezgahta işlenmek üzere İş 1 seçilir. Akabinde Adım 2'de sezgisel yöntem SC-LPT'ye geçer; bu da 28 saatlik bir tamamlanma süresi ile 1. tezgahta işlenmek üzere İş 3'ü seçer. Son olarak Adım 3'te İş 2, 2. tezgahta işlenir ve bu da 22.5 saatlik bir tamamlanma zamanı sağlar. Bu kombine kural kullanılarak yayılma süresi 28 saat, toplam teslim gecikmesi süresi 2.5 saattir ve yalnızca 2. iş gecikmiştir.

Dört kuralın sayısal örnekteki performansı Tablo 5'te özetlenmiştir. Genel olarak, ilk üç dağıtım kuralı arasında SCT'nin bu örnekte en iyi performansı gösterdiği gözlemlenmiştir. Ayrıca, kombine kurallardan elde edilen çözümün toplam gecikmede 0.5 saatlik bir artış ödünleşimiyle yayılma süresini SCT kuralına kıyasla iyileştirebildiği görülmüştür. Bu, dağıtım kurallarını birleştirmenin potansiyel faydasını gösterir.

**[BURAYA TABLO 5 GÖRSELİ EKLENECEK - Summary of results from four rules]**

---

## 5. Hesaplamalı Çalışma (Computational study)
### 5.1. Küçük problem örnekleri (Small problem instances)
Bölüm 3'te açıklanan modeller ILOG CPLEX 20.1'de uygulanmıştır. Küçük problem örneklerinin çözülmesindeki amaç, problemi ve formüle edilen modelleri göstermenin yanı sıra, üç sistem performans ölçütüne göre problemlerin özelliklerini incelemektir. İlk hesaplamalı testimize dayanarak, üç tezgaha ve on işe kadar büyüklüğe sahip küçük problem örnekleri, problem hakkında fikir verebilir ve makul bir hesaplama süresi içinde çözülebilir. Küçük problem örneklerine ait veriler gerçek verilerin örnekleridir. Verilerin kaynağı, Tayland'daki en büyük çelik boru üreticisi olan endüstriyel bir kullanıcıdır. 1 ve 2 numaralı problem örnekleri nispeten düşük talepli üretim aylarından alınmış örnek veriler iken, 3 ve 4 numaralı problem örnekleri yüksek talepli üretim aylarındandır. Ayrıca, 1 ve 3 numaralı örnekler bazı tezgahlarda işlenebilen işleri içerirken, 2 ve 4 numaralı örnekler herhangi bir tezgahta işlenebilen işleri içerir. Problem örneği 1 aşağıda sunulmuştur ve diğer örnekler Ek'te (Appendix) verilmiştir.

**[BURAYA PARAMETRE MATRİSLERİ EKLENECEK - $P_{j,k}, D_j, NP_{j,k}, S_{i,j,1}, S_{i,j,2}, S_{i,j,3}$]**

Her bir model için karar değişkenlerinin, ikili değişkenlerin sayısı ve hesaplama süreleri Tablo 6'da listelenmiştir.

**[BURAYA TABLO 6 GÖRSELİ EKLENECEK - The decision variables, binary variables, and computational times]**

#### 5.1.1. Optimal çözümler (Optimal solutions)
P1 problem örneği için M1'den elde edilen optimal çözüm Tablo 7 ve Şekil 2'de sunulmaktadır. Ek B, M2 ve M3 için diğer optimal çözümleri sunar.

**[BURAYA TABLO 7 GÖRSELİ EKLENECEK - Completion time, due date, and tardiness of each job from minimizing the makespan]**

Şekil 2, on iş üzerinde çalışan üç tezgahı göstermektedir. Her tezgah bir işi ardışık olarak işler. Tezgah 1 sırasıyla 3, 6, 2, 7 ve 8 numaralı işlerle başlayarak beş işi işler. Tezgah 2 sırasıyla 10, 9, 5 ve 4 numaralı işlerle başlayarak dört işe hizmet verir. Son tezgah olan Tezgah 3 yalnızca 1 numaralı işi yürütür. Şekil 2 ayrıca hazırlık için toplam sürenin 18.5 saat olduğunu göstermektedir. Optimal yayılma süresi 71.93 saattir. Ayrıca, bu iki tezgah 8, 7, 2, 6, 4 ve 5 numaralı işleri teslim tarihinden sonra bitirmektedir. Toplam teslim gecikmesi süresi 197.75 saattir.

**[BURAYA ŞEKİL 2 GÖRSELİ EKLENECEK - Job sequence at each machine from minimizing the makespan]**

#### 5.1.2. Pareto çözümü (Pareto solution)
M4, toplam teslim gecikmesi süresinin ($T$) ve geciken iş sayısının ($L$) değerini sabitlerken yayılma süresini en aza indirerek uzlaşmacı (compromise) çözümleri bulmak için kullanılır. M1, M2 ve M3 için optimal çözümlerden bir ödeme tablosu (payoff table) oluşturmak gereklidir. P1 için ödeme tablosu Tablo 8'de sunulmuştur.

**[BURAYA TABLO 8 GÖRSELİ EKLENECEK - Payoff table for P1]**

Bu ödeme tablosu, M2'den elde edilen en düşük gecikmenin 11.23 saat ve M1'den elde edilen en yüksek gecikmenin 197.75 saat olduğunu göstermektedir. Geciken iş sayısının en yüksek değeri M1'den 6 ve en düşük değeri M3'ten 1'dir. Ödeme tablosundan, $L$'nin aralığı $[1, 2, 3, 4, 5, 6]$'dır. Daha sonra, gecikme aralığı $(197.75 - 11.23)/20 = 9.33$ adım boyutu ile 20 kılavuz noktasına ayarlanır. Dolayısıyla gecikme aralığı, $T = [11.23, 20.56, ..., 197.75]$ olur. M4, 126 kez çalıştırılarak çözüldükten sonra, üç performans ölçütünde de diğer çözümler tarafından baskılanmayan (non-dominated) dokuz Pareto çözümü elde edilmiştir. Tablo 9, Şekil 3'te gösterilen dört problem için optimal Pareto çözümleri kümesini göstermektedir.

**[BURAYA TABLO 9 GÖRSELİ EKLENECEK - Pareto solutions]**
**[BURAYA ŞEKİL 3 GÖRSELİ EKLENECEK - Pareto solutions of small problem instances]**

Şekil 3'ten görülebileceği üzere, belirli bir geciken iş sayısı verildiğinde, yayılma süresi arttıkça toplam teslim gecikmesi süresi azalmaktadır. Benzer şekilde, belirli bir toplam teslim gecikmesi süresi verildiğinde, geciken iş sayısı arttıkça yayılma süresi azalmıştır. Aynı gözlem, belirli bir yayılma süresi verildiğinde geciken iş sayısı ile toplam teslim gecikmesi süresi arasındaki ilişki için de yapılabilir.

Pareto çözümlerinin kalitesini değerlendirmek için, Tablo 10'da gösterildiği gibi dört problem örneği için hiperhacim (hypervolume) yüzdeleri hesaplanmıştır. AUGMECON yönteminden elde edilen Pareto çözümleri %74 (P3) ile %91 (P1) arasında değişmektedir.

**[BURAYA TABLO 10 GÖRSELİ EKLENECEK - Hypervolume of Pareto solutions]**

Pareto çözümleri arasından bir karar verici, her bir performans ölçütü için önem ağırlığını belirleyerek ve aşağıdaki gibi min-maks normalizasyonunu uygulayarak bir çözüm seçebilir:
$\tilde{x}_i = \frac{x_i - \min_i \{x_i\}}{\max_i \{x_i\} - \min_i \{x_i\}}$

Karar vericinin üç performans ölçütüne şu ağırlıkları atadığını varsayalım: $W_{C_{max}} = 0.5, W_T = 0.4, W_L = 0.1$.
P1 için minimum $C_{max}$ 71.93 ve maksimum $C_{max}$ 78.35, minimum $T$ 20.56, maksimum $T$ 57.86, minimum $L$ 1 ve maksimum $L$ 4'tür. Tüm Pareto çözüm performans ölçütleri, Tablo 11'de gösterildiği gibi toplam normalize edilmiş skoru elde etmek için normalize edilir ve ağırlıklandırılır. En düşük toplam normalize edilmiş skora sahip çözüm karar verici tarafından seçilir. P1 için, Tablo 9'da gösterildiği gibi $C_{max} = 72.14, T = 39.21$ ve $L = 3$ olan 6. Çözüm seçilir. P2, P3 ve P4'e aynı prosedürün uygulanmasıyla elde edilen seçilmiş çözümler Tablo 12'de sunulmaktadır.

**[BURAYA TABLO 11 GÖRSELİ EKLENECEK - The total normalized score of P1's Pareto solutions]**
**[BURAYA TABLO 12 GÖRSELİ EKLENECEK - The selected one solution of the set of Pareto solutions for the four problems]**

#### 5.1.3. Sezgisel yöntemlerin küçük problem örneklerindeki performansı (Performance of the heuristic methods on the small problem instances)
Sezgisel yöntemlerin performansı, bilinen Pareto çözümlerine sahip küçük problem örnekleri kullanılarak değerlendirilir. Sezgisel yöntemlerden bulunan en iyi çözüm, bulunan en iyi sezgisel çözüme en yakın Pareto çözümlerinden biriyle karşılaştırılır. Tablo 13, P1 için sonuçların bir karşılaştırmasını sunar. Örneğin, [SC-EDD & SC-LPT: 60]'tan elde edilen ilk sezgisel çözüm $L = 2, C_{max} = 106.59$ ve $T = 29.19$'a sahipti. En yakın Pareto çözümünün aynı $L$'ye sahip çözümler arasından seçildiğine dikkat edin; bu da $C_{max} = 75.41$ ve $T = 29.88$ olan bir çözümle sonuçlanır. $C_{max}$ ve $T$ için % fark (%off Pareto) sırasıyla %41.35 ve %-2.31'dir. Bu, sezgisel çözümün $C_{max}$ açısından seçilen Pareto çözümünden daha kötü olduğunu, ancak $T$ açısından Pareto çözümünden daha iyi performans gösterdiğini belirtir ki bu da sezgisel çözümün Pareto çözümünden aşağı kalmadığını ima eder. [SC-EDD & SC-LPT: 30]'dan elde edilen $L = 3, C_{max} = 81$ ve $T = 18.02$ olan ikinci sezgisel çözüm için de benzer argümanlar uygulanır. Ancak, $L = 4, C_{max} = 77.88$ ve $T = 41.78$ ile en iyi bulunan sezgisel çözüm, en yakın Pareto çözümünden daha düşüktür. P2, P3 ve P4 için sezgisel yöntemlerin sonuçları Ek C'de bulunabilir.

**[BURAYA TABLO 13 GÖRSELİ EKLENECEK - The solutions from heuristic methods and pareto, and %-Off Pareto solutions for P1]**

### 5.2. Büyük problem örnekleri (Large problem instances)
Büyük problem örnekleri, Ocak 2019'dan Haziran 2020'ye kadar 18 aylık gerçek üretim verileri kullanılarak oluşturulmuştur. Her problem örneği bir aylık üretim verisidir. Toplamda 413 ürün, 26 ürün ailesine ayrılmıştır. Bu ürünler; (1) aynı ailede kategorize edilen, yani kısa bir hazırlık süresi gerektiren farklı kalınlıklara, (2) çaplardaki değişime bağlı olarak orta düzeyde hazırlık süresi gerektiren farklı çaplara veya (3) farklı ailelerde sınıflandırılan, yani uzun bir hazırlık süresi gerektiren farklı şekillere (yuvarlak, dikdörtgen veya kare) sahip çelik borulardır. Aylık talep verileri 1359 ile 3639 sipariş arasında değişen müşteri siparişlerini içerir. Her sipariş en fazla 40 ürün içerir. Aynı ürünleri talep eden müşteri siparişleri aynı işte (job), yani üretim siparişlerinde birleştirilir. Ortalama olarak her ayki iş sayısı 244 ile 298 arasında değişmiştir.

Üretim hattında, her tezgahın işleyebileceği ürün aileleri ve üretim hızı açısından farklı yeteneklere sahip on ilişkisiz paralel tezgah bulunmaktadır. Aynı aileden ancak farklı kalınlıklardaki ürünlerin hazırlık süreleri 20 ile 40 dakika arasında değişmektedir. Ancak aynı aileden farklı çaplara sahip ürünler veya farklı ailelerden ürünler, iş sırasına bağlı olarak 3 ile 11 saat arasında değişen hazırlık süreleri gerektirmektedir; yani çapları değiştirmek, şekli değiştirmekten daha kısa bir hazırlık süresi gerektirir. Büyük örneklerin istatistiksel özeti Tablo 14'te sunulmaktadır.

**[BURAYA TABLO 14 GÖRSELİ EKLENECEK - Statistical summary of large problem instances]**

Önerilen sezgisel yöntemlerin çeşitli talep senaryolarındaki etkinliğini göstermek için birkaç aylık veri test edilmiştir. Doğal olarak, aylık talepte bazı dalgalanmalar vardır ve iş büyümesi nedeniyle zaman içinde talepte artan bir eğilim vardır (bkz. Şekil 4). Özellikle, 2019 Ekim ayı hariç, 2019 yılındaki aylık talep 2020 yılına göre daha düşüktür. İlginç bir şekilde, Covid-19 salgınına rağmen artan bir talep vardır. Talep senaryolarını karakterize etmek için problem örnekleri k-ortalama (k-mean) kümeleme yöntemi kullanılarak gruplandırılır. Analize dayanarak, 18 aylık talep verileri iki kümeye ayrılabilir: düşük talep ve yüksek talep. Küme sayısı, Tablo 15'te gösterildiği gibi en yüksek siluet (silhouette) skoruna göre seçilmiştir.

**[BURAYA ŞEKİL 4 GÖRSELİ EKLENECEK - 18-month demand]**
**[BURAYA TABLO 15 GÖRSELİ EKLENECEK - Silhouettes score]**

Her problem örneği, üç tekli dağıtım kuralı ve altı kural değiştirme süresi ile kombinasyon halinde altı kombine kural ile test edilmiştir. Bir ayda en fazla 25 çalışma günü, vardiya başına 8 saat, günde iki vardiya ve en fazla beş saat mesai vardır ve bu durum maksimum 525 üretim saatiyle sonuçlanır. Bu nedenle kural değiştirme süreleri, 200, 250, 300, 350, 400 ve 450 olmak üzere 50 saatlik adımlarla 200 ile 450 saat arasında ayarlanmıştır. Özetle, hesaplamalı deney (3 + 6 × 6) = 39 kuralı, 18 problem örneği ve yayılma süresi, gecikme ve geciken iş sayısı dahil olmak üzere üç performans ölçütü üzerinde test etmektedir.

#### 5.2.1. Tekli dağıtım kuralı sonuçları (Single dispatching rule results)
İlk olarak, üç tekli dağıtım kuralının ortalama performansı Tablo 16'da her iki talep senaryosu için raporlanmıştır. Varyans analizi (ANOVA) ve Tukey testi dahil olmak üzere istatistiksel analiz; bağımlı değişken (response) olarak ele alınan her performans ölçütü, deneysel faktörler olarak üç kural ve blok olarak talep senaryoları üzerinde gerçekleştirilmiştir. ANOVA'ya göre üç kuralın performansı istatistiksel olarak farklıdır. Ek olarak, Tukey karşılaştırma sonuçları, SCT ve SC-EDD kurallarının performansının üç ölçütün tümünde ve her iki talep senaryosunda SC-LPT kuralından istatistiksel olarak daha iyi olduğunu göstermektedir. Bu nedenle, SC-LPT sonraki analizlerden çıkarılmıştır. SCT ve SC-EDD için şunlar gözlemlenmiştir: (1) SCT yayılma süresi açısından istatistiksel olarak daha iyi sonuçlar vermektedir (beklendiği gibi), (2) SCT geciken iş sayısı açısından nispeten daha iyi sonuçlar vermektedir ve (3) SC-EDD düşük talep senaryosunda toplam teslim gecikmesi süresi açısından daha iyi sonuçlar verirken yüksek talep senaryosunda daha kötü sonuçlar vermektedir. Toplam teslim gecikmesi süresi ve geciken iş sayısı açısından bu iki kuralın performanslarının istatistiksel olarak farklı olmadığına dikkat ediniz.

**[BURAYA TABLO 16 GÖRSELİ EKLENECEK - Average performance measures of dispatching rules]**

#### 5.2.2. Kombine dağıtım kuralı sonuçları (Combined dispatching rule results)
Altı kombine kural için, kural değiştirme zamanının ve talep senaryolarının etkilerinin yanı sıra bunların etkileşimleri olabilir. Bu nedenle altı kombine kural, altı seviyeli kategorik bir faktör olarak ve kural değiştirme süresi de bir ortak değişken (covariate) olarak ele alınmıştır. İki talep senaryosuna ayrılmış 18 problem örneği, iki seviyeli başka bir faktör olarak ele alınır. Her performans ölçütü için regresyon modelleri, her bir talep senaryosu için etkili kural(lar)ı ve uygun kural değiştirme zamanını belirlemek üzere uydurulmuştur. Faktör etkilerini değerlendirmek için kullanılan istatistiksel analizin sonuçları Tablo 17–19'da gösterilmektedir.

**[BURAYA TABLO 17 GÖRSELİ EKLENECEK - ANOVA for makespan]**
**[BURAYA TABLO 18 GÖRSELİ EKLENECEK - Regression equations for makespan]**
**[BURAYA ŞEKİL 5 GÖRSELİ EKLENECEK - Regression models of different dispatching rules on the makespan]**

Tablo 17'den, üç faktörlü etkileşim anlamlı olduğu için, dağıtım kurallarının yayılma süresi (makespan) üzerindeki etkisinin açıkça kural değiştirme zamanına ve talep senaryolarına bağlı olduğu görülmektedir. Bir talep senaryosunda her kural için yayılma süresi ve kural değiştirme süresi arasındaki ilişki Tablo 18'de gösterilmiş ve Şekil 5'te çizilmiştir. Şekil 5'ten, yayılma süresini azaltmak için etkili kurallar yüksek talep senaryosu için [SCT & SC-LPT: 450] ve düşük talep senaryosu için [SCT & SC-EDD: 450], [SCT & SC-LPT: 450]'dir. Bu kuralların, diğer kurallara geçmeden önce bir aydaki üretim süresinin çok daha büyük bir bölümünde SCT'yi kullandığını unutmayın.

Toplam teslim gecikmesi süresi ve geciken iş sayısı üzerinde de benzer bir analiz gerçekleştirilmiştir. ANOVA sonuçlarına göre dağıtım kuralı, kural değiştirme süresi ve talep senaryosunun üç faktörlü etkileşimi her iki tepki için de anlamlıdır. Üç performans ölçütünün analizine dayanarak, iki talep senaryosu altındaki tümü için etkili kurallar Tablo 19'da özetlenmiştir. 36 olası kural (altı kombine kural ve altı kural değiştirme süresi) arasında üç etkili kombine kural vardır: (1) her iki talep senaryosunda yayılma süresi ve geciken iş sayısı için [SCT & SC-LPT: 450]; (2) düşük talepte yayılma süresi, yüksek talepte toplam teslim gecikmesi süresi ve her iki talep senaryosunda geciken iş sayısı için [SCT & SC-EDD: 450]; ve (3) düşük talepte toplam teslim gecikmesi süresi ve her iki talep senaryosunda geciken iş sayısı için [SC-EDD & SCT: 200].

**[BURAYA TABLO 19 GÖRSELİ EKLENECEK - Effective combined dispatching rules]**

### 5.3. Çoklu performans ölçütleri altında dağıtım kuralı seçimi (Selection of dispatching rule under multiple measures of performance)
Etkili dağıtım kuralları (iki tekli ve üç kombine kural) ve bunların üç ölçüt üzerindeki performansları Tablo 20'de özetlenmiştir. Dağıtım kurallarının seçimi çok kriterli bir karar verme (multi-criteria decision-making) problemi haline gelmektedir. Daha yakından bakıldığında bazı kuralların etkili olmalarına rağmen diğerlerinden daha düşük olduğu görülmektedir. Spesifik olarak, yüksek talep altında, [SCT & SC-LPT: 450] her üç ölçütte de SCT tarafından geride bırakılır. Bu nedenle, [SCT & SC-LPT: 450] yüksek talep altında daha fazla analiz edilmek üzere elenmiştir. Sonuç olarak, yüksek talep senaryosu için geriye dört kural kalmaktadır. Benzer şekilde, düşük talep altında SCT ve [SCT & SC-LPT: 450], [SCT & SC-EDD: 450] tarafından elenir ve SC-EDD, [SC-EDD & SCT: 200] tarafından elenir. Başka bir deyişle, düşük talep altında değerlendirilmesi gereken sadece iki kural vardır: [SC-EDD & SCT: 200] ve [SCT & SC-EDD: 450].

**[BURAYA TABLO 20 GÖRSELİ EKLENECEK - Effective dispatching rules]**

Çok kriterli karar verme probleminde, her ölçüte atanan önem ağırlığı (weight of importance) kural seçim sürecinde kritiktir. Bu ağırlıklar genellikle bir karar verici (DM) tarafından belirlense de, biz üç ağırlığın kapsamlı hesaplamaları altında kural seçimi analizi yapmayı tercih ettik. Amaç, ölçütlere atanan göreceli ağırlıklar ile belirtilen ve her bir dağıtım kuralının en etkili olduğu koşulları elde etmektir. Yayılma süresi, toplam teslim gecikmesi süresi ve geciken iş sayısı için ağırlıklar sırasıyla $w_C, w_T$ ve $w_L$ ile gösterilmektedir. Bunların değerleri, ağırlıkların toplamının 1 olması şartıyla ($w_C + w_T + w_L = 1$) 0.01 ile 0.98 arasında değiştirilmektedir ($w_C, w_T, w_L \in [0.01, 0.98]$). Üç ölçüt de sayısal (numerical) olduğundan, ideal çözüme benzerliğe göre sıralama tercihi tekniği (TOPSIS) uygun bir seçim yöntemidir. Bu çalışmada uygulanan TOPSIS adımları aşağıda açıklanmıştır [45].

**Adım 1:** $a$ dağıtım kuralı ve $b$ performans ölçütü için $x_{ab}$ performans ölçütü matrisini oluşturun. Problemimiz için her üç ölçüt de maliyet (cost) niteliği olarak kabul edilmiştir; $x_{ab}$ değeri ne kadar düşükse, performans o kadar iyidir.
**Adım 2:** $x_{ab}$'nin normalize edilmiş değeri olarak $r_{ab} = \frac{\tilde{x}_b}{x_{ab}}$ hesaplayın, burada $\tilde{x}_b = \min_a\{x_{ab}\}$'dir. Normalizasyondan sonra $r_{ab}$ değeri ne kadar yüksekse performans o kadar iyidir.
**Adım 3:** Her bir performans ölçütü için pozitif ideal çözüm ($v^+_b$) ve negatif ideal çözüm ($v^-_b$) bulun; burada $v^+_b = \max_a\{r_{ab}\}$ ve $v^-_b = \min_a\{r_{ab}\}$'dir.
**Adım 4:** Her bir dağıtım kuralı $a$ için ayrılma ölçülerini (separate measures) hesaplayın. Pozitif ideal çözümden ayrılma ölçüleri $S^+_a = \sqrt{\sum_b w_b (r_{ab} - v^+_b)^2}$ ve negatif ideal çözümden $S^-_a = \sqrt{\sum_b w_b (r_{ab} - v^-_b)^2}$ olarak hesaplanır.
**Adım 5:** Dağıtım kuralı $a$ için ideal çözüme göreceli yakınlığı (relative closeness) $C^*_a = \frac{S^-_a}{S^+_a + S^-_a}$ hesaplayın. Göreceli yakınlık ne kadar büyükse performans o kadar iyidir.

Düşük talep senaryosu için $w_C = 0.36, w_T = 0.3$ ve $w_L = 0.34$ ağırlıkları ile [SC-EDD & SCT: 200] ve [SCT & SC-EDD: 450] olmak üzere iki kuralı karşılaştırmak için sayısal bir örnek kullanılmıştır. $a=1$'in [SC-EDD & SCT: 200]'ü, $a=2$'nin [SCT & SC-EDD: 450]'yi; $b=1, 2$ ve 3'ün sırasıyla yayılma süresi, toplam teslim gecikmesi süresi ve geciken iş sayısını ifade ettiğini unutmayın. Hesaplama sonuçları Tablo 21'de sunulmaktadır. Tablodan anlaşılacağı üzere [SC-EDD & SCT: 200] daha etkilidir.

**[BURAYA TABLO 21 GÖRSELİ EKLENECEK - Numerical example for TOPSIS]**

TOPSIS'in birçok ağırlık kombinasyonu için tekrarlanmasının ardından, her bir dağıtım kuralının en etkili olması için gereken koşullar şu şekildedir:

**Düşük talep senaryosu:** Değerlendirilecek iki kural vardır: minimum toplam teslim gecikmesi süresi ve minimum geciken iş sayısını veren [SC-EDD & SCT: 200] ve minimum yayılma süresini veren [SCT & SC-EDD: 450]. [SCT & SC-EDD: 450] aşağıdaki koşullar altında en etkilidir:
1. $w_C \geq 0.88, w_T = 0.04$ ve $w_L \leq 0.08$
2. $w_C \geq 0.70, w_T = 0.03$ ve $w_L \leq 0.27$
3. $w_C \geq 0.53, w_T = 0.02$ ve $w_L \leq 0.45$
4. $w_C \geq 0.36, w_T = 0.01$ ve $w_L \leq 0.63$
Aksi takdirde, [SC-EDD & SCT: 200] en etkili kuraldır.

Bu koşullar, karar verici (DM) toplam teslim gecikmesi süresine çok az önem verdiğinde [SCT & SC-EDD: 450]'nin en etkili olduğunu göstermektedir. Diğer bir deyişle, $w_T \geq 0.05$ olduğunda [SC-EDD & SCT: 200] baskındır. Ek olarak, DM toplam gecikmeye çok az ağırlık verse bile, dört koşula göre [SCT & SC-EDD: 450]'nin daha etkili kural olabilmesi için yayılma süresine yeterince ağırlık vermelidir.

**Yüksek talep senaryosu:** Değerlendirilen dört kural için (SCT, SC-EDD, [SCT & SC-EDD: 450] ve [SC-EDD & SCT: 200]). Koşullar şunlardır:
SCT; yayılma süresi veya geciken iş sayısının önem ağırlıkları açısından baskın olduğu $0.22 \leq w_C \leq 0.98$, $w_T = 0.01$ ve $0.01 \leq w_L \leq 0.77$ koşulları altında en etkilidir.
[SC-EDD & SCT: 200] aşağıdaki koşullar altında en etkilidir: Bu koşullar, yayılma süresinin ağırlığının %29'a kadar ve toplam teslim gecikmesi süresinin ağırlığının nispeten küçük (%7'ye kadar) olduğu çeşitli durumlar için geçerlidir.
1. $0.01 \leq w_C \leq 0.07, 0.01 \leq w_T \leq 0.07, 0.86 \leq w_L \leq 0.98$ ve $(w_T - w_C) \leq 0.03$
2. $0.08 \leq w_C \leq 0.09, 0.01 \leq w_T \leq 0.06$ ve $0.85 \leq w_L \leq 0.91$
3. $0.10 \leq w_C \leq 0.12, 0.01 \leq w_T \leq 0.05$ ve $0.83 \leq w_L \leq 0.89$
4. $0.13 \leq w_C \leq 0.16, 0.01 \leq w_T \leq 0.04$ ve $0.80 \leq w_L \leq 0.86$
5. $0.17 \leq w_C \leq 0.21, 0.01 \leq w_T \leq 0.03$ ve $0.76 \leq w_L \leq 0.82$
6. $0.22 \leq w_C \leq 0.29, w_T = 0.02$ ve $0.69 \leq w_L \leq 0.76$
[SCT & SC-EDD: 450] aşağıda listelenen dört koşul altında en etkilidir. Bu koşullar, toplam teslim gecikmesi süresi ağırlığının %50'ye kadar olduğu durumları gösterir.
1. $w_C \geq 0.49, w_T \geq 0.02$ ve $w_L \leq 0.49$
2. $0.30 \leq w_C \leq 0.48, 0.02 \leq w_T \leq 0.50, 0.02 \leq w_L \leq 0.68$ ve $(w_T - w_C) \leq 0.02$
3. $0.24 \leq w_C \leq 0.29, 0.03 \leq w_T \leq 0.31, 0.40 \leq w_L \leq 0.73$ ve $(w_T - w_C) \leq 0.03$
4. $0.07 \leq w_C \leq 0.23, 0.03 \leq w_T \leq 0.24, 0.53 \leq w_L \leq 0.85$ ve $(w_T - w_C) \leq 0.01$
Aksi takdirde, toplam teslim gecikmesi süresinin ağırlığı %50'den büyük olduğunda SC-EDD etkilidir.

### 5.4. Tartışma (Discussion)
Bu araştırmanın bulguları, özellikle tezgah ve iş sırası bağımlı hazırlık sürelerine sahip ilişkisiz paralel tezgahlar bağlamında üretim çizelgeleme araştırma alanına katkılar sağlamaktadır. Sonuçlar, üretim ortamlarındaki çizelgeleme sorunlarının karmaşıklığını vurgulayan önceki araştırmalarla uyumludur. Paralel tezgahların özdeş (identical), tek tip (uniform) ve ilişkisiz (unrelated) kategorilerine ayrılması literatürde iyi bir şekilde belgelenmiştir [1-3]. Bu yaklaşım, daha az sıklıkla araştırılmış olan, tezgah ve iş sırasına bağlı kurulumların oluşturduğu zorlukları spesifik olarak ele alarak bu temel üzerine inşa edilmiştir.

Değiştirilmiş dağıtım kurallarının, yani SPT, EDD ve LPT'nin performansı, geleneksel yöntemlere göre net bir fayda sağlamaktadır. Önceki çalışmalar bu kuralların belirli koşullar altında etkili çizelgeleme çözümleri sağlayabileceğini göstermiştir [4,5]. Araştırmamız tezgah ve iş sırasına bağlı hazırlık sürelerini dâhil ederek bu anlayışı genişletmekte ve dolayısıyla bu kuralların gerçek dünyadaki senaryolara uygulanabilirliğini artırmaktadır. Dahası, ANOVA ve Tukey testi dahil olmak üzere yürütülen istatistiksel analiz; çeşitli performans ölçütleri ve talep senaryoları genelinde SCT ve SC-EDD kurallarının performansının SC-LPT kuralından daha üstün olduğunu doğrulamaktadır. Bu bulgu, spesifik operasyonel bağlamlara dayalı kural seçiminin önemini öne süren önceki çalışmalarla tutarlıdır [6]. Dağıtım kurallarını her bir çizelgeleme probleminin benzersiz özelliklerine uyarlama yeteneği, üretim verimliliğini artırmak için çok önemlidir.

Çok kriterli karar verme analizi, farklı performans ölçütlerinin karar vericinin tercihine göre nasıl önceliklendirilebileceğini göstererek bu bulguları daha da zenginleştirmektedir. Araştırmanın bu yönü, yayılma süresi, gecikme ve iş tamamlanma zamanlarının göreceli öneminin üretim ortamına bağlı olarak önemli ölçüde değişebildiği, özel (tailored) bir çizelgeleme yaklaşımını destekleyen literatürle rezonansa girmektedir [9]. Bu çalışma, [SCT & SC-LPT] ve [SCT & SC-EDD] gibi kombine dağıtım kurallarının, tek kurallı yaklaşımlara kıyasla daha iyi yayılma süresi ve kabul edilebilir gecikme ile sonuçlanan esnek ve sağlam stratejiler sunduğunu vurgulamaktadır.

### 5.5. Araştırmanın etkileri (Research implication)
Araştırma bulgularının üretim çizelgelemesindeki pratik uygulamalara, özellikle de endüstriyel kullanıcılara yönelik etkileri aşağıdaki gibidir.
İlk olarak, makine ve iş sırasına bağlı hazırlık sürelerini dikkate alan değiştirilmiş dağıtım kurallarının geliştirilmesi, üretim süreçlerini optimize etmek için değerli bir çerçeve sağlar. Endüstriyel kullanıcılar, çizelgeleme verimliliklerini artırmak, boşta kalma sürelerinin (idle times) azalmasını ve makine kullanımının (machine utilization) iyileşmesini sağlamak için bu özel kuralları uygulayabilirler. Kurulum sürelerini en aza indirerek ve iş dizilerini etkili bir şekilde yöneterek üreticiler daha yüksek verim (throughput) elde edebilir ve üretim hedeflerine daha iyi ulaşabilirler.
İkinci olarak, çok kriterli karar verme analizinin uygulanması, karar vericilerin çizelgeleme çözümlerini değerlendirirken çoklu performans ölçütlerini dikkate alma gerekliliğinin altını çizmektedir. Endüstriyel kullanıcılar genellikle, gecikmeyi azaltırken yayılma süresini en aza indirmek gibi rekabet halindeki sistem ölçütleriyle karşılaşırlar. Bu araştırma, çizelgelemeye bütüncül (holistic) bir yaklaşım sağlayarak belirli operasyonel hedeflere dayalı çeşitli performans ölçütlerinin dengelenmesine izin vermektedir. Bu esneklik, zamanında teslimatlar sayesinde artan müşteri memnuniyetine ve gelişmiş genel operasyonel performansa yol açabilir.
Üçüncü olarak bulgular, çizelgeleme sistemlerinde uyarlanabilirliğin önemini vurgulamaktadır. Endüstriler talep dalgalanmaları ve üretim gereksinimlerindeki değişikliklerle giderek daha fazla karşılaştıkça, zamanlama stratejilerini ayarlama yeteneği hayati hale gelmektedir. Önerilen sezgisel yöntemler ve dağıtım kuralları, farklı üretim talebi senaryolarına uyum sağlayacak şekilde kolayca değiştirilebilir ve böylece üreticilerin pazar değişikliklerine hızla yanıt vermesini sağlayabilir. Bu uyarlanabilirlik yalnızca operasyonel dayanıklılığı (operational resilience) artırmakla kalmaz, aynı zamanda şirketleri yeni ortaya çıkan fırsatlardan yararlanacak şekilde konumlandırır.
Son olarak araştırma, çeşitli sezgisel ve optimizasyon tekniklerinin güçlü yönlerini birleştiren hibrit çizelgeleme yaklaşımlarının daha fazla araştırılması için bir temel sağlamaktadır. Endüstriyel kullanıcılar, gelişmiş çizelgeleme algoritmalarını mevcut sistemlerine entegre etmekten, böylece daha sofistike karar verme süreçlerine ve gelişmiş üretim planlamasına sahip olmaktan fayda sağlayabilirler.

---

## 6. Sonuç (Conclusion)
Bu çalışma, sıra ve tezgaha bağlı hazırlık sürelerine sahip ilişkisiz paralel tezgah çizelgeleme problemini içermektedir. Yayılma süresi (makespan), toplam teslim gecikmesi süresi (total tardiness) ve geciken iş sayısı (number of tardy jobs) dahil olmak üzere üç sistem performans ölçütü dikkate alınmıştır. Küçük problem örnekleri için, AUGMECON yönteminin uygulanmasıyla Pareto çözümlerinin yanı sıra optimal çözümleri bulmak için MILP modelleri formüle edilmiştir. Büyük problem örnekleri için, sıra ve tezgaha bağlı hazırlık sürelerini dikkate alan dağıtım kuralı tabanlı sezgisel yöntemler geliştirilmiştir. Bunlar SCT, SC-LPT, SC-EDD ve bu kuralların altı kombinasyonunu içerir. Kombine kurallar için, uygun kural değiştirme süresi (rule-switching time) hesaplamalı deneyler aracılığıyla belirlenir.

Sezgisel yöntemler endüstriden alınan aylık talebe ait 18 veri seti kullanılarak test edilmiştir. Sonuçlar yüksek talep senaryosunda, yayılma süresi, toplam teslim gecikmesi süresi ve geciken iş sayısı için en iyi dağıtım kuralının sırasıyla SCT, SC-EDD ve [SCT & SC-EDD: 450] olduğunu göstermektedir. Düşük talep senaryosu için, yayılma süresi açısından en iyi kural [SCT & SC-EDD: 450] iken, [SC-EDD & SCT: 200] hem toplam teslim gecikmesi süresi hem de geciken iş sayısı için en etkilidir. Uygulamada, karar vericiler performans ölçütlerine göreceli olarak birden fazla önem ağırlığı atayabilir, bu da hangi kuralın kullanılması gerektiğini belirler. Karar vericinin (DM) bir kuralı diğerlerine tercih ettiği bir dizi koşulu belirlemek için ağırlıkların tam bir sayımını gerçekleştiriyoruz.

Bu araştırmadaki sonuç, gelecekteki çeşitli araştırma yönleri için bir basamak niteliğindedir. Bunlardan biri, yeni dağıtım kuralları geliştirmek veya problemi, her bir operasyonda ilişkisiz paralel tezgahların bulunduğu sıralı (in sequence) çoklu operasyonlara genişletmektir. Ayrıca performansı daha da artırmak için dağıtım kuralları, büyük problem örnekleri için Pareto cephesinde çözümler üreten bir meta-sezgisel algoritmanın parçası olarak da uygulanabilir.

---

### Finansman (Funding)
Bu çalışma Thammasat Üniversitesi Araştırma Fonu tarafından desteklenmektedir [Sözleşme Numarası: TUFT 85/2566].

### Çıkar Çatışması Beyanı (Declaration of competing interest)
Yazarlar, bu makalede bildirilen çalışmayı etkilemiş gibi görünebilecek bilinen hiçbir rekabetçi finansal çıkarları veya kişisel ilişkileri olmadığını beyan ederler.

### Ek A. Tamamlayıcı veriler (Appendix A. Supplementary data)
Bu makaleyle ilgili tamamlayıcı materyaller https://doi.org/10.1016/j.dajour.2024.100525 adresinde çevrimiçi olarak bulunabilir.

### Veri Bulunabilirliği (Data availability)
Veriler talep üzerine sağlanacaktır.

---

### Referanslar (References)
*(Derse Not: Tüm atıflar için makalenin mevcut formatındaki numaralandırılmış sistem korunmuştur)*

[1] O. Avalos-Rosales, F. Angel-Bello, A. Alvarez, Efficient metaheuristic algorithm and re-formulations for the unrelated parallel machine scheduling problem with sequence and machine-dependent setup times, Int. J. Adv. Manuf. Technol. 76 (9) (2015) 1705–1718.
[2] L. Ghalami, D. Grosu, Scheduling parallel identical machines to minimize makespan: A parallel approximation algorithm, J. Parallel Distrib. Comput. 133 (2019) 221–231.
[3] M.Y. Kim, Y.H. Lee, MIP models and hybrid algorithm for minimizing the makespan of parallel machines scheduling problem with a single server, Comput. Oper. Res. 39 (11) (2012) 2457–2468.
[4] M.K. Omar, S.C. Teo, Minimizing the sum of earliness/tardiness in identical parallel machines schedule with incompatible job families: An improved MIP approach, Appl. Math. Comput. 181 (2) (2006) 1008–1017.
[5] B.E. Anderson, J.D. Blocher, K.M. Bretthauer, M.A. Venkataramanan, An efficient network-based formulation for sequence dependent setup scheduling on parallel identical machines, Math. Comput. Modelling 57 (3–4) (2013) 483–493.
[6] A. Hamzadayi, G. Yildiz, Modeling and solving static m identical parallel machines scheduling problem with a common server and sequence dependent setup times, Comput. Ind. Eng. 106 (2017) 287–298.
[7] E.A. Ozer, T. Sarac, MIP models and a matheuristic algorithm for an identical parallel machine scheduling problem under multiple copies of shared resources constraints, TOP 27 (1) (2019) 94–124.
[8] L. Epstein, Parallel solutions for preemptive makespan scheduling on two identical machines, J. Sched. (2022) 1–16.
[9] G.H. Wu, P. Pourhejazy, W.X. Li, T.H. Wu, A new dispatching mechanism for parallel-machine scheduling with different efficiencies and sequence-dependent setup times, Decis. Anal. J. 10 (2024) 100432.
[10] K. Li, W. Xiao, S. Yang, Minimizing total tardiness on two uniform parallel machines considering a cost constraint, Expert Syst. Appl. 123 (2019) 143–153.
[11] A. Zandi, R. Ramezanian, L. Monplaisir, Green parallel machines scheduling problem: A bi-objective model and a heuristic algorithm to obtain Pareto frontier, J. Oper. Res. Soc. 71 (6) (2020) 967–978.
[12] R. Logendran, B. McDonell, B. Smucker, Scheduling unrelated parallel machines with sequence-dependent setups, Comput. Oper. Res. 34 (11) (2007) 3420–3438.
[13] Y.K. Lin, J.W. Fowler, M.E. Pfund, Multiple-objective heuristics for scheduling unrelated parallel machines, European J. Oper. Res. 227 (2) (2013) 239–253.
[14] M. Ghirardi, C.N. Potts, Makespan minimization for scheduling unrelated parallel machines: A recovering beam search approach, European J. Oper. Res. 165 (2) (2005) 457–467.
[15] S.W. Lin, K.C. Ying, A multi-point simulated annealing heuristic for solving multiple objective unrelated parallel machine scheduling problems, Int. J. Prod. Res. 53 (4) (2015) 1065–1076.
[16] C.Y. Cheng, L.W. Huang, Minimizing total earliness and tardiness through unrelated parallel machine scheduling using distributed release time control, J. Manuf. Syst. 42 (2017) 1–10.
[17] X. Xiong, P. Zhou, Y. Yin, T.C.E. Cheng, D. Li, An exact branch-and-price algorithm for multitasking scheduling on unrelated parallel machines, Naval Res. Logist. 66 (6) (2019) 502–516.
[18] L.H. Su, M.C. Hsiao, H. Zhou, F.D. Chou, Minimizing the number of tardy jobs on unrelated parallel machines with dirt consideration, J. Ind. Prod. Eng. 35 (6) (2018) 383–393.
[19] M.A. Bajestani, R. Tavakkoli-Moghaddam, A new branch-and-bound algorithm for the unrelated parallel machine scheduling problem with sequence-dependent setup times, IFAC Proc. Vol. 42 (4) (2009) 792–797.
[20] J.E.C. Arroyo, J.Y.T. Leung, R.G. Tavares, An iterated greedy algorithm for total flow time minimization in unrelated parallel batch machines with unequal job release times, Eng. Appl. Artif. Intell. 77 (2019) 239–254.
[21] A.J. Soper, V.A. Strusevich, Preemptive and non-preemptive scheduling on two unrelated parallel machines, J. Sched. 25 (6) (2022) 659–674.
[22] A. Allahverdi, The third comprehensive survey on scheduling problems with setup times/costs, European J. Oper. Res. 246 (2) (2015) 345–378.
[23] Y.K. Lin, M.E. Pfund, J.W. Fowler, Heuristics for minimizing regular performance measures in unrelated parallel machine scheduling problems, Comput. Oper. Res. 38 (6) (2011) 901–916.
[24] M. Moser, N. Musliu, A. Schaerf, F. Winter, Exact and metaheuristic approaches for unrelated parallel machine scheduling, J. Sched. 25 (5) (2022) 507–534.
[25] C.C. Chyu, W.S. Chang, A Pareto evolutionary algorithm approach to bi-objective unrelated parallel machine scheduling problems, Int. J. Adv. Manuf. Technol. 49 (2010) 697–708.
[26] S.A. Torabi, N. Sahebjamnia, S.A. Mansouri, M.A. Bajestani, A particle swarm optimization for a fuzzy multi-objective unrelated parallel machines scheduling problem, Appl. Soft Comput. 13 (12) (2013) 4750–4762.
[27] M. Nikabadi, R. Naderi, A hybrid algorithm for unrelated parallel machines scheduling, Int. J. Ind. Eng. Comput. 7 (4) (2016) 681–702.
[28] H. Wang, B. Alidaee, Unrelated parallel machine selection and job scheduling with the objective of minimizing total workload and machine fixed costs, IEEE Trans. Autom. Sci. Eng. 15 (4) (2018) 1955–1963.
[29] G. Bektur, T. Saraç, A mathematical model and heuristic algorithms for an unrelated parallel machine scheduling problem with sequence-dependent setup times, machine eligibility restrictions and a common server, Comput. Oper. Res. 103 (2019) 46–63.
[30] J.C. Yepes-Borrero, F. Perea, R. Ruiz, F. Villa, Bi-objective parallel machine scheduling with additional resources during setups, European J. Oper. Res. 292 (2) (2021) 443–455.
[31] A.E. Ezugwu, Enhanced symbiotic organisms search algorithm for unrelated parallel machines manufacturing scheduling with setup times, Knowl.-Based Syst. 172 (2019) 15–32.
[32] M. Mirmozaffari, S.M. Hejazi, N. Karamizadeh, A. Montazeri, A mixed-integer non-linear no-wait open-shop scheduling model for minimizing makespan and total tardiness in manufacturing, Decis. Anal. J. 10 (2024) 100403.
[33] S. Nessari, R. Tavakkoli-Moghaddam, H. Bakhshi-Khaniki, A. Bozorgi-Amiri, A hybrid simheuristic algorithm for solving bi-objective stochastic flexible job shop scheduling problems, Decis. Anal. J. (2024) 100485.
[34] E.V. Shchepin, N. Vakhania, An optimal rounding gives a better approximation for scheduling unrelated machines, Oper. Res. Lett. 33 (2) (2005) 127–133.
[35] M. Lee, K. Lee, M. Pinedo, Tight approximation bounds for the LPT rule applied to identical parallel machines with small jobs, J. Sched. 25 (6) (2022) 721–740.
[36] Y. Yin, Y. Chen, K. Qin, D. Wang, Two-agent scheduling on unrelated parallel machines with total completion time and weighted number of tardy jobs criteria, J. Sched. 22 (3) (2019) 315–333.
[37] N. Farmand, H. Zarei, M. Rasti-Barzoki, Two meta-heuristic algorithms for optimizing a multi-objective supply chain scheduling problem in an identical parallel machines environment, Int. J. Ind. Eng. Comput. 12 (3) (2021) 249–272.
[38] Z. Pei, M. Wan, Z. Wang, A new approximation algorithm for unrelated parallel machine scheduling with release dates, Ann. Oper. Res. 285 (1) (2020) 397–425.
[39] H. Krim, N. Zufferey, J.Y. Potvin, R. Benmansour, D. Duvivier, Tabu search for a parallel-machine scheduling problem with periodic maintenance, job rejection and weighted sum of completion times, J. Sched. (2022) 1–17.
[40] P. Kongsri, J. Buddhakulsomsiri, A mixed integer programming model for unrelated parallel machine scheduling problem with sequence dependent setup time to minimize makespan and total tardiness, in: 2020 IEEE 7th International Conference on Industrial Engineering and Applications, ICIEA, IEEE, 2020, pp. 605–609.
[41] Y. Fallahpour, M. Rafiee, A. Elomri, V. Kayvanfar, A. El Omri, A multi-objective planning and scheduling model for elective and emergency cases in the operating room under uncertainty, Decis. Anal. J. 11 (2024) 100475.
[42] G. Mavrotas, Effective implementation of the $\epsilon$-constraint method in multi-objective mathematical programming problems, Appl. Math. Comput. 213 (2) (2009) 455–465.
[43] M. Momenitabar, Z.D. Ebrahimi, A. Abdollahi, W. Helmi, K. Bengtson, P. Ghasemi, An integrated machine learning and quantitative optimization method for designing sustainable bioethanol supply chain networks, Decis. Anal. J. 7 (2023) 100236.
[44] P.J. Rousseeuw, Silhouettes: a graphical aid to the interpretation and validation of cluster analysis, J. Comput. Appl. Math. 20 (1987) 53–65.
[45] H.S. Shih, H.J. Shyur, E.S. Lee, An extension of TOPSIS for group decision making, Math. Comput. Modelling 45 (7–8) (2007) 801–813.
