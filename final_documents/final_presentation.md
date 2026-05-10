# BÖLÜM A: TASLAK (DRAFT) SUNUM SENARYOSU

Aşağıdaki senaryo, sunumun genel akışını, konuşma metinlerini ve jüri stratejilerini içeren bir taslaktır. Slaytların asıl içerikleri (BÖLÜM B) bu taslak referans alınarak sayfa sayfa oluşturulacaktır.

---

### BÖLÜM 1: GİRİŞ VE PROBLEMİN DOĞASI

**SLAYT 1: Kapak (Dersin Adı, Türkçe/İngilizce Başlık, Öğrenci Bilgileri ve Fotoğraf)**
- 👁️ **Slayt Tasarımı:**
  - Ders: END505 - Üretimde Sıralama ve Çizelgeleme
  - Konu: Sıra-Bağımlı Hazırlık Süreli İlişkisiz Paralel Tezgah Çizelgeleme Problemi
  - İngilizce: Unrelated Parallel Machines with Sequence-Dependent Set-up Times
  - Görsel: Temiz ve kurumsal bir İTÜ şablonu, sağ alt köşede öğrenci fotoğrafı ve bilgileri.
- 🗣️ **Sunucu Konuşma Metni:** "Saygıdeğer hocalarım ve değerli dinleyenler, hoş geldiniz. Bugün sizlere teorik matematiğin gerçek dünyadaki devasa bir kaosu nasıl dize getirdiğini anlatacağım. END505 dönemi boyunca öğrendiğimiz çizelgeleme teorilerini, uçtan uca karmaşık bir endüstriyel vakada nasıl uyguladığımızı adım adım inceleyeceğiz."
- 🛡️ **Jüri Stratejisi / Not:** Sakin ve özgüvenli bir giriş yapın. Göz temasını jüriyle kurun, ekrana bakmayın.

**SLAYT 2: Makale Künyesi (Dergi Adı, Yıl, Sayı ve Orijinal Başlık Görseli)**
- 👁️ **Slayt Tasarımı:**
  - Dergi: Decision Analytics Journal 13 (2024) 100525
  - Yazarlar: Pham Duc Tai ve arkadaşları
  - Görsel: [BURAYA MAKALENİN BAŞLIK VE ÖZET KISMININ ORİJİNAL EKRAN GÖRÜNTÜSÜ EKLENECEK]
- 🗣️ **Sunucu Konuşma Metni:** "İncelediğimiz ve kodladığımız bu çalışma, henüz 2024 yılında yayımlanmış, üretim planlama literatürüne çok taze ve iddialı bir soluk getiren bir araştırma. Karar analitiği alanında çok prestijli bir dergide basılan bu makale, sadece teorik bir model sunmakla kalmıyor, Tayland'daki devasa bir çelik boru fabrikasının gerçek 18 aylık verilerini kullanıyor."
- 🛡️ **Jüri Stratejisi / Not:** Makalenin güncelliği (2024) vurgulanarak çalışmanın "son teknoloji" olduğu imajı pekiştiriliyor.

**SLAYT 3: Çelik Boru Fabrikasındaki Kaos (Endüstriyel Motivasyonumuz)**
- 👁️ **Slayt Tasarımı:**
  - Sektör: Çelik Boru Üretimi
  - Problemler: Devasa iş yığınları, karmaşık ürün aileleri.
  - Amaç: Kaosu senfoniye çevirmek.
  - Görsel: Çelik boru istiflerinin ve devasa sanayi tezgahlarının sinematik, karanlık bir endüstriyel fotoğrafı.
- 🗣️ **Sunucu Konuşma Metni:** "Gelin önce problemi yerinde, Tayland'daki o devasa fabrikada hayal edelim. Satış departmanından durmadan siparişler yağıyor. İnce borular, kalın borular, yuvarlak veya kare profiller... Fabrika müdürünün önünde yüzlerce iş ve bunları işleyebilecek devasa ama birbirinden farklı tezgahlar var. Her bir ürün değişiminde kaybedilen saatler, hem maliyetleri artırıyor hem de teslimatları geciktiriyor. İşte biz tam bu noktada, bu kaosu yönetecek beyni tasarlamak için devreye giriyoruz."
- 🛡️ **Jüri Stratejisi / Not:** Hikayeleştirmenin zirvesi. Sayılarla değil, gerçek hayatla bağ kurarak jüriyi anlatının içine çekiyorsunuz.

