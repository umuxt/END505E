# UPMSP Projesi - Hoca Sunumu İçin Kritik Teknik Notlar (Cheat Sheet)

Sunum sırasında hocanın dikkatini çekebilecek ve projenin "ekstra" değerini kanıtlayacak teknik noktalar aşağıda özetlenmiştir.

---

### 1. Matematiksel Model Düzeltmeleri (Akademik Titizlik)
Hocaya, makaledeki bazı denklemlerin dizgi hataları içerdiğini ve bunları kodlarken düzelttiğimizi vurgulayın:
*   **Denklem (9) - NP Kısıtı:** Makalede indis hatası vardı, her makine ($k$) için ayrı kısıt eklenerek düzeltildi.
*   **Denklem (16) - Gecikme Göstergesi:** Makalede "eşitlik" ($=$) olarak verilmişti, ancak bu çözüm uzayını hatalı daraltıyordu. "Küçük-eşittir" ($\leq$) olarak güncellenerek standart MILP formuna getirildi.

### 2. Görselleştirme İnovasyonu: "Time-Phased Gantt"
250 işlik bir Gantt şemasının tek satırda okunamayacağını fark ettiğimizi belirtin:
*   **Çözüm:** Timeline'ı **250 birimlik parçalara** böldük.
*   **Carry-over Mantığı:** Bir iş 250. birimde bitmiyorsa, otomatik olarak bir sonraki satıra "devam ediyor" şeklinde aktarılıyor. Bu, yüksek çözünürlüklü ve hatasız bir çıktı sağlıyor.

### 3. Profesyonel Raporlama (Rowspan)
*   PDF çıktılarında amatör bir görünüm olmaması için CSS `rowspan` özelliğini kullandık.
*   Makineler dikey olarak birleştirildi (merge) ve ortalandı, böylece veri-görsel hiyerarşisi sağlandı.

### 4. Çift Çözücü Mimarisi (Dual-Solver)
*   **SCIP (MILP):** Makale denklemlerini %100 doğrulamak için kullanıldı.
*   **CP-SAT (Industrial):** Büyük veri setlerinde SCIP'in saatlerce çözemediği sonuçları saniyeler içinde bulması için entegre edildi.
*   **Karşılaştırma:** Hocaya "Hocam, akademik sadakat için SCIP, endüstriyel hız için CP-SAT kullandık" diyerek teknik derinliğinizi gösterin.

### 5. Karar Destek Katmanı (TOPSIS & Pareto)
*   Sadece bir kural çalıştırmak yerine, **39 farklı konfigürasyonu** yarıştırıp TOPSIS ile "En İyi Uzlaşı Çözümü"nü bulan tam bir Karar Destek Sistemi (DSS) geliştirdik.

---
**Bu notlar, projenin "kopyala-yapıştır" bir ödev değil, üzerine mühendislik vizyonu eklenmiş bir çalışma olduğunu kanıtlar.**
