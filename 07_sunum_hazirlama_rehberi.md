# Sunum Hazırlama Rehberi (15-20 Dakika - Detaylı Akış)

Bu rehber, ders hocasının 6 maddelik şartnamesine %100 uyumlu, 15-20 dakikalık bir sunum için tasarlanmış 22 slaytlık bir plandır.

---

## Genel Kurallar
- **Format:** Sadece PowerPoint (.pptx).
- **Görsel:** Formülleri metin olarak yazmayın, makaleden kesip resim olarak yapıştırın.
- **Dil:** Formül altındaki açıklamalar ve sunum dili tamamen Türkçe.
- **Terminoloji:** "Tamamlanma Zamanı", "Yayılma Süresi", "Teslim Gecikmesi Süresi" gibi dersteki terimleri kullanın.

---

## 22 Slaytlık Detaylı İçerik Planı

### BÖLÜM 1: GİRİŞ VE KİMLİK (2 Slayt)

#### Slayt 1: Kapak (Hocanın Özel Formatı)
1. **Slayt Başlığı:** Üretimde Sıralama ve Çizelgeleme - Dönem Projesi
2. **Görsel Gereksinim:** Sağ üstte İTÜ logosu, sağ ortada öğrenci vesikalık fotoğrafı.
3. **Özet Metin / Bullet Points:** 
    - **Makale İngilizce Başlık:** A multi-objective production scheduling model and dynamic dispatching rules for unrelated parallel machines with sequence-dependent set-up times
    - **Makale Türkçe Başlık:** Sıra-Bağımlı Hazırlık Süreli İlişkisiz Paralel Makineler İçin Çok Amaçlı Bir Üretim Çizelgeleme Modeli ve Dinamik Dağıtım Kuralları
    - **Hazırlayan:** [Adınız Soyadınız] - [Öğrenci Numaranız]
4. **Türkçe Formül/Tablo Açıklaması:** (Yok)
5. **Konuşmacı Notu:** "Girişte dersin adını ve makalenin her iki dildeki başlığını net bir şekilde telaffuz edin. Fotoğrafın güncel olması hocanın isteğidir."

#### Slayt 2: Makale Künyesi
1. **Slayt Başlığı:** Makale Tanıtımı ve Literatürdeki Yeri
2. **Görsel Gereksinim:** Makalenin ilk sayfasındaki başlık, yazar isimleri ve "Decision Analytics Journal" logosunun ekran görüntüsü.
3. **Özet Metin / Bullet Points:** 
    - **Yazarlar:** P.D. Tai, P. Kongsri, P. Soeurn, J. Buddhakulsomsiri (2024).
    - **Dergi:** Decision Analytics Journal, Cilt 13.
    - **Odak Noktası:** Gerçek bir çelik boru fabrikasındaki ilişkisiz paralel makine problemi.
4. **Türkçe Formül/Tablo Açıklaması:** (Görsel altı): 2024 yılına ait güncel bir çalışma olup, literatürdeki üç temel performans kriterini aynı anda ele alan nadir makalelerden biridir.
5. **Konuşmacı Notu:** "Makalenin 2024 gibi çok güncel bir tarihli olduğunu vurgulayın, bu akademik güncelliği takip ettiğinizi gösterir."

---

### BÖLÜM 2: PROBLEMİN TANIMI VE ÖNEMİ (3 Slayt)

#### Slayt 3: Endüstriyel Motivasyon
1. **Slayt Başlığı:** Problemin Kaynağı: Çelik Boru Üretimi
2. **Görsel Gereksinim:** Çelik boru üretim hattını temsil eden sembolik bir fabrika görseli veya makaledeki motivasyon kısmının vurgulanmış metni.
3. **Özet Metin / Bullet Points:** 
    - Tayland'ın en büyük çelik boru fabrikasındaki gerçek kısıtlar.
    - **Karmaşıklık:** Makinelerin hızları ve yetenekleri birbirinden farklı (İlişkisiz).
    - **Kritik Unsur:** Ürün ailesi değişimlerinde ortaya çıkan yüksek hazırlık süreleri.
