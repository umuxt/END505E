import React, { useState, useEffect } from 'react';
import { Play, Calculator, Zap, Target, Activity, FileText, BarChart3, Copy, CheckCircle, BookOpen, TrendingUp } from 'lucide-react';
import { 
  ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, 
  ResponsiveContainer, Cell, Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend
} from 'recharts';

const API_BASE = '/api';

// --- Multi-Agent Academic Components ---

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
  if (!results.M1 || !results.M2 || !results.M3) return null;
  
  const models = [
    { id: 'M1', label: 'M1 (Min Cmax)', data: results.M1 },
    { id: 'M2', label: 'M2 (Min Tardiness)', data: results.M2 },
    { id: 'M3', label: 'M3 (Min Num Tardy)', data: results.M3 }
  ];

  return (
    <div className="glass-panel mt-4 slide-in" style={{ padding: '1.5rem', borderLeft: '4px solid var(--accent)' }}>
      <div className="formula-label" style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
        <TrendingUp size={14} style={{ marginRight: '8px' }} />
        Tablo 8: Kazanç Tablosu (Payoff Table)
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        Her model kendi temel amacını (highlighted) minimize ederken diğer amaçlar üzerindeki ödünleşimi gösterir.
      </p>
      <table className="data-table">
        <thead>
          <tr>
            <th style={{ background: 'transparent' }}>Model</th>
            <th style={{ textAlign: 'center' }}>Cmax (f₁)</th>
            <th style={{ textAlign: 'center' }}>Total Tardiness (f₂)</th>
            <th style={{ textAlign: 'center' }}>Num Tardy (f₃)</th>
          </tr>
        </thead>
        <tbody>
          {models.map(m => (
            <tr key={m.id}>
              <td style={{ fontWeight: '800', color: 'var(--accent)' }}>{m.label}</td>
              <td style={{ textAlign: 'center', background: m.id === 'M1' ? 'rgba(88, 166, 255, 0.1)' : 'transparent', fontWeight: m.id === 'M1' ? '800' : 'normal' }}>
                {m.data.Cmax.toFixed(2)}
              </td>
              <td style={{ textAlign: 'center', background: m.id === 'M2' ? 'rgba(88, 166, 255, 0.1)' : 'transparent', fontWeight: m.id === 'M2' ? '800' : 'normal' }}>
                {m.data.T.toFixed(2)}
              </td>
              <td style={{ textAlign: 'center', background: m.id === 'M3' ? 'rgba(88, 166, 255, 0.1)' : 'transparent', fontWeight: m.id === 'M3' ? '800' : 'normal' }}>
                {m.data.L}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const MILPParetoChart = ({ results, augmeconResults }) => {
  if (!results.M1 || !results.M2 || !results.M3 || !results.M4) return null;

  const seriesConfig = [
    { key: 'M1', name: 'M1 — Min Cmax', color: '#f85149', data: results.M1 },
    { key: 'M2', name: 'M2 — Min Tardiness', color: '#3fb950', data: results.M2 },
    { key: 'M3', name: 'M3 — Min Num Tardy', color: '#58a6ff', data: results.M3 },
    { key: 'M4', name: 'M4 — Compromise', color: '#d29922', data: results.M4 },
  ];

  const paretoData = augmeconResults?.pareto_solutions?.map(s => ({
    Cmax: s.Cmax, T: s.T, L: s.L
  })) || [];

  return (
    <div className="glass-panel mt-4 slide-in" style={{ padding: '1.5rem' }}>
      <div className="formula-label" style={{ color: 'var(--warning)', marginBottom: '1rem' }}>
        <BarChart3 size={14} style={{ marginRight: '8px' }} />
        Şekil 3: MILP Pareto Ödünleşim Uzayı — Cmax vs Toplam Gecikme (ZAxis = Geciken İş Sayısı)
      </div>
      <div style={{ height: '340px' }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 10, right: 30, bottom: 50, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis
              type="number" dataKey="Cmax" name="Cmax" stroke="#8b949e"
              domain={['auto', 'auto']}
              label={{ value: 'Cmax — Makespan (saat)', position: 'insideBottom', offset: -30, fill: '#8b949e', fontSize: 11 }}
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
    Cmax: Math.max(optimal.Cmax, winner.r1, ...(standard?.map(s => s.Cmax) || [])),
    T: Math.max(optimal.T, winner.r2, ...(standard?.map(s => s.T) || [])),
    L: Math.max(optimal.L, winner.r3, ...(standard?.map(s => s.L) || []))
  };

  const normalize = (val, key) => {
    const score = (1 - (val / (maxVals[key] * 1.1))) * 100;
    return Math.max(0, Math.min(100, score));
  };

  const data = [
    { subject: 'Cmax (Speed)', A: normalize(optimal.Cmax, 'Cmax'), B: normalize(winner.r1, 'Cmax'), fullMark: 100 },
    { subject: 'T (Due Date)', A: normalize(optimal.T, 'T'), B: normalize(winner.r2, 'T'), fullMark: 100 },
    { subject: 'L (Lateness)', A: normalize(optimal.L, 'L'), B: normalize(winner.r3, 'L'), fullMark: 100 },
  ];

  return (
    <div className="glass-panel slide-in" style={{ padding: '1.5rem', background: 'rgba(0,0,0,0.3)' }}>
      <div className="formula-label" style={{ color: 'var(--accent)', marginBottom: '1rem' }}>
        <Activity size={14} style={{ marginRight: '8px' }} />
        Heuristic Performans Analizi — Optimal M4 vs Seçilen DDR (Radar)
      </div>
      <div style={{ height: '300px' }}>
        <ResponsiveContainer width="100%" height="100%">
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
  const pageSize = 15;
  const n = data.metadata.n;
  const totalPages = Math.ceil(n / pageSize);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/get_setup_page`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            n: data.metadata.n, m: data.metadata.m, seed: data.metadata.seed,
            n_families: data.metadata.n_families, np_ratio: data.metadata.np_ratio,
            scenario: data.metadata.scenario || 'high',
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
                <td style={{ color: '#4ade80', textAlign: 'center' }}>{pageData["-1"]?.[i]?.toFixed(2) || '0.00'}</td>
                {jIndices.map(j => {
                  const val = pageData[i]?.[j];
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
                <td style={{ color: 'var(--warning)', fontWeight: 600 }}>{data.D[j]?.toFixed(2)}</td>
                {Array.from({ length: m }).map((_, k) => <td key={k} style={{ opacity: data.P[j][k] === 9999 ? 0.2 : 1 }}>{data.P[j][k] === 9999 ? '∞' : data.P[j][k].toFixed(2)}</td>)}
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
              <th>Sıra</th><th>Kural</th><th>r₁ (Cmax)</th><th>r₂ (T)</th><th>r₃ (L)</th>
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
                <td>{r.r1.toFixed(3)}</td><td>{r.r2.toFixed(3)}</td><td>{r.r3.toFixed(3)}</td>
                <td style={{ color: '#f85149' }}>{r.s_plus}</td>
                <td style={{ color: '#4ade80' }}>{r.s_minus}</td>
                <td style={{ color: '#4ade80', fontWeight: 'bold' }}>{r.cc}</td>
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
  Object.values(schedule).forEach(m => m.forEach(j => { if (j[2] > maxEnd) maxEnd = j[2]; }));
  
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
          <span style={{ fontWeight: 'bold', color: 'var(--warning)', marginLeft: '10px' }}>Cₘₐₓ: {maxEnd.toFixed(2)}h</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: '1rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', minWidth: `${chartWidth}px`, position: 'relative' }}>
          {Array.from({ length: m }).map((_, k) => (
            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--warning)' }}>M{k + 1}</div>
              <div style={{ flex: 1, height: '28px', background: 'rgba(255,255,255,0.02)', position: 'relative', border: '1px solid #30363d' }}>
                {schedule[k]?.map((job, idx) => {
                  const [jId, start, end, setup] = job;
                  const setupWidth = (setup / maxEnd) * 100;
                  const jobWidth = ((end - start) / maxEnd) * 100;
                  const leftPos = (start / maxEnd) * 100;
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
      const [jId, start, end, setupTime] = jobTuple;
      const pTime = problemData.P[jId][machineId];
      const sTime = setupTime;
      const dTime = problemData.D[jId];
      const lateness = end - dTime;
      const tardiness = Math.max(0, lateness);
      rows.push({
        k: machineId + 1, j: jId + 1, isFirst: i === 0, rowSpan: numJobs,
        p: pTime.toFixed(2), s: sTime.toFixed(2), end: end.toFixed(2), d: dTime.toFixed(2),
        t: tardiness.toFixed(2), e: Math.max(0, -lateness).toFixed(2), f: problemData.family?.[jId]
      });
    });
  });

  return (
    <div className="terminal-box" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <ScrollableTable maxHeight="1000px">
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
  Object.values(schedule).forEach(m => m.forEach(([j, s, e]) => {
    maxC = Math.max(maxC, e);
    totalT += Math.max(0, e - problemData.D[j]);
    if (e - problemData.D[j] > 0.01) numL++;
    totalP += (e - s);
  }));
  const util = (totalP / (Object.keys(schedule).length * maxC)) * 100;
  return (
    <div className="flex-row" style={{ gap: '1rem', marginTop: '1rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', fontSize: '0.8rem', justifyContent: 'space-around', border: '1px solid rgba(255,255,255,0.05)' }}>
      <span><strong>Cmax:</strong> {maxC.toFixed(1)}h</span>
      <span><strong>ΣT:</strong> {totalT.toFixed(1)}h</span>
      <span><strong>L:</strong> {numL} iş</span>
      <span><strong>Kullanım Oranı:</strong> %{util.toFixed(1)}</span>
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

export default function GuidedFlow() {
  const [loading, setLoading] = useState(false);
  const [activeStage, setActiveStage] = useState(1);
  const [inputJobs, setInputJobs] = useState('8');
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

  const scrollToNext = (stage) => { setActiveStage(stage); setTimeout(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }), 100); };

  const generateData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n: Number(inputJobs), m: Number(inputMachines), seed: 42, n_families: Number(inputFamilies) || 3, np_ratio: (Number(inputNP) / 100) || 0.0, scenario: inputScenario })
      });
      const data = await res.json();
      setProblemData(data.data);
      setActiveStage(2);
    } catch (e) { alert(e.message); }
    setLoading(false);
  };

  const runCPSAT = async () => {
    if (!problemData) return;
    if (problemData.metadata.n > 15) {
      alert("Bu ölçekteki problemler (n > 15) kesin çözümleyiciler için çok büyüktür. Lütfen Sezgisel (DDR) yöntemleri kullanın.");
      return;
    }
    setLoading(true);
    try {
      const solve = async (obj) => {
        const res = await fetch(`${API_BASE}/solve_cpsat`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...problemData.metadata, obj_type: obj, time_limit: 10 }) });
        const d = await res.json();
        if (!res.ok) throw new Error(d.detail || "Solver error");
        return d.results;
      };
      const rM1 = await solve('Cmax'); 
      const rM2 = await solve('T'); 
      const rM3 = await solve('L'); 
      const rM4 = await solve('weighted');
      setCpsatResults({ M1: rM1, M2: rM2, M3: rM3, M4: rM4 });
      scrollToNext(3);
    } catch (e) { 
      alert(e.message); 
    }
    setLoading(false);
  };

  const runAugmecon = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/solve_augmecon`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...problemData.metadata, time_limit: 6, grid_T: 5 }) });
      const d = await res.json(); setAugmeconResults(d.result);
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
          setDdrResults(currentResults);
        }
      } catch (e) { console.error(e); }
    }
    scrollToNext(4);
    setLoading(false);
  };

  const runTopsis = () => {
    if (ddrResults.length === 0) return;
    const minVal = (key) => Math.min(...ddrResults.map(r => r[key]));
    const maxVal = (key) => Math.max(...ddrResults.map(r => r[key]));
    const minC = minVal('Cmax'), maxC = maxVal('Cmax'), minT = minVal('T'), maxT = maxVal('T'), minL = minVal('L'), maxL = maxVal('L');
    
    let processed = ddrResults.map(r => {
      const r1 = minC / (r.Cmax || 0.1), r2 = minT / (r.T || 0.1), r3 = minL / (r.L || 1);
      return { ...r, r1, r2, r3 };
    });

    const v1 = Math.max(...processed.map(p => p.r1)), v2 = Math.max(...processed.map(p => p.r2)), v3 = Math.max(...processed.map(p => p.r3));
    
    let final = processed.map(p => {
      const s_plus = Math.sqrt(weights.wC * Math.pow(p.r1 - v1, 2) + weights.wT * Math.pow(p.r2 - v2, 2) + weights.wL * Math.pow(p.r3 - v3, 2));
      const s_minus = Math.sqrt(weights.wC * Math.pow(p.r1 - 0, 2) + weights.wT * Math.pow(p.r2 - 0, 2) + weights.wL * Math.pow(p.r3 - 0, 2));
      return { ...p, s_plus: s_plus.toFixed(4), s_minus: s_minus.toFixed(4), cc: (s_minus / (s_plus + s_minus)).toFixed(4) };
    }).sort((a, b) => b.cc - a.cc);

    setTopsisResults(final);
    scrollToNext(5);
  };

  return (
    <div className="flow-container">
      <div className="flow-content">
        
        {/* STEP 01: Intro */}
        {activeStage >= 1 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">01</div>
            <div className="flow-step-node">
              <h3><BookOpen size={20} /> 01. Problem Tanımı ve Giriş (Bölüm 1-2)</h3>
              <AcademicBlock items={[
                { h: "Problem Kapsamı", t: "Sıra ve tezgah bağımlı hazırlık sürelerine (Sijk) sahip ilişkisiz paralel tezgah çizelgeleme (UPMSP). Üç temel amaç: Yayılma süresi (Cmax), Toplam Gecikme (T) ve Geciken İş Sayısı (L)." },
                { h: "Sayısal Örnek (Tablo 2)", t: "Raporun 4. bölümünde kullanılan örnek veri seti: 3 İş, 2 Tezgah. İş 1 ve 2 aynı aileden (hazırlık süresi kısa), İş 3 farklı aileden (hazırlık süresi uzun) gelmektedir." }
              ]} />
              
              {/* Tablo 2 — Sayısal Örnek Verileri */}
              <div className="glass-panel mb-4" style={{ padding: '1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--warning)', marginBottom: '0.5rem' }}>📊 Tablo 2: Sayısal Örnek Veri Seti (P, S, D)</div>
                <table className="data-table small-table" style={{ fontSize: '0.7rem' }}>
                  <thead>
                    <tr><th>İş</th><th>M1 Pⱼₖ</th><th>M2 Pⱼₖ</th><th>Dⱼ (Termin)</th><th>Aile</th></tr>
                  </thead>
                  <tbody>
                    <tr><td>J1</td><td>10.0</td><td>6.0</td><td>15.0</td><td>F1</td></tr>
                    <tr><td>J2</td><td>12.0</td><td>15.0</td><td>20.0</td><td>F1</td></tr>
                    <tr><td>J3</td><td>20.0</td><td>10.0</td><td>30.0</td><td>F2</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '1rem' }}>
                <div className="form-group"><label>İş (n)</label><input type="number" className="input-field" value={inputJobs} onChange={e => setInputJobs(e.target.value)} /></div>
                <div className="form-group"><label>Tezgah (m)</label><input type="number" className="input-field" value={inputMachines} onChange={e => setInputMachines(e.target.value)} /></div>
                <div className="form-group"><label>Aile (F)</label><input type="number" className="input-field" value={inputFamilies} onChange={e => setInputFamilies(e.target.value)} /></div>
                <div className="form-group"><label>NP Yüzde (%)</label><input type="number" className="input-field" value={inputNP} onChange={e => setInputNP(e.target.value)} /></div>
                <div className="form-group"><label>Senaryo</label><select className="input-field" value={inputScenario} onChange={e => setInputScenario(e.target.value)}><option value="high">Yüksek Talep</option><option value="low">Düşük Talep</option></select></div>
              </div>
              <button className="btn btn-warning mt-4" onClick={generateData} disabled={loading}><Play size={16} /> Veri Üret ve Başlat</button>
            </div>
          </div>
        )}

        {/* STEP 02: MILP */}
        {activeStage >= 2 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">02</div>
            <div className="flow-step-node">
              <h3><Calculator size={20} /> 02. Matematiksel Modelleme (MILP - Bölüm 3)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', margin: '1rem 0' }}>
                <MathBox title="M1: Min Cmax" formula="min f₁ = Cmax" description="Yayılma süresini minimize eder." />
                <MathBox title="M2: Min T" formula="min f₂ = Σ eⱼ⁺" description="Toplam teslim gecikmesini minimize eder." />
                <MathBox title="M3: Min L" formula="min f₃ = Σ Uⱼ" description="Geciken iş sayısını minimize eder." />
              </div>
              <div className="glass-panel mb-4" style={{ padding: '1rem', fontSize: '0.75rem' }}>
                <strong>📊 Tablo 6: Model Kompleksliği (n={problemData?.metadata.n}, m={problemData?.metadata.m})</strong> — Karar Değişkeni: {problemData?.metadata.n ** 2 * problemData?.metadata.m}+, İkili Değişken: {problemData?.metadata.n ** 2 * problemData?.metadata.m}+.
              </div>
              <DataMatrixView data={problemData} title="Problem Veri Matrisi" />
              
              {problemData.metadata.n <= 15 ? (
                <button className="btn btn-primary mt-4" onClick={runCPSAT} disabled={loading}>
                  <Calculator size={16} /> Kesin Çözümleyicileri Çalıştır (M1-M4)
                </button>
              ) : (
                <div className="highlight-box mt-4" style={{ background: 'rgba(210,153,34,0.05)', border: '1px dashed var(--warning)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--warning)', marginBottom: '0.5rem' }}>
                    <Activity size={18} /> <strong>BÜYÜK ÖLÇEKLİ PROBLEM TESPİT EDİLDİ</strong>
                  </div>
                  <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '1rem' }}>
                    İş sayısı (n={problemData.metadata.n}) kesin çözüm (MILP) sınırlarının üzerindedir. Akademik raporda (Bölüm 5.2) belirtildiği üzere, bu ölçekte çözüm <strong>Dinamik Dağıtım Kuralları (DDR)</strong> ile milisaniyeler içinde gerçekleştirilmelidir.
                  </p>
                  <button className="btn btn-warning" onClick={() => scrollToNext(4)}>
                    <Zap size={16} /> SEZGİSEL ANALİZ (DDR) AŞAMASINA ATLA
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 03: MILP Results */}
        {activeStage >= 3 && cpsatResults.M1 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">03</div>
            <div className="flow-step-node">
              <h3><Target size={20} /> 03. Kesin Çözüm Sonuçları (Tablo 7-9)</h3>
              <PayoffTable results={cpsatResults} />
              <MILPParetoChart results={cpsatResults} augmeconResults={augmeconResults} />
              <button className="btn btn-accent mt-4" onClick={runAugmecon} disabled={loading}><BarChart3 size={16} /> Pareto Cephesini Hesapla (AUGMECON)</button>
              
              {/* Tablo 10, 11, 12 — Pareto Analizi */}
              {augmeconResults && (
                <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="glass-panel" style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#a371f7' }}>📊 Tablo 10: Hiperhacim Analysis</div>
                    <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>P1 Problem örneği için AUGMECON Hiperhacim: <strong>%91</strong> (P3 için %74).</p>
                  </div>
                  <div className="glass-panel" style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: '#a371f7' }}>📑 Tablo 11 & 12: Pareto Seçimi</div>
                    <p style={{ fontSize: '0.75rem', opacity: 0.8 }}>Karar verici ağırlıkları (0.5, 0.4, 0.1) altında P1 için <strong>6. Çözüm</strong> seçilmiştir: Cmax=72.14, T=39.21, L=3.</p>
                  </div>
                </div>
              )}

              <div className="mt-4"><JobSequenceTable schedule={cpsatResults.M4.schedule} m={Number(inputMachines)} problemData={problemData} /></div>
              <button className="btn btn-warning mt-4" onClick={runDDR}><Zap size={16} /> Sezgisel Analiz (DDR) Aşamasına Geç</button>
            </div>
          </div>
        )}

        {/* STEP 04: DDR */}
        {activeStage >= 4 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">04</div>
            <div className="flow-step-node">
              <h3><Zap size={20} /> 04. Dinamik Dağıtım Kuralları (DDR - Bölüm 4)</h3>
              <AcademicBlock items={[
                { h: "SCT & SC-EDD & SC-LPT", t: "Sezgisel kurallar, hazırlık sürelerini minimize ederek işleri tezgahlara atar." },
                { h: "Sayısal Adım Örneği (Tablo 3, 4)", t: "SCT ve Kombine kuralların adım adım ilerleyişi aşağıda detaylandırılmıştır." }
              ]} />

              {/* Tablo 3 & 4 — Adım Adım İlerleme */}
              <div className="mt-4" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--warning)', marginBottom: '0.5rem' }}>📑 Tablo 3: SCT Adımları</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                    Adım 1: J1 → M2 (C1=6)<br/>
                    Adım 2: J2 → M1 (C2=22)<br/>
                    Adım 3: J3 → M2 (C3=31)<br/>
                    <strong>Sonuç: Cmax=31, T=2.0</strong>
                  </div>
                </div>
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent)', marginBottom: '0.5rem' }}>📑 Tablo 4: [SCT & SC-LPT: 5]</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>
                    Adım 1 (SCT): J1 → M2 (C1=6)<br/>
                    Adım 2 (LPT): J3 → M1 (C3=28)<br/>
                    Adım 3 (LPT): J2 → M2 (C2=22.5)<br/>
                    <strong>Sonuç: Cmax=28, T=2.5</strong>
                  </div>
                </div>
              </div>

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
              </div>

              {ddrResults.length > 0 && (
                <div className="mt-4 slide-in">
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '2rem' }}>
                    <div className="output-header" style={{ marginBottom: '0.5rem' }}>DDR Sonuçları Pareto Dağılımı (Cmax × T, Boyut = L)</div>
                    <div style={{ height: '340px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis type="number" dataKey="Cmax" name="Cmax" stroke="#8b949e" label={{ value: 'Cmax', position: 'insideBottom', offset: -10, fill: '#8b949e', fontSize: 11 }} />
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

                  <div className="glass-panel" style={{ padding: '1rem', background: 'rgba(0,0,0,0.2)', marginBottom: '1rem' }}>
                    <strong>📊 Tablo 12: DDR Performans Matrisi</strong> (Senaryo Analizi)
                    <ScrollableTable maxHeight="300px">
                      <table className="data-table small-table">
                        <tbody>
                          {ddrResults
                            .filter(r => r && typeof r.Cmax === 'number')
                            .sort((a, b) => a.Cmax - b.Cmax)
                            .map((r, i) => (
                              <tr key={i} style={{ background: i < 3 ? 'rgba(210,153,34,0.05)' : 'transparent' }}>
                                <td>{r.rule_name}</td>
                                <td>{r.Cmax.toFixed(2)}</td>
                                <td>{r.T.toFixed(2)}</td>
                                <td>{r.L}</td>
                              </tr>
                            ))}
                        </tbody>
                      </table>
                    </ScrollableTable>
                  </div>
                  
                  <div className="mt-4" style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div className="form-group" style={{ flex: 1 }}><label style={{ color: 'var(--warning)', fontSize: '0.75rem' }}>w₁ (Cmax)</label><input type="number" step="0.05" className="input-field" value={weights.wC} onChange={e => setWeights({...weights, wC: Number(e.target.value)})} /></div>
                    <div className="form-group" style={{ flex: 1 }}><label style={{ color: 'var(--warning)', fontSize: '0.75rem' }}>w₂ (T)</label><input type="number" step="0.05" className="input-field" value={weights.wT} onChange={e => setWeights({...weights, wT: Number(e.target.value)})} /></div>
                    <div className="form-group" style={{ flex: 1 }}><label style={{ color: 'var(--warning)', fontSize: '0.75rem' }}>w₃ (L)</label><input type="number" step="0.05" className="input-field" value={weights.wL} onChange={e => setWeights({...weights, wL: Number(e.target.value)})} /></div>
                    <button 
                      className="btn btn-warning mt-auto" 
                      onClick={runTopsis} 
                      style={{ height: '42px', opacity: (loading || ddrResults.length < 39) ? 0.5 : 1 }}
                      disabled={loading || ddrResults.length < 39}
                    >
                      <Activity size={16} /> TOPSIS Analizi Uygula
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 05: TOPSIS */}
        {activeStage >= 5 && topsisResults.length > 0 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">05</div>
            <div className="flow-step-node">
              <h3><Activity size={20} /> 05. TOPSIS ve Karar Verici Analizi (Bölüm 5.3)</h3>
              <div className="glass-panel mt-4" style={{ padding: '1rem', borderLeft: '4px solid #3fb950' }}>
                <strong>📊 Tablo 20: Etkili Kurallar Özeti</strong><br/>
                <span style={{ fontSize: '0.75rem' }}>Düşük Talep: [SC-EDD & SCT: 200] | Yüksek Talep: SCT</span>
              </div>
              <div className="highlight-box mt-4" style={{ fontSize: '0.75rem' }}>
                <strong>💡 DM Senaryoları:</strong> wT ≥ 0.05 ise [SC-EDD & SCT: 200] baskındır. wC ≥ 0.88 ise [SCT & SC-EDD: 450] tercih edilir.
              </div>
              <TopsisNormalizationTable topsisResults={topsisResults} />
              
              {/* ADD: Seçilen Kuralın Detaylı Çıktısı (Gantt & Liste) */}
              <div className="mt-4 slide-in" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
                <div className="output-header" style={{ color: 'var(--accent)', marginBottom: '0.5rem' }}>
                  🏆 Seçilen En İyi Kural: <span style={{ color: '#fff' }}>{topsisResults[0].rule_name}</span>
                </div>
                <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '1rem' }}>
                  TOPSIS'in seçtiği optimal kural ile oluşturulan operasyonel çizelge. 
                  <span style={{ color: '#9b59b6', fontWeight: 'bold' }}> Mor bloklar hazırlık (Sᵢⱼₖ)</span>, 
                  <span style={{ color: '#27ae60', fontWeight: 'bold' }}> yeşil bloklar işlem (Pⱼₖ)</span> sürelerini gösterir.
                </div>
                
                <JobSequenceTable 
                  schedule={topsisResults[0].schedule} 
                  m={Number(inputMachines)} 
                  problemData={problemData} 
                />
                
                <GanttChart 
                  schedule={topsisResults[0].schedule} 
                  m={Number(inputMachines)} 
                  n={Number(inputJobs)} 
                />

                <CompactMetrics 
                  schedule={topsisResults[0].schedule} 
                  problemData={problemData} 
                />
              </div>

              <button className="btn btn-warning mt-4" onClick={() => scrollToNext(6)}>06. Gap Analizi ve İstatistiklere Geç</button>
            </div>
          </div>
        )}

        {/* STEP 06: Stats & Gap */}
        {activeStage >= 6 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">06</div>
            <div className="flow-step-node">
              <h3><TrendingUp size={20} /> 06. Büyük Ölçek İstatistikleri (Bölüm 5.2)</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <strong>📊 TABLO 14: BÜYÜK ÖRNEK</strong><br/>
                  <span style={{ fontSize: '0.75rem' }}>244-298 iş, 26 aile, 18 aylık gerçek veri seti.</span>
                </div>
                <div className="glass-panel" style={{ padding: '1rem' }}>
                  <strong>📈 TABLO 16 & 19: ANOVA</strong><br/>
                  <span style={{ fontSize: '0.75rem' }}>SCT ve SC-EDD kuralları SC-LPT'den istatistiksel olarak üstündür (p &lt; 0.05).</span>
                </div>
              </div>
              {cpsatResults.M4 && (
                <HeuristicRadarChart optimal={cpsatResults.M4} winner={topsisResults[0]} standard={ddrResults.slice(0,3)} />
              )}
              <button className="btn btn-warning mt-4" onClick={() => scrollToNext(7)}>07. Sonuç</button>
            </div>
          </div>
        )}

        {/* STEP 07: Conclusion */}
        {activeStage >= 7 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">07</div>
            <div className="flow-step-node">
              <h3><BookOpen size={20} /> 07. Sonuç ve Akademik Katkı (Bölüm 6)</h3>
              <AcademicBlock items={[
                { h: "Önemli Bulgular", t: "Sıra-bağımlı hazırlık süreleri altında hibrit DDR kuralları, kesin çözümlere göre %5-10 gap ile milisaniyeler içinde sonuç üretir." },
                { h: "Katkı", t: "Literatüre kazandırılan kural değiştirme mekanizması ve TOPSIS tabanlı seçim çerçevesi çelik boru üretiminde verimliliği artırmaktadır." }
              ]} />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
