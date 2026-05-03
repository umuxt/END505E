# END505E — Makale Çalışması İndeksi (Yeni 5 Aşamalı Teknik Yapı)

**Makale:** A multi-objective production scheduling model and dynamic dispatching rules for unrelated parallel machines with sequence-dependent set-up times  
**Dergi:** Decision Analytics Journal 13 (2024) 100525  
**Yazarlar:** Tai, Kongsri, Soeurn, Buddhakulsomsiri  

---

## Yeni Öğrenim ve Raporlama Aşamaları

Bu repo, makaledeki akademik angaryalardan arındırılarak Endüstri Mühendisliği çıktılarına (Tablo ve Figür eşleştirmelerine) odaklanan 5 temel aşama üzerinden kurgulanmıştır.

| Aşama | Konu / İçerik | Ana Görseller |
|-------|---------------|---------------|
| **1** | **Problemin Kök Nedeni ve Literatürdeki Boşluk** <br> UPM ve SDST tanımları, Cmax-T-L çatışması ve eski makalelerin (Fanjul-Peyro, Lin vb.) yapamadığı şeyin ispatı. | Tablo 1 |
| **2** | **Matematiksel Temeller ve AUGMECON Mimarisi** <br> Big-M (Denklem 6) kısıtı ve AUGMECON ile hedeflerin kısıtlara dönüştürülmesi. Küçük ölçekli Pareto analizleri. | Fig 3, Tablo 9 |
| **3** | **Dinamik Dağıtım Kuralları (DDR) ve Algoritmik Akış** <br> SCT, SC-LPT, SC-EDD mantığı. "Kural Değiştirme (Rule Switching)" şeması ve adım adım hesaplaması. | Fig 1, Tablo 2, 3, 4, 5 |
| **4** | **Endüstriyel Veri Analizi: ANOVA, Regresyon ve TOPSIS** <br> 18 aylık veri üstünde istatistiksel ispatlar. Hangi yöneticinin hangi kuralı ne zaman seçeceğine dair TOPSIS kararı. | Fig 4, 5, Tablo 16, 19 |
| **5** | **Akademik ve Sektörel Çıktılar** <br> Modelin literatüre teorik, algoritmik ve gerçek bir çelik boru fabrikasına operasyonel (DSS) katkısı. | - |

---

## Hızlı Başvuru — Teknik Referanslar

| Formül / Kural | Açıklama |
|----------------|----------|
| **Denklem (6)** | $C_j - C_i + V \cdot (1 - X_{i,j,k}) \geq S_{i,j,k} + P_{j,k}$ <br> *Sıra bağımlı hazırlık süresini hesaplayan kritik Big-M kısıtı.* |
| **SCT (Shortest Completion Time)** | $\min(S_{i,j,k} + P_{j,k})$ <br> *Makineyi en az meşgul eden (işlem + hazırlık) işi seçme kuralı.* |
| **SC-EDD** | $\min(S_{i,j,k} + P_{j,k})$ şartıyla en küçük $D_j$'li işi seçme. <br> *Teslim tarihi patlayan işleri kurtarma hamlesi.* |
| **AUGMECON** | $\min f_1(x)$ subject to $f_2(x) \leq \epsilon_2, f_3(x) \leq \epsilon_3$ <br> *T ve L amaçlarını belirli eşiklerin ($\epsilon$) altında tutma mantığı.* |

---

## Ana Referans Dosyası
Tüm projenin teknik özeti ve hocaya sunulacak final anlatım metni tek bir dosyada toplanmıştır:
👉 **[11_UPMSP_Proje_Raporu_Final.md](./11_UPMSP_Proje_Raporu_Final.md)**
