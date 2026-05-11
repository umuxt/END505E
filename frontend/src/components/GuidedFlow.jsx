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

// --- Academic Content Block (Inline Report Narrative) ---
const AcademicBlock = ({ items }) => (
  <div style={{ margin: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
    {items.map((item, i) => (
      <div key={i} style={{
        background: 'rgba(255,255,255,0.02)',
        borderLeft: '3px solid var(--warning)',
        padding: '0.9rem 1.2rem',
        borderRadius: '0 8px 8px 0'
      }}>
        {item.h && <div style={{ fontWeight: 'bold', color: 'var(--warning)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.4rem' }}>{item.h}</div>}
        <div style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.9 }}>{item.t}</div>
      </div>
    ))}
  </div>
);

// --- MAIN FLOW COMPONENT ---
export default function GuidedFlow() {
  const [loading, setLoading] = useState(false);
  const [activeStage, setActiveStage] = useState(1);
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

  const scrollToNext = (stage) => {
    setActiveStage(stage);
    setTimeout(() => {
      const elements = document.querySelectorAll('.flow-step');
      if (elements[stage - 1]) {
        elements[stage - 1].scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <div className="notebook-container">
      <div className="notebook-header" style={{ padding: '1.5rem 1rem', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', right: '20px', top: '20px', opacity: 0.1, pointerEvents: 'none' }}>
          <img src="/itu-logo.png" alt="ITU Logo" style={{ width: '90px' }} />
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <img src="/itu-logo.png" alt="ITU" style={{ height: '28px' }} />
            <div style={{ fontSize: '0.7rem', fontWeight: 'bold', color: 'var(--text-secondary)', letterSpacing: '2px' }}>İSTANBUL TEKNİK ÜNİVERSİTESİ</div>
          </div>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', letterSpacing: '-1px', marginBottom: '0.5rem', lineHeight: 1.2 }}>UPMSP Akademik Karar Destek Sistemi</h2>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1rem', maxWidth: '650px' }}>
            Bu interaktif sistem, <a href="https://doi.org/10.1016/j.dajour.2024.100525" target="_blank" rel="noreferrer" style={{ color: 'var(--warning)', fontWeight: 'bold', textDecoration: 'underline' }}>Decision Analytics Journal (2024)</a>'da yayınlanan{' '}
            <em>"A multi-objective production scheduling model and dynamic dispatching rules..."</em> makalesi temel alınarak,{' '}
            <strong>İTÜ END505E Proje Ödevi</strong> kapsamında geliştirilmiştir.
          </div>
        </div>
      </div>

      <div className="academic-flow">
        {/* STEP 01 */}
        <div className={`flow-step ${activeStage >= 1 ? 'active' : ''}`}>
          <div className="flow-step-number">01</div>
          <div className="flow-step-node">
            <h3><FileText size={20} /> 01. Giriş ve Problem Tanımı</h3>
            <AcademicBlock items={[
              { h: "Endüstriyel Motivasyon", t: "Bu çalışma, Tayland'daki en büyük çelik boru üreticisindeki gerçek bir üretim planlama probleminden motive edilmiştir. Müşteri siparişlerinden oluşan 244-298 iş, kapasiteleri ve hızları farklı 10 ilişkisiz paralel tezgaha çizelgelenmektedir. Çalışmanın amacı, üç çatışan hedefi (hız, gecikme, teslim terminleri) aynı anda optimize eden bir sistem kurmaktır. [Decision Analytics Journal 13, 2024]" },
              { h: "Sıra-Bağımlı Hazırlık Süresi Problemi (Sᵢⱼₖ)", t: "Bir işin hazırlık süresi, atandığı tezgaha (k) ve kendisinden önce o tezgahta işlenen işe (i) bağlıdır. Farklı ürün ailelerinden işler art arda geldiğinde hazırlık süresi 3-11 saat sürerken, aynı aileden art arda gelenler yalnızca 20-40 dakika sürer. Her periyodun başındaki ilk iş 'Kukla İş (j=0)' olarak modellenir ve hazırlık süresi S₀,ⱼ,ₖ = 0 kabul edilir." },
              { h: "Model Parametreleri (Bölüm 3.1)", t: "n = iş sayısı • m = tezgah sayısı • Pⱼₖ = j işinin k tezgahındaki işlem süresi (saat) • Sᵢⱼₖ = k tezgahında i'den sonra j işlenirken gereken hazırlık süresi • Dⱼ = j işinin teslim tarihi • NPⱼₖ = 1 ise j işi k tezgahında işlenebilir, 0 ise işlenemez" }
            ]} />
            <button className="btn btn-warning mt-4" onClick={() => scrollToNext(2)}><BookOpen size={16} /> Literatür Taramasına Geç</button>
          </div>
        </div>

        {/* STEP 02: Literatür Taraması */}
        {activeStage >= 1 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">02</div>
            <div className="flow-step-node">
              <h3><BookOpen size={20} /> 02. Literatür Taraması (Bölüm 2)</h3>
              <AcademicBlock items={[
                { h: "Araştırma Boşluğu (Research Gap)", t: "Tablo 1'e göre, tezgah ve sıra-bağımlı hazırlık süreli ilişkisiz paralel tezgah sistemlerinde Cmax, T ve L'â€™yi eş zamanlı optimize eden hiçbir çalışma yoktur. Bu çalışma bu boşluğu doldurmaktadır." },
                { h: "Temel Referans 1 – Avalos-Rosales (2015)", t: "M1 modelinin temeli bu çalışmadan alınmıştır. Orijinal model yalnızca Cmax'ı minimize eder. Bu çalışma onu T ve L kriterlerini de kapsayacak şekilde genişletmiştir." },
                { h: "Temel Referans 2 – Bektur & Sarac (2019)", t: "DDR sezgisellerine ilham veren bu çalışma, ATCS kuralını sıra-bağımlı hazırlık süreleri için uyarlar. Bu çalışma ise tek kural yerine SCT, SC-LPT ve SC-EDD adlı üç yeni kural geliştirir." }
              ]} />
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
              <div className="mt-4" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 'bold', color: 'var(--warning)', marginBottom: '0.75rem' }}>🧪 Bunu Kendiniz Deneyin: Problem Veri Seti Oluşturun</div>
                <div className="flex-row" style={{ gap: '1.5rem', flexWrap: 'wrap' }}>
                  <div className="form-group" style={{ flex: 1, minWidth: '130px' }}>
                    <label>İş Sayısı (n)</label>
                    <input type="number" className="input-field" value={inputJobs} onChange={e => setInputJobs(e.target.value)} placeholder="Örn: 10" />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '130px' }}>
                    <label>Tezgah Sayısı (m)</label>
                    <input type="number" className="input-field" value={inputMachines} onChange={e => setInputMachines(e.target.value)} placeholder="Örn: 3" />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '130px' }}>
                    <label>Ürün Ailesi (F)</label>
                    <input type="number" className="input-field" value={inputFamilies} onChange={e => setInputFamilies(e.target.value)} placeholder="Örn: 3" />
                  </div>
                  <div className="form-group" style={{ flex: 1, minWidth: '130px' }}>
                    <label>NP Oranı (%)</label>
                    <input type="number" className="input-field" value={inputNP} onChange={e => setInputNP(e.target.value)} placeholder="Örn: 20" />
                  </div>
                </div>
                <button className="btn btn-warning mt-4" onClick={generateData} disabled={loading}>
                  {loading ? <div className="loader"></div> : <><Play size={16} /> Sistemi Başlat ve Veri Üret</>}
                </button>
                {problemData && (
                  <>
                    <DataMatrixView data={problemData} title="Tablo 2: Problem Veri Matrisi (Pⱼₖ, Sᵢⱼₖ, Dⱼ)" />
                    <button className="btn btn-warning mt-4" onClick={() => scrollToNext(3)}><Calculator size={16} /> 03. Matematiksel Modeller (MILP) Adımına Geç</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}

        {/* STEP 03: MILP */}
        {activeStage >= 2 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">03</div>
            <div className="flow-step-node">
              <h3><Calculator size={20} /> 03. Matematiksel Modeller (MILP – Bölüm 3)</h3>
              <AcademicBlock items={[
                { h: "M1: Min Cmax (Yayılma Süresini Minimize Et)", t: "Temel model: Cmax = max(Cⱼ). Karar değişkeni Xᵢⱼₖ: j işi k tezgahında i'den hemen sonra çizelgelenirse 1, değilse 0. Kısıt (6): Cⱼ ≥ Cᵢ + Sᵢⱼₖ + Pⱼₖ – V·(1 – Xᵢⱼₖ). Kısıtlar (2-3) her işin tek öncülü ve ardılı olmasını, kısıt (5) her tezgahın kukla işle başlamasını garanti eder." },
                { h: "M2: Min T (Toplam Gecikme) | M3: Min L (Geciken İş Sayısı)", t: "M2, M1'e eⱼ⁺ (tardiness) ve eⱼ⁻ (earliness) değişkenleri eklenerek türetilir. Hedef: Min Σ eⱼ⁺. M3 ise Uⱼ ∈ {0,1} ikili değişkeni ekler: Uⱼ = 1 ise j işi gecikmeli, hedef Min Σ Uⱼ. Bu üç model çatışan hedefler üretir." },
                { h: "M4: AUGMECON (Artırılmış ε-Kısıt – Uzlaşmacı Model)", t: "5 adım: (1) M1,M2,M3'ü çöz → Ödeme tablosunu (payoff table) oluştur. (2) T ve L için aralık hesapla, grid noktaları belirle. (3) T≤T̄ ve L≤L̄ kısıtları altında Cmax'ı minimize et. (4) 126 kez çöz. (5) Baskılanmayan (non-dominated) Pareto çözümlerini seç. P1 problemi için 9 Pareto noktası elde edilmiştir." }
              ]} />
              {!problemData && <div style={{ padding: '1rem', background: 'rgba(255,193,7,0.1)', borderRadius: '8px', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--warning)' }}>⚠️ Devam etmek için önce Adım 02'de veri seti oluşturun.</div>}
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
              <button className="btn btn-warning mt-4" onClick={() => scrollToNext(4)}><Zap size={16} /> Sezgisel Analiz (DDR) Adımına Geç</button>
            </div>
          </div>
        )}

        {/* STEP 04: DDR */}
        {activeStage >= 3 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">04</div>
            <div className="flow-step-node">
              <h3><Zap size={20} /> 04. Dinamik Dağıtım Kuralları – DDR (Bölüm 4)</h3>
              <AcademicBlock items={[
                { h: "SCT – En Kısa İş Tamamlanma Zamanı", t: "min(Sᵢⱼₖ + Pⱼₖ) formülüyle, bir sonraki iş ve tezgah aynı anda seçilir. Seçilen iş en kısa işlem süresine sahip olmak zorunda değil; 'hazırlık + işlem' toplamı en kısa olan işi seçer." },
                { h: "SC-LPT & SC-EDD", t: "SC-LPT: Önce en uzun işlem süreli işi seçer (LPT mantığı), ardından bu iş için Sᵢⱼₖ + Pⱼₖ'yı minimize eden tezgahı bulur. SC-EDD: Önce teslim tarihi en yakın işi seçer (EDD mantığı), ardından aynı minimize işlemi yapılır." },
                { h: "Hibrit Kural ve Kural Değiştirme Zamanı (tₛ)", t: "6 kombine kural: [SCT & SC-LPT: tₛ], [SCT & SC-EDD: tₛ], [SC-EDD & SCT: tₛ] vb. tₛ = 200, 250, 300, 350, 400, 450 saat olarak denenir. Çizelgelenen son işin Cⱼ değeri tₛ'yi aşınca kural değişir. Toplam 39 kural (3 tekli + 6×6 kombine) test edilir." }
              ]} />

              <button className="btn btn-warning mt-4" onClick={runDDR} disabled={loading}>
                {loading ? <div className="loader"></div> : <><Zap size={16} /> 39 DDR Kuralını Çalıştır</>}
              </button>
              {ddrResults.length > 0 && (
                <div className="mt-4" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--warning)', paddingLeft: '0.75rem', lineHeight: '1.5' }}>
                    <strong style={{ color: 'var(--warning)' }}>[Tablo 12] DDR Performans Matrisi</strong> — Her satır bir kuralın ürettiği çözümü gösterir. Cmax (yayılma süresi), T (toplam gecikme) ve L (geciken iş sayısı) sütunları birbiriyle çatışan hedefleri temsil eder. Sarı vurgulanan ilk 3 kural Cmax açısından en iyilerdir.
                  </div>
                  <ScrollableTable maxHeight="300px">
                    <table className="data-table">
                      <thead><tr><th>Sıra</th><th>Kural</th><th>Cmax ↓</th><th>T (Gecikme) ↓</th><th>L (Geciken İş) ↓</th></tr></thead>
                      <tbody>{ddrResults.map((r, i) => <tr key={i} style={{ background: i < 3 ? 'rgba(210,153,34,0.05)' : 'transparent' }}><td style={{ fontWeight: 'bold', color: i === 0 ? 'var(--warning)' : 'inherit' }}>{i + 1}</td><td>{r.rule_name}</td><td>{r.Cmax.toFixed(2)}</td><td>{r.T.toFixed(2)}</td><td>{r.L}</td></tr>)}</tbody>
                    </table>
                  </ScrollableTable>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div className="output-header" style={{ marginBottom: '0.5rem' }}>Pareto Uzay Dağılımı (Cmax × T, Nokta Boyutu = L)</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '1rem' }}>Sarı noktalar Cmax açısından ilk 3 kuralı temsil eder. Hiçbir tek kural tüm kriterlerde baskın değildir — bu MCDM ihtiyacını doğrular.</div>
                    <div style={{ height: '340px' }}>
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{ top: 10, right: 30, bottom: 30, left: 20 }}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
                          <XAxis type="number" dataKey="Cmax" name="Cmax" stroke="#8b949e" label={{ value: 'Cmax (Yayılma Süresi)', position: 'insideBottom', offset: -10, fill: '#8b949e', fontSize: 11 }} />
                          <YAxis type="number" dataKey="T" name="T (Gecikme)" stroke="#8b949e" label={{ value: 'T (Gecikme)', angle: -90, position: 'insideLeft', fill: '#8b949e', fontSize: 11 }} />
                          <ZAxis type="number" dataKey="L" range={[20, 200]} name="L (Geciken İş)" />
                          <RechartsTooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ background: '#0d1117', border: '1px solid var(--border-color)', borderRadius: '8px' }} itemStyle={{ color: '#fff' }} formatter={(v, n) => [v, n]} />
                          <Scatter data={ddrResults}>{ddrResults.map((e, i) => <Cell key={i} fill={i < 3 ? 'var(--warning)' : '#30363d'} />)}</Scatter>
                        </ScatterChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <button className="btn btn-warning" onClick={() => scrollToNext(5)}><Target size={16} /> 05. TOPSIS Karar Analizi Adımına Geç</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 05: TOPSIS */}
        {activeStage >= 4 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">05</div>
            <div className="flow-step-node">
              <h3><Target size={20} /> 05. Çok Kriterli Karar Verme – TOPSIS (Bölüm 5.3)</h3>
              <AcademicBlock items={[
                { h: "TOPSIS – 5 Adımlı Süreç", t: "Adım 1: Karar matrisi oluştur (her kural × 3 kriter). Adım 2: rₐᵦ = min(xₐᵦ) / xₐᵦ ile normalize et. Adım 3: v⁺ₐ = max(rₐᵦ) ve v⁻ₐ = min(rₐᵦ) ile ideal çözümleri belirle. Adım 4: S⁺ₐ ve S⁻ₐ ayrılma ölçülerini hesapla. Adım 5: C*ₐ = S⁻ₐ / (S⁺ₐ + S⁻ₐ) ile yakınlık katsayısını bul; en yüksek C* değeri kazanır." },
                { h: "Ağırlıkların Anlamı", t: "wC: Üretim hızını (Cmax) ne kadar önemsiyor? wT: Toplam gecikmeyi (T) ne kadar önemsiyor? wL: Geciken iş sayısını (L) ne kadar önemsiyor? Ağırlıklar toplamı 1.0 olacak şekilde normalize edilir. Ağırlıkları değiştirerek farklı yönetim önceliklerini simüle edebilirsiniz." }
              ]} />

              <div className="mt-4" style={{ background: 'rgba(255,255,255,0.02)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '0.8rem', marginBottom: '1rem', borderLeft: '3px solid var(--warning)', paddingLeft: '0.75rem', lineHeight: '1.5', color: 'var(--text-secondary)' }}>
                  Ağırlıkları değiştirerek farklı yönetim önceliklerini simüle edin, ardından <strong style={{ color: 'var(--warning)' }}>"Analizi Güncelle"</strong> butonuna basın. Ağırlıklar otomatik olarak normalize edilir (Σw = 1.0).
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
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', borderLeft: '3px solid var(--warning)', paddingLeft: '0.75rem', lineHeight: '1.5' }}>
                    <strong style={{ color: 'var(--warning)' }}>TOPSIS Analiz Matrisi (Tablo 21)</strong> — r₁/r₂/r₃: normalize edilmiş Cmax/T/L değerleri (r = min/x, büyük = iyi). S⁺: pozitif idealden uzaklık, S⁻: negatif idealden uzaklık. CC* = S⁻/(S⁺+S⁻) en yüksek olan kural kazanır.
                  </div>
                  <ScrollableTable maxHeight="300px">
                    <table className="data-table small-table">
                      <thead><tr><th>Kural</th><th>r₁ (Cmax)</th><th>r₂ (T)</th><th>r₃ (L)</th><th>S⁺ (İdeal↑)</th><th>S⁻ (İdeal↓)</th><th>CC* ↑</th></tr></thead>
                      <tbody>{topsisResults.map((r, i) => <tr key={i} style={{ background: i === 0 ? 'rgba(210,153,34,0.08)' : 'transparent' }}><td style={{ fontWeight: i === 0 ? 'bold' : 'normal', color: i === 0 ? 'var(--warning)' : 'inherit' }}>{r.rule_name}{i === 0 ? ' ★' : ''}</td><td>{r.r[0]}</td><td>{r.r[1]}</td><td>{r.r[2]}</td><td>{r.S_pos}</td><td>{r.S_neg}</td><td style={{ fontWeight: 'bold', color: i === 0 ? '#4ade80' : 'inherit' }}>{r.C_star.toFixed(4)}</td></tr>)}</tbody>
                    </table>
                  </ScrollableTable>

                  <div style={{ textAlign: 'center', border: '2px solid var(--warning)', background: 'rgba(210,153,34,0.05)', borderRadius: '12px', padding: '1.5rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>TOPSIS SONUCU — EN YÜKSEK CC* SKORU</div>
                    <h4 style={{ color: 'var(--warning)', letterSpacing: '1px', margin: '0.5rem 0' }}>{topsisResults[0].rule_name}</h4>
                    <p style={{ fontSize: '1rem', marginTop: '0.25rem' }}>İdeale Yakınlık (CC*): <span style={{ fontWeight: 'bold', color: '#4ade80', fontSize: '1.3rem' }}>{topsisResults[0].C_star?.toFixed(6)}</span></p>
                    <p style={{ fontSize: '0.75rem', opacity: 0.6, marginTop: '0.5rem' }}>Bu kural, seçtiğiniz ağırlıklar altında Cmax, T ve L kriterlerini en dengeli karşılayan çizelgeleme stratejisidir.</p>
                  </div>

                  <div style={{ background: '#0d1117', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                    <div className="output-header" style={{ marginBottom: '0.5rem' }}><CheckCircle size={16} /> Önerilen Çizelge: {topsisResults[0].rule_name}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.7, marginBottom: '1rem' }}>TOPSIS'in seçtiği optimal kural ile oluşturulan operasyonel çizelge. Mor bloklar hazırlık (Sᵢⱼₖ), yeşil bloklar işlem (Pⱼₖ) sürelerini gösterir.</div>
                    <JobSequenceTable schedule={ddrResults.find(r => r.rule_name === topsisResults[0].rule_name)?.schedule} m={Number(inputMachines)} problemData={problemData} />
                    <GanttChart schedule={ddrResults.find(r => r.rule_name === topsisResults[0].rule_name)?.schedule} m={Number(inputMachines)} n={Number(inputJobs)} />
                  </div>
                  <button className="btn btn-warning" onClick={() => scrollToNext(5)}><Activity size={16} /> 06. Gap Analizi Adımına Geç</button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* STEP 06: Gap Analizi */}
        {activeStage >= 5 && cpsatResults.M1 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">06</div>
            <div className="flow-step-node">
              <h3><Activity size={20} /> 06. Hesaplamalı Çalışma – Gap Analizi (Bölüm 5.1.3)</h3>
              <AcademicBlock items={[
                { h: "Gap Analizi (Tablo 13)", t: "Sezgisel çözümlerin kalitesi, MILP optimal çözümüne olan yüzde uzaklık (%off Pareto) ile ölçülür. Örnek: [SC-EDD & SC-LPT: 60] kuralı Cmax için %41.35 daha kötü olabilirken T için %2.31 daha iyi olabilir. Bu, sezgisel çözümün Pareto çözümünden baskılanmadığını gösterir." },
                { h: "Büyük Ölçek Performansı (Bölüm 5.2)", t: "18 aylık gerçek üretim verisiyle (244-298 iş/ay) test sonuçları: Yüksek talep için en iyi kurallar SCT (Cmax), SC-EDD (T) ve [SCT & SC-EDD: 450] (L). Düşük talep için [SC-EDD & SCT: 200] hem T hem L'de baskındır." }
              ]} />

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
              <button className="btn btn-warning mt-4" onClick={() => scrollToNext(6)}><BookOpen size={16} /> 07. Final Değerlendirmesi ve Sonuç</button>
            </div>
          </div>
        )}

        {/* STEP 07: Sonuç */}
        {activeStage >= 6 && (
          <div className="flow-step active slide-in">
            <div className="flow-step-number">07</div>
            <div className="flow-step-node">
              <h3><BookOpen size={20} /> 07. Sonuç ve Akademik Değerlendirme (Bölüm 6)</h3>
              <AcademicBlock items={[
                { h: "Çalışmanın 3 Temel Katkısı", t: "(1) Tezgah ve sıra-bağımlı hazırlık süreli UPMSP için Cmax, T ve L'yi birleştiren ilk çok amaçlı MILP modeli. (2) SCT, SC-LPT, SC-EDD ve 6 kombine kural içeren DDR sezgiselleri – kural değiştirme mekanizması literatürde yeni. (3) Her kuralın ne zaman baskın olduğunu belirleyen kapsamlı TOPSIS tabanlı MCDM analizi." },
                { h: "Gelecek Araştırma Yönleri", t: "(1) Yeni dağıtım kuralları geliştirme. (2) Problemi çok operasyonlu sıralı sistemlere (job shop / flow shop) genişletme. (3) DDR kurallarını büyük örnekler için Pareto çözümleri üreten meta-sezgisellerin (GA, SA) başlangıç çözümü olarak kullanma." }
              ]} />

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
