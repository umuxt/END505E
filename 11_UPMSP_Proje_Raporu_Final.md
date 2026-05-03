# Proje Raporu: Sıra-Bağımlı Hazırlık Süreli İlişkisiz Paralel Makine Çizelgeleme

**Makale:** A multi-objective production scheduling model and dynamic dispatching rules for unrelated parallel machines with sequence-dependent set-up times (Decision Analytics Journal 13, 2024, 100525)

---

## Aşama 1: Problemin Kök Nedeni ve Literatürdeki Boşluk

Makalenin temel motivasyonu, Tayland'daki bir çelik boru üreticisinin operasyonel dar boğazlarından kaynaklanmaktadır. Sistemde teknolojik kapasiteleri farklı 10 adet makine (İlişkisiz Paralel Makine - UPM) bulunmaktadır. Borular özelliklerine göre "ürün ailelerine" ayrılmakta; makinede aynı aileden bir ürüne geçiş kısa sürerken, farklı bir ürün ailesine geçiş çok uzun "sıra-bağımlı hazırlık sürelerine (SDST)" neden olmaktadır.

Makale, Endüstri Mühendisliği perspektifinden üç birbiriyle çatışan amacı (multi-objective) aynı anda optimize etmeyi hedefler:
1. **$C_{max}$ (Tamamlanma Zamanı):** Kaynak kullanımını maksimize etmek.
2. **$T$ (Toplam Teslim Gecikmesi Süresi):** Müşteri şikayetlerini ve gecikme cezalarını minimize etmek.
3. **$L$ (Geciken İş Sayısı):** Teslimat güvenilirliğini artırmak.

### Literatürle Entegrasyon ve "Boşluk" (Tablo 1 Analizi)
Orijinal metindeki **Tablo 1** (Literatür Özeti) incelendiğinde, bu üç hedefin neden bir arada olması gerektiği çok net görülür:
- **Fanjul-Peyro vd.:** UPM sistemlerinde Cmax'ı mükemmel optimize etmelerine rağmen "hazırlık sürelerini (SDST)" yok saymışlardır.
- **Vallada ve Ruiz (2011) / Gedik vd. (2018):** SDST kısıtını modele dahil etmişler, fakat teslimat gecikmelerini (T ve L) umursamamışlardır.
- **Lin vd. (2011):** Sadece gecikmelere (T) odaklanmıştır.
**Sonuç:** UPM + SDST ortamında $C_{max}$, $T$ ve $L$'yi **aynı anda** ele alan, hem kesin çözüm veren (MILP) hem de saniyeler içinde karar üreten (DDR) ilk bütünleşik çalışma bu makaledir.

---

## Aşama 2: Matematiksel Temeller ve AUGMECON Mimarisi

Makale, problemi M1 ($C_{max}$ min.), M2 ($T$ min.) ve M3 ($L$ min.) olarak üç ayrı Karışık Tamsayılı Doğrusal Programlama (MILP) modeli olarak kurar. Modelin en kritik kısıtı, işlerin sıralanmasını ve araya giren hazırlık süresini hesaplayan "Big-M" kısıtıdır (Denklem 6):

$C_j - C_i + V \cdot (1 - X_{i,j,k}) \geq S_{i,j,k} + P_{j,k}$

### AUGMECON ile Çok Amaçlı Optimizasyon (M4)
Üç hedefin aynı anda optimize edildiği M4 modeli için **AUGMECON** (Artırılmış $\epsilon$-kısıt) yöntemi kullanılır. Bu yöntem, hedeflerden birini (örneğin $C_{max}$) amaç fonksiyonunda tutarken, diğerlerini (T ve L) kısıt olarak ($T \leq \epsilon_T$, $L \leq \epsilon_L$) modele ekler.
- **Tablo 9 ve Figür 3 (Pareto Cephesi):** Küçük problem setlerinde algoritmanın ürettiği Pareto çözümlerini gösterir. Bir hedefin iyileşmesinin diğerini nasıl kötüleştirdiği (Trade-off) matematiksel olarak ispatlanmıştır.

---

## Aşama 3: Dinamik Dağıtım Kuralları (DDR) ve Algoritmik Akış

