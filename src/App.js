import React, { useState } from 'react';
import RunbookPanel from './RunbookPanel';
import CommsPanel from './CommsPanel';
import RunbookUpload from './RunbookUpload';
import ReportModal from './ReportModal';
import { generateReport } from './api';

function App() {
  const [incident, setIncident] = useState(null);
  const [runbookText, setRunbookText] = useState('');
  const [runbookName, setRunbookName] = useState('');
  const [chatHistory, setChatHistory] = useState([]);
  const [showReport, setShowReport] = useState(false);
  const [report, setReport] = useState('');
  const [reportLoading, setReportLoading] = useState(false);
  const [resolved, setResolved] = useState(false);
  const [form, setForm] = useState({
    title: '',
    severity: 'SEV1',
    system: '',
    description: ''
  });

  const handleRunbookLoaded = (text, name) => {
    setRunbookText(text);
    setRunbookName(name);
  };

  const handleSubmit = () => {
    if (!form.title || !form.description) return;
    setIncident({ ...form, startTime: new Date().toLocaleTimeString() });
    setResolved(false);
    setReport('');
    setChatHistory([]);
  };

  const handleResolve = async () => {
    setResolved(true);
    setShowReport(true);
    setReportLoading(true);
    try {
      const text = await generateReport(incident, chatHistory);
      setReport(text);
    } catch (err) {
      setReport(`Error generating report: ${err.message}`);
    } finally {
      setReportLoading(false);
    }
  };

  return (
    <div className={incident && !resolved ? `app-${incident.severity.toLowerCase()}` : ''}>
      <header className="app-header">
        <h1>⚡ Incident Copilot</h1>
        <span className="badge">AI-POWERED</span>
        {runbookName && (
          <span className="badge badge-green">📎 {runbookName}</span>
        )}
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
                placeholder="Describe what is happening..."
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
              />
            </div>
          </div>
          <div className="form-bottom-row">
            <button className="btn-primary" onClick={handleSubmit}>
              🚨 Activate Incident Response
            </button>
            <RunbookUpload
              onRunbookLoaded={handleRunbookLoaded}
              runbookLoaded={!!runbookText}
              runbookName={runbookName}
            />
          </div>
        </div>

        {incident && (
          <div className="status-bar">
            <div className={`status-dot ${resolved ? 'resolved' : ''}`} />
            <span><strong>{resolved ? 'RESOLVED:' : 'ACTIVE INCIDENT:'}</strong> {incident.title}</span>
            <span>|</span>
            <span className={`severity-${incident.severity.toLowerCase()}`}>{incident.severity}</span>
            <span>|</span>
            <span>System: {incident.system || 'Unspecified'}</span>
            <span>|</span>
            <span>Started: {incident.startTime}</span>
            {runbookText && <><span>|</span><span>📎 RAG Active</span></>}
            <div style={{ marginLeft: 'auto', display: 'flex', gap: '8px' }}>
              {!resolved && (
                <button className="btn-resolve" onClick={handleResolve}>
                  ✅ Resolve & Generate PIR
                </button>
              )}
              {resolved && report && (
                <button className="btn-secondary btn-small" onClick={() => setShowReport(true)}>
                  📄 View PIR
                </button>
              )}
            </div>
          </div>
        )}

        <div className={`panels ${incident && !resolved ? `panels-${incident.severity.toLowerCase()} ${incident.severity === 'SEV1' ? 'sev1-glow' : incident.severity === 'SEV2' ? 'sev2-glow' : ''}` : ''}`}>
          <RunbookPanel
            incident={incident}
            runbookText={runbookText}
            onChatUpdate={setChatHistory}
          />
          <CommsPanel incident={incident} />
        </div>
      </main>

      {showReport && (
        <ReportModal
          report={report}
          loading={reportLoading}
          onClose={() => setShowReport(false)}
        />
      )}
    </div>
  );
}

export default App;