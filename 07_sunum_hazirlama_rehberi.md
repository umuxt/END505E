# Sunum Hazırlık Rehberi

## Hocamızın Beklentileri (Özet)

- Bire-bir çeviri değil → **özet anlatım**
- Her formülü ayrı resim olarak yansıt + Türkçe açıklaması
- Derste kullanılan notasyonu kullan
- Kapak slaytı: ders adı, İng/Tr başlık, öğrenci bilgisi, fotoğraf
- 2. slayt: orijinal makalenin künyesi (küçük resim)

---

## Önerilen Slayt Yapısı (≈12-14 Slayt)

### Slayt 1 — Kapak
- Ders: END505E
- İngilizce başlık (makale orijinali)
- Türkçe başlık (çeviri)
- Ad, soyad, öğrenci numarası, fotoğraf

### Slayt 2 — Makale Künyesi
- Derginin orijinal başlık sayfasının küçük resmi
- Decision Analytics Journal 13 (2024) 100525
- Yazarlar, DOI

### Slayt 3 — Motivasyon ve Problem
- Gerçek sanayi problemi: Tayland çelik boru üreticisi
- 10 ilişkisiz paralel makine, yüzlerce iş/ay
- Makine ve sıra bağımlı hazırlık süresi
- Çatışan 3 hedef: Cₘₐₓ, T, L

### Slayt 4 — Problem Tanımı
- n iş, m makine, hazırlık süresi yapısı
- İş ailesi kavramı (aynı aile → kısa hazırlık, farklı aile → uzun hazırlık)
- Küçük örnek ile sezgiselleştir (3 iş, 2 makine tablosu)

### Slayt 5 — MILP Modeli (Notasyon)
- Parametreler ve karar değişkenleri tablosu
- **Resim: M1 amaç fonksiyonu (1) ve kısıt (6) formülleri**
- Kısa Türkçe açıklama

### Slayt 6 — Çok Amaçlı Model (M4) ve AUGMECON
- 3 amaç fonksiyonu (resim olarak)
- Pareto çözüm kavramı → şema veya Pareto cephesi grafiği (Şekil 3)
- Ödeme tablosu (P1 için)

### Slayt 7 — Pareto Çözümden Seçim
- Min-Max normalizasyon formülü (resim)
- Karar vericinin ağırlık ataması
- P1 örneği: Çözüm 6 seçildi

### Slayt 8 — Sezgisel Yöntem: 3 Temel Kural
- SCT, SC-LPT, SC-EDD formülleri (resim)
- Her birinin mantığı (1-2 cümle)

### Slayt 9 — Kombine Kurallar ve Algoritma
- Kural değiştirme mekanizması şeması (Şekil 1)
- 6 kombine kural listesi
- tₛ örneği: [SC-EDD & SC-LPT: 200]

### Slayt 10 — Sayısal Örnek (SCT Adım Adım)
- 3 iş, 2 makine tablosu
- Adım adım SCT uygulaması (Tablo 3)
- Sonuç: Cₘₐₓ=31, T=2, L=1

### Slayt 11 — Büyük Örnekler: Veri ve Sonuçlar
- 18 aylık gerçek veri özeti
- Düşük vs. yüksek talep senaryosu
- Tek kural ANOVA sonuçları (Tablo 16)
- SC-LPT elendi

### Slayt 12 — TOPSIS ile Kural Seçimi
- TOPSIS adımları (formüller resim olarak)
- Hangi ağırlık koşulunda hangi kural daha iyi → tablo
- Ana mesaj: wT önemine göre kural değişiyor

### Slayt 13 — Sonuçlar ve Katkı
- 3 ana katkı (MILP + DDR + TOPSIS)
- Sanayi uygulaması sonuçları tablosu
- Gelecek araştırma yönleri

### Slayt 14 — Teşekkür / Sorular

---

## Sunumda Kullanılacak Türkçe Terimler

| İngilizce | Türkçe (Derste Kullanılan) |
|-----------|--------------------------|
| Makespan | Tamamlanma zamanı |
| Total tardiness | Toplam teslim gecikmesi süresi |
| Number of tardy jobs | Geciken iş sayısı |
| Processing time | İşlem süresi |
| Setup time | Hazırlık süresi |
| Due date | Teslim tarihi |
| Completion time | Tamamlanma zamanı |
| Dispatching rule | Öncelik kuralı |
| Heuristic | Sezgisel yöntem |
| Unrelated parallel machine | İlişkisiz paralel makine |
| Sequence-dependent | Sıra bağımlı |
| Machine-dependent | Makine bağımlı |
| Pareto solution | Pareto çözümü |
| Rule-switching time | Kural değiştirme zamanı |
| Tardiness | Teslim gecikmesi süresi |
| Earliness | Erken teslim süresi |

---

## Sunumda Resim Olarak Yansıtılacak Formüller

Aşağıdaki formüller PDF'den kesilerek slayta resim olarak eklenecek, altına Türkçe açıklamaları yazılacak:

| # | Formül | Türkçe Açıklama |
|---|--------|-----------------|
| 1 | Denklem (1) | M1 amaç: Tamamlanma zamanını en küçükle |
| 2 | Denklem (6) | Tamamlanma zamanı hesabı (Big-M kısıtı) |
| 3 | Denklem (12) | M2 amaç: Toplam teslim gecikmesi süresini en küçükle |
| 4 | Denklem (13) | Gecikme–erken bitme denge kısıtı |
| 5 | Denklem (15) | M3 amaç: Geciken iş sayısını en küçükle |
| 6 | SCT formülü | En kısa toplam süre (hazırlık+işlem) olan işi seç |
| 7 | SC-LPT formülü | En uzun işlemli işi, en kısa tamamlanma sağlayan makineye ata |
| 8 | SC-EDD formülü | En erken teslimli işi, en kısa tamamlanma sağlayan makineye ata |
| 9 | TOPSIS S⁺, S⁻ | İdeal çözümlere ağırlıklı uzaklık |
| 10 | TOPSIS C* | Göreli yakınlık — büyük olan kural daha iyi |
| 11 | Min-Max normalize | Pareto çözümden seçim için normalleştirme |

---

## Word Çevirisi İçin Bölüm Planı

1. **Giriş** — Motivasyon, problem, katkılar
2. **Literatür Özeti** — Tablo 1 ile birlikte
3. **Problem Tanımı** — Varsayımlar, parametreler
4. **Matematiksel Modeller** — M1, M2, M3, M4, AUGMECON
5. **Sezgisel Yöntem** — SCT, SC-LPT, SC-EDD, kombine kurallar, algoritma
6. **Sayısal Örnek** — Tablo 2, 3, 4, 5
7. **Hesaplamalı Çalışma** — Küçük ve büyük örnekler, ANOVA, TOPSIS
8. **Sonuç**