**SLAYT 4: Neden "İlişkisiz Paralel Tezgahlar (UPMSP)" Diyoruz?**
- 👁️ **Slayt Tasarımı:**
  - Özdeş (Identical) Değil: Her makinenin gücü farklı.
  - Tekdüze (Uniform) Değil: Hızlar standart orantılı değil.
  - İlişkisiz (Unrelated): İşlem süreleri tamamen iş-tezgah eşleşmesine özel.
  - Görsel: 3 Farklı tezgah ikonu ve bir işin her birinde farklı işlem sürelerini (Örn: 5 saat, 12 saat, sonsuz) gösteren basit bir infografik.
- 🗣️ **Sunucu Konuşma Metni:** "Çizelgeleme literatüründe tezgâhları tanımlarken çok dikkatli olmalıyız. Bizim tezgahlarımız özdeş değil. Tekdüze (uniform) de değil. Tamamen 'ilişkisiz'. Yani X işi 1. tezgahta 5 saat sürerken, 2. tezgahta 12 saat sürebilir, hatta 3. tezgah bu işi yapabilecek kalıplara sahip olmadığı için o tezgahta hiç işlenemez. İşte bu durum, problemin kombinatoryal boyutunu patlatan ilk faktör."
- 🛡️ **Jüri Stratejisi / Not:** Terminoloji şovu! Zaman ve süre kavramlarına dikkat ederek, üretim teorisine olan hâkimiyetinizi kanıtlıyorsunuz.

**SLAYT 5: Hazırlık Sürelerinin Dinamikliği (Sıra ve Tezgah Bağımlılık - $S_{i,j,k}$)**
- 👁️ **Slayt Tasarımı:**
  - Sıra Bağımlı: Önceki iş neydi?
  - Tezgah Bağımlı: Hangi makinedeyiz?
  - Görsel: [BURAYA KÜÇÜK BİR MATRİS VEYA $S_{i,j,k}$ İKONİK DİYAGRAMI EKLENECEK]
  - Açıklama: Hazırlık süreleri sabit değildir; tezgaha, önceki işe ve şimdiki işe bağlı devasa bir 3D matristir.
- 🗣️ **Sunucu Konuşma Metni:** "Karmaşıklığı zirveye taşıyan ikinci faktör: Hazırlık süreleri. Bir tezgahta yuvarlak borudan kare boruya geçiyorsanız kalıpları değiştirmek 11 saatlik bir hazırlık süresi yaratabilir. Ama sadece et kalınlığını değiştiriyorsanız bu süre 20 dakikadır. Kısacası, bir işin hazırlık süresi sadece kendisine değil, hangi tezgahta işlendiğine ($k$) ve kendisinden hemen önce hangi işin ($i$) yapıldığına bağlıdır."
- 🛡️ **Jüri Stratejisi / Not:** $S_{i,j,k}$'nın neden matris olarak ifade edildiğini uygulamalı anlatıyorsunuz. Jürinin "setup times" mantığını anladığınızı görmesi kritik.

---

### BÖLÜM 2: ÇATIŞAN HEDEFLER VE MATEMATİKSEL MODEL

**SLAYT 6: Üç Yöneticinin Çatışması (Yayılma Süresi, Toplam Gecikme, Geciken İş Sayısı)**
- 👁️ **Slayt Tasarımı:**
  - Üretim Müdürü: Fabrikayı boşalt! $\rightarrow$ Yayılma Süresi ($C_{max}$)
  - Finans Müdürü: Gecikme cezalarından kaçın! $\rightarrow$ Toplam Teslim Gecikmesi Süresi ($T$)
  - Müşteri İlişkileri: Herkesi mutlu et! $\rightarrow$ Geciken İş Sayısı ($L$)
  - Görsel: Birbiriyle halat çeken 3 farklı figür (Üçgen biçiminde çatışma).
- 🗣️ **Sunucu Konuşma Metni:** "Fabrikada üç farklı yönetici var ve istekleri birbiriyle çatışıyor. Üretim müdürü, makinelerin en erken an olan 'tamamlanma zamanı'nda bitmesini, yani yayılma süresinin minimize edilmesini istiyor. Finans müdürü, müşterilere ödenecek tazminatları kısmak için toplam teslim gecikmesi süresini sıfırlamak istiyor. Satış müdürü ise, 1 müşterinin 100 saat gecikmesini, 100 müşterinin 1 saat gecikmesine tercih ediyor; çünkü bozulan müşteri sayısını, yani geciken iş sayısını en aza indirmeye çalışıyor."
- 🛡️ **Jüri Stratejisi / Not:** "Zaman" ve "Süre" kavramlarını tam da burada, hocanın istediği mükemmellikte ayırıyorsunuz. (Tamamlanma zamanı vs. Yayılma süresi).

