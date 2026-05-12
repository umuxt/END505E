export const flowNarratives = {
  introMotivation:
    "Bu çalışma, ilişkisiz paralel tezgahlarda (UPMSP) sıra ve tezgah bağımlı hazırlık sürelerini (Sᵢⱼₖ) ele alan çok amaçlı bir çizelgeleme sistemidir.",
  introMetrics:
    "Performans ölçütleri: Yayılma Süresi (Cₘₐₓ), Toplam Gecikme (T) ve Geciken İş Sayısı (L). Bu kriterler arasındaki ödünleşim, Karar Destek Sistemimizin temelidir.",
  introPaperBridge:
    "Raporun 1. bölümünde belirtildiği üzere, Tayland'daki çelik boru üreticisinin 298 işlik gerçek senaryosunu modellemek için önce bu teorik altyapının kurulması, kısıtların ve amaç fonksiyonlarının matematiksel olarak tanımlanması elzemdir.",
  literatureGap:
    "Tablo 1'de gösterildiği üzere, literatürde Sᵢⱼₖ dâhil edilerek Cₘₐₓ, T ve L'yi eş zamanlı optimize eden başka bir çalışma bulunmamaktadır.",
  literatureBridge:
    "Literatür özeti, bu akışın neden hem kesin çözüm hem de sezgisel yöntemleri bir arada kullandığını gösterir; amaç, boşluğu yöntem seçimiyle kapatmaktır.",
  literatureApplied:
    "Literatürdeki bu araştırma boşluğunu doldurmak için tasarladığımız sistem, hem AUGMECON ile Pareto-optimal çözümleri bulmayı hem de DDR ile büyük ölçekli problemlerde hızlı ve verimli kararlar almayı hedefler.",
  dataSetIntro:
    "Analizlerimizde referans aldığımız 3 İş ve 2 Tezgahlık küçük ölçekli veri seti aşağıdadır.",
  dataModelBridge:
    "Gerçek senaryodaki aileye bağlı işlem ve teslimat verileri, modelin yalnızca teorik değil, üretim ortamına uyarlanmış bir yapı olduğunu gösterir.",
  prepTimeImportance:
    "Hazırlık süreleri, ürün aileleri arası geçişteki gizli maliyeti temsil eder; bu yüzden Cₘₐₓ ve gecikme metrikleri üzerinde doğrudan etkileri vardır.",
  prepTimeApplied:
    "Hazırlık sürelerinin (Sᵢⱼₖ) modele dahil edilmesi kritiktir; çünkü ürün aileleri arası geçişlerdeki zaman kayıpları, toplam üretim süresini (Makespan) ve teslimat performansını doğrudan etkiler.",
  dataIntegrityNote:
    "Karmaşık Sᵢⱼₖ matrisleri görüntülenirken amaç veri kaybını önlemek ve karar vericinin tüm geçiş maliyetlerini aynı bağlamda görmesini sağlamaktır.",
  dataIntegrityApplied:
    "Karmaşık Sᵢⱼₖ matrislerini işlerken hiçbir veri kaybı yaşanmaması için sayfalama ve sanal kaydırma teknolojileri kullanılarak, verinin tüm akademik zenginliği korunmuştur.",
  m4Compromise:
    "M4, üç ölçütü birlikte dengeleyen uzlaşmacı modeldir; tablodaki rolü tek amaçlı modellerden çıkan ödünleşimi görünür hale getirmektir.",
  augmeconBridge:
    "AUGMECON, T ve L ölçütlerini üst sınırlarla kısıtlayıp Cₘₐₓ için uzlaşmacı çözümler üretir; böylece tek bir en iyi çözüm yerine Pareto cephesi elde edilir.",
  exactSolverBridge:
    "İş sayısı büyüdükçe kesin çözücülerin maliyeti hızla artar; bu yüzden küçük örneklerde MILP, büyük örneklerde DDR akışı kullanılır.",
  intractableBridge:
    "Küçük ölçekli problemler için kesin çözücü motorlarla global optimumu arıyoruz. Ancak makalede de vurgulandığı üzere, problem boyutu büyüdükçe (n > 15) kesin çözüm yöntemleri matematiksel olarak intractable hale gelir; bu noktada sezgisel algoritmalar (DDR) devreye girer.",
  ddrIntro:
    "SCT, SC-EDD ve SC-LPT temel kurallardır; hibrit versiyonlar belirlenen tₛ anında bir kuraldan diğerine geçerek yük, teslim ve tamamlanma süresi arasında denge kurar.",
  ddrSwitching:
    "39 konfigürasyon, tekli kurallar ile kural değiştirme zamanına sahip hibrit kuralların performans farkını aynı akış içinde kıyaslamak içindir.",
  topsisLegend:
    "Ağırlıklar w₁, w₂, w₃; karar vericinin Cₘₐₓ, T ve L arasındaki önceliklerini yansıtır ve sıralamayı doğrudan değiştirir.",
  topsisSelectionNote:
    "TOPSIS, Pareto kümesindeki adayları ideal ve anti-ideal noktalara göre sıralar; seçilen kural, bu dengeyi en iyi koruyan alternatiftir.",
  topsisApplied:
    "Bu aşama yalnızca seçilen optimal çizelgeyi sunar. TOPSIS, Pareto kümesindeki alternatifleri ağırlıklı tercih yapısına göre sıralar; CC* değeri 1'e yaklaştıkça çözüm ideal noktaya yaklaşır.",
  ganttLegend:
    "Gantt şemasındaki yeşil bloklar işlem süresini, mor bloklar sıra-bağımlı hazırlık süresini gösterir; bu ayrım çizelge kalitesinin nedenini okunur hale getirir.",
  ganttApplied:
    "Gantt şemasındaki yeşil bloklar net işlem süresini (Pⱼ,ₖ), mor bloklar ise o tezgahtaki bir önceki işten kaynaklanan sıra-bağımlı hazırlık süresini (Sᵢ,ⱼ,ₖ) temsil eder.",
  liveValidationNote:
    "Bu bölüm makaledeki istatistiksel ispatı yeniden üretmez; kullanıcı tarafından üretilen verideki performans farkını gösterir.",
  liveComparisonNote:
    "Canlı kural özeti, en etkili hibrit seçenekleri karar vericiye hızlı referans olarak verir; bu özet sonuçların neden seçildiğini yorumlamaya yardımcı olur.",
  liveApplied:
    "Buradaki kural özeti, makaledeki etkili konfigürasyonları canlı verideki sıralama ile aynı panelde gösteren yardımcı bir referanstır; istatistiksel ispat yerine karşılaştırma amacı taşır.",
  conclusionTitle:
    "08. Sonuç ve Değerlendirme (Rapor Bölüm 6)",
  conclusionCaution:
    "Bu akış bir öğretici ve karar destek demo’sudur; amaç, makaledeki yöntemleri kullanıcı girdisi üzerinde şeffaf biçimde göstermek ve yorumlamaktır.",
  conclusionSummary:
    "Sonuç ekranı, sadece en iyi sayıları değil, kullanılan yöntemlerin hangi koşullarda değer ürettiğini de özetler; bu nedenle rapor mantığının kısa bir kapanışıdır.",
  conclusionApplied:
    "Bu çalışma, makalede önerilen hibrit dağıtım kurallarının ve TOPSIS tabanlı karar destek mekanizmasının, karmaşık üretim ortamlarında ne denli etkili sonuçlar verdiğini hem teorik hem de pratik olarak kanıtlamıştır.",
};