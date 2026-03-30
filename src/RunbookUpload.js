import React, { useState } from 'react';

function RunbookUpload({ onRunbookLoaded, runbookLoaded, runbookName }) {
  const [mode, setMode] = useState(null);
  const [text, setText] = useState('');

  const handleLoad = () => {
    if (!text.trim()) return;
    onRunbookLoaded(text, 'Runbook');
    setMode(null);
  };

  if (runbookLoaded) {
    return (
      <div className="runbook-upload">
        <span className="upload-label loaded">✅ Runbook Loaded</span>
      </div>
    );
  }

  if (mode === 'paste') {
    return (
      <div className="runbook-paste-box">
        <textarea
          placeholder="Paste your runbook text here..."
          value={text}
          onChange={e => setText(e.target.value)}
          className="runbook-textarea"
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <button className="btn-primary" onClick={handleLoad}>
            ✅ Load Runbook
          </button>
          <button className="btn-secondary" onClick={() => setMode(null)}>
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="runbook-upload">
      <button className="upload-label" onClick={() => setMode('paste')}>
        📎 Add Runbook Context (optional)
      </button>
    </div>
  );
}

export default RunbookUpload;