**SLAYT 7: Akademik Şerh: Notasyon Literatürü ve "$L$" Sembolü Çıkmazı**
- 👁️ **Slayt Tasarımı:**
  - Standart Literatür: L = Lateness ($C_j - d_j$)
  - Bu Makale: L = Number of Tardy Jobs ($\sum U_j$)
  - Aksiyon: Modele sadakat prensibi.
  - Görsel: "L" harfi üzerinde bir "Dikkat/Ünlem" ikonu.
- 🗣️ **Sunucu Konuşma Metni:** "Tam bu noktada, END505 dersinde öğrendiklerimizle makale arasında ilginç bir notasyon farklılığı tespit ettik. Standart çizelgeleme literatüründe 'L' sembolü, bir işin erken veya geç bitme durumunu ifade eden Lateness ($C_j - d_j$) kavramı için kullanılır. Ancak makale yazarları, 'Geciken İş Sayısı' hedefini ifade etmek için U değişkenlerinin toplamını $L$ sembolü ile tanımlamış. Çalışmanın orijinal matematiksel iskeletini bozmamak adına raporda ve kodda bu notasyonu korudum ancak bu detayı bir akademik şerh olarak özellikle belirtmek isterim."
- 🛡️ **Jüri Stratejisi / Not:** MUAZZAM BİR JÜRİ ZIRHI. Hoca "Neden Lateness yerine Number of Tardy Jobs'a L dedin?" diye sormadan siz vuruyorsunuz ve "Derste böyle öğrendik ama makale böyle yapmış" diyerek dersin hakkını veriyorsunuz.

**SLAYT 8: Model M1: Yalnızca Hıza Odaklanmak ($C_{max}$ Minimizasyonu)**
- 👁️ **Slayt Tasarımı:**
  - [BURAYA DENKLEM 1 RESMİ KESİLİP EKLENECEK]
  - Felsefesi: Fabrikadaki son makinenin fişini en erken ne zaman çekebiliriz? Odak sadece makine verimliliği, müşteriler umrumuzda değil.
- 🗣️ **Sunucu Konuşma Metni:** "Gelelim matematiksel modellemeye. Birinci modelimiz M1, yalnızca Üretim Müdürünün hedefini, yani Yayılma Süresini ($C_{max}$) en aza indirmeyi hedefler. Burada tüm sistemin en son tamamlanan işinin 'tamamlanma zamanı' minimize edilir. Teslim tarihleri bu modelin umurunda değildir; tek dert fabrikanın şalterini en kısa sürede kapatmaktır."
- 🛡️ **Jüri Stratejisi / Not:** Formülü okumayın. Sadece felsefesini açıklayın.

**SLAYT 9: Model M2 ve M3: Müşteri Beklentileri ve "Big-M" ($V$) Mantığı**
- 👁️ **Slayt Tasarımı:**
  - [BURAYA DENKLEM 12 VE DENKLEM 15 RESİMLERİ YAN YANA KESİLİP EKLENECEK]
  - Felsefesi: Müşteriye verilen sözler tutulmalı.
  - Akademik Uyarı: Orijinal makaledeki Denklem 16 ($e^+_j = V \times U_j$) eşitlik hatası ve eşitsizlik ($\leq$) düzeltmesi.
- 🗣️ **Sunucu Konuşma Metni:** "İkinci ve üçüncü modellerimiz sırasıyla toplam teslim gecikmesi süresini ve geciken iş sayısını minimize eder. Ancak burada yöneylem açısından kritik bir düzeltme yaptık. Makalenin orijinal metninde, gecikme ceza değişkenini bağlayan kısıtta bir 'eşitlik' kullanılmıştı. Oysa Big-M mantığı gereği bir işin gecikme süresinin ($e^+$), binary bir değişkene bağlanması için bunun teorik olarak bir eşitsizlik ($\leq$) olması şarttır. Modeli kurgularken bu teorik kusuru onararak ilerledik."
- 🛡️ **Jüri Stratejisi / Not:** İkinci akademik zırh. Hocaların formüllerde en çok aradığı şey Big-M hatalarıdır. Bunu makalenin hatası olarak gösterip sizin yakaladığınızı belirtmek müthiş bir puan getirir.

**SLAYT 10: Model M4: AUGMECON ile Uzlaşma Noktası (Pareto Cephesi)**
- 👁️ **Slayt Tasarımı:**
  - [BURAYA ŞEKİL 3 PARETO GRAFİĞİ RESMİ KESİLİP EKLENECEK]
  - Felsefesi: Çatışan 3 hedefin ortasında "en az kötü" noktayı, yani optimal ödünleşimi bulmak.
