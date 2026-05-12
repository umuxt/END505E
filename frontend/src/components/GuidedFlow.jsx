import React, { useState, useEffect, useRef } from 'react';
import { Play, Calculator, Zap, Target, Activity, FileText, BarChart3, Copy, CheckCircle, BookOpen, TrendingUp, Database } from 'lucide-react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend
} from 'recharts';
import { flowNarratives } from './flowNarratives';

const API_BASE = '/api';

// --- Multi-Agent Academic Components ---

const AcademicInsight = ({ message }) => {
  return (
    <div className="academic-insight slide-in" style={{
      background: 'rgba(56, 139, 253, 0.05)',
      borderLeft: '4px solid var(--accent)',
      borderRadius: '4px',
      padding: '1rem',
      margin: '1.5rem 0',
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent)', fontSize: '0.75rem', fontWeight: 'bold', letterSpacing: '1px' }}>
        <BookOpen size={14} /> AKADEMİK NOT / TEORİK ÇERÇEVE
      </div>
      <div style={{ fontSize: '0.9rem', color: '#e6edf3', lineHeight: '1.6', fontWeight: 500 }}>
        {message}
      </div>
    </div>
  );
};

const MathBox = ({ title, formula, description }) => (
  <div className="formula-card slide-in">
    <div className="formula-label">
      <FileText size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
      {title}
    </div>
    <div className="formula-math">{formula}</div>
    {description && (
      <div className="formula-info">
        {description}
      </div>
    )}
  </div>
);

const PayoffTable = ({ results }) => {
  if (!results || !results.M1 || !results.M2 || !results.M3) return null;
  
  const models = [
    { id: 'M1', label: 'M1 (Min Cₘₐₓ)', data: results.M1 },
    { id: 'M2', label: 'M2 (Min T)', data: results.M2 },
    { id: 'M3', label: 'M3 (Min L)', data: results.M3 }
  ];

  return (
    <div className="glass-panel mt-4 slide-in" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
      <div className="formula-label" style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
        <TrendingUp size={14} style={{ marginRight: '8px' }} />
        Tablo 8: Kazanç Tablosu (Payoff Table)
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Her model kendi temel amacını (vurgulanan) minimize ederken diğer amaçlar üzerindeki ödünleşimi gösterir.
      </p>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ background: 'transparent' }}>Model</th>
            <th style={{ textAlign: 'center' }}>Cₘₐₓ (f₁)</th>
            <th style={{ textAlign: 'center' }}>Toplam Gecikme (f₂)</th>
            <th style={{ textAlign: 'center' }}>Geciken İşler (f₃)</th>
          </tr>
        </thead>
        <tbody>
          {models.map(m => (
            <tr key={m.id}>
              <td style={{ fontWeight: '800', color: 'var(--accent)' }}>{m.label}</td>
              <td style={{ textAlign: 'center', background: m.id === 'M1' ? 'rgba(88, 166, 255, 0.1)' : 'transparent', fontWeight: m.id === 'M1' ? '800' : 'normal' }}>
                {m.data?.Cmax?.toFixed?.(2) || '0.00'}
              </td>
              <td style={{ textAlign: 'center', background: m.id === 'M2' ? 'rgba(88, 166, 255, 0.1)' : 'transparent', fontWeight: m.id === 'M2' ? '800' : 'normal' }}>
                {m.data?.T?.toFixed?.(2) || '0.00'}
              </td>
              <td style={{ textAlign: 'center', background: m.id === 'M3' ? 'rgba(88, 166, 255, 0.1)' : 'transparent', fontWeight: m.id === 'M3' ? '800' : 'normal' }}>
                {m.data?.L ?? 0}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MILPParetoChart = ({ results, augmeconResults }) => {
  if (!results || !results.M1 || !results.M2 || !results.M3 || !results.M4) return null;

  const seriesConfig = [
    { key: 'M1', name: 'M1 — Min Cₘₐₓ', color: '#f85149', data: results.M1 },
    { key: 'M2', name: 'M2 — Min T', color: '#3fb950', data: results.M2 },
    { key: 'M3', name: 'M3 — Min L', color: '#58a6ff', data: results.M3 },
    { key: 'M4', name: 'M4 — Uzlaşmacı', color: '#d29922', data: results.M4 },
  ];

  const paretoData = augmeconResults?.pareto_solutions?.map(s => ({
    Cmax: s.Cmax, T: s.T, L: s.L
  })) || [];

  return (
    <div className="glass-panel mt-4 slide-in" style={{ padding: '1.5rem' }}>
      <div className="formula-label" style={{ color: 'var(--warning)', marginBottom: '1rem' }}>
        <BarChart3 size={14} style={{ marginRight: '8px' }} />
        Şekil 3: MILP Pareto Ödünleşim Uzayı — Cₘₐₓ vs Toplam Gecikme (ZAxis = L)
      </div>
      <div style={{ height: '340px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <ScatterChart margin={{ top: 10, right: 30, bottom: 50, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              type="number" dataKey="Cmax" name="Cₘₐₓ" stroke="#8b949e"
              domain={['auto', 'auto']}
              label={{ value: 'Cₘₐₓ — Makespan (saat)', position: 'insideBottom', offset: -30, fill: '#8b949e', fontSize: 11 }}
            />
            <YAxis
              type="number" dataKey="T" name="Toplam Gecikme" stroke="#8b949e"
              domain={['auto', 'auto']}
              label={{ value: 'Toplam Gecikme (T)', angle: -90, position: 'insideLeft', fill: '#8b949e', fontSize: 11 }}
            />
            <ZAxis type="number" dataKey="L" name="Geciken İş" range={[80, 400]} />
            <RechartsTooltip
              cursor={{ strokeDasharray: '3 3' }}
              contentStyle={{ background: '#0d1117', border: '1px solid var(--glass-border)', borderRadius: '12px', fontSize: '0.8rem' }}
            />
            <Legend
              wrapperStyle={{ paddingTop: '1rem', fontSize: '0.78rem' }}
              formatter={(value) => <span style={{ color: '#c9d1d9' }}>{value}</span>}
            />
            {seriesConfig.map(s => (
              <Scatter
                key={s.key}
                name={s.name}
                data={[{ Cmax: s.data.Cmax, T: s.data.T, L: s.data.L }]}
                fill={s.color}
                stroke={s.key === 'M4' ? '#fff' : s.color}
                strokeWidth={s.key === 'M4' ? 2 : 0}
              />
            ))}
            {paretoData.length > 0 && (
              <Scatter
                name="Pareto Cephesi (AUGMECON)"
                data={paretoData}
                fill="#a371f7"
                stroke="#a371f7"
                strokeWidth={1}
                opacity={0.6}
                shape="diamond"
              />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

const HeuristicRadarChart = ({ optimal, winner, standard }) => {
  if (!optimal || !winner) return null;

  const maxVals = {
    Cmax: Math.max(optimal?.Cmax || 1, winner?.Cmax || 1, ...(standard?.map(s => s?.Cmax || 1) || [1])),
    T: Math.max(optimal?.T || 1, winner?.T || 1, ...(standard?.map(s => s?.T || 1) || [1])),
    L: Math.max(optimal?.L || 1, winner?.L || 1, ...(standard?.map(s => s?.L || 1) || [1]))
  };

  const normalize = (val, key) => {
    const divisor = (maxVals[key] || 1) * 1.1;
    const score = (1 - ((val || 0) / divisor)) * 100;
    return Math.max(0, Math.min(100, score));
  };

  const data = [
    { subject: 'Cₘₐₓ (Speed)', A: normalize(optimal?.Cmax, 'Cmax'), B: normalize(winner?.Cmax, 'Cmax'), fullMark: 100 },
    { subject: 'T (Due Date)', A: normalize(optimal?.T, 'T'), B: normalize(winner?.T, 'T'), fullMark: 100 },
    { subject: 'L (Lateness)', A: normalize(optimal?.L, 'L'), B: normalize(winner?.L, 'L'), fullMark: 100 },
  ];

  return (
    <div className="glass-panel slide-in" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)' }}>
      <div className="formula-label" style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
        <Activity size={14} style={{ marginRight: '8px' }} />
        Sezgisel Performans Analizi — Optimal M4 vs Seçilen DDR (Radar)
      </div>
      <div style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%" minWidth={0}>
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="rgba(255,255,255,0.1)" />
            <PolarAngleAxis dataKey="subject" tick={{ fill: '#8b949e', fontSize: 12 }} />
            <Radar name="Optimal (M4 MILP)" dataKey="A" stroke="var(--warning)" fill="var(--warning)" fillOpacity={0.2} />
            <Radar name="Seçilen DDR Kuralı" dataKey="B" stroke="var(--accent)" fill="var(--accent)" fillOpacity={0.4} />
            <Legend wrapperStyle={{ paddingTop: '0.5rem', fontSize: '0.78rem' }} formatter={(value) => <span style={{ color: '#c9d1d9' }}>{value}</span>} />
          </RadarChart>
        </ResponsiveContainer>
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

const PaginatedSetupMatrix = React.memo(({ data, selectedK }) => {
  const [page, setPage] = useState(0);
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(false);
  
  const metadata = data?.metadata || {};
  const n = metadata.n || 0;
  const pageSize = 15;
  const totalPages = Math.ceil(n / pageSize) || 1;

  useEffect(() => {
    if (!data) return;
    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/get_setup_page`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            n: metadata.n, m: metadata.m, seed: metadata.seed,
            n_families: metadata.n_families, np_ratio: metadata.np_ratio,
            scenario: metadata.scenario || 'high',
            k: selectedK, page: page, page_size: pageSize
          })
        });
        const d = await res.json();
        setPageData(d.page_data);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    fetchPage();
  }, [page, selectedK, data]);

  if (!pageData && loading) return <div className="loader"></div>;
  if (!pageData) return null;

  const startI = page * pageSize;
  const endI = Math.min(startI + pageSize, n);
  const iIndices = Array.from({ length: endI - startI }, (_, idx) => startI + idx);
  const jIndices = Array.from({ length: Math.min(n, 12) }, (_, idx) => idx);

  return (
    <div style={{ marginTop: '1rem', background: 'rgba(0,0,0,0.1)', padding: '1rem', borderRadius: '8px', opacity: loading ? 0.5 : 1 }}>
      <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '15px', alignItems: 'center' }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--warning)' }}>
          🔍 Sᵢⱼₖ Matris Görünümü (İş {startI + 1}-{endI} / {n})
        </div>
        <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
          <button className="btn btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>← Önceki</button>
          <span style={{ fontSize: '0.7rem' }}>Sayfa {page + 1}/{totalPages}</span>
          <button className="btn btn-sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>Sonraki →</button>
        </div>
      </div>
      <ScrollableTable maxHeight="350px">
        <table className="data-table small-table sticky-column">
          <thead>
            <tr>
              <th style={{ textAlign: 'center', background: '#161b22', width: '80px' }}>i \ j</th>
              <th style={{ background: 'rgba(210,153,34,0.1)', width: '60px' }}>J0 (Kukla)</th>
              {jIndices.map(j => <th key={j} style={{ minWidth: '60px' }}>J{j + 1}</th>)}
            </tr>
          </thead>
          <tbody>
            {iIndices.map(i => (
              <tr key={i}>
                <td style={{ fontWeight: 'bold', background: '#161b22', position: 'sticky', left: 0 }}>J{i + 1}</td>
                <td style={{ color: '#4ade80', textAlign: 'center' }}>{pageData["-1"]?.[i]?.toFixed?.(2) || '0.00'}</td>
                {jIndices.map(j => {
                  const val = pageData[i]?.[j];
                  const same = data.family?.[i] === data.family?.[j];
                  return (
                    <td key={j} style={{ textAlign: 'center', background: same ? 'rgba(74, 222, 128, 0.05)' : 'transparent', color: same ? '#4ade80' : '#ff7b72', fontSize: '0.7rem' }}>
                      {i === j ? '-' : val?.toFixed?.(2) || '0.00'}
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
  const [page, setPage] = useState(0);
  const pageSize = 20;
  const totalPages = Math.ceil(n / pageSize);
  const rows = Array.from({ length: Math.min(pageSize, n - page * pageSize) }, (_, i) => page * pageSize + i);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    alert('RAW JSON panoya kopyalandı!');
  };

  return (
    <div className="matrix-section slide-in mt-4">
      <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="output-header" style={{ color: 'var(--warning)', border: 'none' }}><BarChart3 size={14} /> {title} (n={n}, m={m})</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="btn btn-sm" onClick={copyToClipboard}><Copy size={12} /> JSON</button>
          <div style={{ display: 'flex', gap: '5px' }}>
            <button className="btn btn-sm" disabled={page === 0} onClick={() => setPage(p => p - 1)}>←</button>
            <span style={{ fontSize: '0.7rem', alignSelf: 'center' }}>{page + 1}/{totalPages}</span>
            <button className="btn btn-sm" disabled={page >= totalPages - 1} onClick={() => setPage(p => p + 1)}>→</button>
          </div>
        </div>
      </div>
      <ScrollableTable maxHeight="400px">
        <table className="data-table sticky-column">
          <thead>
            <tr>
              <th>İş (j)</th><th>Aile</th><th style={{ background: 'rgba(210,153,34,0.1)' }}>Teslim (Dⱼ)</th>
              {Array.from({ length: m }).map((_, k) => <th key={k}>M{k + 1} Pⱼₖ</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map(j => (
              <tr key={j}>
                <td style={{ fontWeight: 'bold' }}>J{j + 1}</td><td>F{data.family?.[j]}</td>
                <td style={{ color: 'var(--warning)', fontWeight: 600 }}>{data.D?.[j]?.toFixed?.(2) || '0.00'}</td>
                {Array.from({ length: m }).map((_, k) => (
                  <td key={k} style={{ opacity: data.P?.[j]?.[k] === 9999 ? 0.2 : 1 }}>
                    {data.P?.[j]?.[k] === 9999 ? '∞' : data.P?.[j]?.[k]?.toFixed?.(2) || '0.00'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>
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

const TopsisNormalizationTable = ({ topsisResults }) => {
  if (!topsisResults || topsisResults.length === 0) return null;
  return (
    <div className="mt-4">
      <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--warning)', paddingLeft: '0.75rem', marginBottom: '1rem' }}>
        <strong>Tablo 21: TOPSIS Karar Matrisi</strong> — Ağırlıklı skorlara göre sıralama.
      </div>
      <ScrollableTable maxHeight="320px">
        <table className="data-table small-table">
          <thead>
            <tr>
              <th>Sıra</th><th>Kural</th><th>r₁ (Cₘₐₓ)</th><th>r₂ (T)</th><th>r₃ (L)</th>
              <th style={{ background: 'rgba(248,81,73,0.05)' }}>S⁺</th>
              <th style={{ background: 'rgba(74,222,128,0.05)' }}>S⁻</th>
              <th style={{ background: 'rgba(210,153,34,0.1)', color: 'var(--warning)' }}>CC* ↑</th>
            </tr>
          </thead>
          <tbody>
            {topsisResults.map((r, i) => (
              <tr key={i} style={{ background: i === 0 ? 'rgba(210,153,34,0.08)' : 'transparent' }}>
                <td>{i + 1}</td>
                <td style={{ fontWeight: i === 0 ? 'bold' : 'normal' }}>{r.rule_name}{i === 0 ? ' ★' : ''}</td>
                <td>{r.r1?.toFixed?.(3) || '0.000'}</td>
                <td>{r.r2?.toFixed?.(3) || '0.000'}</td>
                <td>{r.r3?.toFixed?.(3) || '0.000'}</td>
                <td style={{ color: '#f85149' }}>{r.s_plus || 0}</td>
                <td style={{ color: '#4ade80' }}>{r.s_minus || 0}</td>
                <td style={{ color: '#4ade80', fontWeight: 'bold' }}>{r.cc || 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>
    </div>
  );
};

const GanttChart = React.memo(({ schedule, m, n }) => {
  const [zoomLevel, setZoomLevel] = useState(100);
  if (!schedule) return null;
  
  let maxEnd = 0;
  Object.values(schedule).forEach(mach => {
    if (Array.isArray(mach)) {
      mach.forEach(j => { if (j[2] > maxEnd) maxEnd = j[2]; });
    }
  });
  
  const chartWidth = Math.max(800, (maxEnd * 15 * (zoomLevel / 100)));
  const idealZoom = maxEnd > 0 ? (800 / (maxEnd * 15)) * 100 : 100;

  return (
    <div className="gantt-container mt-4" style={{ background: '#0d1117', padding: '1.5rem', borderRadius: '12px', border: '1px solid #30363d', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
      <div className="flex-row" style={{ justifyContent: 'space-between', marginBottom: '1.5rem', borderBottom: '1px solid #30363d', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '0.5px' }}>Zaman Çizelgesi (Gantt)</div>
          <div style={{ display: 'flex', gap: '15px', fontSize: '0.65rem', opacity: 0.7 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', background: '#9b59b6' }}></div> Hazırlık (S)</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><div style={{ width: '10px', height: '10px', background: '#27ae60' }}></div> İşlem (P)</span>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '0.7rem' }}>Zoom:</span>
          <input type="range" min="1" max="300" value={zoomLevel} onChange={e => setZoomLevel(Number(e.target.value))} style={{ width: '100px', cursor: 'pointer' }} />
          <button className="btn btn-sm" onClick={() => setZoomLevel(idealZoom)}>Oto</button>
          <span style={{ fontWeight: 'bold', color: 'var(--warning)', marginLeft: '10px' }}>Cₘₐₓ: {maxEnd?.toFixed?.(2) || '0.00'}h</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: `${chartWidth}px`, position: 'relative' }}>
          {Array.from({ length: m }).map((_, k) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--warning)' }}>M{k + 1}</div>
              <div style={{ flex: 1, height: '28px', background: 'rgba(255,255,255,0.02)', position: 'relative', border: '1px solid #30363d' }}>
                {schedule[k]?.map((job, idx) => {
                  const jId = job[0];
                  const start = job[1];
                  const end = job[2];
                  const setup = job[3] || 0;
                  
                  const safeMaxEnd = maxEnd || 1;
                  const setupWidth = (setup / safeMaxEnd) * 100;
                  const jobWidth = ((end - start) / safeMaxEnd) * 100;
                  const leftPos = (start / safeMaxEnd) * 100;
                  const setupLeft = leftPos - setupWidth;
                  return (
                    <React.Fragment key={idx}>
                      {setup > 0.01 && (
                        <div style={{ position: 'absolute', left: `${setupLeft}%`, width: `${setupWidth}%`, height: '100%', background: '#9b59b6', opacity: 0.6 }} />
                      )}
                      <div title={`J${jId + 1} (Setup: ${setup})`} style={{ position: 'absolute', left: `${leftPos}%`, width: `${jobWidth}%`, height: '100%', background: '#27ae60', borderLeft: '1px solid #1e8449', borderRight: '1px solid #1e8449', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.6rem', color: '#fff', fontWeight: 'bold', overflow: 'hidden' }}>
                        {(jobWidth / 100 * chartWidth) > 20 ? `J${jId + 1}` : ''}
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

const JobSequenceTable = React.memo(({ schedule, m, problemData }) => {
  if (!schedule || !problemData) return null;
  let rows = [];
  Object.keys(schedule).forEach(k => {
    const machineId = Number(k);
    const numJobs = schedule[k].length;
    schedule[k].forEach((jobTuple, i) => {
      const jId = jobTuple?.[0];
      const start = jobTuple?.[1] || 0;
      const end = jobTuple?.[2] || 0;
      const setupTime = jobTuple?.[3] !== undefined ? jobTuple[3] : 0;

      const pTime = problemData?.P?.[jId]?.[machineId] ?? 0;
      const sTime = setupTime || 0;
      const dTime = problemData?.D?.[jId] ?? 0;
      
      const lateness = (end || 0) - (dTime || 0);
      const tardiness = Math.max(0, lateness);
      rows.push({
        k: machineId + 1, j: (jId !== undefined ? jId + 1 : '?'), isFirst: i === 0, rowSpan: numJobs,
        p: pTime?.toFixed?.(2) || '0.00', 
        s: sTime?.toFixed?.(2) || '0.00', 
        end: end?.toFixed?.(2) || '0.00', 
        d: dTime?.toFixed?.(2) || '0.00',
        t: tardiness?.toFixed?.(2) || '0.00', 
        e: Math.max(0, -lateness)?.toFixed?.(2) || '0.00', 
        f: problemData?.family?.[jId] ?? '-'
      });
    });
  });

  return (
    <div className="terminal-box" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <ScrollableTable maxHeight="500px">
        <table className="data-table small-table">
          <thead>
            <tr><th>Tezgâh</th><th>İş</th><th>Fⱼ</th><th>Pⱼₖ</th><th>Sᵢⱼₖ</th><th>Cⱼ</th><th>Dⱼ</th><th>eⱼ⁺</th><th>eⱼ⁻</th></tr>
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

const CompactMetrics = ({ schedule, problemData }) => {
  if (!schedule || !problemData) return null;
  let maxC = 0, totalT = 0, numL = 0, totalP = 0;
  Object.values(schedule).forEach(mach => {
    if (Array.isArray(mach)) {
      mach.forEach((job) => {
        const j = job[0];
        const s = job[1];
        const e = job[2];
        const d = problemData.D?.[j] || 0;
        maxC = Math.max(maxC, e || 0);
        totalT += Math.max(0, (e || 0) - d);
        if ((e || 0) - d > 0.01) numL++;
        totalP += ((e || 0) - (s || 0));
      });
    }
  });
  const util = (totalP / (Object.keys(schedule).length * maxC)) * 100;
  return (
    <div className="flex-row" style={{ gap: '1rem', marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem', justifyContent: 'space-around', border: '1px solid rgba(255,255,255,0.05)' }}>
      <span><strong>Cₘₐₓ:</strong> {maxC?.toFixed?.(1) || '0.0'}h</span>
      <span><strong>ΣT:</strong> {totalT?.toFixed?.(1) || '0.0'}h</span>
      <span><strong>L:</strong> {numL ?? 0} iş</span>
      <span><strong>Kullanım Oranı:</strong> %{util?.toFixed?.(1) || '0.0'}</span>
    </div>
  );
};

const AcademicBlock = ({ items }) => (
  <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    {items.map((item, i) => (
      <div key={i} style={{ background: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--warning)', padding: '0.9rem 1.2rem', borderRadius: '0 8px 8px 0' }}>
        {item.h && <div style={{ fontWeight: 'bold', color: 'var(--warning)', fontSize: '0.8rem', textTransform: 'uppercase', marginBottom: '0.4rem' }}>{item.h}</div>}
        <div style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.9 }}>{item.t}</div>
      </div>
    ))}
  </div>
);

const ReportArtifactCard = ({ label, title, status, note, children, tone = 'var(--accent)' }) => (
  <div className="glass-panel" style={{ padding: '1rem', borderLeft: `4px solid ${tone}`, background: 'rgba(255,255,255,0.02)' }}>
    <div className="flex-row" style={{ justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
      <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#e6edf3' }}>{label} · {title}</div>
      <div style={{ fontSize: '0.65rem', fontWeight: 'bold', textTransform: 'uppercase', color: tone, letterSpacing: '0.08em' }}>{status}</div>
    </div>
    {note && <div style={{ marginTop: '0.65rem', fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{note}</div>}
    {children && <div style={{ marginTop: '0.9rem' }}>{children}</div>}
  </div>
);

const ReportAtlasSection = ({ title, subtitle, children }) => (
  <details className="glass-panel mt-4 slide-in" open style={{ padding: '1rem 1.1rem', borderLeft: '4px solid var(--warning)' }}>
    <summary style={{ cursor: 'pointer', listStyle: 'none', fontWeight: 800, color: 'var(--warning)', marginBottom: '0.5rem' }}>
      {title}
    </summary>
    {subtitle && <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{subtitle}</div>}
    <div style={{ display: 'grid', gap: '0.9rem' }}>{children}</div>
  </details>
);

const ReportAtlas = ({ problemData, cpsatResults, augmeconResults, ddrResults, topsisResults, inputJobs, inputMachines, reportBundle, reportBundleError, weights }) => {
  const selectedRule = topsisResults?.[0];
  const report14 = reportBundle?.table14;
  const report15 = reportBundle?.table15;
  const report16 = reportBundle?.table16;
  const report17 = reportBundle?.table17;
  const report18 = reportBundle?.table18;
  const report19 = reportBundle?.table19;

  return (
    <div className="report-atlas-container mt-4" style={{ borderTop: '2px dashed var(--border-color)', paddingTop: '2rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem' }}>
        <Activity size={24} style={{ color: 'var(--accent)' }} />
        <h2 style={{ fontSize: '1.25rem', margin: 0 }}>Rapor Atlası: Makale & Uygulama Eşleşmesi</h2>
      </div>

      <ReportAtlasSection title="5. Hesaplamalı Çalışma Sonuçları" subtitle="Tablo 14 - Tablo 21 arası büyük ölçekli ve karar analizi verileri">
        <ReportArtifactCard
          label="Tablo 14 / Tablo 15"
          title="Talep trendi, kümeleme ve örneklerin özet istatistiği"
          status={report14 ? 'live backend' : 'paper reference'}
          note="Live backend: aylık büyük örnek özeti ve 1B k-means kümeleme sonucu."
        >
          {report14 && report15 ? (
            <>
              <ScrollableTable maxHeight="260px">
                <table className="data-table small-table">
                  <thead>
                    <tr>
                      <th>Ay</th><th>Senaryo</th><th>İş</th><th>Aile</th><th>Elig%</th><th>Avg P</th><th>Setup S</th><th>Setup D</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report14.instances.map((row) => (
                      <tr key={row.month}>
                        <td>{row.month}</td>
                        <td>{row.scenario}</td>
                        <td>{row.jobs}</td>
                        <td>{row.families}</td>
                        <td>{(row.eligible_ratio * 100).toFixed(1)}%</td>
                        <td>{row.avg_processing?.toFixed?.(2)}</td>
                        <td>{row.avg_setup_same?.toFixed?.(2)}</td>
                        <td>{row.avg_setup_diff?.toFixed?.(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </ScrollableTable>
            </>
          ) : (
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Rapor bundle yüklenirken bu bölüm referans açıklama olarak kalır.
            </div>
          )}
        </ReportArtifactCard>

        <ReportArtifactCard
          label="Tablo 16 / 17 / 18 / 19"
          title="DDR Performans Analizi (ANOVA & Regresyon)"
          status={report16 ? 'live backend' : 'paper reference'}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            {report16 ? 'ANOVA ve regresyon katmanları backend verisiyle güncellenmiştir.' : 'DDR sonuçları ve özetler hazırlandığında bu bölüm dolar.'}
          </div>
        </ReportArtifactCard>

        <ReportArtifactCard
          label="Tablo 20 / Tablo 21"
          title="Etkili kurallar ve TOPSIS tabanlı seçim"
          status={selectedRule ? 'live backend' : 'paper reference'}
          note="Live backend: TOPSIS tablosu ve kural seçimi."
        >
          {selectedRule && weights ? (
            <>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Ağırlıklar: wC {weights.wC}, wT {weights.wT}, wL {weights.wL}</div>
              <TopsisNormalizationTable topsisResults={topsisResults} />
            </>
          ) : <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>TOPSIS çalıştırıldığında Tablo 20-21 burada temsil edilir.</div>}
        </ReportArtifactCard>
      </ReportAtlasSection>
    </div>
  );
};

export default function GuidedFlow() {
  const [loading, setLoading] = useState(false);
  const [activeStage, setActiveStage] = useState(1);
  const [inputJobs, setInputJobs] = useState('10');
  const [inputMachines, setInputMachines] = useState('3');
  const [inputFamilies, setInputFamilies] = useState('3');
  const [inputNP, setInputNP] = useState('0');
  const [inputScenario, setInputScenario] = useState('high');
  const [problemData, setProblemData] = useState(null);
  const [cpsatResults, setCpsatResults] = useState({ M1: null, M2: null, M3: null, M4: null });
  const [augmeconResults, setAugmeconResults] = useState(null);
  const [ddrResults, setDdrResults] = useState([]);
  const [topsisResults, setTopsisResults] = useState([]);
  const [weights, setWeights] = useState({ wC: 0.34, wT: 0.33, wL: 0.33 });
  const [reportBundle, setReportBundle] = useState(null);
  const [reportBundleError, setReportBundleError] = useState(null);
  const stageRefs = useRef({});

  useEffect(() => {
    let cancelled = false;
    const loadReportBundle = async () => {
      try {
        const res = await fetch(`${API_BASE}/report_bundle`);
        const data = await res.json();
        if (!res.ok) throw new Error(data?.detail || 'Rapor bundle alınamadı');
        if (!cancelled) {
          setReportBundle(data.report);
          setReportBundleError(null);
        }
      } catch (error) {
        if (!cancelled) setReportBundleError(error.message);
      }
    };
    loadReportBundle();
    return () => {
      cancelled = true;
    };
  }, []);

  const scrollToNext = (stage) => {
    setActiveStage(stage);
    setTimeout(() => {
      const target = stageRefs.current[stage];
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const generateData = async () => {
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
          np_ratio: (Number(inputNP) / 100) || 0.0, 
          scenario: inputScenario 
        })
      });
      if (!res.ok) throw new Error("Veri üretilemedi.");
      const data = await res.json();
      setProblemData(data.data);
      // Reset for new data
      setCpsatResults({ M1: null, M2: null, M3: null, M4: null });
      setAugmeconResults(null);
      setDdrResults([]);
      setTopsisResults([]);
      scrollToNext(3);
    } catch (e) { alert(e.message); }
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
          body: JSON.stringify({ ...problemData.metadata, obj_type: obj, time_limit: 15 }) 
        });
        const d = await res.json();
        if (!res.ok) throw new Error(d.detail || "Solver error");
        return d.results;
      };
      const rM1 = await solve('Cmax'); 
      const rM2 = await solve('T'); 
      const rM3 = await solve('L'); 
      const rM4 = await solve('weighted');
      setCpsatResults({ M1: rM1, M2: rM2, M3: rM3, M4: rM4 });
    } catch (e) { 
      alert("MILP Çözümü hatası: " + e.message); 
    }
    setLoading(false);
  };

  const runAugmecon = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/solve_augmecon`, { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ ...problemData.metadata, time_limit: 10, grid_T: 5 }) 
      });
      if (!res.ok) throw new Error("AUGMECON hatası");
      const d = await res.json(); 
      setAugmeconResults(d.result);
    } catch (e) { alert(e.message); }
    setLoading(false);
  };

  const runDDR = async () => {
    if (!problemData) return;
    setLoading(true);
    setDdrResults([]); 
    
    const stdRules = ["SCT", "SC-EDD", "SC-LPT"];
    const hybridPairs = [
      ["SCT", "SC-LPT"], ["SCT", "SC-EDD"],
      ["SC-EDD", "SCT"], ["SC-EDD", "SC-LPT"],
      ["SC-LPT", "SCT"], ["SC-LPT", "SC-EDD"]
    ];
    const tsValues = [200, 250, 300, 350, 400, 450];
    
    let configs = [...stdRules];
    hybridPairs.forEach(([r1, r2]) => {
      tsValues.forEach(ts => {
        configs.push(`[${r1} & ${r2}: ${ts}]`);
      });
    });

    let currentResults = [];
    for (let rule of configs) {
      try {
        const res = await fetch(`${API_BASE}/solve_single_ddr`, { 
          method: 'POST', 
          headers: { 'Content-Type': 'application/json' }, 
          body: JSON.stringify({ ...problemData.metadata, rule_name: rule }) 
        });
        const d = await res.json(); 
        if (d.result) {
          currentResults = [...currentResults, d.result];
          setDdrResults([...currentResults]);
        }
      } catch (e) { console.error(e); }
    }
    setLoading(false);
  };

  const runTopsis = () => {
    if (ddrResults.length === 0) return;
    
    const minC = Math.min(...ddrResults.map(r => r.Cmax));
    const minT = Math.min(...ddrResults.map(r => r.T));
    const minL = Math.min(...ddrResults.map(r => r.L));
    
    const totalW = weights.wC + weights.wT + weights.wL;
    const normW = { wC: weights.wC / (totalW || 1), wT: weights.wT / (totalW || 1), wL: weights.wL / (totalW || 1) };

    let processed = ddrResults.map(r => {
      const r1 = minC / (r.Cmax || 0.1);
      const r2 = minT / (r.T || 0.1);
      const r3 = minL / (r.L || 1);
      return { ...r, r1, r2, r3 };
    });

    const v1 = Math.max(...processed.map(p => p.r1));
    const v2 = Math.max(...processed.map(p => p.r2));
    const v3 = Math.max(...processed.map(p => p.r3));
    const v1Minus = Math.min(...processed.map(p => p.r1));
    const v2Minus = Math.min(...processed.map(p => p.r2));
    const v3Minus = Math.min(...processed.map(p => p.r3));
    
    let final = processed.map(p => {
      const s_plus = Math.sqrt(normW.wC * Math.pow(p.r1 - v1, 2) + normW.wT * Math.pow(p.r2 - v2, 2) + normW.wL * Math.pow(p.r3 - v3, 2));
      const s_minus = Math.sqrt(normW.wC * Math.pow(p.r1 - v1Minus, 2) + normW.wT * Math.pow(p.r2 - v2Minus, 2) + normW.wL * Math.pow(p.r3 - v3Minus, 2));
      const cc = s_minus / (s_plus + s_minus) || 0;
      return { 
        ...p, 
        s_plus: s_plus.toFixed(4), 
        s_minus: s_minus.toFixed(4), 
        cc: cc.toFixed(4) 
      };
    }).sort((a, b) => b.cc - a.cc);

    setTopsisResults(final);
    scrollToNext(6);
  };

  const bestSingleRuleCmax = ddrResults
    .filter(r => ['SCT', 'SC-EDD', 'SC-LPT'].includes(r.rule_name))
    .reduce((best, current) => (best === null || current.Cmax < best ? current.Cmax : best), null);

  const gapValue = topsisResults[0]
    ? (
        cpsatResults.M4?.Cmax
          ? ((topsisResults[0].Cmax - cpsatResults.M4.Cmax) / cpsatResults.M4.Cmax) * 100
          : (bestSingleRuleCmax ? ((topsisResults[0].Cmax - bestSingleRuleCmax) / bestSingleRuleCmax) * 100 : null)
      )
    : null;

  const gapLabel = cpsatResults.M4 ? 'GAP vs M4 (%)' : 'Fark vs en iyi tekli kural (%)';

  return (
    <div className="flow-container">
      <div className="flow-content">
        
        {/* CHAPTER 1: Giriş */}
        <div ref={(el) => { stageRefs.current[1] = el; }} className={`flow-step ${activeStage >= 1 ? 'active' : ''}`}>
          <div className="flow-step-number">01</div>
          <div className="flow-step-node">
            <h3><BookOpen size={20} /> 01. Giriş (Introduction)</h3>
            <AcademicBlock items={[
              { h: "Motivasyon", t: flowNarratives.introMotivation },
              { h: "Akademik Çerçeve", t: flowNarratives.introMetrics }
            ]} />
            
            <ReportArtifactCard
              label="Section 1"
              title="Giriş ve Notasyon Eşleşmesi"
              status="paper reference"
              note="Rapordaki Bölüm 1 ve 2'nin uygulamadaki karşılığıdır."
            >
              <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{flowNarratives.introApplied}</div>
            </ReportArtifactCard>

            <button className="btn btn-warning mt-4" onClick={() => scrollToNext(2)}>Literatür Taramasına Geç</button>
          </div>
        </div>

        {/* CHAPTER 2: Literatür */}
        {activeStage >= 2 && (
          <div ref={(el) => { stageRefs.current[2] = el; }} className="flow-step active slide-in">
            <div className="flow-step-number">02</div>
            <div className="flow-step-node">
              <h3><FileText size={20} /> 02. Literatür Taraması (Literature Review)</h3>
              <AcademicBlock items={[
                { h: "Araştırma Boşluğu", t: flowNarratives.literatureGap }
              ]} />
              
              <div className="glass-panel mb-4" style={{ padding: '1rem' }}>
                <div className="output-header">Tablo 1: Literatür Özeti</div>
                <table className="data-table small-table">
                  <thead><tr><th>Yazar</th><th>Tezgah</th><th>Hazırlık</th><th>Ölçütler</th></tr></thead>
                  <tbody>
                    <tr><td>Avalos-Rosales (2015)</td><td>Unrelated</td><td>Sᵢⱼₖ</td><td>Cₘₐₓ</td></tr>
                    <tr><td>Logendran (2007)</td><td>Unrelated</td><td>Sᵢⱼₖ</td><td>T</td></tr>
                    <tr style={{ background: 'rgba(210,153,34,0.1)', fontWeight: 'bold' }}><td>Tai vd. (Bu Çalışma)</td><td>Unrelated</td><td>Sᵢⱼₖ</td><td>Cₘₐₓ, T, L</td></tr>
                  </tbody>
                </table>
              </div>

              <ReportArtifactCard
                label="Bölüm 2"
                title="Literatür Taraması Eşleşmesi"
                status="paper reference"
                note="Rapordaki literatür tablosunun uygulama içindeki izdüşümüdür."
              >
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{flowNarratives.literatureApplied}</div>
              </ReportArtifactCard>

              <button className="btn btn-warning mt-4" onClick={() => scrollToNext(3)}>Problem Tanımı ve Veri Üretimine Geç</button>
            </div>
          </div>
        )}

        {/* CHAPTER 3: Problem Tanımı ve Veri Üretimi */}
        {activeStage >= 3 && (activeStage === 3 || problemData) && (
          <div ref={(el) => { stageRefs.current[3] = el; }} className="flow-step active slide-in">
            <div className="flow-step-number">03</div>
            <div className="flow-step-node">
              <h3><Database size={20} /> 03. Problem Tanımı ve Veri Üretimi (Bölüm 3.1)</h3>
              <AcademicBlock items={[
                { h: "Sayısal Örnek (Tablo 2)", t: flowNarratives.dataSetIntro }
              ]} />
              <AcademicInsight message={flowNarratives.prepTimeImportance} />
              <div className="glass-panel mb-4" style={{ padding: '1rem' }}>
                <div className="output-header">Tablo 2: Sayısal Örnek Veri Seti (Pⱼₖ, Dⱼ)</div>
                <table className="data-table small-table">
                  <thead><tr><th>İş</th><th>M1 Pⱼₖ</th><th>M2 Pⱼₖ</th><th>Dⱼ</th><th>Aile</th></tr></thead>
                  <tbody>
                    <tr><td>J1</td><td>10.0</td><td>6.0</td><td>15.0</td><td>F1</td></tr>
                    <tr><td>J2</td><td>12.0</td><td>15.0</td><td>20.0</td><td>F1</td></tr>
                    <tr><td>J3</td><td>20.0</td><td>10.0</td><td>30.0</td><td>F2</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-4" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--warning)', marginBottom: '1rem' }}>🧪 Canlı Test: Kendi Veri Setinizi Oluşturun</div>
                <div className="grid-4" style={{ gap: '1rem' }}>
                  <div className="form-group"><label>İş (n)</label><input type="number" className="input-field" value={inputJobs} onChange={e => setInputJobs(e.target.value)} /></div>
                  <div className="form-group"><label>Tezgah (m)</label><input type="number" className="input-field" value={inputMachines} onChange={e => setInputMachines(e.target.value)} /></div>
                  <div className="form-group"><label>Aile (F)</label><input type="number" className="input-field" value={inputFamilies} onChange={e => setInputFamilies(e.target.value)} /></div>
                  <div className="form-group"><label>NP Yüzde (%)</label><input type="number" className="input-field" value={inputNP} onChange={e => setInputNP(e.target.value)} /></div>
                  <div className="form-group"><label>Senaryo</label><select className="input-field" value={inputScenario} onChange={e => setInputScenario(e.target.value)}><option value="high">Yüksek Talep</option><option value="low">Düşük Talep</option></select></div>
                </div>
                <AcademicInsight message={flowNarratives.prepTimeApplied} />
                <button className="btn btn-warning mt-4" onClick={generateData} disabled={loading}><Play size={16} /> Veriyi Üret ve Matrisleri İncele</button>
              </div>

              {problemData && (
                <div className="mt-4 slide-in">
                  <DataMatrixView data={problemData} title="Üretilen Problem Veri Matrisi" />
                  <ReportArtifactCard
                    label="Bölüm 3.1"
                    title="Veri Yapısı ve Örnek Problem"
                    status="live backend"
                    note="Rapordaki Section 5.1'in canlı verilerle doğrulanmasıdır."
                  >
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{flowNarratives.dataApplied}</div>
                  </ReportArtifactCard>

                  <button className="btn btn-warning mt-4" onClick={() => scrollToNext(4)}>Matematiksel Modellere (MILP) Geç</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CHAPTER 4: Matematiksel Modeller */}
        {activeStage >= 4 && problemData && (
          <div ref={(el) => { stageRefs.current[4] = el; }} className="flow-step active slide-in">
            <div className="flow-step-number">04</div>
            <div className="flow-step-node">
              <h3><Calculator size={20} /> 04. Matematiksel Modeller (MILP - Bölüm 3.2)</h3>
              <div className="grid-3" style={{ gap: '1rem', margin: '1rem 0' }}>
                <MathBox title="M1: Min Cₘₐₓ" formula="min Z = Cₘₐₓ" description="Toplam üretim süresini minimize eder." />
                <MathBox title="M2: Min T" formula="min T = Σ eⱼ⁺" description="Müşteri gecikmelerini minimize eder." />
                <MathBox title="M3: Min L" formula="min L = Σ Uⱼ" description="Geciken sipariş sayısını minimize eder." />
              </div>
              <div className="glass-panel mb-4" style={{ padding: '1rem', fontSize: '0.75rem' }}>
                <strong>📊 Tablo 6: Model Kompleksliği (Özet)</strong> — Karar Değişkeni: n²m + n. İkili (Binary): n²m + n.
              </div>
              
              <ReportArtifactCard
                label="Bölüm 3.2"
                title="Çözüm Metodolojisi Eşleşmesi"
                status="paper reference"
                note="Rapordaki Section 3.2'nin matematiksel modellerini temsil eder."
              >
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{flowNarratives.methodologyApplied}</div>
              </ReportArtifactCard>

              {problemData.metadata.n <= 15 ? (
                <div className="mt-4">
                  <button className="btn btn-primary" onClick={runCPSAT} disabled={loading}><Calculator size={16} /> M1-M4 Tüm Akademik Modelleri Çöz</button>
                  {cpsatResults.M1 && (
                    <div className="mt-4">
                      <PayoffTable results={cpsatResults} />
                      <AcademicInsight message={flowNarratives.augmeconBridge} />
                      <button className="btn btn-accent mt-4" onClick={runAugmecon} disabled={loading}><BarChart3 size={16} /> Pareto Cephesini Hesapla (AUGMECON)</button>
                      {augmeconResults && <MILPParetoChart results={cpsatResults} augmeconResults={augmeconResults} />}
                      <div className="mt-4"><JobSequenceTable schedule={cpsatResults.M4.schedule} m={Number(inputMachines)} problemData={problemData} /></div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="highlight-box mt-4">Kesin çözüm sınırları aşıldı. Sezgisel Analiz (DDR) önerilir.</div>
              )}
              <button className="btn btn-warning mt-4" onClick={() => scrollToNext(5)}>Dinamik Dağıtım Kurallarına (DDR) Geç</button>
            </div>
          </div>
        )}

        {/* CHAPTER 5: DDR */}
        {activeStage >= 5 && problemData && (
          <div ref={(el) => { stageRefs.current[5] = el; }} className="flow-step active slide-in">
            <div className="flow-step-number">05</div>
            <div className="flow-step-node">
              <h3><Zap size={20} /> 05. Dinamik Dağıtım Kuralları (DDR - Bölüm 4)</h3>
              <AcademicBlock items={[
                { h: "Sezgisel Strateji", t: flowNarratives.ddrIntro }
              ]} />
              <AcademicInsight message={flowNarratives.ddrSwitching} />
              <div className="flex-column" style={{ gap: '1rem', alignItems: 'center', margin: '2rem 0' }}>
                <button className="btn btn-warning" onClick={runDDR} disabled={loading} style={{ padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 'bold', boxShadow: '0 0 20px rgba(210,153,34,0.3)' }}>
                  {loading ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div className="loader" style={{ width: '16px', height: '16px' }}></div>
                      <span>Senaryolar Çözülüyor...</span>
                    </div>
                  ) : (
                    <><Zap size={16} /> 39 FARKLI DDR SENARYOSUNU ANALİZ ET</>
                  )}
                </button>
                {loading && (
                  <div style={{ width: '100%', maxWidth: '500px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '5px', color: 'var(--warning)', fontWeight: 'bold' }}>
                      <span>İlerleme: {ddrResults[ddrResults.length-1]?.rule_name || 'Başlanıyor...'}</span>
                      <span>{Math.round((ddrResults.length / 39) * 100)}%</span>
                    </div>
                    <div style={{ height: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '5px', overflow: 'hidden', border: '1px solid #30363d' }}>
                      <div style={{ height: '100%', background: 'var(--warning)', width: `${(ddrResults.length / 39) * 100}%`, transition: 'width 0.4s ease' }}></div>
                    </div>
                  </div>
                )}
                {ddrResults.length > 0 && (
                  <ReportArtifactCard
                    label="Bölüm 4"
                    title="Sezgisel Öncelik Kuralları (DDR)"
                    status="live backend"
                    note="Rapordaki Section 4 kurallarının simülasyonudur."
                  >
                    <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{flowNarratives.ddrApplied}</div>
                  </ReportArtifactCard>
                )}
              </div>
              
              {ddrResults.length > 0 && (
                <div className="mt-4 slide-in">
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                    <div className="output-header" style={{ marginBottom: '0.5rem' }}>DDR Sonuçları Pareto Dağılımı (Cₘₐₓ × T, Boyut = L)</div>
                    <div style={{ height: '340px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis type="number" dataKey="Cmax" name="Cₘₐₓ" stroke="#8b949e" label={{ value: 'Cₘₐₓ', position: 'insideBottom', offset: -10, fill: '#8b949e', fontSize: 11 }} />
                          <YAxis type="number" dataKey="T" name="T (Gecikme)" stroke="#8b949e" label={{ value: 'T', angle: -90, position: 'insideLeft', fill: '#8b949e', fontSize: 11 }} />
                          <ZAxis type="number" dataKey="L" range={[20, 200]} name="L" />
                          <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#0d1117', border: '1px solid var(--border-color)', borderRadius: '8px' }} />
                          <Scatter data={ddrResults.filter(r => r)}>
                            {ddrResults.filter(r => r).map((e, i) => (
                              <Cell key={i} fill={i < 3 ? 'var(--warning)' : '#3fb950'} />
                            ))}
                          </Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                   <div className="glass-panel" style={{ padding: '1rem', marginBottom: '1rem' }}>
                    <strong>📊 Tablo 12: DDR Performans Matrisi</strong>
                    <ScrollableTable maxHeight="300px">
                      <table className="data-table small-table">
                        <thead><tr><th>Kural</th><th>Cₘₐₓ</th><th>T (Gecikme)</th><th>L (Geciken)</th></tr></thead>
                        <tbody>
                          {ddrResults.map((r, i) => (
                            <tr key={i}><td>{r.rule_name}</td><td>{r.Cmax.toFixed(2)}</td><td>{r.T.toFixed(2)}</td><td>{r.L}</td></tr>
                          ))}
                        </tbody>
                      </table>
                    </ScrollableTable>
                  </div>
                  <div className="mt-4 flex-row" style={{ gap: '1rem', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div className="form-group" style={{ flex: 1 }}><label>w₁ (Cₘₐₓ)</label><input type="number" step="0.05" className="input-field" value={weights.wC} onChange={e => setWeights({...weights, wC: Number(e.target.value)})} /></div>
                    <div className="form-group" style={{ flex: 1 }}><label>w₂ (T)</label><input type="number" step="0.05" className="input-field" value={weights.wT} onChange={e => setWeights({...weights, wT: Number(e.target.value)})} /></div>
                    <div className="form-group" style={{ flex: 1 }}><label>w₃ (L)</label><input type="number" step="0.05" className="input-field" value={weights.wL} onChange={e => setWeights({...weights, wL: Number(e.target.value)})} /></div>
                    <button className="btn btn-warning mt-auto" style={{ height: '42px' }} onClick={runTopsis} disabled={ddrResults.length < 39}><Target size={16} /> TOPSIS Analizi Uygula</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CHAPTER 6: TOPSIS Sonuçları ve Çizelge */}
        {activeStage >= 6 && topsisResults.length > 0 && problemData && (
          <div ref={(el) => { stageRefs.current[6] = el; }} className="flow-step active slide-in">
            <div className="flow-step-number">06</div>
            <div className="flow-step-node">
              <h3><Target size={20} /> 06. Karar Analizi (Rapor Bölüm 5.3)</h3>
              <AcademicInsight message={flowNarratives.topsisSelectionNote} />
              <AcademicInsight message={flowNarratives.topsisApplied} />
              <div style={{ fontSize: '0.75rem', opacity: 0.75, marginTop: '0.25rem' }}>{flowNarratives.topsisLegend}</div>
              <TopsisNormalizationTable topsisResults={topsisResults} />

              <ReportArtifactCard
                label="Tablo 20 / 21"
                title="TOPSIS Tabanlı Kural Seçimi"
                status="live backend"
                note="Ağırlıklar: wC, wT, wL bazlı seçim."
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Ağırlıklar: wC {weights.wC}, wT {weights.wT}, wL {weights.wL}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{flowNarratives.topsisApplied}</div>
              </ReportArtifactCard>

              <div className="mt-4" style={{ border: '2px solid var(--warning)', borderRadius: '12px', padding: '1.5rem', background: 'rgba(0,0,0,0.2)' }}>
                <div className="output-header" style={{ color: 'var(--warning)', border: 'none', padding: 0, marginBottom: '1.5rem' }}>🏆 SEÇİLEN OPTİMAL ÇİZELGE: {topsisResults[0].rule_name}</div>
                <JobSequenceTable schedule={topsisResults[0].schedule} m={Number(inputMachines)} problemData={problemData} />
                <GanttChart schedule={topsisResults[0].schedule} m={Number(inputMachines)} n={Number(inputJobs)} />
                <CompactMetrics schedule={topsisResults[0].schedule} problemData={problemData} />
              </div>
              <AcademicInsight message={flowNarratives.ganttLegend} />
              <AcademicInsight message={flowNarratives.ganttApplied} />
              <button className="btn btn-warning mt-4" onClick={() => scrollToNext(7)}>Büyük Ölçekli Analizlere Geç</button>
            </div>
          </div>
        )}

        {/* CHAPTER 7: Live validation */}
        {activeStage >= 7 && (
          <div ref={(el) => { stageRefs.current[7] = el; }} className="flow-step active slide-in">
            <div className="flow-step-number">07</div>
            <div className="flow-step-node">
              <h3><TrendingUp size={20} /> 07. Canlı Performans Doğrulama</h3>
              <AcademicInsight message={flowNarratives.liveValidationNote} />
              <AcademicInsight message={flowNarratives.liveComparisonNote} />
              <AcademicInsight message={flowNarratives.liveApplied} />

              <div className="mt-4">
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--accent)' }}>CANLI PERFORMANS KARŞILAŞTIRMASI</div>
                <HeuristicRadarChart 
                  optimal={cpsatResults.M4 || (topsisResults.length > 0 ? topsisResults[0] : null)} 
                  winner={topsisResults[0]} 
                  standard={ddrResults.slice(0,3)} 
                />
              </div>

              <div className="academic-card mt-4 shadow-sm" style={{ background: 'rgba(210,153,34,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--warning)' }}>
                <div style={{ color: 'var(--warning)', fontWeight: 'bold', fontSize: '0.9rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Zap size={18} /> CANLI KURAL ÖZETİ: EN ETKİLİ HİBRİT SEÇİMLER
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
                  <div className="p-3" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--accent)' }}>[SCT & SC-LPT: 450]</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>Cₘₐₓ ve L için güçlü seçenek</div>
                  </div>
                  <div className="p-3" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--accent)' }}>[SCT & SC-EDD: 450]</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>Yüksek talepte T odaklı seçim</div>
                  </div>
                  <div className="p-3" style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '8px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '0.8rem', color: 'var(--accent)' }}>[SC-EDD & SCT: 200]</div>
                    <div style={{ fontSize: '0.65rem', opacity: 0.7 }}>Düşük talepte T ve L dengesi</div>
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', marginBottom: '1rem', color: 'var(--accent)' }}>RAPOR ATLASI: BÜYÜK ÖLÇEKLİ DOĞRULAMA (TABLO 14-19)</div>
                <div style={{ display: 'grid', gap: '1rem' }}>
                   <ReportArtifactCard
                    label="Tablo 14 / 15"
                    title="Talep Trendi ve Kümeleme"
                    status={reportBundle?.table14 ? 'live backend' : 'loading...'}
                  >
                    {reportBundle?.table14 ? (
                      <>
                        <ScrollableTable maxHeight="260px">
                          <table className="data-table small-table">
                            <thead>
                              <tr>
                                <th>Ay</th><th>Senaryo</th><th>İş</th><th>Aile</th><th>Elig%</th><th>Avg P</th><th>Setup S</th><th>Setup D</th>
                              </tr>
                            </thead>
                            <tbody>
                              {reportBundle.table14.instances.map((row) => (
                                <tr key={row.month}>
                                  <td>{row.month}</td><td>{row.scenario}</td><td>{row.jobs}</td><td>{row.families}</td>
                                  <td>{(row.eligible_ratio * 100).toFixed(1)}%</td><td>{row.avg_processing?.toFixed?.(2)}</td>
                                  <td>{row.avg_setup_same?.toFixed?.(2)}</td><td>{row.avg_setup_diff?.toFixed?.(2)}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </ScrollableTable>
                        <div className="grid-2 mt-3" style={{ gap: '0.75rem' }}>
                          <div className="glass-panel p-2" style={{ fontSize: '0.75rem' }}>
                            <strong>Tablo 14 Özeti:</strong> {reportBundle.table14.summary.months} ay · Avg Jobs: {reportBundle.table14.summary.avg_jobs}
                          </div>
                          <div className="glass-panel p-2" style={{ fontSize: '0.75rem' }}>
                            <strong>Tablo 15 Kümeleme:</strong> Silhouette: {reportBundle.table15.silhouette} · Low: {reportBundle.table15.clusters?.[0]?.count} ay · High: {reportBundle.table15.clusters?.[1]?.count} ay
                          </div>
                        </div>
                      </>
                    ) : <div>Büyük ölçekli veriler yükleniyor...</div>}
                  </ReportArtifactCard>
                  
                  <ReportArtifactCard
                    label="Tablo 16 / 17 / 18 / 19"
                    title="DDR Performans Analizi (ANOVA & Regresyon)"
                    status={reportBundle?.table16 ? 'live backend' : 'loading...'}
                  >
                    {reportBundle?.table16 ? (
                      <div style={{ display: 'grid', gap: '0.75rem' }}>
                        <details>
                          <summary style={{ cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--warning)' }}>Tablo 16: Tekli DDR ANOVA & Tukey</summary>
                          {Object.entries(reportBundle.table16.anova).map(([metric, rows]) => (
                            <div key={metric} className="mt-2">
                              <div style={{ fontSize: '0.7rem', fontWeight: 'bold' }}>{metric} ANOVA</div>
                              <ScrollableTable maxHeight="140px">
                                <table className="data-table small-table">
                                  <thead><tr><th>Terim</th><th>df</th><th>F</th><th>p</th></tr></thead>
                                  <tbody>
                                    {rows && rows.length > 0 ? (
                                      rows.map((row, idx) => (
                                        row.error ? (
                                          <tr key={idx}><td colSpan="4" style={{ color: 'var(--warning)', fontSize: '0.65rem' }}>Hata: {row.error}</td></tr>
                                        ) : (
                                          <tr key={idx}>
                                            <td>{row.term || '—'}</td>
                                            <td>{row.df || '0'}</td>
                                            <td>{typeof row.F === 'number' ? row.F.toFixed(3) : '—'}</td>
                                            <td>{typeof row.p_value === 'number' ? row.p_value.toFixed(4) : '—'}</td>
                                          </tr>
                                        )
                                      ))
                                    ) : (
                                      <tr><td colSpan="4" style={{ textAlign: 'center', opacity: 0.5 }}>Veri hesaplanamadı</td></tr>
                                    )}
                                  </tbody>
                                </table>
                              </ScrollableTable>
                            </div>
                          ))}
                          <div className="mt-2" style={{ fontSize: '0.7rem', opacity: 0.8 }}>* Tukey karşılaştırmaları backend'den doğrulanmıştır (Rej: p &lt; 0.05).</div>
                        </details>

                        <details>
                          <summary style={{ cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--warning)' }}>Tablo 17/18: Kombine ANOVA & Regresyon</summary>
                          <div className="mt-2">
                            <ScrollableTable maxHeight="140px">
                              <table className="data-table small-table">
                                <thead><tr><th>Metric</th><th>R²</th><th>Adj R²</th></tr></thead>
                                <tbody>
                                  {Object.entries(reportBundle.table18.regression).map(([metric, payload]) => (
                                    <tr key={metric}><td>{metric}</td><td>{payload.r_squared?.toFixed?.(4)}</td><td>{payload.adj_r_squared?.toFixed?.(4)}</td></tr>
                                  ))}
                                </tbody>
                              </table>
                            </ScrollableTable>
                          </div>
                        </details>

                        <details>
                          <summary style={{ cursor: 'pointer', fontSize: '0.8rem', fontWeight: 'bold', color: 'var(--warning)' }}>Tablo 19: Etkili Kombine Kurallar</summary>
                          <ScrollableTable maxHeight="180px" className="mt-2">
                            <table className="data-table small-table">
                              <thead><tr><th>Senaryo</th><th>Metric</th><th>Kural</th><th>Mean</th></tr></thead>
                              <tbody>
                                {Object.entries(reportBundle.table19.best_rules).flatMap(([scenario, rows]) => (rows || []).map((row, idx) => (
                                  <tr key={`${scenario}-${idx}`}><td>{scenario}</td><td>{row.metric}</td><td>{row.rule_name}</td><td>{row.mean_value?.toFixed?.(2)}</td></tr>
                                )))}
                              </tbody>
                            </table>
                          </ScrollableTable>
                        </details>
                      </div>
                    ) : <div>İstatistiksel veriler hazırlanıyor...</div>}
                  </ReportArtifactCard>
                </div>
              </div>

              <button className="btn btn-warning mt-4" onClick={() => scrollToNext(8)}>Final Değerlendirmesine Geç</button>
            </div>
          </div>
        )}

        {/* CHAPTER 8: Sonuç */}
        {activeStage >= 8 && topsisResults.length > 0 && problemData && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">08</div>
            <div className="flow-step-node">
              <h3><CheckCircle size={20} /> {flowNarratives.conclusionTitle}</h3>
              <div className="glass-panel mt-4" style={{ borderLeft: '4px solid var(--accent)', padding: '1.5rem' }}>
                <div style={{ fontWeight: 'bold', fontSize: '0.85rem', marginBottom: '1rem', color: 'var(--accent)' }}><Activity size={16} /> MEVCUT ANALİZ İSTATİSTİKLERİ</div>
                <div className="grid-4 text-center" style={{ gap: '1rem' }}>
                  <div><div style={{ fontSize: '0.65rem', opacity: 0.6 }}>İŞ / MAKİNE</div><div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{inputJobs} / {inputMachines}</div></div>
                  <div><div style={{ fontSize: '0.65rem', opacity: 0.6 }}>AİLE SAYISI</div><div style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{new Set(Object.values(problemData.family || {})).size}</div></div>
                  <div><div style={{ fontSize: '0.65rem', opacity: 0.6 }}>BEST CC*</div><div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--success)' }}>{topsisResults[0]?.cc}</div></div>
                  <div><div style={{ fontSize: '0.65rem', opacity: 0.6 }}>{gapLabel}</div><div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'var(--warning)' }}>{gapValue !== null ? gapValue.toFixed(2) : '0.00'}</div></div>
                </div>
              </div>
              <AcademicInsight message={flowNarratives.conclusionSummary} />
              <AcademicInsight message={flowNarratives.conclusionApplied} />
              <AcademicInsight message={flowNarratives.conclusionCaution} />

              <ReportArtifactCard
                label="Sonuç"
                title="Özet ve Katkılar"
                status="live backend"
                note={flowNarratives.conclusionSummary}
              >
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{flowNarratives.conclusionApplied}</div>
              </ReportArtifactCard>
            </div>
          </div>
        )}

      </div>
      <div style={{ height: '100px' }}></div>
    </div>
  );
}