4. **Türkçe Formül/Tablo Açıklaması:** (Görsel altı): Üretim sisteminde makineler 'özdeş' değil, 'ilişkisiz paralel' yapıdadır.
5. **Konuşmacı Notu:** "Burada 'Unrelated Parallel Machines' terimini 'İlişkisiz Paralel Makineler' olarak Türkçe kullanmaya dikkat edin."

#### Slayt 4: Teknik Kavramlar: UPMSP ve SDST
1. **Slayt Başlığı:** Problemin Teknik Karakteristikleri
2. **Görsel Gereksinim:** Makine bağımlı işlem süresi ($P_{j,k}$) ve sıra bağımlı hazırlık süresini ($S_{i,j,k}$) gösteren küçük bir diyagram.
3. **Özet Metin / Bullet Points:** 
    - **UPMSP:** İşlem süreleri makineye göre değişir.
    - **SDST:** Hazırlık süresi, hem makineye hem de bir önceki işe bağlıdır.
    - **Statik Çizelgeleme:** Tüm işler dönemin başında hazırdır.
4. **Türkçe Formül/Tablo Açıklaması:** $S_{i,j,k}$ terimi, k makinesinde i işinden j işine geçerken gereken hazırlık süresini ifade eder.
5. **Konuşmacı Notu:** "Hazırlık süresinin neden 'sıra bağımlı' olduğunu (örn: ebat değişimi vs. boya değişimi) basitçe örneklendirin."

#### Slayt 5: Çatışan Amaçlar (Performance Measures)
1. **Slayt Başlığı:** Performans Ölçütleri ve Hedefler
2. **Görsel Gereksinim:** Üç hedefi (Cmax, T, L) temsil eden bir denge/terazi ikonu.
3. **Özet Metin / Bullet Points:** 
    - **Yayılma Süresi ($C_{max}$):** Toplam üretim süresini kısaltmak (Verimlilik).
    - **Toplam Teslim Gecikmesi Süresi ($T$):** Müşteri terminlerine uyum (Hizmet seviyesi).
    - **Geciken İş Sayısı ($L$):** Güvenilirlik ölçütü.
4. **Türkçe Formül/Tablo Açıklaması:** Bu üç hedef birbiriyle çatışır; birini iyileştirmek genellikle diğerini kötüleştirir.
5. **Konuşmacı Notu:** "Ders notlarında $C_{max}$ için kullanılan 'Yayılma Süresi' terimini mutlaka vurgulayın."

---

### BÖLÜM 3: MATEMATİKSEL MODEL - MILP (6 Slayt)

#### Slayt 6: İndeksler ve Parametreler
1. **Slayt Başlığı:** Matematiksel Modelin Temelleri
2. **Görsel Gereksinim:** Makaledeki "Indices" ve "Parameters" kısımlarının ekran görüntüsü.
3. **Özet Metin / Bullet Points:** 
    - $i, j$: İşler; $k$: Makineler.
    - $P_{j,k}$: İşlem süresi; $S_{i,j,k}$: Hazırlık süresi.
    - $D_j$: Teslim tarihi; $V$: Çok büyük sayı (Big-M).
4. **Türkçe Formül/Tablo Açıklaması:** Modelde işlerin hangi makineye atanacağı $X_{i,j,k}$ karar değişkeni ile belirlenir.
5. **Konuşmacı Notu:** "Parametrelerin 'bilinen', karar değişkenlerinin ise 'bulunmaya çalışılan' değerler olduğunu hatırlatın."

#### Slayt 7: Amaç Fonksiyonu ve M1 Modeli
1. **Slayt Başlığı:** Amaç Fonksiyonları: Verimlilik Odaklı (M1)
2. **Görsel Gereksinim:** Makaledeki Denklem (1) ekran görüntüsü.
3. **Özet Metin / Bullet Points:** 
    - M1 Modeli sadece Yayılma Süresini ($C_{max}$) minimize eder.
    - $C_{max}$, sistemdeki tüm işlerin tamamlandığı en son andır.
