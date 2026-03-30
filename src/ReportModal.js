import React from 'react';
import ReactMarkdown from 'react-markdown';

function ReportModal({ report, loading, onClose }) {
  const handleCopy = () => {
    navigator.clipboard.writeText(report);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>📄 Post-Incident Review</h2>
          <div className="modal-actions">
            {report && (
              <button className="btn-secondary" onClick={handleCopy}>
                Copy Report
              </button>
            )}
            <button className="btn-secondary" onClick={onClose}>
              ✕ Close
            </button>
          </div>
        </div>
        <div className="modal-body">
          {loading && (
            <div className="empty-state">
              ✍️ Generating Post-Incident Review...
            </div>
          )}
          {report && (
            <div className="report-content">
              <ReactMarkdown>{report}</ReactMarkdown>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ReportModal;