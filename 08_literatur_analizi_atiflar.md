# Atıfta Bulunulan Temel Makaleler — Literatür Analizi

> Bu belge, seçilen makalenin dayandığı temel referansları açıklar.
> Sunum ve raporu zenginleştirmek için bu çalışmaları bağlamsal olarak kullanabilirsin.

---

## Makalenin Literatür Haritası

```
Hazırlık Süresi Türleri (Allahverdi 2015) [22]
        ↓
İlişkisiz Makine + Sıra Bağımlı Hazırlık → TEK HEDEF
    ├── Logendran et al. 2007 [12]    → Ağırlıklı gecikme, Tabu Search
    ├── Avalos-Rosales et al. 2015 [1] → Makespan, GA+MA  ← Bu makalenin MILP kaynağı
    ├── Bektur & Sarac 2019 [29]       → Ağırlıklı gecikme, ATCS + SA/TS
    └── Bajestani & Moghaddam 2009 [19]→ Ağırlıklı gecikme, BAB

İlişkisiz Makine + Sıra Bağımlı Hazırlık → ÇOK HEDEF
    ├── Chyu & Chang 2010 [25]         → WF + WT, Pareto evrimsel  ← İlk çok hedefli
    ├── Torabi et al. 2013 [26]        → WF + WT + Yük varyasyonu, MOPSO
    ├── Nikabadi & Naderi 2016 [27]    → Cmax+T+E+L, MOGA+SA
    ├── Wang & Alidaee 2018 [28]       → Çok hedefli kabul+çizelge, LS-MPGA
    ├── Lin et al. 2013 [13]           → Cmax+WC+WT, GA         ← En yakın önceki
    └── Yepes-Borrero et al. 2021 [30] → Cmax + Kaynak sayısı, IG

AUGMECON Yöntemi (Mavrotas 2009) [42]
        ↓
Bu makale:  Cmax + T + L  →  MILP(M4/AUGMECON) + DDR(SCT/SC-LPT/SC-EDD) + TOPSIS
```

---

## [1] Avalos-Rosales, Angel-Bello, Alvarez (2015)
**"Efficient metaheuristic algorithm and re-formulations for the unrelated parallel machine scheduling problem with sequence and machine-dependent setup times"**
*Int. J. Adv. Manuf. Technol.* 76(9), 1705–1718.

### Neden Önemli?
Bu makale, **seçilen makalenin MILP modelinin doğrudan kaynağıdır.** Mevcut çalışmanın M1 modeli bu çalışmadan adapte edilmiştir.

### Ne Yaptılar?
- Problem: İlişkisiz paralel makine + makine ve sıra bağımlı hazırlık süresi
- Tek hedef: **Makespan (Cₘₐₓ) minimizasyonu**
- MILP modelini yeniden formüle ettiler (daha sıkı alt sınır)
- GA (Genetik Algoritma) ve MA (Memetic Algoritma) önerdiler

### Seçilen Makaleye Katkısı
Seçilen makale bu modeli alıp **3 hedefe (Cₘₐₓ + T + L)** genişletmiş ve AUGMECON yöntemiyle Pareto çözüm setini bulmuştur.

---

## [40] Kongsri & Buddhakulsomsiri (2020)
**"A mixed integer programming model for unrelated parallel machine scheduling problem with sequence dependent setup time to minimize makespan and total tardiness"**
*2020 IEEE 7th ICIEA Conf.*, s. 605–609.

### Neden Önemli?
Bu makale, **seçilen makalenin doğrudan öncülüdür.** Aynı araştırma grubunun önceki konferans bildirisidir.

### Ne Yaptılar?
- Aynı problem yapısı
- **İki hedef:** Cₘₐₓ ve T (gecikme sayısı L yok)
- Sadece MILP; büyük örnekler için sezgisel geliştirmediler
- Pareto analizi yoktu

### Seçilen Makaleye Katkısı
Bu makale, o önceki çalışmayı L ölçütünü ekleyerek, DDR sezgiseli geliştirerek ve TOPSIS analizi yaparak genişletmiştir.

---

## [42] Mavrotas (2009)
**"Effective implementation of the ε-constraint method in multi-objective mathematical programming problems"**
*Appl. Math. Comput.* 213(2), 455–465.

### Neden Önemli?
**AUGMECON yönteminin kaynağı.** Bu yöntem olmadan Pareto çözüm kümesi bulunamazdı.

### Ne Yaptılar?
- Klasik ε-kısıt yönteminin sorunlarını tespit etti
- **Augmented ε-constraint (AUGMECON)** yöntemini geliştirdi
- Gerçek Pareto-optimal çözümleri garanti eder; sahte (weakly dominated) çözümleri eleme özelliği vardır
- Çok hedefli matematiksel programlamada standart bir araç hâline geldi

