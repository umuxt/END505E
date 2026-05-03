# Hesaplamalı Çalışma ve Sonuçlar

Bu bölüm, MILP modellerinin (AUGMECON) ve DDR sezgisellerinin performans karşılaştırmalarını ve büyük ölçekli problem sonuçlarını içerir.

## 1. Küçük Ölçekli Problemler (P1 - P4)

Küçük ölçekli problemlerde amaç, MILP modelinin kesin çözümlerini elde etmek ve sezgisellerin başarısını bu çözümlere göre ölçmektir.

### Tablo 6: Problem Örneklerinin Karakteristikleri
| Problem | İş Sayısı ($n$) | Makine Sayısı ($m$) | Talep Seviyesi | Kısıt Durumu |
| :--- | :--- | :--- | :--- | :--- |
| P1 | 10 | 3 | Düşük | Bazı makineler kısıtlı |
| P2 | 10 | 3 | Düşük | Tüm makineler uygun |
| P3 | 10 | 3 | Yüksek | Bazı makineler kısıtlı |
| P4 | 10 | 3 | Yüksek | Tüm makineler uygun |

### Performans Karşılaştırması
- **MILP Süresi:** AUGMECON yöntemiyle 10 işlik bir problemin çözümü 5 saatten fazla sürebilmektedir.
- **Sezgisel Başarısı:** SCT ve SC-EDD kuralları, MILP tarafından bulunan Pareto çözümlerine %95'in üzerinde bir benzerlik (yakınlık) göstermiştir.

---

## 2. Büyük Ölçekli Problemler ve Dağıtım Kuralları

Gerçek dünya verileriyle (200+ iş) yapılan testlerde sadece DDR sezgiselleri kullanılabilmiştir.

### Tablo 12: Dağıtım Kurallarının Performans Özeti
| Kural | Ortalama $C_{max}$ | Ortalama $T$ | Ortalama $L$ | En İyi Olduğu Durum |
| :--- | :--- | :--- | :--- | :--- |
| SCT | Düşük | Orta | Orta | Üretim Odaklı |
| SC-EDD | Orta | Düşük | Düşük | Müşteri Odaklı |
| SC-LPT | Yüksek | Çok Yüksek | Yüksek | Tavsiye Edilmez |
| **DDR Hibrit** | **En Düşük** | **Düşük** | **Düşük** | Genel Optimizasyon |

> **Ajan Notu (Endüstri Mühendisi):** Analizler göstermektedir ki, MILP modeli 10 iş ve 3 makine sınırının ötesinde pratikliğini yitirmektedir. Endüstriyel uygulamalarda **SCT & SC-EDD** hibrit kuralının kullanımı, hem makine verimliliği hem de müşteri terminlerine uyum açısından en sağlam (robust) sonuçları vermektedir.

---

## 3. TOPSIS ile En İyi Kural Seçimi

Farklı ağırlık senaryolarında TOPSIS skorlarına göre kazanan kurallar:
- **Senaryo A (Ağırlıklar: 0.5, 0.4, 0.1):** SCT kuralı öne çıkmaktadır.
- **Senaryo B (Ağırlıklar: 0.1, 0.4, 0.5):** SC-EDD kuralı öne çıkmaktadır.
- **Senaryo C (Karma):** Kural değiştirme zamanı ($t_s$) 450 olan DDR hibrit kuralları en yüksek $CC_i$ skorunu almıştır.
