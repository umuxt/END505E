import React, { useState, useEffect } from 'react';
import { Play, Calculator, Zap, Target, Activity, FileText, BarChart3, Copy, CheckCircle, HelpCircle, X, BookOpen, TrendingUp } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const API_BASE = 'http://127.0.0.1:8000/api';

// --- Multi-Agent Academic Components ---

const MathBox = ({ title, formula, description }) => (
  <div className="math-box" style={{ borderLeft: '4px solid var(--warning)', background: 'rgba(210, 153, 34, 0.05)', padding: '1rem', margin: '1rem 0' }}>
    <div style={{ fontWeight: 'bold', color: 'var(--warning)', marginBottom: '0.5rem', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>{title}</div>
    <code style={{ fontSize: '1.1rem', color: '#e6edf3', display: 'block', padding: '0.5rem 0' }}>{formula}</code>
    {description && <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.7, fontStyle: 'italic' }}>{description}</p>}
  </div>
);

const AgentInsight = ({ agent, message }) => {
  const colors = {
    paper: "#d29922",
    backend: "#4ade80",
    frontend: "#58a6ff"
  };
  return (
    <div className="agent-insight slide-in" style={{
      background: 'rgba(255,255,255,0.02)',
      borderLeft: `4px solid ${colors[agent] || '#30363d'}`,
      borderRadius: '4px',
      padding: '1rem',
      margin: '1.5rem 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem'
    }}>
      <div style={{ fontSize: '0.9rem', color: '#e6edf3', lineHeight: '1.5', fontWeight: 500 }}>
        {message}
      </div>
    </div>
  );
};

const ScrollableTable = ({ children, maxHeight = '400px' }) => (
  <div className="data-table-container" style={{
    maxHeight,
    overflowY: 'auto',
    overflowX: 'auto',
    border: '1px solid var(--border-color)',
    borderRadius: '8px',
    background: 'rgba(0,0,0,0.2)',
    marginTop: '1rem'
  }}>
    {children}
  </div>
);

// --- PERFORMANCE COMPONENTS ---

