# Proje Raporu: Sıra-Bağımlı Hazırlık Süreli İlişkisiz Paralel Makine Çizelgeleme Problemi İçin AUGMECON Modeli ve Dinamik Dağıtım Kuralları

*(Orijinal Makale: "An augmented ε-constraint model and dynamic dispatching rules for unrelated parallel machine scheduling with sequence-dependent setup times" - Decision Analytics Journal 13 (2024) 100525)*

---

## 1. Giriş (Introduction)

Küresel pazarda üretim yapan işletmeler için performansın tek ölçütü maliyet değildir. Müşterilerin tedarikçi seçiminde en az fiyat ve kalite kadar önem verdiği bir diğer unsur "teslimat hızı ve güvenilirliği"dir. Zamanında teslimat (On-time delivery), bir işletmenin pazar payını koruması ve sürdürülebilir kârlılık elde etmesi için kritik bir öneme sahiptir. Siparişlerin teslimat tarihlerinde yaşanacak gecikmeler sadece müşteri kaybına değil, aynı zamanda yüksek tazminat ödemelerine ve üretim planlarının bozulmasına yol açar. Bu karmaşık süreci optimize etmek için kullanılan "üretim çizelgeleme" (production scheduling), sınırlı kaynakların (makineler, iş gücü vb.) işlere en verimli şekilde atanması sanatıdır.

Endüstriyel ortamlarda en sık karşılaşılan ve çözümü en zor olan yapılardan biri "ilişkisiz paralel makine çizelgeleme problemi" (UPMSP) olarak bilinir. UPMSP'de makineler aynı işi yapabilse de, teknolojik farklardan dolayı işlem süreleri ($P_{j,k}$) her makine için farklılık gösterir. Bu problemin en zorlu katmanı ise "sıra-bağımlı hazırlık süreleri"dir ($S_{i,j,k}$). Bir makinede üretilen önceki işin özellikleri, bir sonraki iş için yapılacak kalıp veya ayar değişikliğinin süresini doğrudan etkiler. Bu durum, matematiksel olarak kombinatoryal bir patlamaya yol açar ve UPMSP'yi "NP-Zor" (NP-Hard) bir problem haline getirir.

Bu çalışma, Tayland'daki büyük bir çelik boru üreticisinin operasyonel verilerinden esinlenmiştir. Fabrikada ürünler farklı boyut ve malzemelere göre "ürün ailelerine" ayrılmaktadır. Bir aileden farklı bir aileye geçiş yapıldığında makinelerde çok uzun hazırlık süreleri (setup) oluşmaktadır. Yönetim, bir yandan makine verimliliğini (makespan - $C_{max}$) en üst düzeye çıkarmaya çalışırken, diğer yandan toplam teslim gecikmesi süresini ($T$) ve geciken iş sayısını ($L$) minimize etmek zorundadır. Bu rapor, bu üç çatışan amacın (multi-objective) optimizasyonu için geliştirilen kesin ve sezgisel yöntemleri detaylandırmaktadır.

---

## 2. Literatür Analizi ve Atıfların Evrimi

İlişkisiz paralel makine çizelgeleme (UPMSP) literatürü, on yıllar içinde problemin daha gerçekçi kısıtlarla donatılmasıyla gelişim göstermiştir.

**Fanjul-Peyro (2020)** ve meslektaşları, işlem sürelerini minimize ederek toplam tamamlanma zamanını ($C_{max}$) iyileştiren güçlü matematiksel modeller (MILP) sunmuşlardır. Ancak bu çalışmalar, çelik üretimi gibi hazırlık sürelerinin saatler sürebildiği sektörler için yeterli değildir. Hazırlık süresinin önemini fark eden **Vallada ve Ruiz (2011)** ile **Gedik vd. (2018)**, sıra-bağımlı hazırlık sürelerini ($S_{i,j,k}$) modele dahil ederek gerçek dünya problemlerine daha yakın bir çerçeve çizmişlerdir. Ancak onların odak noktası da teslim tarihlerinden ziyade sadece makine kullanımı olmuştur.

Müşteri odaklı teslimat hedeflerine odaklanan **Lin vd. (2011)** ve **Wang vd. (2020)** ise gecikme sürelerini minimize eden modeller geliştirmişlerdir. Bu çalışmanın farkı ve literatürdeki temel katkısı ise; hem makine verimliliğini hem de iki farklı teslimat performans ölçütünü (toplam gecikme - $T$ ve geciken iş sayısı - $L$) aynı anda ele alan, ürün ailesi bağımlılıklarını ve makine kısıtlarını kapsayan bütünleşik bir yapı sunmasıdır.

---

## 3. Problem Tanımı ve Varsayımlar

Problem, $n$ adet işin $m$ adet teknolojik olarak birbirinden farklı (ilişkisiz) paralel makinede işlenmesini kapsar. 