- 🗣️ **Sunucu Konuşma Metni:** "Üç hedefi aynı anda optimize etmek imkansız olduğu için M4 modelini oluşturduk. Burada Artırılmış Epsilon-Kısıt, yani AUGMECON yöntemini kullandık. Klasik ağırlıklı toplam yönteminin aksine AUGMECON, sınırları kılavuz noktalara bölerek bize grafiklerde gördüğünüz bu kusursuz Pareto Cephelerini verir. Bir hedef iyileşirken diğeri zorunlu olarak kötüleşir; yönetici bu grafik üzerinden fabrikası için en uygun ödünleşim noktasını seçer."
- 🛡️ **Jüri Stratejisi / Not:** AUGMECON'un klasik yöntemlere göre neden üstün olduğunu (kılavuz noktalar/grid) açıklayarak derinliğinizi gösteriyorsunuz.

---

### BÖLÜM 3: BÜYÜK VERİ KRİZİ VE DİNAMİK DAĞITIM KURALLARI (DDR)

**SLAYT 11: Gerçeklik Duvarı: MILP Neden Yetersiz Kaldı? (NP-Hard Doğası)**
- 👁️ **Slayt Tasarımı:**
  - Laboratuvar: 3 Tezgah, 10 İş $\rightarrow$ CPLEX ile Çözüm: 21 dakika.
  - Gerçek Hayat: 10 Tezgah, 300 İş $\rightarrow$ MILP Çözümü: Bilgisayar kilitlenmesi (Sonsuzluk).
  - Sonuç: NP-Hard Problemler "Sezgisel" (Heuristic) zeka ister.
- 🗣️ **Sunucu Konuşma Metni:** "Pareto çözümleri harika görünüyor, değil mi? Ama laboratuvar ortamından çıkıp gerçek fabrikaya, 300 işin aktığı o kaosa adım attığımızda CPLEX bilgisayarlarımızı donduruyor. Problem kombinatoryal olarak patlıyor, NP-Hard doğası yüzünden kesin çözüm bulmak imkansızlaşıyor. Matematiksel modeller sınırına ulaştı. Bize gerçek hayatta işleyecek, pratik ve hızlı bir zeka lazımdı."
- 🛡️ **Jüri Stratejisi / Not:** Geçiş slaytı. Teoriden pratiğe geçerken jürinin zihnini hazırlıyor.

**SLAYT 12: Çözüm Yaklaşımı: Dinamik Dağıtım Kuralları (DDR) Felsefesi**
- 👁️ **Slayt Tasarımı:**
  - Meta-Sezgisel Değil, Dağıtım Kuralı!
  - Sahadaki operatörün anlayabileceği hız ve şeffaflık.
  - Sıra ve tezgah bağımlı hazırlık sürelerini karar mekanizmasına dahil etme.
- 🗣️ **Sunucu Konuşma Metni:** "Bu aşamada karmaşık Meta-Sezgisellere (Genetik Algoritma vb.) yönelmek yerine 'Dinamik Dağıtım Kuralları' yani DDR tasarladık. Çünkü sahadaki operatörün mili-saniyeler içinde karar vermesi ve bu kararın arkasındaki mantığı anlaması gerekir. Klasik kuralları alıp, içlerine hazırlık sürelerini ve makine farklılıklarını anlayan dinamik bir vizyon ekledik."
- 🛡️ **Jüri Stratejisi / Not:** Neden heuristik olarak kuralları (dispatching rules) seçtiğinizi endüstriyel "şeffaflık" argümanı ile savunuyorsunuz.

**SLAYT 13: Kuralların Evrimi: Klasik SPT'den SCT'ye Geçiş ($j^*$ Mantığı)**
- 👁️ **Slayt Tasarımı:**
  - Klasik SPT: En kısa işlem süresine sahip işi seç! (Hazırlık süresine kör).
  - Gelişmiş SCT: İşlem Süresi + Hazırlık Süresi toplamı en kısa olanı seç!
  - [BURAYA SCT FORMÜLÜ RESMİ KESİLİP EKLENECEK]
  - Felsefesi: Bir iş hızlı işlenebilir ama kalıp değiştirmek çok uzun sürüyorsa, o işi o an seçme!
- 🗣️ **Sunucu Konuşma Metni:** "Klasik sıralama kurallarından En Kısa İşlem Süresi (SPT), bizim fabrikamızda intihardır. Çünkü bir işin işlem süresi kısacık olabilir ama ondan önce o tezgaha uymayan bir parça işlenmişse, hazırlık süresi o kadar uzundur ki işin avantajı biter. Bu yüzden bunu modifiye ederek En Kısa İş Tamamlanma Zamanı (SCT) kuralını geliştirdik. Kural artık, işlem ve hazırlık süresi toplamına bakarak o anlık en iyi ($j^*$) işini seçiyor."
- 🛡️ **Jüri Stratejisi / Not:** SPT'nin neden yetersiz kaldığını mükemmel bir şekilde mantıksal bir temele oturttuk.

