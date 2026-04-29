# Hesaplamalı Çalışma — Sonuçlar ve Bulgular

## 5.1 Küçük Problem Örnekleri (MILP)

### Çözücü
- **ILOG CPLEX 20.1** kullanıldı
- En fazla 3 makine, 10 iş

### Problem Örnekleri

| Örnek | Talep | Kısıt | Makine Sayısı | İş Sayısı |
|-------|-------|-------|---------------|-----------|
| P1 | Düşük | Var (bazı işler bazı makinelerde yapılamaz) | 3 | 10 |
| P2 | Düşük | Yok (tüm işler tüm makinelerde) | 3 | 10 |
| P3 | Yüksek | Var | 3 | 10 |
| P4 | Yüksek | Yok | 3 | 10 |

### Model Karmaşıklığı (P1 için)

| Model | Karar Değişkeni | İkili Değişken | Hesaplama Süresi (P1) |
|-------|-----------------|----------------|----------------------|
| M1 (Cₘₐₓ) | 342 | 330 | 22 sn |
| M2 (T) | 362 | 330 | 8 sn |
| M3 (L) | 372 | 340 | 7 sn |
| M4 (Pareto) | 372 | 340 | 21 dk |

> M4 için P2'de **4 saat 39 dakika** sürdü → büyük örnekler için MILP pratik değil.

### P1 Ödeme Tablosu (Payoff Table)

|  | Cₘₐₓ | T | L |
|--|------|---|---|
| Min Cₘₐₓ (M1) | **71.93** | 197.75 | 6 |
| Min T (M2) | 81.00 | **11.23** | 4 |
| Min L (M3) | 127.95 | 48.95 | **1** |

> Çatışma açık: Cₘₐₓ en küçük yapılınca T en büyük; T en küçük yapılınca Cₘₐₓ artar.

### Pareto Çözüm Kalitesi (Hypervolume %)

| Örnek | Hypervolume % |
|-------|---------------|
| P1 | **91.99%** |
| P2 | 90.22% |
| P3 | 73.97% |
| P4 | 81.69% |

---

## 5.2 Büyük Problem Örnekleri (Sezgisel DDR)

### Veri Kaynağı
- Tayland'ın en büyük çelik boru üreticisi
- Ocak 2019 – Haziran 2020 (18 aylık veri)
- 413 ürün, 26 ürün ailesi
- Aylık 1359–3639 sipariş
- Ortalama 244–298 iş/ay
- 10 ilişkisiz paralel makine

### Talep Senaryoları (K-Ortalama Kümeleme)

| Senaryo | Aylar | İş Sayısı (Ort.) |
|---------|-------|-----------------|
| Düşük Talep | 1–9, 11–12 | ~244–270 |
| Yüksek Talep | 10, 13–18 | ~270–298 |

Silüet skoru en yüksek: 2 küme (skor = 0.76)

### Hesaplama Tasarımı

- 3 tek kural × 18 örnek
- 6 kombine kural × 6 kural değiştirme zamanı × 18 örnek
- Kural değiştirme zamanları: tₛ ∈ {200, 250, 300, 350, 400, 450} saat
- Toplam test: (3 + 6×6) = **39 kural** × 18 örnek × 3 ölçüt

---

## 5.2.1 Tek Kural Sonuçları

### Ortalama Performans (İstatistiksel Analiz: ANOVA + Tukey Testi)

| Senaryo | Kural | Cₘₐₓ | T | L |
|---------|-------|------|---|---|
| Düşük | **SCT** | 466.99 C | 3.915 B | 43.36 B |
| Düşük | SC-EDD | 629.86 B | 3.657 B | 51.18 B |
| Düşük | SC-LPT | 907.15 A | 26.313 A | 113.64 A |
| Yüksek | **SCT** | 637.97 C | 8.771 B | 67.14 B |
| Yüksek | SC-EDD | 827.20 B | 11.336 B | 70.00 B |
| Yüksek | SC-LPT | 1112.51 A | 55.823 A | 179.00 A |

*A, B, C: Aynı harfi paylaşmayanlar istatistiksel olarak farklıdır.*

**Sonuç:** SC-LPT en kötü → elendi. SCT ile SC-EDD arasındaki fark istatistiksel olarak anlamlı değil (gecikme ölçütlerinde).

---

## 5.2.2 Kombine Kural Sonuçları

Regresyon analizi ile her kural için kural değiştirme zamanına bağlı denklem:

| Senaryo | Kural | Regresyon Denklemi |
|---------|-------|-------------------|
| Yüksek | SCT & SC-LPT | Cₘₐₓ = 1028.2 − 0.902·tₛ |
| Yüksek | SCT & SC-EDD | Cₘₐₓ = 845.7 − 0.448·tₛ |
| Düşük | SCT & SC-EDD | Cₘₐₓ = 606.6 − 0.374·tₛ |
| Düşük | SCT & SC-LPT | Cₘₐₓ = 586.4 − 0.327·tₛ |

> Negatif eğim: tₛ büyüdükçe Cₘₐₓ küçülüyor → **Daha uzun süre SCT kullanmak makespan'i azaltır.**

### Etkin Kombine Kurallar

| Ölçüt | Düşük Talep | Yüksek Talep |
|-------|-------------|--------------|
| Cₘₐₓ | [SCT & SC-EDD: 450], [SCT & SC-LPT: 450] | [SCT & SC-LPT: 450] |
| T | [SC-EDD & SCT: 200] | [SCT & SC-EDD: 450] |
| L | [SC-EDD & SCT: 200], [SCT & SC-EDD: 450], [SCT & SC-LPT: 450] | [SCT & SC-EDD: 450], [SCT & SC-LPT: 450], [SC-EDD & SCT: 200] |

---

## 5.3 Nihai Kural Seçimi (TOPSIS ile)

### Hâkim Olmayan (Non-Dominated) Kurallar:

**Yüksek Talep:** 4 kural → SCT, SC-EDD, [SC-EDD & SCT: 200], [SCT & SC-EDD: 450]
*(SCT tarafından hâkim kılınan [SCT & SC-LPT: 450] elendi)*

**Düşük Talep:** 2 kural → [SC-EDD & SCT: 200], [SCT & SC-EDD: 450]
*(SCT ve SC-EDD ve [SCT & SC-LPT: 450] elendi)*

### Ana Bulgular

1. **SCT**, makespan ve geciken iş sayısı için güçlü bir kuraldır.
2. **[SC-EDD & SCT: 200]**, gecikme ölçütlerini optimize etmek için idealdir (özellikle düşük talepte).
3. **[SCT & SC-EDD: 450]**, birden fazla ölçütte dengeli performans sağlar.
4. **wT ≥ 0.05** ise düşük talepte [SC-EDD & SCT: 200] her zaman daha iyidir.
5. **wT > 0.50** ise yüksek talepte SC-EDD tercih edilmelidir.

---

## Sonuç Özeti

| Senaryo | En İyi: Cₘₐₓ | En İyi: T | En İyi: L |
|---------|--------------|----------|----------|
| **Yüksek Talep** | SCT | SC-EDD | [SCT & SC-EDD: 450] |
| **Düşük Talep** | [SCT & SC-EDD: 450] | [SC-EDD & SCT: 200] | [SC-EDD & SCT: 200] |
