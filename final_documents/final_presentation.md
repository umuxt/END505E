# END505E - Proje Sunumu: İlişkisiz Paralel Tezgah Çizelgeleme Problemi

---

## Slayt 1: Başlık ve Amaç
- **Konu:** Sıra ve Tezgaha Bağımlı Hazırlık Sürelerine Sahip İlişkisiz Paralel Tezgah Çizelgeleme Problemi
- **Temel Problem:** Hız ve Müşteri Memnuniyeti arasındaki zıtlığı yönetmek (Trade-off).
- **Yöntem:** MILP (Karışık Tamsayılı Doğrusal Programlama), AUGMECON ve Dağıtım Kuralı Tabanlı Sezgisel Yöntemler (DDR).

---

## Slayt 2: Problem Tanımı (UPMSP)
- **İlişkisiz Paralel Tezgahlar:** Her tezgahın farklı yetenekleri vardır (İşlem süreleri $P_{j,k}$ tezgaha göre değişir).
- **Bağımlı Hazırlık Süreleri:** Makine ayar süresi ($S_{i,j,k}$), hem kullanılan tezgaha hem de bir önceki işe bağlıdır.

---

## Slayt 3: Amaç Fonksiyonları ve Notasyon Uyarısı
Modelimiz aynı anda 3 amacı iyileştirmeye çalışır:
1. **Yayılma Süresi ($C_{max}$):** Tüm işlerin tamamlanma zamanı (Sistem Verimliliği).
2. **Toplam Teslim Gecikmesi ($T$):** Toplam bekleme süresi (Müşteri Memnuniyeti).
3. **Geciken İş Sayısı ($L$):** Siparişi geciken müşteri sayısı.

> **⚠️ JÜRİ İÇİN KRİTİK NOT:** 
> Standart çizelgeleme teorisinde $L$ "Lateness" ($C_j - d_j$) demektir. Ancak bu makalenin yazarları, Geciken İş Sayısını ($N_T$ veya $\sum U_j$) kısaca ifade etmek için **$L$** sembolünü kullanmıştır. Makaleye sadık kalınmıştır.

---

## Slayt 4: Önerilen Modeller (M1 - M4)
- **M1:** Sadece Yayılma Süresini ($C_{max}$) minimize eder.
- **M2:** Sadece Toplam Teslim Gecikmesini ($T$) minimize eder.
- **M3:** Sadece Geciken İş Sayısını ($L$) minimize eder (Big-M kısıtı kullanılarak).
- **M4 (AUGMECON):** $\epsilon$-kısıt yöntemiyle üç amaç arasındaki en iyi denge noktalarını (Pareto Cephesi) bulur.

---

## Slayt 5: Dinamik Dağıtım Kuralları (DDR)
Büyük ölçekli problemleri çözmek için klasik kurallar modifiye edilmiştir:
- **SCT:** En Kısa Tamamlanma Zamanı (Yayılma süresi odaklı)
- **SC-EDD:** Hazırlık Süreli En Erken Teslim Tarihi (Gecikme odaklı)
- **SC-LPT:** Hazırlık Süreli En Uzun İşlem Süresi
- **Kombine Kurallar ($t_s$):** Belli bir kural değiştirme süresinden sonra strateji değiştirilir (Örn: Önce SCT, sonra SC-EDD).

---

## Slayt 6: Hesaplamalı Çalışma ve TOPSIS Analizi
- **Endüstriyel Veri:** 18 aylık gerçek talep verisi (Düşük ve Yüksek talep senaryoları).
- **Sonuç:** Yüksek talepte $C_{max}$ için SCT kuralı birinci olurken, Düşük talepte [SCT & SC-EDD: 450] kuralı birinci olmuştur.
- **TOPSIS Analizi:** Karar vericinin (Yöneticinin) 3 amaca vereceği ağırlıklara ($w_C, w_T, w_L$) göre hangi kuralın en iyi olduğunu belirleyen matematiksel karar destek sistemi.

---

## Slayt 7: Sonuç ve Çıkarımlar
- **Uyarlanabilirlik:** Operasyonel dayanıklılık (resilience) için tek bir kural yerine dinamik kuralların kullanılması şarttır.
- **Gelecek Çalışmalar:** Meta-sezgisel yöntemlerin entegrasyonu ve çoklu operasyonlu (in-sequence) problemlere genişletilmesi.