4. **Türkçe Formül/Tablo Açıklaması:** Denklem (1): Tüm işlerin tamamlanma zamanları içinden en büyüğünü minimize etmeyi hedefler.
5. **Konuşmacı Notu:** "Süre (duration) ve Zaman (point in time) ayrımına dikkat! $P_{j,k}$ bir süredir, $C_j$ bir zamandır."

#### Slayt 8: Temel Akış Kısıtları (Denklem 2-5)
1. **Slayt Başlığı:** Atama ve Akış Dengesi Kısıtları
2. **Görsel Gereksinim:** Makaledeki Denklem (2, 3, 4, 5) ekran görüntüsü.
3. **Özet Metin / Bullet Points:** 
    - Her işın tam olarak bir ardılı ve bir öncülü olmalıdır.
    - Akış dengesi: Bir makineye giren iş o makineden çıkmalıdır.
    - Her makine bir 'kukla' (dummy) iş ile başlar.
4. **Türkçe Formül/Tablo Açıklaması:** Bu kısıtlar, hiçbir işin boşta kalmamasını ve makineler arasındaki iş akışının sürekliliğini sağlar.
5. **Konuşmacı Notu:** "Kukla iş (0 numaralı iş) mantığını, makinenin başlangıç durumunu temsil ettiğini belirterek açıklayın."

#### Slayt 9: Tamamlanma Zamanı ve Hazırlık Süresi İlişkisi
1. **Slayt Başlığı:** Tamamlanma Zamanı Hesaplama (Denklem 6)
2. **Görsel Gereksinim:** Makaledeki Denklem (6) ekran görüntüsü.
3. **Özet Metin / Bullet Points:** 
    - Bir işin tamamlanması = Önceki işin bitişi + Hazırlık süresi + İşlem süresi.
    - "Big-M" kısıtı ile sıralama ve zamanlama birbirine bağlanır.
4. **Türkçe Formül/Tablo Açıklaması:** Denklem (6): j işinin tamamlanma zamanı, öncülü olan i işine ve atandığı k makinesine bağlı olarak hesaplanır.
5. **Konuşmacı Notu:** "Hazırlık süresinin ($S_{i,j,k}$) burada toplamsal olarak modele nasıl girdiğine dikkat çekin."

#### Slayt 10: Teslim Tarihi ve Gecikme Modelleri (M2 ve M3)
1. **Slayt Başlığı:** Müşteri Odaklı Modeller: Gecikme ve İş Sayısı
2. **Görsel Gereksinim:** Makaledeki Denklem (12) ve (15) ekran görüntüleri.
3. **Özet Metin / Bullet Points:** 
    - **M2 (Denklem 12):** Toplam teslim gecikmesi süresini ($T$) minimize eder.
    - **M3 (Denklem 15):** Geciken iş sayısını ($L$) minimize eder.
    - Erken bitirme ($e^-$) ve Gecikme ($e^+$) değişkenleri kullanılır.
4. **Türkçe Formül/Tablo Açıklaması:** Teslim gecikmesi, işin tamamlanma zamanı ile teslim tarihi arasındaki pozitif farktır.
5. **Konuşmacı Notu:** "Dersteki 'Tj = max(0, Cj - dj)' formülünün burada 'ej+' olarak temsil edildiğini belirtin."

#### Slayt 11: Analitik Denetim: Modeldeki Hataların Düzeltilmesi
1. **Slayt Başlığı:** Akademik Analiz: Model Hatalarının Tespiti
2. **Görsel Gereksinim:** Makaledeki orijinal Denklem (9) ve (16) ile bizim düzeltilmiş halimizin yan yana karşılaştırması.
3. **Özet Metin / Bullet Points:** 
    - **Hata 1:** Denklem 9'daki indis hatası (Makine kapasite kısıtı).
    - **Hata 2:** Denklem 16'daki eşittir ($=$) hatası.
    - **Düzeltme:** Eşittir yerine büyük-eşittir ($\geq$) kullanılarak modelin tutarlılığı sağlanmıştır.