MILP ve AUGMECON sadece küçük problemleri çözebildiğinden, gerçek fabrika ölçeği için dinamik Sezgisel Yöntemler (Heuristics) geliştirilmiştir. (Bkz. **Figür 1 - Algoritma Akış Şeması**).

### Temel Kurallar (Tekli)
1. **SCT (Shortest Completion Time):** Hazırlık ($S_{i,j,k}$) + İşlem Süresi ($P_{j,k}$) toplamı en kısa olan işi seçer. Amacı Cmax'ı düşürmektir.
2. **SC-LPT:** İşlem süresi en uzun olan işi, en kısa zamanda tamamlayacak makineye atar.
3. **SC-EDD:** Teslim tarihi ($D_j$) en erken olan işi, en kısa zamanda tamamlayacak makineye atar. Amacı gecikmeleri (T ve L) önlemektir.

### Kural Değiştirme (Rule-Switching) Mekanizması
Kurallar tek başlarına 3 hedefi birden iyileştiremez. Bu yüzden **$t_s$ (Kural Değiştirme Zamanı)** parametresiyle iki kural birleştirilir. Örneğin **[SCT & SC-EDD: $t_s$]** kuralı; üretimin başında sırf kaynak verimliliği için SCT'yi kullanır, ancak süre $t_s$'yi aştığında teslim tarihi yaklaşan işleri kurtarmak için aniden SC-EDD kuralına geçer.
- **Tablo 2, 3, 4 ve 5:** Makalede verilen bu sayısal örnek tabloları, bu kuralların elle nasıl işletildiğini adım adım kanıtlar.

---

## Aşama 4: Endüstriyel Veri Analizi: ANOVA, Regresyon ve TOPSIS

Kurallar, Tayland'daki fabrikanın 18 aylık (Bkz. **Figür 4 - 18 Aylık Talep**) gerçek verileri üzerinde test edilmiştir. K-means kümeleme ile aylar "Düşük Talep" ve "Yüksek Talep" olarak ikiye ayrılmıştır.

### İstatistiksel İspat (ANOVA ve Regresyon)
- **Tablo 16 (ANOVA):** Kuralların, talep tiplerinin ve makinelerin performans üzerindeki etkisinin istatistiksel olarak anlamlı ($p < 0.05$) olduğu kanıtlanmıştır. En kötü kural olan SC-LPT elenmiştir.
- **Figür 5 (Regresyon):** Farklı kuralların $C_{max}$ üzerindeki etkisi modellenmiş, SCT'nin Cmax'ı düşürmedeki ezici üstünlüğü görselleştirilmiştir.

### TOPSIS ile Karar Analizi (Tablo 19)
Üç hedeften elde edilen sonuçlar farklı birimlerdedir (Cmax ve T saat cinsinden, L adet cinsinden). Bu sonuçları birleştirmek için TOPSIS yöntemi uygulanmıştır.
- Yönetici $C_{max}$'a önem veriyorsa: **SCT** tek başına en iyidir.
- Yönetici Gecikmelere (T ve L) önem veriyorsa: **SC-EDD** kuralı ve onunla başlayan kombinasyonlar seçilmelidir.

---

## Aşama 5: Akademik ve Sektörel Çıktılar

Bu makale, sıradan bir optimizasyon makalesi olmaktan çıkıp şu üç net değeri üretmiştir:
1. **Teorik Katkı:** UPM + SDST sistemleri için $C_{max}$, $T$ ve $L$'yi tek bir çatı altında birleştiren güçlü bir M4 (AUGMECON) modeli literatüre kazandırılmıştır.
2. **Algoritmik Katkı:** $t_s$ zaman parametresine bağlı "Rule-Switching" mantığı, NP-Zor problemlerde inanılmaz bir işlem yükü tasarrufu sağlamış ve çok pratik bir sezgisel mimari oluşturmuştur.
3. **Endüstriyel Katkı:** Tayland'daki çelik boru fabrikası, TOPSIS karar analizi sayesinde üretim döneminin başındaki yoğunluk durumuna göre (düşük/yüksek talep) vardiya amirlerine "Hangi saatte hangi kurala geçeceklerini" dikte edebilecek bir karar destek sistemine (DSS) kavuşmuştur.