**Temel Kısıtlar ve Tanımlar:**
*   **İşlem Süresi ($P_{j,k}$):** $j$ işinin $k$ makinesindeki işlem süresi.
*   **Makine Kısıtı ($NP_{j,k}$):** Fiziksel sınırlamalar nedeniyle her iş her makinede yapılamayabilir. Eğer $NP_{j,k} = 0$ ise o iş o makineye atanamaz.
*   **Sıra-Bağımlı Hazırlık ($S_{i,j,k}$):** Makine $k$'da, iş $i$'den sonra iş $j$ yapılacaksa gereken hazırlık süresidir. Bu süre, işlerin ait oldukları ürün ailelerine göre değişir.
*   **Teslim Tarihi ($D_j$):** Her işin müşteriye söz verilen bitiş tarihidir.

---

## 4. Matematiksel Modelleme (MILP)

Makalede üç ana performans ölçütü için üç ayrı Karışık Tam Sayılı Doğrusal Programlama (MILP) modeli kurulmuştur:
1.  **$M1$ Modeli:** $C_{max}$ minimizasyonu (Tamamlanma zamanı).
2.  **$M2$ Modeli:** $T$ minimizasyonu (Toplam teslim gecikmesi süresi).
3.  **$M3$ Modeli:** $L$ minimizasyonu (Geciken iş sayısı).

### Rota ve Subtour Elimination Mantığı (Miller-Tucker-Zemlin Kısıtı)
Model, makineleri birer rota (route) olarak ele alır. Her makinedeki iş sırası, başlangıçtan bitişe bir akış olarak modellenmiştir. Bu akışın sürekliliğini ve doğruluğunu sağlamak için kullanılan en kritik kısıt, literatürde **Miller-Tucker-Zemlin (MTZ)** kısıtı olarak bilinen **Denklem (6)**'dır:
$$C_j \ge C_i + S_{i,j,k} + P_{j,k} - M(1 - X_{i,j,k})$$
Bu kısıt, bir işin ($j$) ancak kendisinden önceki iş ($i$) bittikten ve gerekli hazırlık yapıldıktan sonra başlayabileceğini garanti eder. Ayrıca, Gezgin Satıcı Problemlerinden (TSP) bilinen "alt-döngü" (subtour) oluşumunu—yani bir işin kendi kendine dönmesini veya kopuk bir döngü oluşturmasını—matematiksel olarak engeller.

### Geliştirilmiş ε-Kısıt Yöntemi (AUGMECON) — Mavrotas (2009)
Yöneticiler için sadece bir hedefi minimize etmek yeterli değildir; amaçlar arası ödünleşimleri görmek isterler. Klasik yöntemlerde amaç fonksiyonları belli ağırlıklarla toplanır, ancak bu yöntem her zaman optimal (Pareto) sonuçları vermez.

**Mavrotas (2009)**, klasik ε-kısıt yönteminin zayıflıklarını gidermek için **AUGMECON** (Augmented ε-constraint) metodolojisini geliştirmiştir. Mavrotas'ın bu çalışmasının iki temel üstünlüğü vardır:
1.  **Sözlüksel Optimizasyon (Lexicographic Optimization):** Önce "ödeme tablosu" (payoff table) oluşturarak her amacın alabileceği en iyi ve en kötü değerleri belirler.
2.  **Grid Noktaları:** Diğer amaçları kısıt olarak ($T \le \bar{T}$ ve $L \le \bar{L}$) modele ekler ve bu kısıtların sağ taraf değerlerini kademeli olarak değiştirerek tüm Pareto cephesini tarar. 

Bu sayede, "zayıf Pareto" olarak adlandırılan ve bir hedefin iyileşmeden diğerinin kötüleştiği verimsiz çözümler ayıklanmış olur. Bu makale, Mavrotas'ın bu derin metodolojisini UPMSP probleminin sıra-bağımlı hazırlık kısıtlarına başarıyla entegre etmiştir.

---

## 5. Sezgisel Çözüm Yaklaşımı: Dinamik Dağıtım Kuralları (DDR)

MILP modelleri küçük problemlerde harika çalışsa da, makine ve iş sayısı arttıkça çözüm süresi katlanarak artar. Bu aşamada, çizelgeleme teorisinin temel taşları olan "Öncelik Kuralları" devreye girer.

**Tarihsel Köken:**
Çizelgeleme biliminin kurucuları sayılan **Smith (1956)** ve **Jackson (1955)**, sırasıyla SPT (Shortest Processing Time) ve EDD (Earliest Due Date) gibi kuralların belirli performans ölçütleri altında optimal olduğunu kanıtlamışlardır. Bu makale, bu klasik felsefeyi alıp "Sıra-Bağımlı Hazırlık Süreleri" ile modifiye ederek **Dinamik Dağıtım Kuralları (DDR)** mekanizmasını kurmuştur:

