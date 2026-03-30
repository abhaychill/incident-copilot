import React, { useState } from 'react';
import RunbookPanel from './RunbookPanel';
import CommsPanel from './CommsPanel';

function App() {
  const [incident, setIncident] = useState(null);
  const [form, setForm] = useState({
    title: '',
    severity: 'SEV1',
    system: '',
    description: ''
  });

  const handleSubmit = () => {
    if (!form.title || !form.description) return;
    setIncident({ ...form, startTime: new Date().toLocaleTimeString() });
  };

  return (
    <div>
      <header className="app-header">
        <h1>⚡ Incident Copilot</h1>
        <span className="badge">AI-POWERED</span>
      </header>

      <main className="app-body">
        <div className="intake-card">
          <h2>Log Incident</h2>
          <div className="form-row">
            <div className="form-group">
              <label>Incident Title</label>
              <input
                type="text"
                placeholder="e.g. Core banking system unresponsive"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ maxWidth: '160px' }}>
              <label>Severity</label>
              <select
                value={form.severity}
                onChange={e => setForm({ ...form, severity: e.target.value })}
              >
                <option>SEV1</option>
                <option>SEV2</option>
                <option>SEV3</option>
              </select>
            </div>
            <div className="form-group">
              <label>Affected System</label>
              <input
                type="text"
                placeholder="e.g. Payment Processing, Core Banking"
                value={form.system}
                onChange={e => setForm({ ...form, system: e.target.value })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Description</label>
              <textarea
                placeholder="Describe what is happening, what you've observed, and any initial findings..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <button className="btn-primary" onClick={handleSubmit}>
            🚨 Activate Incident Response
          </button>
        </div>

        {incident && (
          <div className="status-bar">
            <div className="status-dot" />
            <span><strong>ACTIVE INCIDENT:</strong> {incident.title}</span>
            <span>|</span>
            <span className={`severity-${incident.severity.toLowerCase()}`}>{incident.severity}</span>
            <span>|</span>
            <span>System: {incident.system || 'Unspecified'}</span>
            <span>|</span>
            <span>Started: {incident.startTime}</span>
          </div>
        )}

        <div className="panels">
          <RunbookPanel incident={incident} />
          <CommsPanel incident={incident} />
        </div>
      </main>
    </div>
  );
}

export default App;