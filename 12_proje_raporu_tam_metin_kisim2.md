---

## 4. Önerilen Dinamik Dağıtım Kuralları (Proposed Dynamic Dispatching Rules)

MILP formülasyonu, sıra-bağımlı hazırlık sürelerini ve üç farklı amacı içeren paralel makine çizelgeleme probleminde optimal çözümü (Pareto kümesini) bulabilmektedir. Ancak hesaplamalı çalışma bölümünde gösterileceği üzere, iş sayısı ve makine sayısı arttıkça çözüm süreleri (CPU time) devasa boyutlara ulaşmaktadır. Endüstriyel problemlerde saniyeler içerisinde pratik ve uygulanabilir sonuçlar elde edebilmek için araştırmacılar **Dinamik Dağıtım Kuralları (DDR)** önermişlerdir. 

*(Word raporunda bu bölüme orijinal makaledeki Denklem 21, 22, 23 formüllerini resim olarak ekleyiniz.)*

1.  **SCT (Shortest Completion Time):** Bir işi, işlem süresi ile önceki işten gelen hazırlık süresinin toplamının ($S_{i,j,k} + P_{j,k}$) en az olduğu makineye atar. Temel amacı *tamamlanma zamanını (Makespan)* en aza indirmektir.
2.  **SC-LPT (Shortest Completion Time - Longest Processing Time):** İşlem süresi en uzun olan işi (LPT), o anki durumu en az uzatacak şekilde (SCT) en uygun makineye atar. Bu kural yine ağırlıklı olarak kapasite kullanımını hedefler.
3.  **SC-EDD (Shortest Completion Time - Earliest Due Date):** Teslim tarihi en yakın olan işi (EDD), en kısa sürede bitirecek makineye (SCT) atar. Amacı *gecikmeleri (Tardiness)* en aza indirmektir.

### Kural Değiştirme (Rule Switching) Mekanizması
Üç farklı amacın aynı anda hedeflenmesi gerektiğinden, tek bir kural kullanmak her zaman en iyi sonucu vermez. Bu nedenle makalede $t_s$ (Kural değiştirme zamanı) isimli bir parametre tanımlanmıştır. Sistemin zamanı $t_s$'den küçükken A kuralı çalıştırılır, saat $t_s$'yi geçtiğinde ise kalan atanmamış işler için B kuralına geçilir. Üç temel kuralın ikili eşleşmesi sonucu toplamda 6 adet kombine kural oluşturulur (Örn: `[SCT & SC-EDD]`).

---

## 5. Karar Analizi ve Sayısal Örnek (Decision Analysis and Numerical Example)

### TOPSIS ile Karar Analizi
Farklı dağıtım kuralları kullanıldığında ortaya çıkan Cmax, Toplam Gecikme ve Geciken İş Sayısı sonuçları arasında seçim yapmak için Çok Kriterli Karar Verme yöntemlerinden biri olan TOPSIS (Technique for Order Preference by Similarity to Ideal Solution) kullanılmıştır. 

Yöntemin adımları:
1.  **Karar Matrisinin Oluşturulması ve Normalizasyon:** Kuralların elde ettiği sonuçlar normalize edilerek boyutsuzlaştırılır.
2.  **Ağırlıklı Normalize Matris:** Karar vericinin (yöneticinin) her bir amaca atadığı ağırlıklara göre ($w_C, w_T, w_L$) matris çarpılır.
3.  **Pozitif ($S^+$) ve Negatif İdeal Çözüme ($S^-$) Uzaklıkların Hesaplanması:** Her sonucun olabilecek en iyi (ideal) ve en kötü duruma olan uzaklığı bulunur.
4.  **Göreli Yakınlık ($C^*$):** $C^* = S^- / (S^+ + S^-)$ formülü ile hesaplanır. $C^*$ değeri 1'e en yakın olan kural, en iyi uzlaşı çözümü (Best Compromise) olarak seçilir.