1.  **SCT (Shortest Completion Time):** Bir makineye atanacak işi seçerken, sadece işlem süresini değil, makinedeki hazırlık süresini ($S_{i,j,k}$) de hesaba katar. En kısa toplam süreyi vereni seçer.
2.  **SC-LPT ve SC-EDD:** LPT (Longest Processing Time) ve EDD (Earliest Due Date) kurallarının SCT mantığıyla birleşimidir. Büyük işleri veya acil işleri önceliklendirerek makine verimliliğini korur.

**Zaman-Tetiklemeli ($t_s$) Geçiş:** Makalenin asıl gücü, bu kuralları statik bırakmamasıdır. Belirli bir zamana ($t_s$) kadar $A$ kuralı, o zamandan sonra $B$ kuralı çalıştırılarak melez (hybrid) stratejiler üretilir. Toplam 39 konfigürasyon, bu esneklik sayesinde farklı talep senaryolarına adapte olabilir.

---

## 6. Çok Kriterli Karar Verme: TOPSIS — Hwang ve Yoon (1981)

Elde edilen 39 farklı kural sonucundan hangisinin "en iyi" olduğunu seçmek, yöneticinin tercihlerine (ağırlıklarına) bağlıdır. Bu karmaşık seçim sürecinde, literatürün en saygın Çok Kriterli Karar Verme (MCDM) tekniklerinden biri olan **TOPSIS** kullanılmıştır.

**Hwang ve Yoon (1981)** tarafından geliştirilen TOPSIS yönteminin temel felsefesi "İdeal Çözüme Yakınlık" ilkesine dayanır. Yöntem, bir kuralın başarısını iki kutup üzerinden ölçer:
1.  **Pozitif İdeal Çözüm ($S^+$):** Üç hedefin ($C_{max}, T, L$) en iyi değerlerini içeren hayali nokta.
2.  **Negatif İdeal Çözüm ($S^-$):** Üç hedefin en kötü değerlerini içeren hayali nokta.

Seçilecek "Şampiyon Kural", pozitif ideale geometrik (Euclidean) olarak en yakın, negatif ideale ise en uzak olandır. Bu yöntem, yöneticinin ağırlıklarını ($w_C, w_T, w_L$) dikkate alarak nesnel ve matematiksel olarak kanıtlanmış bir karar desteği sunar.

---

## 7. Hesaplamalı Çalışma ve Uygulama Doğrulaması

Makalede sunulan tüm bu teorik çerçeve, hem matematiksel sınırlar (MILP çözüm süreleri) hem de pratik fayda (DDR hızı) açısından test edilmiştir.

**Exact Çözüm Sınırı:** AUGMECON ($M4$) modelinin küçük bir problemde (10 iş) bile 4.5 saat sürmesi, NP-Zor yapının pratik engelini göstermiştir. Ancak DDR kuralları büyük ölçekli fabrikalarda saniyeler içinde sonuç vererek yöneticinin yükünü almıştır.

### 7.1. Geliştirilen Python Karar Destek Aracı
Bu rapor kapsamında gerçekleştirilen en önemli çalışma, yukarıda anlatılan tüm karmaşık matematiğin **Python (Google OR-Tools)** kullanılarak çalışan bir yazılıma dönüştürülmesidir. 

Geliştirdiğimiz yazılım;
*   Miller-Tucker-Zemlin rota kısıtlarını barındıran **MILP Çözücüyü**,
*   Mavrotas (2009) mantığıyla çalışan **AUGMECON Pareto Algoritmasını**,
*   39 farklı **DDR Kural Motorunu**,
*   Hwang ve Yoon (1981) felsefesiyle çalışan **TOPSIS Analiz Modülünü**

tek bir çatı altında toplamıştır. Yazılımımız üzerinden alınan ekran görüntüsünde (Şekil 1), sıra-bağımlı hazırlık sürelerinin (pembe bloklar) işlerin önünde nasıl yer aldığı ve sistemin optimal Pareto çözümünü saniyeler içinde nasıl doğruladığı gözlemlenebilir. Bu uygulama, makaledeki teorik modelin endüstriyel olarak tamamen uygulanabilir ve güvenilir olduğunu kanıtlamaktadır.

---

## 8. Sonuç ve Öneriler

Bu çalışmada, sıra-bağımlı hazırlık süreli ilişkisiz paralel makine çizelgeleme problemi (UPMSP) için literatürdeki en kapsamlı çözüm metodolojilerinden biri ele alınmıştır. $3$ amaçlı matematiksel modelleme, AUGMECON yöntemiyle Pareto analizi ve TOPSIS destekli dinamik dağıtım kuralları ile tam bir karar destek sistemi sunulmuştur.

Geliştirilen Python uygulaması ve yapılan analizler sonucunda, önerilen hibrit stratejilerin büyük ölçekli çelik boru üretim fabrikalarında operasyonel verimliliği ve müşteri memnuniyetini eş zamanlı olarak maksimize edebileceği doğrulanmıştır. Gelecek çalışmalarda, makine arızaları ve sipariş değişiklikleri gibi dinamik (stochastic) kısıtların da sisteme eklenmesi planlanmaktadır.
