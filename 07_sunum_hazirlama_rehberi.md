# Sunum Hazırlama Rehberi (15-20 Dakika - Detaylı Akış)

Bu rehber, ders hocasının 6 maddelik şartnamesine %100 uyumlu, 15-20 dakikalık bir sunum için tasarlanmış 24 slaytlık tam bir plandır.

---

## Genel Kurallar
- **Format:** Sadece PowerPoint (.pptx).
- **Görsel:** Formülleri metin olarak yazmayın, makaleden kesip resim olarak yapıştırın.
- **Dil:** Formül altındaki açıklamalar ve sunum dili tamamen Türkçe.
- **Terminoloji:** "Tamamlanma Zamanı", "Yayılma Süresi", "Teslim Gecikmesi Süresi" gibi dersteki terimleri kullanın.

---

## 24 Slaytlık Detaylı İçerik Planı

### BÖLÜM 1: GİRİŞ VE KİMLİK (2 Slayt)

#### Slayt 1: Kapak (Hocanın Özel Formatı)
1. **Görsel:** İTÜ logosu ve sağda öğrenci vesikalık fotoğrafı.
2. **Metin:** Ders adı, Makale İng/Tr başlıkları, Hazırlayan bilgileri.

#### Slayt 2: Makale Künyesi
1. **Görsel:** Makalenin ilk sayfası (Başlık, Yazarlar, Dergi logosu).
2. **Açıklama:** 2024 yılına ait, literatürdeki üç temel performans kriterini aynı anda ele alan güncel bir çalışmadır.

---

### BÖLÜM 2: PROBLEMİN TANIMI VE ÖNEMİ (3 Slayt)

#### Slayt 3: Endüstriyel Motivasyon
1. **Görsel:** Çelik boru üretim hattını temsil eden sembolik bir görsel.
2. **Metin:** Tayland'daki gerçek bir fabrika problemi. İlişkisiz paralel makineler ve yüksek hazırlık süreleri.

#### Slayt 4: Teknik Kavramlar: UPMSP ve SDST
1. **Görsel:** $P_{j,k}$ ve $S_{i,j,k}$ terimlerini gösteren küçük bir diyagram.
2. **Metin:** İşlem süreleri makineye göre değişir. Hazırlık süreleri makineye ve bir önceki işe bağlıdır.

#### Slayt 5: Çatışan Amaçlar (Performance Measures)
1. **Görsel:** Üç hedefi (Cmax, T, L) temsil eden bir denge/terazi ikonu.
2. **Metin:** Yayılma Süresi ($C_{max}$), Toplam Teslim Gecikmesi ($T$) ve Geciken İş Sayısı ($L$).

---

### BÖLÜM 3: MATEMATİKSEL MODEL - MILP (8 Slayt)

#### Slayt 6: İndeksler ve Parametreler
1. **Görsel:** Makaledeki "Indices" ve "Parameters" kısımları.
2. **Not:** Zaman (AN) ve Süre (ARALIK) ayrımına dikkat ederek parametreleri tanıtın.

#### Slayt 7: M1 Modeli (Yayılma Süresi)
1. **Görsel:** Denklem (1) ekran görüntüsü.
2. **Açıklama:** Tüm işlerin tamamlanma zamanları içinden en büyüğünü minimize etmeyi hedefler.

#### Slayt 8: Temel Atama Kısıtları (Denklem 2-5)
1. **Görsel:** Denklem (2, 3, 4, 5) ekran görüntüleri.
2. **Açıklama:** Akış dengesi kısıtları: Her iş bir öncüle ve ardıla sahip olmalı, makine akışı süreklilik göstermelidir.

#### Slayt 9: Hazırlık Süreli Zaman Kısıtı (Denklem 6)
1. **Görsel:** Denklem (6) ekran görüntüsü.
2. **Açıklama:** j işinin tamamlanma zamanı, öncülü i'ye ve hazırlık süresine ($S_{i,j,k}$) bağlı olarak "Big-M" mantığıyla hesaplanır.

#### Slayt 10: Teslim Tarihi ve Gecikme Modelleri (M2 ve M3)
1. **Görsel:** Denklem (12) ve (15) ekran görüntüleri.
2. **Açıklama:** M2 toplam gecikmeyi ($T$), M3 ise sadece geciken işlerin sayısını ($L$) minimize eder.

#### Slayt 11: AUGMECON: Pareto Analiz Altyapısı
1. **Görsel:** Denklem (18, 19) ve model M4.
2. **Açıklama:** Çok amaçlı problemi tek bir amaç fonksiyonuna (Min Cmax) indirgerken diğer amaçları kısıt (epsilon) olarak ekler.

#### Slayt 12: Analitik Denetim: Model Hatalarının Düzeltilmesi
1. **Görsel:** Orijinal Denklem (9) ve (16) ile düzeltilmiş hallerinin yan yana karşılaştırması.
2. **Metin:** Notasyonel çelişkiler ve Big-M kısıtı hataları (Eşitlik -> Eşitsizlik) tarafımızca düzeltilmiştir.