### AUGMECON'un Temel Mantığı
Bir hedefi optimize et, diğerlerini kısıt olarak ekle (ε olarak sınırla). Farklı ε değerleri için tekrar çöz → Pareto cephesini tara.

---

## [22] Allahverdi (2015)
**"The third comprehensive survey on scheduling problems with setup times/costs"**
*Eur. J. Oper. Res.* 246(2), 345–378.

### Neden Önemli?
Hazırlık süresi problemlerini sınıflandıran **kapsamlı derleme makale.** Bu çalışmanın literatürdeki yerini anlamak için temel kaynak.

### Hazırlık Süresi Sınıflandırması

| Tür | Açıklama | Örnek |
|-----|----------|-------|
| Sıra bağımsız | Sabit, önceki işe göre değişmez | Kimyasal tank temizliği |
| Sıra bağımlı | Önceki işe bağlı | Çelik boru çapı değişimi |
| Makine bağımlı | Makineye bağlı | Farklı tezgah özellikleri |
| **Makine + sıra bağımlı** | **Her ikisi de** | **← Bu makalenin problemi** |

---

## [12] Logendran, McDonell, Smucker (2007)
**"Scheduling unrelated parallel machines with sequence-dependent setups"**
*Comput. Oper. Res.* 34(11), 3420–3438.

### Neden Önemli?
İlişkisiz paralel makinelerde **sıra bağımlı hazırlık süresi** olan ilk önemli çalışmalardan biri.

### Ne Yaptılar?
- Tek hedef: **Ağırlıklı tamamlanma zamanı** minimizasyonu
- Tabu Search (TS) tabanlı sezgisel

### Seçilen Makaleye Göre Farkı
- Yalnızca tek hedef
- Makine bağımlılığı yok (sadece sıra bağımlı)
- Seçilen makale bu çalışmayı makine bağımlılığı ve çok hedeflilik ile genişletti

---

## [25] Chyu & Chang (2010)
**"A Pareto evolutionary algorithm approach to bi-objective unrelated parallel machine scheduling problems"**
*Int. J. Adv. Manuf. Technol.* 49, 697–708.

### Neden Önemli?
İlişkisiz paralel makinelerde **çok hedefli optimizasyonu** ele alan **öncü çalışma.** Sıra ve makine bağımlı hazırlık süreleri mevcut.

### Ne Yaptılar?
- **İki hedef:** Ağırlıklı akış süresi (WF) + Ağırlıklı gecikme süresi (WT)
- Pareto evrimsel algoritma (SA + GA karışımı)

### Seçilen Makaleyle Karşılaştırma
| Özellik | Chyu & Chang [25] | Seçilen Makale |
|---------|-------------------|----------------|
| Hedef sayısı | 2 (WF, WT) | **3** (Cmax, T, L) |
| Sezgisel | SA/GA | **DDR (SCT, SC-EDD, SC-LPT)** |
| Pareto yöntemi | Evrimsel | **AUGMECON** |
| Kural değiştirme | Yok | **Var (ts mekanizması)** |

---

## [13] Lin, Fowler, Pfund (2013)
**"Multiple-objective heuristics for scheduling unrelated parallel machines"**
*Eur. J. Oper. Res.* 227(2), 239–253.

### Neden Önemli?
Seçilen makaleyle en yakın benzer çalışma. Üç hedef var ama **hazırlık süresi yok.**

### Ne Yaptılar?
- **Üç hedef:** Makespan (Cₘₐₓ) + Ağırlıklı tamamlanma süresi (WC) + Ağırlıklı gecikme (WT)
- Genetik Algoritma (GA) ile Pareto çözüm kümesi
- İki sezgisel geliştirdiler

### Seçilen Makaleyle Karşılaştırma
| Özellik | Lin et al. [13] | Seçilen Makale |
|---------|-----------------|----------------|
| Hedefler | Cmax, WC, WT | **Cmax, T, L** |
| Hazırlık süresi | **Yok** | **Var (makine+sıra bağımlı)** |
| Yöntem | GA | **MILP + DDR + TOPSIS** |

---

## [26] Torabi, Sahebjamnia, Mansouri, Bajestani (2013)
**"A particle swarm optimization for a fuzzy multi-objective unrelated parallel machines scheduling problem"**
*Appl. Soft Comput.* 13(12), 4750–4762.

### Ne Yaptılar?
- **Belirsiz (fuzzy)** parametreli çok hedefli model
- **Üç hedef:** Ağırlıklı akış süresi + WT + Makine yükü varyasyonu
- MOPSO (Çok Amaçlı Parçacık Sürü Optimizasyonu)
- Makine ve sıra bağımlı hazırlık süresi vardı