4. **Türkçe Formül/Tablo Açıklaması:** Orijinal modeldeki kısıtlar gevşetilerek çözüm uzayının hatalı daraltılması engellenmiştir.
5. **Konuşmacı Notu:** "Hocanın en çok değer vereceği slayt burasıdır. Makaleyi sadece okumadığınızı, matematiksel olarak sorguladığınızı gösterir."

---

### BÖLÜM 4: SEZGİSEL YÖNTEM - DDR (5 Slayt)

#### Slayt 12: Neden Sezgisel Yöntem?
1. **Slayt Başlığı:** MILP Sınırları ve Sezgisel İhtiyacı
2. **Görsel Gereksinim:** İş sayısı arttıkça çözüm süresinin üstel arttığını gösteren bir grafik veya "NP-Hard" ibaresi.
3. **Özet Metin / Bullet Points:** 
    - MILP 10 işten sonra pratik çözüm üretemez hale geliyor (5+ saat).
    - Fabrikada 250+ işlik gerçek senaryolar mevcut.
    - Hızlı ve "yeterince iyi" çözümler için Sezgisel (Heuristic) şart.
4. **Türkçe Formül/Tablo Açıklaması:** Karar verme süresini saatlerden saniyelere indirmek için Dağıtım Kuralları (Dispatching Rules) kullanılır.
5. **Konuşmacı Notu:** "Burada 'NP-Zor' (NP-Hard) kavramına değinerek akademik derinlik katın."