**SLAYT 14: Kuralların Evrimi: SC-LPT ve SC-EDD ile Gecikme Yönetimi**
- 👁️ **Slayt Tasarımı:**
  - SC-LPT: İş yükü ağır olanı aradan çıkar, ama tezgaha hazırlık süresini hesaplatarak koy.
  - SC-EDD: Termin tarihi yanan işi (acil) bul, onu en hızlı bitirecek makineye ata.
  - [BURAYA SC-LPT VE SC-EDD FORMÜLLERİ RESMİ KESİLİP EKLENECEK]
  - Felsefesi: Şartlı Minimizasyon ($\min$ şartıyla $\max$ veya $\min$).
- 🗣️ **Sunucu Konuşma Metni:** "SCT ile bitmiyor. Büyük taşları aradan çıkarmak için En Uzun İşlem Süresi tabanlı (SC-LPT) kuralı ve teslimat gecikmelerini önlemek için En Erken Teslim Tarihi tabanlı (SC-EDD) kuralını geliştirdik. Her ikisi de önce kendi şartını arar (en ağır iş veya en acil iş), sonra bu işin tamamlanma zamanını en aza indirecek olan doğru tezgâhı bulur."
- 🛡️ **Jüri Stratejisi / Not:** Formüllerdeki kısıtlı optimizasyon (subject to) mantığının ne işe yaradığını metinle vurguladık.

**SLAYT 15: Strateji Değişimi: "Kural Değiştirme Zamanı" ($t_s$) Neden İcat Edildi?**
- 👁️ **Slayt Tasarımı:**
  - Problem: Tek bir kural bütün ay boyunca iyi çalışamaz.
  - İnovasyon: Maç içinde taktik değiştirmek ($t_s$).
  - Örnek: [SCT & SC-EDD : 200] $\rightarrow$ İlk 200 saat fabrikayı temizle, sonra terminlere koş!
- 🗣️ **Sunucu Konuşma Metni:** "Yaptığımız en büyük inovasyon tek bir kurala bağlı kalmamak oldu. Bir futbol maçında 90 dakika aynı taktikle oynayamazsınız. Kural değiştirme zamanı, yani $t_s$ parametresini icat ettik. Algoritmamıza diyoruz ki: 'Ayın ilk 200 saati SCT ile sadece üretimi hızlandır. Ama tamamlanma zamanı 200 saati aştığında işler kızışıyor, hemen vites değiştir ve SC-EDD'ye geçerek müşterilerin teslim tarihlerine odaklan!'"
- 🛡️ **Jüri Stratejisi / Not:** Sunumun en can alıcı noktalarından biri. Bu konseptin endüstriyel vizyonu hocaların çok hoşuna gidecektir.

**SLAYT 16: Algoritma 1: Kombine Kuralların İşleyiş Şeması**
- 👁️ **Slayt Tasarımı:**
  - [BURAYA ŞEKİL 1 AKIŞ ŞEMASI KESİLİP EKLENECEK]
  - Felsefesi: While döngüsü içinde dinamik karar ağacı ve makine belleklerinin güncellenmesi.
- 🗣️ **Sunucu Konuşma Metni:** "Burada Algoritma 1'in mimarisini görüyoruz. Sistem sonsuz bir While döngüsü içinde kalan işleri tarıyor. Her atamada, sadece o işin değil, o tezgaha gelecek bir sonraki olası tüm işlerin hazırlık sürelerini ve tamamlanma zamanlarını güncelliyor. $t_s$ bariyerine çarpana kadar Kural 1'i, aşarsa Kural 2'yi acımasızca işletiyor."
- 🛡️ **Jüri Stratejisi / Not:** Akış şemasının çok teknik duruşu, sunumun ağırlığını artırır. Çok detayına girmeden güncelleme mantığını verip geçin.

---

### BÖLÜM 4: CANLI DEMO VE SİMÜLASYON

**SLAYT 17: 💻 CANLI UYGULAMA (Python Algoritma Demostrasyonu)**
- 👁️ **Slayt Tasarımı:**
  - Büyük puntoyla: "BİLGİSAYARLARIN KİLİTLENDİĞİ PROBLEMDEN MİLİSANİYELİK ÇÖZÜMLERE..."
  - (Alt kısımda) "Lütfen ekranı takip ediniz..."
