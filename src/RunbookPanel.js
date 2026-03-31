import React, { useState, useEffect, useRef, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import { chatWithRunbook } from './api';

function RunbookPanel({ incident, runbookText, onChatUpdate }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const updateMessages = useCallback((newMessages) => {
    setMessages(newMessages);
    if (onChatUpdate) onChatUpdate(newMessages);
  }, [onChatUpdate]);

  useEffect(() => {
    if (!incident) return;
    updateMessages([]);
    setLoading(true);
    const initial = [{ role: 'user', content: 'The incident has just been logged. What are the first steps I should take right now?' }];
    chatWithRunbook(incident, initial, runbookText)
      .then(text => {
        updateMessages([
          { role: 'user', content: 'The incident has just been logged. What are the first steps I should take right now?' },
          { role: 'assistant', content: text }
        ]);
      })
      .catch(err => updateMessages([{ role: 'assistant', content: `Error: ${err.message}` }]))
      .finally(() => setLoading(false));
  }, [incident, apiKey, runbookText, updateMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMsg = { role: 'user', content: input };
    const updated = [...messages, userMsg];
    updateMessages(updated);
    setInput('');
    setLoading(true);
    try {
      const reply = await chatWithRunbook(incident, updated, runbookText);
      updateMessages([...updated, { role: 'assistant', content: reply }]);
    } catch (err) {
      updateMessages([...updated, { role: 'assistant', content: `Error: ${err.message}` }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="panel">
      <div className="panel-header">
        <span className="panel-icon">📋</span>
        <h2>Runbook Assistant</h2>
        {runbookText && <span className="badge badge-green" style={{ fontSize: '10px' }}>RAG ON</span>}
      </div>
      <div className="panel-body">
        {!incident && (
          <div className="empty-state">
            Log an incident above to activate<br />the runbook assistant
          </div>
        )}
        {incident && (
          <>
            <div className="chat-messages">
              {messages.map((msg, i) => (
                <div key={i} className={`chat-bubble ${msg.role}`}>
                  <ReactMarkdown>{msg.content}</ReactMarkdown>
                </div>
              ))}
              {loading && (
                <div className="chat-bubble assistant">
                  <span className="typing">Analyzing...</span>
                </div>
              )}
              <div ref={bottomRef} />
            </div>
            <div className="chat-input-row">
              <input
                type="text"
                placeholder="Ask a follow-up question..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendMessage()}
                className="chat-input"
              />
              <button className="btn-primary" onClick={sendMessage} disabled={loading}>
                Send
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default RunbookPanel;
