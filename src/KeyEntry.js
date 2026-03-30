import React, { useState } from 'react';

function KeyEntry({ onKeySubmit }) {
  const [key, setKey] = useState('');

  const handleSubmit = () => {
    if (!key.startsWith('sk-ant-')) {
      alert('That doesn\'t look like a valid Anthropic API key. It should start with sk-ant-');
      return;
    }
    onKeySubmit(key);
  };

  return (
    <div className="key-entry-screen">
      <div className="key-entry-card">
        <div className="key-entry-logo">⚡</div>
        <h1>Incident Copilot</h1>
        <p className="key-entry-subtitle">
          AI-powered incident response for financial services teams
        </p>

        <div className="key-entry-features">
          <div className="feature-item">📋 Real-time runbook guidance</div>
          <div className="feature-item">📢 Multi-audience communications</div>
          <div className="feature-item">🔍 RAG-powered document search</div>
        </div>

        <div className="key-entry-form">
          <label>Enter your Anthropic API Key to get started</label>
          <input
            type="password"
            placeholder="sk-ant-..."
            value={key}
            onChange={e => setKey(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          />
          <p className="key-entry-hint">
            Don't have a key?{' '}
            <a href="https://console.anthropic.com" target="_blank" rel="noreferrer">
              Get one free at console.anthropic.com
            </a>
          </p>
          <button className="btn-primary btn-full" onClick={handleSubmit}>
            Launch Incident Copilot →
          </button>
        </div>

        <p className="key-entry-privacy">
          🔒 Your API key is never stored or transmitted anywhere except directly to Anthropic.
          It lives only in your browser session and disappears when you close the tab.
        </p>
      </div>
    </div>
  );
}

export default KeyEntry;