- 🗣️ **Sunucu Konuşma Metni:** "Şimdi sizleri slaytlardan alıp, geliştirdiğimiz algoritmanın kalbine götürmek istiyorum. CPLEX'in çözemediği o yüzlerce işlik senaryoları Python'da nasıl modellediğimizi, kombine kurallarımızın o karmaşık hazırlık süresi matrislerini milisaniyeler içinde eriterek Makespan ve Tardiness değerlerini nasıl ekrana döktüğünü canlı bir demo ile göstermek isterim."
- 🛡️ **Jüri Stratejisi / Not:** Kod demosunda kodun mimarisinden ziyade HIZINA ve SONUÇLARINA odaklanın. "Gördüğünüz gibi sistem hemen cevap üretti" deyin.

**SLAYT 18: Küçük Problem Örnekleri: Sezgisel Yöntemler Pareto'ya Ne Kadar Yakın?**
- 👁️ **Slayt Tasarımı:**
  - [BURAYA TABLO 13 RESMİ KESİLİP EKLENECEK]
  - Kritik Soru: Matematiksel olarak optimal olana ne kadar yakınsadık?
  - Açıklama: Hız bedava değildir, ancak tavizimiz yok denecek kadar azdır.
- 🗣️ **Sunucu Konuşma Metni:** "Kodu gördük, inanılmaz hızlı. Peki ama matematiğe ne kadar yakın? Tablo 13'te görüldüğü üzere, sezgisel algoritmamızı M4'ten elde ettiğimiz optimal Pareto çözümleriyle çarpıştırdık. Bazı noktalarda Pareto'dan %8 civarı uzaklaşırken, diğer amaç fonksiyonunda Pareto'dan daha bile iyi sonuçlar elde ettik. Kısacası, hız kazanırken kaliteden verdiğimiz taviz son derece sınırlı."
- 🛡️ **Jüri Stratejisi / Not:** Heuristiklerin optimal olmadığı eleştirisine önceden verilmiş, çok iyi istatistiksel bir cevaptır.

---

### BÖLÜM 5: ENDÜSTRİYEL VERİ ANALİZİ VE KARAR VERME

**SLAYT 19: 18 Aylık Gerçek Fabrika Verisinin Anatomisi**
- 👁️ **Slayt Tasarımı:**
  - 18 Aylık Süreç (Ocak 2019 - Haz 2020)
  - Çeşitlilik: 413 Ürün, 26 Ürün Ailesi
  - Yoğunluk: Ayda 3639'a varan müşteri siparişi (298 Ana İş)
  - [BURAYA TABLO 14 RESMİ KESİLİP EKLENECEK]
- 🗣️ **Sunucu Konuşma Metni:** "Gelelim bu kuralları test ettiğimiz arenaya. Fabrikanın 18 aylık gerçek geçmiş verisini masaya yatırdık. İçerisinde 400'den fazla ürün ve saniyede değişen binlerce müşteri siparişi var. Test algoritmamız işte bu gerçek endüstriyel stres altında denenmiştir."
- 🛡️ **Jüri Stratejisi / Not:** "Toy data" (oyuncak veri) kullanmadığınızı, tamamen gerçek hayat problemi çözdüğünüzü gösterin.

**SLAYT 20: Veriyi Anlamak: K-Ortalamalar (K-Means) ile Talep Senaryoları (Düşük/Yüksek)**
- 👁️ **Slayt Tasarımı:**
  - [BURAYA ŞEKİL 4 (18 Aylık Talep Eğrisi) RESMİ KESİLİP EKLENECEK]
  - Analitik Araç: Makine Öğrenmesi (K-Means Clustering).
  - Metrik: Siluet (Silhouette) Skoru ile 2 ana küme (Düşük ve Yüksek talep).
- 🗣️ **Sunucu Konuşma Metni:** "Bu 18 ayı analiz ederken göz kararı bir gruplama yapmadık. Verileri K-Ortalamalar, yani makine öğrenmesi algoritmalarına soktuk. Siluet skorunun bize verdiği istatistiksel kanıta dayanarak fabrikanın aylarını 'Yüksek Talep' ve 'Düşük Talep' olmak üzere kesin sınırlarla iki senaryoya böldük."
- 🛡️ **Jüri Stratejisi / Not:** İstatistik ve Veri Madenciliği (K-Means, Silhouette score) kullanmanız, projenin sadece yöneylem değil, veri analitiği kısmının da güçlü olduğunu ispatlar.

