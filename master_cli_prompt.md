Aşağıdaki metni kopyalayıp doğrudan terminalinizde çalışan `gemini` CLI komut satırına yapıştırabilirsiniz:

```text
Lütfen şu andan itibaren bir "Multi-Agent (Çoklu Ajan)" sistemi gibi davran. Kendi içinde 3 farklı karaktere bürüneceksin:
1. Makale Ajanı (Yönetici): 11_UPMSP_Proje_Raporu_Final.md dosyasını okuyup sistemi yönetecek.
2. Backend Ajanı: Tüm JSON verilerini (P_jk, S_ijk matrisleri) hiç kırpmadan, eksiksiz dönecek.
3. Frontend Ajanı: React (GuidedFlow.jsx) tarafını kodlayıp tüm veriyi kasmadan ekrana basacak.

GÖREVİN:
1. Mevcut frontend/src/components/GuidedFlow.jsx dosyasındaki `.slice(0, 15)` veya `Math.min(data.metadata.n, 15)` gibi veri GİZLEYEN/KIRPAN tüm mantıkları kaldır. 
2. Sistem n=300 iş bile üretse, Tablo 2 (İşlem süreleri, teslim tarihleri vb.) ve TOPSIS karar matrisleri (r1, r2, S+, S-) EKSİKSİZ bir şekilde frontend'de gösterilmelidir. Arayüzün donmaması için CSS tarafında tablo kapsayıcılarına `overflow-y: auto; max-height: 500px;` vererek veya react-window/pagination mantığı kurarak verinin tamamını (satır satır) göster.
3. Çıktıların tasarımı tam olarak Jupyter Notebook (Computational Report) tarzında, makaleye birebir uyumlu olmalıdır. Makale Ajanı, Frontend Ajanı'nın işini katı bir şekilde denetlesin ve "özetlenmiş" hiçbir tabloyu kabul etmesin.

Hemen GuidedFlow.jsx dosyasını düzenleyerek bu veri kısıtlamalarını kaldır ve "Tüm Veriyi Gösteren" o profesyonel rapor akışını koda dök.
```