*(Not: Word raporunda Tablo 2, 3, 4 ve 5'in çevirileri ve küçük sayısal örneğin (n=3, m=2) anlatımı eklenecektir.)*

---

## 6. Hesaplamalı Çalışma (Computational Study)

Önerilen matematiksel modellerin (M1, M2, M3, M4) ve Dinamik Dağıtım Kurallarının (DDR) performansını test etmek için geniş çaplı rastgele veri setleri üretilmiştir. Veriler üretilirken $C_{max}$, $T$ ve $L$ amaçları değerlendirilmiştir.

1.  **Küçük Boyutlu Problemler (P1-P4):** MILP modelleri küçük problemlerde çalıştırılmıştır. M4 modeli (AUGMECON), P2 örneğinde bile Pareto kümesini bulmak için 4 saat 39 dakika gibi devasa bir CPU süresi harcamıştır. Bu durum, sıra-bağımlı UPMSP probleminin NP-Zor yapısını kanıtlamaktadır ve büyük işletmeler için kesin çözücülerin (exact solvers) kullanışsız olduğunu göstermektedir.
2.  **Büyük Boyutlu Problemler (P5-P8):** Çelik boru üretim firmasından elde edilen 18 aylık veriler kullanılmıştır. İş sayısı (n) çok yüksek olduğunda, önerilen 39 DDR konfigürasyonu saniyenin kesirleri mertebesinde (aşırı hızlı) sonuç vermiştir.
3.  **TOPSIS Sonuçları:** Ağırlıkların durumuna göre hangi kuralın birinci olduğu değişkenlik göstermektedir. Örneğin, Cmax ağırlığı çok yüksekse SCT türevi kurallar birinci çıkarken; gecikme önemsendiğinde SC-EDD ağırlıklı kurallar 1. sırayı almaktadır.

### 6.1. Ek: Geliştirilen Python Uygulaması Üzerinden Doğrulama (Uygulama Notu)
*Bu çalışma kapsamında, orijinal makalede anlatılan tüm MILP denklemleri (Big-M kısıtları dahil), TOPSIS karar analizi metodu ve 39 farklı DDR sezgisel algoritması baştan sona Python programlama dili (OR-Tools kütüphanesi) ile kodlanmış ve dijital bir karar destek aracı (çözücü) haline getirilmiştir.* 

Geliştirdiğimiz "Bütüncül Test" simülatörü, makalede anlatılan:
1.  Veri Üretme
2.  DDR Kurallarını Yarıştırma
3.  TOPSIS ile Şampiyonu Seçme
4.  Küçük problemlerde MILP (AUGMECON) Pareto iterasyonlarını tamamlama

işlemlerinin tümünü tek seferde, makale sonuçlarıyla tutarlı biçimde gerçekleştirmektedir. Aşağıda, sistemin $n=10$ iş ve $m=7$ makine kısıtı altındaki bir senaryoda **SC-EDD** kuralını birinci seçtiğini ve makine bazlı (hazırlık bloklarını içeren) Gantt şeması çıkardığını doğrulayan terminal çıktısı yer almaktadır:

*(Bu kısımdan sonra Word raporunuza "main.py" çalıştırdığınızda Terminalden kopyaladığınız o muhteşem Gantt Şemalı ve Tablolu çıktının resmini/metnini yapıştırarak hocanıza uygulamanızı kanıt olarak gösterebilirsiniz.)*

---

## 7. Sonuçlar (Conclusions)

Bu çalışmada, ilişkisiz paralel makine çizelgeleme probleminde sıra-bağımlı hazırlık süreleri, ürün ailesi bağımlılıkları ve makine uygunluk kısıtları eş zamanlı olarak ele alınmıştır. Tamamlanma zamanı, toplam teslim gecikmesi süresi ve geciken iş sayısını en küçüklemek için üç amaçlı bir MILP (Karışık Tam Sayılı Doğrusal Programlama) modeli sunulmuştur. Exact çözüm gerektiren durumlar için Geliştirilmiş ε-Kısıt (AUGMECON) yöntemi kullanılarak bir Pareto Kümesi elde edilmiştir.

Modelin NP-Zor doğası gereği çözüm süresinin katlanarak artması, gerçek hayattaki büyük ölçekli problemler için sezgisel yöntemlerin kullanılmasını zorunlu kılmıştır. Bu amaçla üç temel kural (SCT, SC-LPT, SC-EDD) ve altı kombine kuraldan oluşan Zaman-Tetiklemeli Dinamik Dağıtım (DDR) mekanizması tasarlanmıştır. Elde edilen çözümler arasından karar vericinin (üretim yöneticisinin) tercihlerine en uygun çözümü seçmek üzere TOPSIS analizinden faydalanılmıştır. Sonuçlar, önerilen DDR kurallarının ve karar modelinin büyük çelik boru fabrikalarındaki gerçek problemlere, esnek ve yüksek kaliteli çözümler sunduğunu kanıtlamıştır. Gelecekteki çalışmalar, iş iptalleri, makine arızaları gibi belirsizlikleri (stochastic/fuzzy ortamlarda) ele alacak şekilde genişletilebilir.