**SLAYT 21: Tekli Kuralların İstatistiksel Çarpışması (ANOVA ve Tukey Testleri)**
- 👁️ **Slayt Tasarımı:**
  - [BURAYA TABLO 16 RESMİ KESİLİP EKLENECEK]
  - Elenen Kural: SC-LPT (İstatistiksel olarak en kötü performans).
  - Açıklama: Sadece hislerle değil, ANOVA ve Tukey testleriyle kuralların elenmesi.
- 🗣️ **Sunucu Konuşma Metni:** "Senaryolar belli olduktan sonra 3 tekli kuralımızı yarıştırdık. ANOVA ve Tukey testlerinin sonuçları çok keskindi. SC-LPT kuralı, yani en uzun işi önce alma stratejisi, bizim fabrikamızın doğasına uymadı ve istatistiksel olarak sınıfta kaldı. Bu yüzden analizin geri kalanında bu kuralı tamamen eledik ve yola SCT ile SC-EDD ile devam ettik."
- 🛡️ **Jüri Stratejisi / Not:** Eleme işlemini hislere değil p-değerlerine dayandırmanız mükemmel bir akademik duruştur.

**SLAYT 22: Kombine Kuralların Performansı ve Üç Faktörlü Etkileşim**
- 👁️ **Slayt Tasarımı:**
  - [BURAYA TABLO 17 (ANOVA for makespan) ve ŞEKİL 5 RESİMLERİ EKLENECEK]
  - Dağıtım Kuralı x Kural Değiştirme Zamanı x Talep Senaryosu = Anlamlı Etkileşim.
- 🗣️ **Sunucu Konuşma Metni:** "Kombine kurallara geçtiğimizde, işin içine kural değiştirme zamanı ($t_s$) girdiği için çoklu regresyon modelleri kurduk. Üç faktörlü etkileşimin p-değerinin anlamlı olduğunu gördük. Yani bir kuralın başarısı, fabrikanın o anki talep yoğunluğuna ve kuralı ayın hangi saatinde ($t_s$) değiştirdiğinize doğrudan bağlıdır."
- 🛡️ **Jüri Stratejisi / Not:** Jüride istatistik kökenli bir hoca varsa "Etkileşim (interaction) anlamlı mıydı?" diyecektir. Buna ANOVA tablosuyla peşin cevap veriyorsunuz.

**SLAYT 23: Karar Verme Çıkmazı: Çok Kriterli Optimizasyona Geçiş**
- 👁️ **Slayt Tasarımı:**
  - Elimizde 36 farklı kombinasyon kaldı.
  - Ama hala 3 çatışan hedefimiz var ($C_{max}, T, L$).
  - Kural seçimi artık bir ÇKKV (Çok Kriterli Karar Verme) problemidir.
- 🗣️ **Sunucu Konuşma Metni:** "İstatistiksel elemelerden sonra elimizde güçlü kurallar kaldı. Ancak temel problemimiz hala masada duruyor: Bir kural Makespan'ı ezerken, diğer kural Tardiness'ı çok iyi çözüyor. Yüzlerce olasılık arasında fabrika müdürü hangi kuralı düğmeye basıp çalıştıracak? İşte burada Yöneylem Araştırmasından Çok Kriterli Karar Verme teorisine geçiş yaptık."
- 🛡️ **Jüri Stratejisi / Not:** Konudan konuya bağlama slaytı. Jüriyi TOPSIS aşamasına hazırlıyor.

**SLAYT 24: TOPSIS Yöntemi: Yöneticinin Ağırlıkları ($w_C, w_T, w_L$) Doğrultusunda En İyi Seçim**
- 👁️ **Slayt Tasarımı:**
  - [BURAYA TABLO 21 RESMİ KESİLİP EKLENECEK]
  - Ölçüt Ağırlıkları ($w_C + w_T + w_L = 1$)
  - Pozitif İdeal Çözüme Yakınlık, Negatiften Uzaklık.
- 🗣️ **Sunucu Konuşma Metni:** "Problemi çözmek için TOPSIS yöntemini koda entegre ettik. Sisteme şunu dedik: Yönetici gelsin ve hedeflerin ağırlığını girsin. Örneğin yayılma süresine \%36, toplam gecikmeye \%30, iş sayısına \%34 önem versin. TOPSIS bu ağırlıkları alır, ideal çözüme en yakın ve en kötüden en uzak olan dağıtım kuralını anında seçip karşımıza çıkarır."
- 🛡️ **Jüri Stratejisi / Not:** Formüllere girmeyin, TOPSIS'in mantığını "İdeale yakınlık, kötüye uzaklık" diyerek bir cümleyle anlatın.

---

### BÖLÜM 6: SONUÇLAR VE GELECEK YÖNELİMLER