#### Slayt 13: Modifiye Dağıtım Kuralları (SCT, SC-LPT, SC-EDD)
1. **Slayt Başlığı:** Geliştirilen Dağıtım Kuralları
2. **Görsel Gereksinim:** SCT, SC-LPT ve SC-EDD kurallarının makaledeki matematiksel tanımları.
3. **Özet Metin / Bullet Points:** 
    - **SCT:** En kısa "hazırlık + işlem" süresini seçer (Dersteki SPT'nin gelişmiş hali).
    - **SC-LPT:** Önce uzun işleri bitirip makine dengesi sağlar.
    - **SC-EDD:** Teslim tarihi en yakın işe öncelik verir.
4. **Türkçe Formül/Tablo Açıklaması:** Kurallar, makine ve sıra bağımlı hazırlık sürelerini ($S_{i,j,k}$) içerecek şekilde modifiye edilmiştir.
5. **Konuşmacı Notu:** "Dersteki temel kuralların (SPT, EDD) bu karmaşık probleme nasıl uyarlandığını vurgulayın."

#### Slayt 14: Algoritma Akış Şeması
1. **Slayt Başlığı:** DDR Algoritması İşleyişi
2. **Görsel Gereksinim:** Makaledeki "Figure 1: Flow chart" görseli.
3. **Özet Metin / Bullet Points:** 
    - Adım 0-2: Başlangıç verilerinin yüklenmesi.
    - Adım 3-5: Kural 1'e göre iş ataması ve listelerin güncellenmesi.
    - Adım 6: Kural değiştirme zamanı ($t_s$) kontrolü.
4. **Türkçe Formül/Tablo Açıklaması:** Algoritma, belirlenen bir kritik zamanda strateji değiştirerek dinamik bir yapı sunar.
5. **Konuşmacı Notu:** "Akış şemasını 'Eğer-Değilse' mantığıyla basitçe anlatın, detaya boğulmayın."

#### Slayt 15: Dinamik Kural Değiştirme (Rule Switching)
1. **Slayt Başlığı:** Hibrit Yaklaşım: Kural Değiştirme Mantığı
2. **Görsel Gereksinim:** "SCT & SC-EDD : ts" gibi kombine kural örnekleri.
3. **Özet Metin / Bullet Points:** 
    - Üretimin başında verimlilik (SCT) odaklı başla.
    - Belirli bir AN'dan ($t_s$) sonra teslim tarihine (SC-EDD) odaklan.
    - Bu sayede hem makine hızı hem de müşteri memnuniyeti dengelenir.
4. **Türkçe Formül/Tablo Açıklaması:** $t_s$ parametresi, stratejik bir geçiş noktasıdır ve TOPSIS ile optimize edilir.
5. **Konuşmacı Notu:** "Bu dinamik yapının makalenin en özgün katkısı olduğunu belirtin."

#### Slayt 16: Sezgisel Yöntemdeki Formül Hatası
1. **Slayt Başlığı:** Sezgisel Hesaplamadaki Kritik Eksiklik
2. **Görsel Gereksinim:** Makaledeki eksik $C_{j,k}$ formülü ve bizim eklediğimiz $+C_{i,k}$ terimi.
3. **Özet Metin / Bullet Points:** 
    - Makale metninde kümülatif zaman ($C_{i,k}$) formülde unutulmuş.
    - Bizim analizimiz: Önceki işin bitiş zamanı eklenmeden doğru çizelgeleme yapılamaz.
    - Uygulamada bu hata tarafımızca düzeltilmiştir.
4. **Türkçe Formül/Tablo Açıklaması:** Tamamlanma zamanı hesaplanırken makinenin o anki mevcut zamanı (hazır olma zamanı) mutlaka hesaba katılmalıdır.
5. **Konuşmacı Notu:** "Bu durumun sayısal örneklerde neden hatalı sonuç vereceğini açıklayarak hocanın takdirini kazanın."

---

### BÖLÜM 5: SAYISAL ÖRNEK VE TOPSIS (4 Slayt)

#### Slayt 17: Sayısal Örnek Verileri
1. **Slayt Başlığı:** Uygulama: 2 Makine 3 İş Örneği
2. **Görsel Gereksinim:** Makaledeki Tablo 2 (İşlem ve Hazırlık süreleri).
3. **Özet Metin / Bullet Points:** 
    - Farklı ürün ailelerinden gelen işler ve hazırlık maliyetleri.
    - İşlem sürelerinin makineler arasındaki farkı (İlişkisizlik).
4. **Türkçe Formül/Tablo Açıklaması:** Tablo 2: Küçük ölçekli bir örnek üzerinde kuralların nasıl farklı sonuçlar ürettiği test edilmiştir.
5. **Konuşmacı Notu:** "Tablodaki verilerin rastgele değil, karmaşıklığı göstermek için seçildiğini belirtin."

#### Slayt 18: Çözüm Süreci ve Karşılaştırma
1. **Slayt Başlığı:** Kural Performanslarının Kıyaslanması
2. **Görsel Gereksinim:** Makaledeki Tablo 5 (SCT, SC-LPT, SC-EDD sonuçları).
3. **Özet Metin / Bullet Points:** 
    - SCT en iyi Cmax (31) ve T (2) değerlerini verdi.
    - Hibrit kural [SCT & SC-LPT] Cmax'ı 28'e düşürerek en iyi sonucu verdi.
4. **Türkçe Formül/Tablo Açıklaması:** Tablo 5: Hibrit (kombine) kuralların tekli kurallara göre %12.5 daha iyi sonuç verebildiği kanıtlanmıştır.
5. **Konuşmacı Notu:** "Neden hibrit kuralın daha iyi olduğunu, esneklik kavramıyla açıklayın."

#### Slayt 19: Çok Kriterli Karar Verme: TOPSIS
1. **Slayt Başlığı:** En İyi Kuralın Seçimi: TOPSIS Analizi
2. **Görsel Gereksinim:** TOPSIS adımları (Normalizasyon, İdeal Çözüm Uzaklığı).
3. **Özet Metin / Bullet Points:** 
    - Kriterler: Cmax, T, L.
    - Adımlar: 1. Normalizasyon, 2. Ağırlıklandırma, 3. İdeale yakınlık.
4. **Türkçe Formül/Tablo Açıklaması:** TOPSIS, çatışan hedefler arasında matematiksel olarak 'en dengeli' olanı seçmemizi sağlar.
5. **Konuşmacı Notu:** "Derste görülen ÇKKV yöntemlerinden biri olduğu için bu bölüme aşina olduğunuzu hissettirin."

#### Slayt 20: Karar Verici Senaryoları
1. **Slayt Başlığı:** Senaryo Analizi ve Karar Destek
2. **Görsel Gereksinim:** Farklı ağırlık setleri (w1, w2, w3) ve seçilen en iyi kurallar tablosu.
3. **Özet Metin / Bullet Points:** 
    - Senaryo A: Üretim hızı öncelikli (Cmax ağırlıklı).
    - Senaryo B: Müşteri memnuniyeti öncelikli (Gecikme ağırlıklı).
    - Her senaryo için en uygun kural otomatik olarak belirlenir.
4. **Türkçe Formül/Tablo Açıklaması:** İşletmenin o anki stratejisine göre (bayram yoğunluğu vs. normal dönem) çizelgeleme kuralı değiştirilebilir.
5. **Konuşmacı Notu:** "Bunun bir Karar Destek Sistemi (DSS) mantığında çalıştığını vurgulayın."

---

### BÖLÜM 6: HESAPLAMALI SONUÇLAR VE KAPANIŞ (2 Slayt)

#### Slayt 21: MILP vs DDR Performansı
1. **Slayt Başlığı:** Büyük Ölçekli Test Sonuçları
2. **Görsel Gereksinim:** Makaledeki performans karşılaştırma tablolarından (Gap Analizi) bir özet.
3. **Özet Metin / Bullet Points:** 
    - Sezgisel yöntemler optimal sonuca %95+ yakınlıkta.
    - Çözüm süresi farkı: 5 saat (MILP) vs 1 saniye (DDR).
    - DDR, 200+ işlik gerçek dünya verilerinde son derece kararlı.
4. **Türkçe Formül/Tablo Açıklaması:** Sezgisel yöntemlerin 'etkinliği' (accuracy) ve 'verimliliği' (CPU time) arasındaki denge gösterilmiştir.
5. **Konuşmacı Notu:** "Endüstriyel uygulamada hızın, %100 optimallikten bazen daha önemli olduğunu tartışmaya açın."

#### Slayt 22: Genel Değerlendirme ve Sonuç
1. **Slayt Başlığı:** Sonuç ve Değerlendirme
2. **Görsel Gereksinim:** Çalışmanın tüm aşamalarını (Model -> DDR -> TOPSIS) özetleyen bir piramit görseli.
3. **Özet Metin / Bullet Points:** 
    - Çok amaçlı bir problemin hem teorik (MILP) hem pratik (DDR) çözümü sunulmuştur.
    - Sıra bağımlı hazırlık sürelerinin önemi vurgulanmıştır.
    - Gelecek çalışma: Belirsiz (Stokastik) işlem sürelerinin dahil edilmesi.
4. **Türkçe Formül/Tablo Açıklaması:** (Görsel altı): Bu çalışma, üretim çizelgeleme literatürüne üç hedefli ve dinamik kural geçişli özgün bir katkı sağlamıştır.
5. **Konuşmacı Notu:** "Sunumu 'Sorularınız varsa cevaplamaktan memnuniyet duyarım' diyerek nazikçe bitirin. Zamanı iyi yönettiğinizden emin olun."

---

## Anlatım İçin Altın Kurallar (Hoca Tavsiyesi)
1. **Göz Teması:** Slayttaki metni okumayın, formülü 'anlatın'.
2. **Lazer İşaretleyici:** Formülleri açıklarken ilgili terimin ($S_{i,j,k}$ gibi) üzerinden geçin.
3. **Zaman Yönetimi:** İlk 10 slayta 7-8 dakika, model hatalarına 3 dakika, sezgisellere 5 dakika ayırın.
4. **Kıyafet:** Akademik bir sunum olduğu için yarı-resmi/resmi kıyafet tercih edin.
