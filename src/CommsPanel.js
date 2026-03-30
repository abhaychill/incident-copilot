import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { generateComms } from './api';

function CommsPanel({ incident, apiKey }) {
  const [comms, setComms] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  useEffect(() => {
    if (!incident) return;
    setComms('');
    setLoading(true);
    generateComms(incident, apiKey)
      .then(text => setComms(text))
      .catch(err => setComms(`Error: ${err.message}`))
      .finally(() => setLoading(false));
  }, [incident]);

  const copySection = (label, text) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-icon">📢</span>
        <h2>Communications Generator</h2>
      </div>
      <div className="panel-body">
        {!incident && (
          <div className="empty-state">
            Log an incident above to generate<br />stakeholder communications
          </div>
        )}
        {loading && (
          <div className="empty-state">✍️ Drafting communications...</div>
        )}
        {comms && (
          <div className="comms-output">
            <ReactMarkdown
              components={{
                h2: ({ children }) => (
                  <div className="comms-section">
                    <div className="comms-section-header">
                      <h3>{children}</h3>
                      <button
                        className="btn-copy"
                        onClick={() => copySection(children, children)}
                      >
                        {copied === children ? '✅ Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                ),
                p: ({ children }) => (
                  <p className="comms-text">{children}</p>
                )
              }}
            >
              {comms}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}

export default CommsPanel;