**SLAYT 25: Nihai Karar Matrisi: Hangi Senaryoda Hangi Kural Kazandı?**
- 👁️ **Slayt Tasarımı:**
  - Yüksek Talep (Kriz Anı): [SCT & SC-LPT: 450] (Makineleri aralıksız doldur)
  - Düşük Talep (Stabil An): [SC-EDD & SCT: 200] (Hemen termin tarihlerine odaklan)
  - Felsefe: Sistem dinamik, kurallar akışkan.
- 🗣️ **Sunucu Konuşma Metni:** "Tüm bu karmaşık hesaplamaların bize verdiği nihai endüstriyel sonuç şu oldu: Eğer fabrikada Yüksek Talep varsa, yani kaos yaşanıyorsa ince ayar yapacak vaktiniz yoktur; [SCT & SC-LPT] kuralıyla makineleri devir daim ettirmeniz gerekir. Ancak talep görece Düşükse, fabrikada nefes alacak yeriniz vardır, bu durumda hemen [SC-EDD & SCT] kuralına geçip direkt müşteri memnuniyetine odaklanmalısınız."
- 🛡️ **Jüri Stratejisi / Not:** Tüm matematiksel terin sahadaki yönetimsel karşılığını vererek mühendislik vizyonunuzu kanıtlıyorsunuz.

**SLAYT 26: Araştırmanın Üretim Planlama Literatürüne Temel Katkıları**
- 👁️ **Slayt Tasarımı:**
  - İlişkisiz Paralel Tezgahlarda Üçlü Hedef (Büyük Boşluk Dolduruldu).
  - Klasik kurallara hazırlık süresi ($S_{i,j,k}$) gömülmesi.
  - $t_s$ İnovasyonu: Çizelgeleme sırasında anlık taktik değişimi.
- 🗣️ **Sunucu Konuşma Metni:** "Peki bu proje literatüre ne kattı? Birincisi, ilişkisiz paralel tezgah ve sıra-bağımlı hazırlık kısıtlarında bu üç çatışan hedefi bir araya getiren bir çalışma yoktu. İkincisi, SPT gibi statik kuralları alıp matris mantığıyla akıllandırdık. Üçüncüsü ve en önemlisi; kural değiştirme ($t_s$) zamanı icadıyla çizelgeleme sırasında duruma göre taktik değiştiren, otonom bir yapı inşa ettik."
- 🛡️ **Jüri Stratejisi / Not:** Kendi çalışmanızın değerini yüksek perdeden (ama kibre kaçmadan) savunduğunuz yer.

**SLAYT 27: Modelin Sınırları ve Gelecek Çalışmalar (Meta-Sezgiseller)**
- 👁️ **Slayt Tasarımı:**
  - Sınırlar: Dağıtım kuralları "lokal optimum"a takılabilir.
  - Gelecek Vizyonu: Üretilen bu DDR çözümleri, Genetik Algoritma veya Tabu Arama için "tohum (başlangıç) popülasyonu" olarak kullanılabilir.
- 🗣️ **Sunucu Konuşma Metni:** "Elbette her modelin bir sınırı vardır. Dinamik Dağıtım Kuralları mükemmel hız sağlar ama doğası gereği her zaman global optimumu garanti edemez. Gelecek çalışmalarda, bizim bu kurallarla mili-saniyede bulduğumuz sonuçları, Tabu Arama veya Genetik Algoritmalara 'başlangıç popülasyonu' olarak verirsek, çok daha muazzam sonuçlar ve yeni Pareto cepheleri elde edebiliriz."
- 🛡️ **Jüri Stratejisi / Not:** Jüri sormadan kendi zayıf noktanızı söyleyip bunu nasıl çözeceğinizi (meta-sezgisel başlangıç popülasyonu) anlattığınız an savunmayı %100 kazanırsınız.

**SLAYT 28: Teşekkür ve Soru-Cevap**
- 👁️ **Slayt Tasarımı:**
  - İTÜ Logosu
  - "Teşekkür Ederim"
  - Soru ve Cevaplar (?)
- 🗣️ **Sunucu Konuşma Metni:** "Kaosu bir senfoniye dönüştürme yolculuğumuzda beni dinlediğiniz için çok teşekkür ederim. Tasarım, kodlama veya matematiksel altyapıyla ilgili değerli sorularınızı yanıtlamaktan büyük memnuniyet duyarım."
- 🛡️ **Jüri Stratejisi / Not:** Tebessüm edin ve soruları dinlerken asla hocaların sözünü kesmeyin.

---

# BÖLÜM B: SLAYTLARIN HAZIRLANMASI (Bu alan adım adım doldurulacaktır)