const PaginatedSetupMatrix = React.memo(({ data, selectedK }) => {
  const [pageI, setPageI] = useState(0);
  const [pageJ, setPageJ] = useState(0);
  const pageSize = 15;
  const n = data.metadata.n;
  const totalPages = Math.ceil(n / pageSize);

  const startI = pageI * pageSize;
  const endI = Math.min(startI + pageSize, n);
  const startJ = pageJ * pageSize;
  const endJ = Math.min(startJ + pageSize, n);

  const iIndices = Array.from({ length: endI - startI }, (_, idx) => startI + idx);
  const jIndices = Array.from({ length: endJ - startJ }, (_, idx) => startJ + idx);

  return (
    <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '8px' }}>
      <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--warning)' }}>
          🔍 Sᵢⱼₖ Matris Görünümü (İş {startI + 1}-{endI} x {startJ + 1}-{endJ})
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.65rem' }}>Satır:</span>
            <button className="btn btn-sm" disabled={pageI === 0} onClick={() => setPageI(p => p - 1)}>←</button>
            <span style={{ fontSize: '0.7rem' }}>{pageI + 1}/{totalPages}</span>
            <button className="btn btn-sm" disabled={pageI >= totalPages - 1} onClick={() => setPageI(p => p + 1)}>→</button>
          </div>
          <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.65rem' }}>Sütun:</span>
            <button className="btn btn-sm" disabled={pageJ === 0} onClick={() => setPageJ(p => p - 1)}>←</button>
            <span style={{ fontSize: '0.7rem' }}>{pageJ + 1}/{totalPages}</span>
            <button className="btn btn-sm" disabled={pageJ >= totalPages - 1} onClick={() => setPageJ(p => p + 1)}>→</button>
          </div>
        </div>
      </div>
      <ScrollableTable maxHeight="350px">
        <table className="data-table small-table sticky-column">
          <thead>
            <tr>
              <th style={{ textAlign: 'center', background: '#161b22', width: '80px' }}>i \ j</th>
              <th style={{ background: 'rgba(210,153,34,0.1)', width: '60px' }}>J0</th>
              {jIndices.map(j => <th key={j} style={{ minWidth: '60px' }}>J{j + 1}</th>)}
            </tr>
          </thead>
          <tbody>
            {iIndices.map(i => (
              <tr key={i}>
                <td style={{ fontWeight: 'bold', background: '#161b22', position: 'sticky', left: 0 }}>J{i + 1}</td>
                <td style={{ color: '#4ade80', textAlign: 'center' }}>0.00</td>
                {jIndices.map(j => {
                  const val = data.S[i]?.[j]?.[selectedK];
                  const same = data.family?.[i] === data.family?.[j];
                  return (
                    <td key={j} style={{ textAlign: 'center', background: same ? 'rgba(74, 222, 128, 0.05)' : 'transparent', color: same ? '#4ade80' : '#ff7b72', fontSize: '0.7rem' }}>
                      {i === j ? '-' : val?.toFixed(2)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>
    </div>
  );
});

const DataMatrixView = React.memo(({ data, title }) => {
  if (!data) return null;
  const { n, m } = data.metadata;
  const [selectedK, setSelectedK] = useState(0);

  const [pPage, setPPage] = useState(0);
  const pPageSize = 20;
  const pTotalPages = Math.ceil(n / pPageSize);
  const pRows = Array.from({ length: Math.min(pPageSize, n - pPage * pPageSize) }, (_, i) => pPage * pPageSize + i);

  const copyToClipboard = (obj) => {
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
    alert('Veri matrisi panoya kopyalandı!');
  };

  return (
    <div className="matrix-section slide-in mt-4">
      <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="output-header" style={{ color: 'var(--warning)', border: 'none' }}><BarChart3 size={14} /> {title} (n={n}, m={m})</div>
        <button className="btn btn-sm" onClick={() => copyToClipboard(data)} style={{ background: 'rgba(210,153,34,0.1)', color: 'var(--warning)', fontSize: '0.6rem' }}><Copy size={12} /> RAW JSON</button>
      </div>

      <div style={{ marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginBottom: '5px' }}>
          <button className="btn btn-sm" disabled={pPage === 0} onClick={() => setPPage(p => p - 1)}>Önceki</button>
          <span style={{ fontSize: '0.75rem', alignSelf: 'center' }}>İşler {pPage * pPageSize + 1}-{Math.min(n, (pPage + 1) * pPageSize)} / {n}</span>
          <button className="btn btn-sm" disabled={pPage >= pTotalPages - 1} onClick={() => setPPage(p => p + 1)}>Sonraki</button>
        </div>
        <ScrollableTable maxHeight="400px">
          <table className="data-table sticky-column" style={{ minWidth: m > 5 ? `${800 + m * 100}px` : '100%' }}>
            <thead>
              <tr>
                <th>İş (j)</th><th>Aile</th><th style={{ background: 'rgba(210,153,34,0.1)' }}>Teslim (Dⱼ)</th>
                {Array.from({ length: m }).map((_, k) => <th key={k}>M{k + 1} Pⱼₖ</th>)}
              </tr>
            </thead>
            <tbody>
              {pRows.map(j => (
                <tr key={j}>
                  <td style={{ fontWeight: 'bold' }}>J{j + 1}</td><td>F{data.family?.[j]}</td>
                  <td style={{ color: 'var(--warning)', fontWeight: 600 }}>{data.D[j]?.toFixed(2)}</td>
                  {Array.from({ length: m }).map((_, k) => <td key={k} style={{ opacity: data.P[j][k] === 9999 ? 0.2 : 1 }}>{data.P[j][k] === 9999 ? '∞' : data.P[j][k]}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollableTable>
      </div>

      <div className="mt-4" style={{ background: 'rgba(255,255,255,0.01)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
        <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600 }}><Activity size={14} /> Sᵢⱼₖ (Sıra-Bağımlı Hazırlık Süresi Matrisi)</div>
          <select className="input-field" style={{ width: 'auto', padding: '2px 8px', fontSize: '0.75rem' }} value={selectedK} onChange={e => setSelectedK(Number(e.target.value))}>
            {Array.from({ length: m }).map((_, k) => <option key={k} value={k}>M{k + 1} Tezgahı</option>)}
          </select>
        </div>
        <PaginatedSetupMatrix data={data} selectedK={selectedK} />
      </div>
    </div>
  );
});

// --- Gantt Chart Component (Upgraded for PDF Parity & Dynamic Zoom) ---
const GanttChart = React.memo(({ schedule, m, n }) => {
  const [zoomLevel, setZoomLevel] = useState(null);

  if (!schedule) return null;

  let maxEnd = 0;
  let minDuration = Infinity;

  Object.keys(schedule).forEach(k => {
    let currentT = 0;
    schedule[k].forEach(jobTuple => {
      const [jId, start, end] = jobTuple;
      const setupTime = start - currentT;
      const jobTime = end - start;

      if (end > maxEnd) maxEnd = end;
      if (setupTime > 0.01 && setupTime < minDuration) minDuration = setupTime;
      if (jobTime > 0.01 && jobTime < minDuration) minDuration = jobTime;

      currentT = end;
    });
  });

  if (minDuration === Infinity || minDuration <= 0) minDuration = 1;

  const idealZoom = Math.min(300, Math.ceil(25 / minDuration));
  const currentZoom = zoomLevel !== null ? zoomLevel : idealZoom;
  const chartWidth = Math.max(800, maxEnd * currentZoom);

  return (
    <div className="gantt-container mt-4" style={{ background: '#0d1117', padding: '1rem', borderRadius: '8px', border: '1px solid #30363d' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <span style={{ fontWeight: 'bold' }}>Gantt Şeması (Otomatik Ölçekli)</span>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem', fontSize: '0.65rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', background: '#9b59b6' }}></div> Hazırlık (S)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', background: '#27ae60' }}></div> İşlem (P)</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.7rem' }}>Zoom:</span>
          <input type="range" min="1" max="300" value={currentZoom} onChange={e => setZoomLevel(Number(e.target.value))} style={{ width: '100px', cursor: 'pointer' }} />
          <button className="btn btn-sm" onClick={() => setZoomLevel(idealZoom)}>Oto</button>
          <span style={{ fontWeight: 'bold', color: 'var(--warning)', marginLeft: '10px' }}>Cₘₐₓ: {maxEnd.toFixed(2)}h</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: `${chartWidth}px`, position: 'relative' }}>
          {Array.from({ length: m }).map((_, k) => {
            let currentT = 0;
            return (
              <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '30px', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--warning)' }}>M{k + 1}</div>
                <div style={{ flex: 1, height: '28px', background: 'rgba(255,255,255,0.02)', position: 'relative', border: '1px solid #30363d' }}>
                  {schedule[k]?.map((job, idx) => {
                    const [jId, start, end] = job;
                    const setupTime = start - currentT;
                    const jobTime = end - start;
                    const elements = [];

                    if (setupTime > 0.01) {
                      elements.push(
                        <div key={`s-${idx}`} style={{
                          position: 'absolute', left: `${(currentT / maxEnd) * 100}%`, width: `${(setupTime / maxEnd) * 100}%`, height: '100%',
                          background: '#9b59b6', opacity: 0.6
                        }} />
                      );
                    }

                    elements.push(
                      <div key={`j-${idx}`} title={`J${jId + 1}`} style={{
                        position: 'absolute', left: `${(start / maxEnd) * 100}%`, width: `${(jobTime / maxEnd) * 100}%`, height: '100%',
                        background: '#27ae60', borderLeft: '1px solid #1e8449', borderRight: '1px solid #1e8449', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff', fontWeight: 'bold', overflow: 'hidden'
                      }}>
                        {(jobTime / maxEnd * chartWidth) > 20 ? `J${jId + 1}` : ''}
                      </div>
                    );

                    currentT = end;
                    return elements;
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
});

// --- Sequence Table Component (Terminal Style) ---
const JobSequenceTable = React.memo(({ schedule, m, problemData }) => {
  if (!schedule || !problemData) return null;
  let rows = [];
  Object.keys(schedule).forEach(k => {
    const machineId = Number(k);
    let prevJobId = -1;
    const numJobs = schedule[k].length;
    schedule[k].forEach((jobTuple, i) => {
      const [jId, start, end] = jobTuple;
      const pTime = problemData.P[jId][machineId];
      const sTime = problemData.S[prevJobId][jId][machineId];
      const dTime = problemData.D[jId];
      const lateness = end - dTime;
      const tardiness = Math.max(0, lateness);

      rows.push({
        k: machineId + 1,
        j: jId + 1,
        isFirst: i === 0,
        rowSpan: numJobs,
        p: pTime.toFixed(2),
        s: sTime.toFixed(2),
        ps: (pTime + sTime).toFixed(2),
        end: end.toFixed(2),
        d: dTime.toFixed(2),
        l: lateness.toFixed(2),
        t: tardiness.toFixed(2),
        e: Math.max(0, -lateness).toFixed(2),
        f: problemData.family?.[jId]
      });
      prevJobId = jId;
    });
  });

  return (
    <div className="terminal-box" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Detaylı Operasyonel Çizelge Planı
      </div>
      <ScrollableTable maxHeight="350px">
        <table className="data-table small-table">
          <thead>
            <tr>
              <th>Tezgâh</th><th>İş</th><th>Fⱼ</th><th>Pⱼₖ</th><th>Sᵢⱼₖ</th><th>Cⱼ</th><th>Dⱼ</th><th>eⱼ⁺</th><th>eⱼ⁻</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx}>
                {row.isFirst && <td rowSpan={row.rowSpan} style={{ fontWeight: 'bold', textAlign: 'center', background: 'rgba(255,255,255,0.02)', verticalAlign: 'middle' }}>M{row.k}</td>}
                <td style={{ fontWeight: 'bold' }}>J{row.j}</td>
                <td style={{ opacity: 0.7 }}>F{row.f}</td>
                <td style={{ color: '#4ade80' }}>{row.p}</td>
                <td style={{ color: '#ff7b72' }}>{row.s}</td>
                <td style={{ fontWeight: 'bold' }}>{row.end}</td>
                <td style={{ color: 'var(--accent)' }}>{row.d}</td>
                <td style={{ color: row.t > 0 ? '#ff7b72' : '#4ade80', fontWeight: 'bold' }}>{row.t}</td>
                <td style={{ color: '#58a6ff' }}>{row.e}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>
    </div>
  );
});

// --- Side Info Panel ---
const SideInfoPanel = ({ stage, onClose }) => {
  if (!stage) return null;

  const infoContent = {
    1: {
      title: "Adım 01: Problem Doğası ve Parametreler",
      sections: [
        {
          h: "Endüstriyel Motivasyon",
          t: "Bu sistem, Tayland'daki büyük bir çelik boru üreticisinin karşılaştığı gerçek dünya probleminden motive edilmiştir. 200+ iş ve karmaşık tezgah bağımlılıkları içerir."
        },
        {
          h: "İlişkisiz Paralel Tezgahlar (UPMSP)",
          t: "İşlem süreleri iş-tezgah çiftine bağlıdır (Pjk). Her tezgah her işi yapamaz (NP kısıtı). Bir işin hızı, atandığı makinenin teknolojisine göre değişir."
        },
        {
          h: "Sıra-Bağımlı Hazırlık (Sijk)",
          t: "Makalenin kalbi burasıdır. i işinden j işine geçerken gereken hazırlık süresi, hem tezgaha hem de işlerin sırasına bağlıdır. 'Dummy Job 0' konseptiyle her periyodun başındaki ilk hazırlık 0 kabul edilir."
        }
      ]
    },
    2: {
      title: "Adım 02: Matematiksel Modeller (MILP)",
      sections: [
        {
          h: "M1, M2 ve M3 Modelleri",
          t: "M1: Yayılma Süresini (Cmax) minimize eder. M2: Toplam Gecikmeyi (T) minimize eder. M3: Geciken İş Sayısını (L) minimize eder. Bunlar çatışan hedeflerdir."
        },
        {
          h: "AUGMECON Yöntemi (M4)",
          t: "Artırılmış Epsilon-Kısıt yöntemiyle Pareto çözümleri bulunur. Adımlar: 1. Ödeme tablosu (payoff table) oluştur, 2. Grid noktalarını (kesişim) belirle, 3. Her grid için modeli çöz, 4. Baskılanmayan çözümleri (Pareto) seç."
        },
        {
          h: "NP-Hard Doğası",
          t: "Bu problem kombinatoryal olarak patlar. 15 işten sonrası için kesin çözüm (optimal) bulmak saatler sürer, bu yüzden DDR sezgisellerine ihtiyaç duyulur."
        }
      ]
    },
    3: {
      title: "Adım 03: Dinamik Dağıtım Kuralları (DDR)",
      sections: [
        {
          h: "Temel Sezgiseller",
          t: "SCT: En kısa tamamlanma zamanı. SC-LPT: Önce en uzun işi seçip en iyi tezgaha atar. SC-EDD: Önce teslim tarihi en yakın olanı seçer."
        },
        {
          h: "Hibrit Kural Mekanizması (ts)",
          t: "Makaledeki en büyük yenilik kural değiştirme zamanıdır (ts). Fabrika belli bir doluluğa ulaşana kadar SCT (hız) ile çalışır, ts süresi aşılınca vites değiştirip SC-EDD (teslimat) moduna geçer."
        }
      ]
    },
    4: {
      title: "Adım 05: Karar Analizi (TOPSIS)",
      sections: [
        {
          h: "MCDM (Çok Kriterli Karar Verme)",
          t: "Üretim müdürü hıza, müşteri temsilcisi terminleri ister. TOPSIS, bu kriterlere verilen ağırlıklara göre 'İdeal Çözüme' en yakın kuralı matematiksel olarak kanıtlar."
        },
        {
          h: "Normalize Performans Matrisi",
          t: "Tüm sonuçlar 0-1 arasına çekilir (rij = min / xij). Ardından pozitif ideal (v+) ve negatif ideal (v-) uzaklıklar hesaplanarak CCi* (bağıl yakınlık) skoru üretilir."
        }
      ]
    },
    5: {
      title: "Adım 06: Hesaplamalı Çalışma ve Performans",
      sections: [
        {
          h: "Gap Analizi Nedir?",
          t: "Sezgisel yöntemlerin (DDR) kalitesini ölçmek için, bu sonuçlar matematiksel modelin (MILP) bulduğu global optimal sonuçlarla karşılaştırılır. Aradaki fark 'Gap' olarak adlandırılır."
        },
        {
          h: "Karmaşıklık Analizi",
          t: "İş sayısı arttıkça MILP modellerinin çözüm süresi üstel olarak artarken, DDR kuralları sabit ve çok düşük bir sürede çözüm üretmeye devam eder."
        }
      ]
    },
    6: {
      title: "Adım 02: Literatür Taraması (Academic Background)",
      sections: [
        {
          h: "Problem Sınıflandırması",
          t: "Literatürde paralel tezgahlar; Özdeş (Identical), Tekdüze (Uniform) ve İlişkisiz (Unrelated) olarak üçe ayrılır. Bu çalışma 'Unrelated' sınıfındaki en karmaşık Sijk kısıtını ele alır."
        },
        {
          h: "Önceki Çalışmalar vs Bu Çalışma",
          t: "Pek çok çalışma sadece Cmax veya sadece Gecikme üzerine yoğunlaşırken, bu çalışma hem MILP (Kesin Çözüm) hem DDR (Sezgisel) hem de TOPSIS (MCDM) süreçlerini birleştiren literatürdeki ilk kapsamlı modeldir."
        }
      ]
    },
    7: {
      title: "Adım 07: Sonuç ve Değerlendirme",
      sections: [
        {
          h: "Akademik Çıkarımlar",
          t: "Çalışma, sıra-bağımlı hazırlık sürelerinin (Sijk) çizelgeleme performansını nasıl domine ettiğini göstermiştir. Doğru kural seçimi verimliliği %20-30 artırabilmektedir."
        },
        {
          h: "Gelecek Çalışmalar",
          t: "Model, enerji tüketimi veya dinamik iş gelişleri gibi ek kısıtlar eklenerek daha da geliştirilebilir."
        }
      ]
    }
  };

  const content = infoContent[stage];

  return (
    <div className="side-panel-overlay" onClick={onClose}>
      <div className="side-panel slide-right" onClick={e => e.stopPropagation()}>
        <div className="side-panel-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            <BookOpen size={24} color="var(--warning)" />
            <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{content.title}</span>
          </div>
          <button className="close-btn" onClick={onClose}><X size={24}/></button>
        </div>
        <div className="side-panel-content">
          {content.sections.map((s, i) => (
            <div key={i} className="info-section-academic">
              <h3>{s.h}</h3>
              <p>{s.t}</p>
            </div>
          ))}
          <div className="academic-source-footer">
            <small>Referans: Decision Analytics Journal 13 (2024) 100525</small>
            <br />
            <small>Problem: Unrelated Parallel Machines with SDST</small>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- MAIN FLOW COMPONENT ---
export default function GuidedFlow() {
  const [loading, setLoading] = useState(false);
  const [activeStage, setActiveStage] = useState(1);
  const [infoStage, setInfoStage] = useState(null);
  const [inputJobs, setInputJobs] = useState('');
  const [inputMachines, setInputMachines] = useState('');
  const [inputFamilies, setInputFamilies] = useState('');
  const [inputNP, setInputNP] = useState('');
  const [problemData, setProblemData] = useState(null);
  const [cpsatResults, setCpsatResults] = useState({ M1: null, M2: null });
  const [ddrResults, setDdrResults] = useState([]);
  const [topsisResults, setTopsisResults] = useState([]);
  const [weights, setWeights] = useState({ wC: 0.34, wT: 0.33, wL: 0.33 });

  const generateData = async () => {
    if (!inputJobs || !inputMachines) return alert("Lütfen iş ve tezgah sayılarını giriniz.");
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          n: Number(inputJobs),
          m: Number(inputMachines),
          seed: 42,
          n_families: Number(inputFamilies) || 3,
          np_ratio: Number(inputNP) || 0.1
        })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Veri üretilemedi.");
      }
      const data = await res.json();
      setProblemData(data.data);
      setCpsatResults({ M1: null, M2: null, M3: null, M4: null });
      setDdrResults([]);
      setTopsisResults([]);
      setActiveStage(2);
    } catch (e) {
      alert("Hata: " + e.message);
    }
    setLoading(false);
  };

  const runCPSAT = async () => {
    if (!problemData) return;
    setLoading(true);
    try {
      const solve = async (obj) => {
        const res = await fetch(`${API_BASE}/solve_cpsat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ problem: problemData, obj_type: obj, time_limit: 30 })
        });
        const d = await res.json();
        return d.results;
      };

      const rM1 = await solve('Cmax');
      const rM2 = await solve('T');
      const rM3 = await solve('L');
      const rM4 = await solve('weighted'); // Makale M4: Dengeli uzlaşma

      setCpsatResults({ M1: rM1, M2: rM2, M3: rM3, M4: rM4 });
      setActiveStage(4);
    } catch (e) {
      alert("MILP çözümü sırasında bir hata oluştu. Veri seti çok karmaşık olabilir.");
    }
    setLoading(false);
  };

  const runDDR = async () => {
    if (!problemData) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/solve_ddr`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ problem: problemData }) });
      const data = await res.json();
      setDdrResults(data.results.sort((a, b) => a.Cmax - b.Cmax));
      setActiveStage(5);
    } catch (e) { }
    setLoading(false);
  };

  const runTopsis = async () => {
    if (ddrResults.length === 0) return;
    setLoading(true);
    try {
      await new Promise(r => setTimeout(r, 400));
      const total = parseFloat(weights.wC) + parseFloat(weights.wT) + parseFloat(weights.wL);
      const res = await fetch(`${API_BASE}/topsis`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ candidates: ddrResults, wC: parseFloat(weights.wC) / total, wT: parseFloat(weights.wT) / total, wL: parseFloat(weights.wL) / total }) });
      const data = await res.json();
      setTopsisResults(data.results);
    } catch (e) { }
    setLoading(false);
  };

  useEffect(() => { if (ddrResults.length > 0) runTopsis(); }, [ddrResults]);

  return (
    <div className="notebook-container">
      <SideInfoPanel stage={infoStage} onClose={() => setInfoStage(null)} />
      <div className="notebook-header" style={{ paddingLeft: '3rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '40px', top: '20px', opacity: 0.15, pointerEvents: 'none' }}>
          <img src="/itu-logo.png" alt="ITU Logo" style={{ width: '120px' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
              <img src="/itu-logo.png" alt="ITU" style={{ height: '32px' }} />
              <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--text-secondary)', letterSpacing: '2px' }}>İSTANBUL TEKNİK ÜNİVERSİTESİ</div>
            </div>
            <h2 style={{ fontSize: '2.4rem', letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>UPMSP Akademik Karar Destek Sistemi</h2>
            <div style={{ maxWidth: '800px', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
              Bu interaktif sistem, <a href="https://doi.org/10.1016/j.dajour.2024.100525" target="_blank" rel="noreferrer" style={{ color: 'var(--warning)', fontWeight: 'bold', textDecoration: 'underline' }}>Decision Analytics Journal (2024)</a>'da yayınlanan 
              <em> "A multi-objective production scheduling model and dynamic dispatching rules..."</em> makalesi temel alınarak, 
              <strong> İTÜ END505E Proje Ödevi</strong> kapsamında bir dijital ikiz uygulaması olarak geliştirilmiştir.
            </div>
          </div>
        </div>
      </div>

      <div className="academic-flow">
        {/* STEP 01 */}
        <div className={`flow-step ${activeStage >= 1 ? 'active' : ''}`}>
          <div className="flow-step-number">01</div>
          <div className="flow-step-node">
            <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <h3><FileText size={20} /> 01. Giriş ve Problem Tanımı</h3>
              <button className="info-btn-academic" onClick={() => setInfoStage(1)} title="Detaylı Bilgi"><HelpCircle size={18} style={{ marginRight: '6px' }} /> Detay</button>
            </div>
            <AgentInsight agent="paper" message="Tayland'daki büyük bir çelik boru üreticisinin karşılaştığı gerçek dünya probleminden motive edilen bu çalışma, ilişkisiz paralel tezgahları ve sıra-bağımlı hazırlık sürelerini (Sijk) ele alır." />
            <p className="text-secondary mt-2">Makale Bölüm 3.1'de tanımlanan üretim kısıtları ve sistem parametreleri aşağıda belirlenmektedir.</p>
            <div className="interactive-box mt-4">
              <div className="flex-row" style={{ gap: '1.5rem', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                  <label>İş Sayısı (n)</label>
                  <input type="number" className="input-field" value={inputJobs} onChange={e => setInputJobs(e.target.value)} placeholder="Örn: 10" />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                  <label>Tezgah Sayısı (m)</label>
                  <input type="number" className="input-field" value={inputMachines} onChange={e => setInputMachines(e.target.value)} placeholder="Örn: 3" />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                  <label>Ürün Ailesi (F)</label>
                  <input type="number" className="input-field" value={inputFamilies} onChange={e => setInputFamilies(e.target.value)} placeholder="Örn: 3" />
                </div>
                <div className="form-group" style={{ flex: 1, minWidth: '150px' }}>
                  <label>NP Oranı (%)</label>
                  <input type="number" className="input-field" value={inputNP} onChange={e => setInputNP(e.target.value)} placeholder="Örn: 20" />
                </div>
              </div>
              <button className="btn btn-warning mt-4" onClick={generateData} disabled={loading}><Play size={16} /> Sistemi Başlat ve Veri Üret</button>
            </div>
            {problemData && <DataMatrixView data={problemData} title="Tablo 2: Problem Veri Matrisi" />}
          </div>
        </div>

        {/* STEP 02: Literatür Taraması */}
        {activeStage >= 1 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">02</div>
            <div className="flow-step-node">
              <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <h3><BookOpen size={20} /> 02. Literatür Taraması (Tablo 1)</h3>
                <button className="info-btn-academic" onClick={() => setInfoStage(6)} title="Detaylı Bilgi"><HelpCircle size={18} style={{ marginRight: '6px' }} /> Detay</button>
              </div>
              <AgentInsight agent="paper" message="Bu çalışma, ilişkisiz paralel tezgahlar için üç farklı performans kriterini (Cmax, Tardiness, L) eş zamanlı olarak optimize eden literatürdeki ilk kapsamlı modeldir." />
              <div className="mt-4" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div className="output-header">[Tablo 1] İlgili Literatürün Özeti</div>
                <table className="data-table small-table">
                  <thead>
                    <tr><th>Yazar(lar)</th><th>Tezgah</th><th>Hazırlık</th><th>Ölçütler</th><th>Yöntem</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>Avalos-Rosales (2015)</td><td>Unrelated</td><td>Sijk</td><td>Cmax</td><td>MILP, Meta</td></tr>
                    <tr><td>Logendran (2007)</td><td>Unrelated</td><td>Sijk</td><td>T</td><td>Heuristic</td></tr>
                    <tr><td>Bektur (2019)</td><td>Unrelated</td><td>Sijk</td><td>ATCS</td><td>TS, SA</td></tr>
                    <tr style={{ background: 'rgba(210,153,34,0.1)', fontWeight: 'bold' }}><td>Tai vd. (Bu Çalışma)</td><td>Unrelated</td><td>Sijk</td><td>Cmax, T, L</td><td>MILP, DDR</td></tr>
                  </tbody>
                </table>
              </div>
              <button className="btn btn-warning mt-4" onClick={() => setActiveStage(prev => Math.max(prev, 2))}><Calculator size={16} /> Matematiksel Modelleme Adımına Geç</button>
            </div>
          </div>
        )}

        {/* STEP 03: MILP */}
        {activeStage >= 2 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">03</div>
            <div className="flow-step-node">
              <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <h3><Calculator size={20} /> 03. Matematiksel Modeller (MILP)</h3>
                <button className="info-btn-academic" onClick={() => setInfoStage(2)} title="Detaylı Bilgi"><HelpCircle size={18} style={{ marginRight: '6px' }} /> Detay</button>
              </div>
              <AgentInsight agent="paper" message="Küçük ölçekli örnekler (n<15) için Google CP-SAT çözücüsü ile global optimumu arıyoruz." />
              {problemData?.metadata.n > 15 ? (
                <div className="highlight-box mt-4">
                  <p>İş sayısı (n={problemData.metadata.n}) kesin çözüm sınırlarının üzerindedir. Sezgisel Analiz (DDR) aşamasına geçiliyor.</p>
                  <button className="btn btn-warning mt-4" onClick={() => setActiveStage(3)}>Doğrudan Sezgisel Yöntemlere Geç</button>
                </div>
              ) : (
                <div className="mt-4">
                  <button className="btn btn-primary" onClick={runCPSAT} disabled={loading}><Calculator size={16} /> M1-M4 Tüm Akademik Modelleri Çöz</button>
                  {cpsatResults.M1 && (
                    <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                      <div className="milp-result-card">
                        <div className="output-header">M1 Modeli (Min Cmax - Yayılma Süresi)</div>
                        <JobSequenceTable schedule={cpsatResults.M1.schedule} m={Number(inputMachines)} problemData={problemData} />
                        <GanttChart schedule={cpsatResults.M1.schedule} m={Number(inputMachines)} n={Number(inputJobs)} />
                      </div>
                      <div className="milp-result-card">
                        <div className="output-header">M2 Modeli (Min T - Toplam Gecikme)</div>
                        <JobSequenceTable schedule={cpsatResults.M2.schedule} m={Number(inputMachines)} problemData={problemData} />
                        <GanttChart schedule={cpsatResults.M2.schedule} m={Number(inputMachines)} n={Number(inputJobs)} />
                      </div>
                      <div className="milp-result-card">
                        <div className="output-header">M3 Modeli (Min L - Geciken İş Sayısı)</div>
                        <JobSequenceTable schedule={cpsatResults.M3.schedule} m={Number(inputMachines)} problemData={problemData} />
                        <GanttChart schedule={cpsatResults.M3.schedule} m={Number(inputMachines)} n={Number(inputJobs)} />
                      </div>
                      <div className="milp-result-card" style={{ border: '2px solid var(--warning)', borderRadius: '12px', padding: '10px' }}>
                        <div className="output-header" style={{ color: 'var(--warning)' }}>M4 Modeli (Uzlaşmacı / Çok Amaçlı Dengeli Çözüm)</div>
                        <JobSequenceTable schedule={cpsatResults.M4.schedule} m={Number(inputMachines)} problemData={problemData} />
                        <GanttChart schedule={cpsatResults.M4.schedule} m={Number(inputMachines)} n={Number(inputJobs)} />
                      </div>
                    </div>
                  )}
                </div>
              )}
              <button className="btn btn-warning mt-4" onClick={() => setActiveStage(prev => Math.max(prev, 3))}><Zap size={16} /> Sezgisel Analiz (DDR) Adımına Geç</button>
            </div>
          </div>
        )}

        {/* STEP 3: DDR */}
        {activeStage >= 3 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">04</div>
            <div className="flow-step-node">
              <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <h3><Zap size={20} /> 04. Dinamik Dağıtım Kuralları (DDR)</h3>
                <button className="info-btn-academic" onClick={() => setInfoStage(3)} title="Detaylı Bilgi"><HelpCircle size={18} style={{ marginRight: '6px' }} /> Detay</button>
              </div>
              <AgentInsight agent="frontend" message="39 farklı Dinamik Dağıtım Kuralı (DDR) sonucunu eş zamanlı olarak görselleştiriyoruz." />
              <button className="btn btn-warning mt-4" onClick={runDDR} disabled={loading}><Zap size={16} /> 39 Kuralı Test Et</button>
              {ddrResults.length > 0 && (
                <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div className="output-header">[Tablo 12] DDR Performans Matrisi</div>
                  <ScrollableTable maxHeight="300px">
                    <table className="data-table">
                      <thead><tr><th>Sıra</th><th>Kural</th><th>Cmax</th><th>T</th><th>L</th></tr></thead>
                      <tbody>{ddrResults.map((r, i) => <tr key={i}><td>{i + 1}</td><td>{r.rule_name}</td><td>{r.Cmax.toFixed(2)}</td><td>{r.T.toFixed(2)}</td><td>{r.L}</td></tr>)}</tbody>
                    </table>
                  </ScrollableTable>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', height: '400px' }}>
                    <div className="output-header">3B Pareto Dağılımı</div>
                    <ResponsiveContainer width="100%" height="100%">
                      <ScatterChart margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.1} /><XAxis type="number" dataKey="Cmax" name="Cmax" stroke="#8b949e" /><YAxis type="number" dataKey="T" name="T" stroke="#8b949e" /><ZAxis type="number" dataKey="L" range={[20, 200]} name="L" /><RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#0d1117', border: '1px solid var(--border-color)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} labelStyle={{ color: '#fff' }} /><Scatter data={ddrResults}>{ddrResults.map((e, i) => <Cell key={i} fill={i < 3 ? 'var(--warning)' : '#30363d'} />)}</Scatter>
                      </ScatterChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 4: TOPSIS */}
        {activeStage >= 4 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">05</div>
            <div className="flow-step-node">
              <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <h3><Target size={20} /> 05. Karar Analizi (TOPSIS)</h3>
                <button className="info-btn-academic" onClick={() => setInfoStage(4)} title="Detaylı Bilgi"><HelpCircle size={18} style={{ marginRight: '6px' }} /> Detay</button>
              </div>
              <AgentInsight agent="paper" message="Adaylar arasından İdeal Çözüme (C*) en yakın olanı belirliyoruz." />
              <div className="interactive-box mt-4" style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '1.5rem', borderRadius: '12px' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '1rem', borderLeft: '2px solid var(--warning)', paddingLeft: '8px' }}>
                  <TrendingUp size={12} style={{ marginRight: '4px' }} /> Not: Girdiğiniz ağırlıklar sistem tarafından otomatik olarak normalize edilecektir (Σw = 1.0).
                </div>
                <div className="flex-row" style={{ gap: '2rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                  <div className="form-group" style={{ flex: 1, minWidth: '100px' }}>
                    <label style={{ color: 'var(--warning)', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '8px', display: 'block' }}>w₁ (Yayılma Süresi - Cmax)</label>
                    <input type="number" step="0.01" className="input-field" value={weights.wC} onChange={e => setWeights({ ...weights, wC: e.target.value })} style={{ width: '100%' }} />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '100px' }}>
                    <label style={{ color: 'var(--warning)', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '8px', display: 'block' }}>w₂ (Toplam Gecikme - T)</label>
                    <input type="number" step="0.01" className="input-field" value={weights.wT} onChange={e => setWeights({ ...weights, wT: e.target.value })} style={{ width: '100%' }} />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '100px' }}>
                    <label style={{ color: 'var(--warning)', fontWeight: 'bold', fontSize: '0.75rem', marginBottom: '8px', display: 'block' }}>w₃ (Geciken İş - L)</label>
                    <input type="number" step="0.01" className="input-field" value={weights.wL} onChange={e => setWeights({ ...weights, wL: e.target.value })} style={{ width: '100%' }} />
                  </div>
                  <button className="btn btn-warning" onClick={runTopsis} disabled={loading} style={{ height: '42px', padding: '0 2rem', fontWeight: 'bold' }}>
                    {loading ? <div className="loader"></div> : <><Target size={16} style={{ marginRight: '8px' }} /> ANALİZİ GÜNCELLE</>}
                  </button>
                </div>
              </div>
              {topsisResults.length > 0 && (
                <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div className="output-header"><BarChart3 size={16} /> TOPSIS Detay Analiz Matrisi</div>
                  <ScrollableTable maxHeight="300px">
                    <table className="data-table small-table">
                      <thead><tr><th>Kural</th><th>r₁</th><th>r₂</th><th>r₃</th><th>S⁺</th><th>S⁻</th><th>CCᵢ</th></tr></thead>
                      <tbody>{topsisResults.map((r, i) => <tr key={i}><td>{r.rule_name}</td><td>{r.r[0]}</td><td>{r.r[1]}</td><td>{r.r[2]}</td><td>{r.S_pos}</td><td>{r.S_neg}</td><td style={{ fontWeight: 'bold' }}>{r.C_star.toFixed(4)}</td></tr>)}</tbody>
                    </table>
                  </ScrollableTable>
                  
                  <div className="winner-box" style={{ textAlign: 'center', border: '2px solid var(--warning)', background: 'rgba(210,153,34,0.05)' }}>
                    <h4 style={{ color: 'var(--warning)', letterSpacing: '1px' }}>OPTIMAL AKADEMİK KARAR: {topsisResults[0].rule_name}</h4>
                    <p style={{ fontSize: '1.1rem', marginTop: '5px' }}>İdeale Yakınlık Katsayısı (C* / CCᵢ): <span style={{ fontWeight: 'bold', color: '#4ade80' }}>{topsisResults[0].C_star?.toFixed(6)}</span></p>
                  </div>

                  {cpsatResults.M1 && (
                    <div className="mt-4" style={{ padding: '1rem', background: 'rgba(210,153,34,0.05)', borderRadius: '8px', border: '1px solid var(--warning)' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '10px' }}><TrendingUp size={14} /> [Tablo 13] Sezgisel Performans Analizi (Gap Analizi)</div>
                      <div className="flex-row" style={{ gap: '2rem' }}>
                        <div style={{ flex: 1 }}>
                          <small style={{ opacity: 0.7 }}>MILP Best (M4):</small>
                          <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Cmax: {cpsatResults.M4.Cmax}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <small style={{ opacity: 0.7 }}>DDR Best (SCT):</small>
                          <div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>Cmax: {Math.min(...ddrResults.map(r => r.Cmax))}</div>
                        </div>
                        <div style={{ flex: 1 }}>
                          <small style={{ opacity: 0.7 }}>Performance Gap:</small>
                          <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--warning)' }}>
                            {(((Math.min(...ddrResults.map(r => r.Cmax)) - cpsatResults.M4.Cmax) / cpsatResults.M4.Cmax) * 100).toFixed(2)}%
                          </div>
                        </div>
                      </div>
                      <p style={{ fontSize: '0.7rem', marginTop: '8px', opacity: 0.6 }}>*Gap % ne kadar düşükse, sezgisel yöntem optimal çözüme o kadar yakındır (Makale Bölüm 6.2).</p>
                    </div>
                  )}

                  <div style={{ marginTop: '2rem', background: '#0d1117', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div className="output-header"><CheckCircle size={16} /> FİNAL OPERASYONEL PLANI</div>
                    <JobSequenceTable schedule={ddrResults.find(r => r.rule_name === topsisResults[0].rule_name)?.schedule} m={Number(inputMachines)} problemData={problemData} />
                    <GanttChart schedule={ddrResults.find(r => r.rule_name === topsisResults[0].rule_name)?.schedule} m={Number(inputMachines)} n={Number(inputJobs)} />
                  </div>
                  <button className="btn btn-warning mt-4" onClick={() => setActiveStage(prev => Math.max(prev, 5))}><Activity size={16} /> Karşılaştırmalı Performans Analizine Geç</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 06: Hesaplamalı Sonuçlar */}
        {activeStage >= 5 && cpsatResults.M1 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">06</div>
            <div className="flow-step-node">
              <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <h3><Activity size={20} /> 06. Hesaplamalı Çalışma ve Performans</h3>
                <button className="info-btn-academic" onClick={() => setInfoStage(5)} title="Detaylı Bilgi"><HelpCircle size={18} style={{ marginRight: '6px' }} /> Detay</button>
              </div>
              <div className="mt-4" style={{ padding: '1.5rem', background: 'rgba(210,153,34,0.05)', borderRadius: '12px', border: '1px solid var(--warning)' }}>
                <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '15px' }}><TrendingUp size={16} /> Sezgisel Yöntem Başarı Analizi (Gap % Analizi)</div>
                <div className="flex-row" style={{ gap: '3rem' }}>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>MILP Global Optimal (Cmax)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--warning)' }}>{cpsatResults.M4.Cmax}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center', borderLeft: '1px solid rgba(255,255,255,0.1)', borderRight: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>DDR Heuristic Best (Cmax)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{Math.min(...ddrResults.map(r => r.Cmax))}</div>
                  </div>
                  <div style={{ flex: 1, textAlign: 'center' }}>
                    <div style={{ opacity: 0.6, fontSize: '0.8rem' }}>Performance Gap (%)</div>
                    <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#4ade80' }}>
                      {(((Math.min(...ddrResults.map(r => r.Cmax)) - cpsatResults.M4.Cmax) / cpsatResults.M4.Cmax) * 100).toFixed(2)}%
                    </div>
                  </div>
                </div>
                <p style={{ fontSize: '0.8rem', marginTop: '1.5rem', opacity: 0.8, fontStyle: 'italic' }}>
                  * Makale Bölüm 6.2'de belirtildiği üzere, Gap değeri düşük çıktıkça sezgisel yöntemimiz (DDR) global optimal çözüme o kadar çok yaklaşmaktadır.
                </p>
              </div>
              <button className="btn btn-warning mt-4" onClick={() => setActiveStage(prev => Math.max(prev, 6))}><BookOpen size={16} /> 07. Final Değerlendirmesi ve Sonuç</button>
            </div>
          </div>
        )}

        {/* STEP 07: Kapanış */}
        {activeStage >= 6 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">07</div>
            <div className="flow-step-node">
              <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <h3><BookOpen size={20} /> 07. Sonuç ve Genel Değerlendirme</h3>
                <button className="info-btn-academic" onClick={() => setInfoStage(7)} title="Detaylı Bilgi"><HelpCircle size={18} style={{ marginRight: '6px' }} /> Detay</button>
              </div>
              <div className="mt-4" style={{ padding: '2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', border: '1px solid var(--border-color)', position: 'relative' }}>
                <div style={{ position: 'absolute', right: '20px', bottom: '20px', opacity: 0.05 }}>
                  <img src="/itu-logo.png" alt="ITU" style={{ width: '150px' }} />
                </div>
                <h4 style={{ color: 'var(--warning)', marginBottom: '1rem' }}>Akademik Proje Özeti</h4>
                <p style={{ lineHeight: '1.7', opacity: 0.9 }}>
                  Bu çalışma, <strong>İTÜ END505E Üretim Planlama ve Çizelgeleme</strong> dersi kapsamında, UPMSP problemleri için geliştirilen hibrit çözüm yaklaşımlarını bir dijital ikiz üzerinden test etmiştir. 
                  Sıra-bağımlı hazırlık sürelerinin (Sijk) üretim verimliliği üzerindeki kritik etkisi hem MILP hem de DDR modelleri ile kanıtlanmıştır.
                </p>
                <div className="flex-row mt-4" style={{ gap: '2rem' }}>
                  <div className="highlight-box" style={{ flex: 1 }}>
                    <strong>Sistem Başarısı:</strong> %{(((Math.min(...ddrResults.map(r => r.Cmax)) - (cpsatResults.M4?.Cmax || 0)) / (cpsatResults.M4?.Cmax || 1)) * 100).toFixed(2)} Gap oranı ile yüksek verim.
                  </div>
                  <div className="highlight-box" style={{ flex: 1 }}>
                    <strong>Öneri:</strong> {topsisResults[0]?.rule_name} kuralı ile stratejik optimizasyon.
                  </div>
                </div>
                <div className="mt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem', textAlign: 'center', fontSize: '0.8rem', opacity: 0.5 }}>
                  İSTANBUL TEKNİK ÜNİVERSİTESİ | ENDÜSTRİ MÜHENDİSLİĞİ BÖLÜMÜ | 2024
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div style={{ height: '100px' }}></div>
    </div>
  );
}
