import React, { useState } from 'react';

function RunbookUpload({ onRunbookLoaded, runbookLoaded, runbookName }) {
  const [mode, setMode] = useState(null); // 'paste' or null
  const [text, setText] = useState('');

  const handlePaste = () => {
    if (!text.trim()) return;
    onRunbookLoaded(text, 'Pasted Runbook');
    setMode(null);
  };

  if (runbookLoaded) {
    return (
      <div className="runbook-upload">
        <span className="upload-label loaded">✅ {runbookName}</span>
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
          <button className="btn-primary" onClick={handlePaste}>
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