#### Slayt 13: Uygulama Mimarisi: CP-SAT & SCIP
1. **Görsel:** Yazılım ana menü görüntüsü (Option 2 vs Option 9).
2. **Metin:** 
    - Akademik sadakat için SCIP (MILP), endüstriyel performans için CP-SAT çözücüleri beraber kullanılmıştır.
    - **Proje Notu:** Bu uygulama, ödev kapsamı dışında (out-of-scope), modelleri test etmek amacıyla gönüllü olarak geliştirilmiştir.
3. **Açıklama:** Yazılım, teorik doğruluğu kanıtlamak için MILP'i, büyük verilerde hız için ise CP tabanlı motoru kullanır.
4. **Konuşmacı Notu:** "Bu uygulamanın ödevin zorunlu bir parçası olmadığını, ancak makaledeki hataları yakalamamızda ve teoriyi derinlemesine anlamamızda kilit rol oynadığını hocaya belirtin."

---

### BÖLÜM 4: SEZGİSEL YÖNTEM - DDR (5 Slayt)

#### Slayt 14: Neden Sezgisel Yöntem?
1. **Görsel:** MILP'in 10 işten sonra tıkanmasını temsil eden bir CPU süresi grafiği.
2. **Metin:** NP-Hard doğası gereği 250+ işlik gerçek dünya verileri için sezgiseller kaçınılmazdır.

#### Slayt 15: Modifiye Dağıtım Kuralları (SCT, SC-LPT, SC-EDD)
1. **Görsel:** SCT, SC-LPT ve SC-EDD tanımları.
2. **Metin:** Hazırlık sürelerini içerecek şekilde modifiye edilmiş SPT, LPT ve EDD kuralları.

#### Slayt 16: Algoritma Akış Şeması
1. **Görsel:** Figure 1: Flow chart.
2. **Metin:** Dinamik kural seçimi ve iş atama döngüsü.

#### Slayt 17: Dinamik Kural Değiştirme (Rule Switching)
1. **Görsel:** "SCT & SC-EDD : ts" kombine kural şeması.
2. **Metin:** Belirlenen bir $t_s$ zamanında strateji değiştirerek hem verimlilik hem müşteri memnuniyeti sağlanır.

#### Slayt 18: Sezgisel Formül Hatası ($C_{ik}$)
1. **Görsel:** Makaledeki eksik $C_{j,k}$ formülü ve düzeltilmiş kümülatif zaman toplama yapısı.
2. **Metin:** Makalede unutulan "makine hazır olma zamanı" terimi kodlamada düzeltilerek doğruluğu ispatlanmıştır.

---

### BÖLÜM 5: SAYISAL ÖRNEK VE TOPSIS (4 Slayt)

#### Slayt 19: Sayısal Örnek Verileri ve Adımlar
1. **Görsel:** Tablo 2 (İşlem/Hazırlık süreleri).
2. **Metin:** 2 makine 3 iş örneği üzerinde kuralların adım adım iterasyonu.

#### Slayt 20: Çözüm Sonuçları ve Gantt Şemaları
1. **Görsel:** Tablo 5 ve yazılımımızdan alınan bir GANTT Şeması görüntüsü.
2. **Metin:** DDR yaklaşımı Makespan'i 31'den 28'e düşürerek üstünlüğünü kanıtlamıştır.

#### Slayt 21: Çok Kriterli Karar Verme: TOPSIS
1. **Görsel:** TOPSIS normalizasyon ve yakınlık katsayısı ($CC_i$) formülleri.
2. **Metin:** Alternatifler arasından karar vericinin ağırlıklarına göre en dengeli olanın seçimi.

#### Slayt 22: Karar Verici Senaryoları
1. **Görsel:** Farklı ağırlık setleri ve seçilen kurallar tablosu.
2. **Metin:** Stratejik önceliğe göre (Üretim vs Müşteri) kural seçimi.

---

### BÖLÜM 6: SONUÇ VE KAPANIŞ (2 Slayt)

#### Slayt 23: Performans: MILP vs DDR
1. **Görsel:** Tablo 12/13 özeti (Gap Analizi).
2. **Metin:** Sezgiseller saniyeler içinde optimal sonuca %95+ yakınlık göstermektedir.

#### Slayt 24: Genel Değerlendirme ve Sonuç
1. **Görsel:** Çalışmanın aşamalarını özetleyen piramit görseli.
2. **Metin:** Çok amaçlı bir problemin hem teorik doğruluğu hem de pratik uygulama esnekliği sağlanmıştır.

---

## Konuşmacı İçin Kritik Hatırlatmalar
- **Zaman/Süre:** "Tamamlanma zamanı bir AN'dır, hazırlık süresi bir ARALIK'tır."
- **Analitik Not:** "Modeldeki hataları düzeltmeseydik, optimizasyon bizi yanlış yöne sevk ederdi."
- **Solver:** "Gelecek projelerde daha büyük veriler için CP-SAT motorumuz hazır."
