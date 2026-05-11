import React, { useState, useEffect } from 'react';
import { Play, Calculator, Zap, Target, Activity, FileText, BarChart3, Copy, CheckCircle, BookOpen, TrendingUp } from 'lucide-react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, Cell } from 'recharts';

const API_BASE = '/api';

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
              <th style={{ opacity: 0.5 }}>...</th>
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
                <td style={{ opacity: 0.3 }}>...</td>
              </tr>
            ))}
          </tbody>
        </table>
      </ScrollableTable>
    </div>
  );
});

const GanttChart = React.memo(({ schedule, m, n }) => {
  const [zoomLevel, setZoomLevel] = useState(null);
  if (!schedule) return null;

  let maxEnd = 0;
  let minDuration = Infinity;

  Object.keys(schedule).forEach(k => {
    schedule[k].forEach(jobTuple => {
      const [jId, start, end, setup] = jobTuple;
      if (end > maxEnd) maxEnd = end;
      const duration = end - start;
      if (duration < minDuration) minDuration = duration;
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
                      {setup > 0.01 && <div style={{ position: 'absolute', left: `${setupLeft}%`, width: `${setupWidth}%`, height: '100%', background: '#9b59b6', opacity: 0.6 }} />}
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
        p: pTime.toFixed(2), s: sTime.toFixed(2), ps: (pTime + sTime).toFixed(2),
        end: end.toFixed(2), d: dTime.toFixed(2), l: lateness.toFixed(2),
        t: tardiness.toFixed(2), e: Math.max(0, -lateness).toFixed(2), f: problemData.family?.[jId]
      });
    });
  });
  return (
    <div className="terminal-box" style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
      <ScrollableTable maxHeight="350px">
        <table className="data-table small-table">
          <thead><tr><th>Tezgah</th><th>İş</th><th>İşlem (P)</th><th>Hazırlık (S)</th><th>P+S</th><th>Tamamlanma</th><th>Teslim</th><th>Gecikme</th><th>Erkenlik</th><th>Aile</th></tr></thead>
          <tbody>{rows.map((r, idx) => (
            <tr key={idx}>
              {r.isFirst && <td rowSpan={r.rowSpan} style={{ fontWeight: 'bold', color: 'var(--warning)', verticalAlign: 'middle', borderRight: '1px solid #30363d' }}>M{r.k}</td>}
              <td>J{r.j}</td><td>{r.p}</td><td>{r.s}</td><td>{r.ps}</td><td style={{ fontWeight: 'bold' }}>{r.end}</td><td>{r.d}</td>
              <td style={{ color: r.t > 0 ? '#ff7b72' : 'inherit' }}>{r.t}</td><td style={{ color: r.e > 0 ? '#4ade80' : 'inherit' }}>{r.e}</td><td>F{r.f}</td>
            </tr>
          ))}</tbody>
        </table>
      </ScrollableTable>
    </div>
  );
});

const CompactMetrics = ({ schedule, problemData }) => {
  if (!schedule) return null;
  let cmax = 0, totalT = 0, numT = 0;
  Object.values(schedule).forEach(jobs => {
    jobs.forEach(([jId, start, end]) => {
      if (end > cmax) cmax = end;
      const tard = Math.max(0, end - problemData.D[jId]);
      totalT += tard;
      if (tard > 0.01) numT++;
    });
  });
  return (
    <div className="flex-row mt-3" style={{ gap: '1rem', justifyContent: 'center' }}>
      <div className="highlight-box"><strong>Cmax:</strong> {cmax.toFixed(2)}h</div>
      <div className="highlight-box"><strong>Toplam Gecikme:</strong> {totalT.toFixed(2)}h</div>
      <div className="highlight-box"><strong>Geciken İş:</strong> {numT}</div>
    </div>
  );
};

const AcademicBlock = ({ items }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', margin: '1rem 0' }}>
    {items.map((item, idx) => (
      <div key={idx} style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>
        <strong style={{ color: 'var(--warning)', display: 'block', marginBottom: '2px' }}>{item.h}</strong>
        <span style={{ opacity: 0.8 }}>{item.t}</span>
      </div>
    ))}
  </div>
);

