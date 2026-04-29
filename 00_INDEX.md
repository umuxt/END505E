# END505E — Makale Çalışması İndeksi

**Makale:** A multi-objective production scheduling model and dynamic dispatching rules for unrelated parallel machines with sequence-dependent set-up times  
**Dergi:** Decision Analytics Journal 13 (2024) 100525  
**Yazarlar:** Tai, Kongsri, Soeurn, Buddhakulsomsiri  

---

## Dosya Listesi

| # | Dosya | İçerik |
|---|-------|--------|
| 1 | [01_makale_genel_bakis.md](./01_makale_genel_bakis.md) | Künye, Türkçe özet, problem tanımı, makale yapısı |
| 2 | [02_notasyon_ve_parametreler.md](./02_notasyon_ve_parametreler.md) | Tüm semboller, parametreler, zaman/süre notu |
| 3 | [03_matematiksel_modeller_ve_formuller.md](./03_matematiksel_modeller_ve_formuller.md) | M1–M4 modelleri, tüm kısıtlar, AUGMECON adımları |
| 4 | [04_sezgisel_oncelik_kurallari.md](./04_sezgisel_oncelik_kurallari.md) | SCT, SC-LPT, SC-EDD, kombine kurallar, algoritma, sayısal örnek |
| 5 | [05_topsis_analizi.md](./05_topsis_analizi.md) | TOPSIS adımları, formüller, sayısal örnek, kural seçim koşulları |
| 6 | [06_hesaplamali_calisma_sonuclari.md](./06_hesaplamali_calisma_sonuclari.md) | ANOVA, regresyon, küçük/büyük örnek sonuçları, nihai tablo |
| 7 | [07_sunum_hazirlama_rehberi.md](./07_sunum_hazirlama_rehberi.md) | Slayt planı, resim listesi, Türkçe terim sözlüğü |
| 8 | [08_literatur_analizi_atiflar.md](./08_literatur_analizi_atiflar.md) | Temel atıfların özeti, literatür haritası, karşılaştırma tabloları |

---

## Hızlı Başvuru — Temel Formüller

| Formül | Açıklama | Dosya |
|--------|----------|-------|
| Min Cₘₐₓ (1) | M1 amaç | 03 |
| Cⱼ ≥ Cᵢ + Sᵢⱼₖ + Pⱼₖ (6) | Tamamlanma zamanı hesabı (Big-M) | 03 |
| Min T = Σeⱼ⁺ (12) | M2 amaç | 03 |
| Cⱼ - Dⱼ = eⱼ⁺ - eⱼ⁻ (13) | Gecikme/erken farkı | 03 |
| Min L = ΣUⱼ (15) | M3 amaç | 03 |
| SCT: min(Sᵢⱼₖ + Pⱼₖ) | En kısa toplam süre | 04 |
| SC-LPT: argmax Pⱼₖ → min(Sᵢⱼ*ₖ + Pⱼ*ₖ) | Uzun işi kısa tamamlan. makinede | 04 |
| SC-EDD: argmin Dⱼ → min(Sᵢⱼ*ₖ + Pⱼ*ₖ) | Yakın teslimli işi kısa tamamlan. | 04 |
| x̃ᵢ = (xᵢ - min) / (max - min) | Pareto seçim normalizasyonu | 03 |
| C*ₐ = S⁻ₐ / (S⁺ₐ + S⁻ₐ) | TOPSIS göreli yakınlık | 05 |

---

## Ana Bulgular (Özet)

| Senaryo | En İyi: Cₘₐₓ | En İyi: T | En İyi: L |
|---------|--------------|-----------|-----------|
| Yüksek Talep | SCT | SC-EDD | [SCT & SC-EDD: 450] |
| Düşük Talep | [SCT & SC-EDD: 450] | [SC-EDD & SCT: 200] | [SC-EDD & SCT: 200] |

**Kural değiştirme mantığı:** Üretim döneminin büyük bölümünde SCT kullan (makespan iyileştirir), son bölümde gecikmeye göre geç (SC-EDD veya SC-LPT).

---

## Literatürdeki Boşluk (1 Cümle)

Makine ve sıra bağımlı hazırlık süreli ilişkisiz paralel makine sistemlerinde **Cₘₐₓ + T + L** üç ölçütünü birlikte optimize eden hiçbir önceki çalışma yoktu; bu makale o boşluğu doldurmaktadır.
