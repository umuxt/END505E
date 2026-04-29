# Makale Genel Bakış

## Künyesi
- **Dergi:** Decision Analytics Journal, Cilt 13, 2024, Makale No: 100525
- **Yayın Tarihi:** 4 Kasım 2024 (online)
- **DOI:** https://doi.org/10.1016/j.dajour.2024.100525
- **Erişim:** Açık erişim (CC BY-NC-ND 4.0)

## Başlık
- **İngilizce:** A multi-objective production scheduling model and dynamic dispatching rules for unrelated parallel machines with sequence-dependent set-up times
- **Türkçe (Öneri):** Sıra Bağımlı Hazırlık Süreleri ile İlişkisiz Paralel Makineler için Çok Amaçlı Üretim Çizelgeleme Modeli ve Dinamik Öncelik Kuralları

## Yazarlar
- Pham Duc Tai
- Papimol Kongsri
- Prasal Soeurn
- Jirachai Buddhakulsomsiri *(Sorumlu yazar)*

**Kurum:** Sirindhorn International Institute of Technology, Thammasat University, Tayland

---

## Özet (Türkçe)

Bu çalışma, **makine ve iş sırası bağımlı hazırlık süreleri** olan **ilişkisiz paralel makineler** için üretim çizelgelemesini ele almaktadır.

**Minimize edilmek istenen performans ölçütleri:**
1. Tamamlanma zamanı (makespan — C_max)
2. Toplam teslim gecikmesi süresi (total tardiness — T)
3. Geciken iş sayısı (number of tardy jobs — L)

**Çalışmanın iki ana katkısı:**
1. **MILP Modeli:** Küçük problem örnekleri için karma tamsayılı doğrusal programlama modeli ve AUGMECON yöntemiyle Pareto çözüm kümesi
2. **DDR Sezgiseli:** Büyük problem örnekleri için dinamik öncelik kuralı tabanlı sezgiseller (SCT, SC-LPT, SC-EDD ve bunların 6 kombinasyonu)

**Uygulama:** Tayland'ın en büyük çelik boru üreticisinden alınan gerçek veri (18 aylık üretim verisi, 244–298 iş/ay, 10 makine)

---

## Problem Tanımı

- **n** iş, **m** ilişkisiz paralel makine
- Tüm işler dönem başında hazır (aynı serbest bırakma zamanı)
- İşin hazırlık süresi: hem makineye hem de o makinedeki bir önceki işe bağlı
- İlk iş için hazırlık süresi = 0 (dönem başında yapılıyor)
- Her iş yalnızca belirli makinelerde işlenebilir (makine kısıtı)

---

## Makalenin Yapısı

| Bölüm | İçerik |
|-------|--------|
| 1 | Giriş, motivasyon, katkılar |
| 2 | Literatür taraması (Tablo 1) |
| 3 | Matematiksel model (M1, M2, M3, M4) |
| 4 | Dinamik öncelik kuralı sezgiselleri (SCT, SC-LPT, SC-EDD) |
| 5 | Hesaplamalı çalışma (küçük ve büyük örnekler, TOPSIS analizi) |
| 6 | Sonuç |

---

## Literatürdeki Boşluk (Research Gap)

Tablo 1'e göre, **ilişkisiz paralel makineler + makine & sıra bağımlı hazırlık süresi + makespan & toplam gecikme & geciken iş sayısı** üç ölçütünü birlikte ele alan **daha önce hiçbir çalışma yoktur**. Bu makale bu boşluğu doldurmaktadır.
