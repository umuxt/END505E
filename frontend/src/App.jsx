import React from 'react';
import GuidedFlow from './components/GuidedFlow';
import './index.css';

function App() {
  return (
    <div className="dashboard-container">
      <header className="header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>UPMSP Karar Destek Sistemi</h1>
          <div className="badge mt-2" style={{ display: 'inline-flex', gap: '8px', alignItems: 'center', marginTop: '10px' }}>
            <div style={{ width: '8px', height: '8px', background: '#2ea043', borderRadius: '50%' }}></div>
            Sistem Çevrimiçi | Akademik Mod
          </div>
        </div>
      </header>

      {/* Ana Uygulama: Hesaplamalı Rapor (Computational Notebook) */}
      <GuidedFlow />

    </div>
  );
}

export default App;