### Seçilen Makaleyle Farkı
Seçilen makale belirsizlik (fuzzy) içermez; L (geciken iş sayısı) ölçütünü kullanır; Torabi'nin kullanmadığı DDR sezgiseli geliştirmiştir.

---

## [27] Nikabadi & Naderi (2016)
**"A hybrid algorithm for unrelated parallel machines scheduling"**
*Int. J. Ind. Eng. Comput.* 7(4), 681–702.

### Ne Yaptılar?
- **Dört hedef:** Cₘₐₓ + geciken iş sayısı + gecikme + erken bitme
- Sıra bağımlı hazırlık süresi (makine bağımlı değil)
- **MOGA + SA** hibrit algoritma

### Seçilen Makaleyle Farkı
Nikabadi & Naderi L ölçütünü kullansa da makine bağımlı hazırlık süresi yoktur. Seçilen makale, makine bağımlılığını da modelleyerek bu boşluğu kapatmıştır.

---

## [28] Wang & Alidaee (2018)
**"Unrelated parallel machine selection and job scheduling with the objective of minimizing total workload and machine fixed costs"**
*IEEE Trans. Autom. Sci. Eng.* 15(4), 1955–1963.

### Ne Yaptılar?
- **Sipariş kabul ve çizelgeleme** problemini birleştirdi (hangi siparişleri kabul et?)
- **İki hedef:** Toplam iş yükü + makine sabit maliyeti
- LS-MPGA (Liste çizelgeleme tabanlı çok amaçlı partenogenetik algoritma)
- Makine ve sıra bağımlı hazırlık süresi vardı

### Seçilen Makaleyle Farkı
Seçilen makale sipariş kabul kararı içermez; tüm işler çizelgelenir.

---

## [29] Bektur & Sarac (2019)
**"A mathematical model and heuristic algorithms for an unrelated parallel machine scheduling problem with sequence-dependent setup times, machine eligibility restrictions and a common server"**
*Comput. Oper. Res.* 103, 46–63.

### Neden Önemli?
Seçilen makalenin **sezgisel yöntem açısından doğrudan referans aldığı** çalışma.

### Ne Yaptılar?
- **Ortak sunucu (common server)** kısıtı: Hazırlık işlemi için tek bir ortak kaynak (insan/araç)
- **Tek hedef:** Ağırlıklı gecikme
- **ATCS (Apparent Tardiness Cost with Setups)** öncelik kuralını sıra bağımlı hazırlık süresine uyarladılar
- SA ve Tabu Search metasezgiseli

### Seçilen Makaleyle Karşılaştırma
Seçilen makale ATCS'e karşı **3 farklı kural** (SCT, SC-LPT, SC-EDD) tasarlamış, hem tek hem kombine kurallar önermiştir. Ayrıca çok hedeflidir.

---

## [30] Yepes-Borrero, Perea, Ruiz, Villa (2021)
**"Bi-objective parallel machine scheduling with additional resources during setups"**
*Eur. J. Oper. Res.* 292(2), 443–455.

### Ne Yaptılar?
- **İki hedef:** Cₘₐₓ + Gereken ek kaynak (işçi/araç) sayısı
- Makine ve sıra bağımlı hazırlık süresi
- Iterated Greedy (IG) algoritması

### Seçilen Makaleyle Farkı
Kaynak kısıtı boyutu farklı; seçilen makale kaynak kısıtı içermez, bunun yerine müşteri memnuniyeti odaklı T ve L ölçütlerini kullanır.

---

## Özet: Literatürdeki Boşluğu Anlama Tablosu

| Çalışma | Makine Türü | Hazırlık | Hedef 1 | Hedef 2 | Hedef 3 | Sezgisel |
|---------|-------------|---------|---------|---------|---------|---------|
| Logendran [12] | İlişkisiz | Sıra bağımlı | WT | — | — | TS |
| Chyu&Chang [25] | İlişkisiz | Sıra+Mak. | WF | WT | — | SA,GA |
| Lin [13] | İlişkisiz | — | Cmax | WC | WT | GA |
| Torabi [26] | İlişkisiz | Sıra+Mak. | WF | WT | Yük | MOPSO |
| Nikabadi [27] | İlişkisiz | Sıra bağımlı | Cmax | T | E, L | MOGA+SA |
| Bektur [29] | İlişkisiz | Sıra bağımlı | WT | — | — | ATCS+SA+TS |
| Yepes [30] | İlişkisiz | Sıra+Mak. | Cmax | Kaynak | — | IG |
| **Bu Makale** | **İlişkisiz** | **Sıra+Mak.** | **Cmax** | **T** | **L** | **DDR** |

> **Boşluk:** Cmax + T + L üç ölçütünü birlikte, makine ve sıra bağımlı hazırlık süresiyle, dinamik öncelik kurallarıyla ele alan çalışma **bu makaleye kadar yoktu.**