export default function GuidedFlow() {
  const [activeStage, setActiveStage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [problemData, setProblemData] = useState(null);
  const [cpsatResults, setCpsatResults] = useState({ M1: null, M2: null, M3: null, M4: null });
  const [ddrResults, setDdrResults] = useState([]);
  const [topsisResults, setTopsisResults] = useState([]);
  const [weights, setWeights] = useState({ wC: 0.34, wT: 0.33, wL: 0.33 });

  const [inputJobs, setInputJobs] = useState(10);
  const [inputMachines, setInputMachines] = useState(3);
  const [inputScenario, setInputScenario] = useState("high");

  const generateData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ n: Number(inputJobs), m: Number(inputMachines), seed: 42, scenario: inputScenario })
      });
      const d = await res.json();
      setProblemData(d.data);
      setActiveStage(2);
    } catch (e) { alert(e); }
    setLoading(false);
  };

  const runMILP = async () => {
    if (!problemData) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/solve_cpsat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...problemData.metadata, seed: 42, scenario: inputScenario })
      });
      const d = await res.json();
      setCpsatResults(d.results);
      setActiveStage(3);
    } catch (e) { alert(e); }
    setLoading(false);
  };

  const runDDR = async () => {
    if (!problemData) return;
    setLoading(true);
    setDdrResults([]);
    const stdRules = ["SCT", "SC-EDD", "SC-LPT", "SC-WSPT"];
    const r1s = ["SCT", "SC-EDD"], r2s = ["SCT", "SC-EDD", "SC-LPT", "SC-WSPT"], tsValues = [200, 400, 600, 800, 1000];
    let configs = [...stdRules];
    r1s.forEach(r1 => r2s.forEach(r2 => tsValues.forEach(ts => { if (r1 !== r2) configs.push(`[${r1} & ${r2}: ${ts}]`); })));

    for (let i = 0; i < configs.length; i++) {
      try {
        const res = await fetch(`${API_BASE}/solve_single_ddr`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...problemData.metadata, seed: problemData.metadata.seed, rule_name: configs[i] })
        });
        const d = await res.json();
        if (d.status === 'success') setDdrResults(prev => [...prev, d.result].sort((a, b) => a.Cmax - b.Cmax));
      } catch (e) { console.error(e); }
    }
    setLoading(false);
    setActiveStage(5);
  };

  const runTopsis = () => {
    if (ddrResults.length === 0) return;
    const criteria = ddrResults.map(r => ({ rule: r.rule_name, c1: r.Cmax, c2: r.T, c3: r.L }));
    const totalW = parseFloat(weights.wC) + parseFloat(weights.wT) + parseFloat(weights.wL);
    const w = [parseFloat(weights.wC) / totalW, parseFloat(weights.wT) / totalW, parseFloat(weights.wL) / totalW];
    let sqSum1 = 0, sqSum2 = 0, sqSum3 = 0;
    criteria.forEach(c => { sqSum1 += c.c1 * c.c1; sqSum2 += c.c2 * c.c2; sqSum3 += c.c3 * c.c3; });
    const d1 = Math.sqrt(sqSum1) || 1, d2 = Math.sqrt(sqSum2) || 1, d3 = Math.sqrt(sqSum3) || 1;
    const weighted = criteria.map(c => [(c.c1 / d1) * w[0], (c.c2 / d2) * w[1], (c.c3 / d3) * w[2]]);
    const pis = [Infinity, Infinity, Infinity], nis = [-Infinity, -Infinity, -Infinity];
    weighted.forEach(row => { for (let i = 0; i < 3; i++) { if (row[i] < pis[i]) pis[i] = row[i]; if (row[i] > nis[i]) nis[i] = row[i]; } });
    const res = criteria.map((c, idx) => {
      const sPlus = Math.sqrt(weighted[idx].reduce((acc, v, i) => acc + Math.pow(v - pis[i], 2), 0));
      const sMinus = Math.sqrt(weighted[idx].reduce((acc, v, i) => acc + Math.pow(v - nis[i], 2), 0));
      const cc = sMinus / (sPlus + sMinus) || 0;
      return { rule_name: c.rule, r1: c.c1, r2: c.c2, r3: c.c3, s_plus: sPlus.toFixed(4), s_minus: sMinus.toFixed(4), cc: cc.toFixed(6) };
    });
    setTopsisResults(res.sort((a, b) => b.cc - a.cc));
  };

  useEffect(() => { if (ddrResults.length > 0) runTopsis(); }, [ddrResults, weights]);

  const scrollToNext = (stage) => { setActiveStage(stage); setTimeout(() => { window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }, 100); };

  return (
    <div className="guided-flow">
      <div className="flow-container">
        {/* STEP 01 */}
        <div className={`flow-step ${activeStage >= 1 ? 'active' : ''}`}>
          <div className="flow-step-number">01</div>
          <div className="flow-step-node">
            <h3><FileText size={20} /> 01. Veri Seti ve Senaryo Tanımlama (Bölüm 5.1.1)</h3>
            <AcademicBlock items={[{ h: "Problem Ölçeği", t: "n işin m adet özdeş olmayan paralel tezgahta çizelgelenmesi. n=298'e kadar gerçek veriye dayalı ölçekleme desteklenir." }]} />
            <div className="flex-row mt-4" style={{ gap: '1rem', flexWrap: 'wrap' }}>
              <div className="form-group">
                <label>İş Sayısı (n)</label>
                <input type="number" className="input-field" value={inputJobs} onChange={e => setInputJobs(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Tezgah Sayısı (m)</label>
                <input type="number" className="input-field" value={inputMachines} onChange={e => setInputMachines(e.target.value)} />
              </div>
              <div className="form-group">
                <label>Senaryo (Hazırlık Yoğunluğu)</label>
                <select className="input-field" value={inputScenario} onChange={e => setInputScenario(e.target.value)}>
                  <option value="low">Düşük Sᵢⱼₖ / Pⱼₖ Oranı</option>
                  <option value="high">Yüksek Sᵢⱼₖ / Pⱼₖ Oranı (Zor Senaryo)</option>
                </select>
              </div>
            </div>
            <button className="btn btn-warning mt-4" onClick={generateData} disabled={loading}><Play size={16} /> VERİ SETİ OLUŞTUR</button>
          </div>
        </div>

        {/* STEP 02 */}
        {activeStage >= 2 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">02</div>
            <div className="flow-step-node">
              <h3><BarChart3 size={20} /> 02. Dijital İkiz: Veri Matris Analizi</h3>
              <PaginatedSetupMatrix data={problemData} selectedK={0} />
              <button className="btn btn-warning mt-4" onClick={() => scrollToNext(3)}><Calculator size={16} /> 03. Matematiksel Modelleme (MILP) Aşamasına Geç</button>
            </div>
          </div>
        )}

        {/* STEP 03 */}
        {activeStage >= 3 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">03</div>
            <div className="flow-step-node">
              <h3><Calculator size={20} /> 03. Matematiksel Modelleme – MILP (Bölüm 3)</h3>
              <AcademicBlock items={[{ h: "MILP Modelleri (M1, M2, M3, M4)", t: "M1: Makespan (Cmax) Optimizasyonu. M4: Çok Amaçlı Dengeli Çözüm." }]} />
              <button className="btn btn-warning" onClick={runMILP} disabled={loading}><Play size={16} /> MILP ÇÖZÜCÜYÜ BAŞLAT</button>
              {cpsatResults.M1 && (
                <div className="mt-4 grid-2">
                  <div className="milp-result-card"><JobSequenceTable schedule={cpsatResults.M1.schedule} m={Number(inputMachines)} problemData={problemData} /></div>
                  <div className="milp-result-card"><JobSequenceTable schedule={cpsatResults.M4.schedule} m={Number(inputMachines)} problemData={problemData} /></div>
                </div>
              )}
              <button className="btn btn-warning mt-4" onClick={() => scrollToNext(4)}><Zap size={16} /> 04. Sezgisel Analiz (DDR) Aşamasına Geç</button>
            </div>
          </div>
        )}

        {/* STEP 04 */}
        {activeStage >= 4 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">04</div>
            <div className="flow-step-node">
              <h3><Zap size={20} /> 04. Dinamik Dağıtım Kuralları – DDR (Bölüm 4)</h3>
              <div className="flex-column" style={{ gap: '1rem', alignItems: 'center', margin: '2rem 0' }}>
                <button className="btn btn-warning" onClick={runDDR} disabled={loading} style={{ padding: '1rem 3rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  {loading ? "Analiz Ediliyor..." : "39 DDR SENARYOSUNU ANALİZ ET"}
                </button>
                {loading && (
                  <div style={{ width: '100%', maxWidth: '500px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--warning)' }}>
                      <span>İlerleme</span><span>{Math.round((ddrResults.length / 34) * 100)}%</span>
                    </div>
                    <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden', marginTop: '5px' }}>
                      <div style={{ height: '100%', background: 'var(--warning)', width: `${(ddrResults.length / 34) * 100}%` }}></div>
                    </div>
                  </div>
                )}
              </div>
              {ddrResults.length > 0 && (
                <>
                  <ScrollableTable maxHeight="300px">
                    <table className="data-table">
                      <thead><tr><th>Sıra</th><th>Kural</th><th>Cmax ↓</th><th>T (Gecikme) ↓</th><th>L (Geciken İş) ↓</th></tr></thead>
                      <tbody>{ddrResults.map((r, i) => <tr key={i}><td style={{ fontWeight: 'bold' }}>{i + 1}</td><td>{r.rule_name}</td><td>{r.Cmax.toFixed(2)}</td><td>{r.T.toFixed(2)}</td><td>{r.L}</td></tr>)}</tbody>
                    </table>
                  </ScrollableTable>
                  <button className="btn btn-warning mt-4" onClick={() => scrollToNext(5)}><Target size={16} /> 05. TOPSIS Karar Analizi Adımına Geç</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* STEP 05 */}
        {activeStage >= 5 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">05</div>
            <div className="flow-step-node">
              <h3><Target size={20} /> 05. Çok Kriterli Karar Verme – TOPSIS (Bölüm 5.3)</h3>
              <div className="mt-4" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px' }}>
                <div className="flex-row" style={{ gap: '2rem' }}>
                  <div className="form-group"><label>w₁ (Cmax)</label><input type="number" step="0.05" className="input-field" value={weights.wC} onChange={e => setWeights({ ...weights, wC: Number(e.target.value) })} /></div>
                  <div className="form-group"><label>w₂ (Tardiness)</label><input type="number" step="0.05" className="input-field" value={weights.wT} onChange={e => setWeights({ ...weights, wT: Number(e.target.value) })} /></div>
                  <div className="form-group"><label>w₃ (Tardy Jobs)</label><input type="number" step="0.05" className="input-field" value={weights.wL} onChange={e => setWeights({ ...weights, wL: Number(e.target.value) })} /></div>
                  <button className="btn btn-warning" onClick={runTopsis} style={{ height: '42px' }}>ANALİZİ GÜNCELLE</button>
                </div>
              </div>
              {topsisResults.length > 0 && (
                <div className="mt-4">
                  <ScrollableTable maxHeight="300px">
                    <table className="data-table small-table">
                      <thead><tr><th>Kural</th><th>Cmax</th><th>T</th><th>L</th><th>CC* ↑</th></tr></thead>
                      <tbody>{topsisResults.map((r, i) => <tr key={i} style={{ background: i === 0 ? 'rgba(210,153,34,0.1)' : 'transparent' }}><td>{r.rule_name}</td><td>{r.r1}</td><td>{r.r2}</td><td>{r.r3}</td><td style={{ fontWeight: 'bold' }}>{r.cc}</td></tr>)}</tbody>
                    </table>
                  </ScrollableTable>
                  <div style={{ marginTop: '2rem', padding: '1.5rem', border: '2px solid var(--warning)', borderRadius: '12px', textAlign: 'center' }}>
                    <h4 style={{ color: 'var(--warning)' }}>Önerilen Optimal Kural: {topsisResults[0].rule_name}</h4>
                    <p>CC* Skoru: {topsisResults[0].cc}</p>
                    <JobSequenceTable schedule={ddrResults.find(r => r.rule_name === topsisResults[0].rule_name)?.schedule} m={Number(inputMachines)} problemData={problemData} />
                    <GanttChart schedule={ddrResults.find(r => r.rule_name === topsisResults[0].rule_name)?.schedule} m={Number(inputMachines)} n={Number(inputJobs)} />
                  </div>
                  <button className="btn btn-warning mt-4" onClick={() => scrollToNext(6)}><Activity size={16} /> 06. Sezgisel Performans Değerlendirmesine Geç</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 06 */}
        {activeStage >= 6 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">06</div>
            <div className="flow-step-node">
              <h3><Activity size={20} /> 06. Hesaplamalı Çalışma – Gap Analizi</h3>
              <div className="mt-4" style={{ padding: '2rem', background: 'rgba(210,153,34,0.05)', borderRadius: '12px', textAlign: 'center' }}>
                <TrendingUp size={32} color="var(--warning)" />
                <h4>Pareto Gap Analizi</h4>
                <p>Sezgisel çözümlerin kalitesi, global optimal çözüme olan % uzaklıkları ile ölçülür.</p>
                <button className="btn btn-warning mt-4" onClick={() => scrollToNext(7)}><CheckCircle size={16} /> 07. Sonuca Git</button>
              </div>
            </div>
          </div>
        )}

        {/* STEP 07 */}
        {activeStage >= 7 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">07</div>
            <div className="flow-step-node">
              <h3><BookOpen size={20} /> 07. Sonuç</h3>
              <p>Bu çalışma UPMSP problemleri için hibrit bir dijital ikiz sunmaktadır.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
