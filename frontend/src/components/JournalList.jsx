import React from 'react';
import { Calendar, Trash2 } from 'lucide-react';

const JournalList = ({ entries }) => {
  if (entries.length === 0) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '4rem' }}>
        <p className="subtitle">Your journal is empty. Start your first session!</p>
      </div>
    );
  }

  const getAmbienceStyle = (ambience) => {
    switch (ambience) {
      case 'forest': return { borderLeft: '4px solid #064e3b' };
      case 'ocean': return { borderLeft: '4px solid #0c4a6e' };
      case 'mountain': return { borderLeft: '4px solid #4c1d95' };
      default: return {};
    }
  };

  return (
    <div className="journal-list">
      <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Previous Sessions</h2>
      {entries.map((entry) => (
        <div 
          key={entry._id} 
          className="journal-card animate-fade-in" 
          style={getAmbienceStyle(entry.ambience)}
        >
          <header>
            <div>
              <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', marginRight: '0.5rem' }}>
                {entry.ambience}
              </span>
              <span className="badge" style={{ background: 'var(--primary-glow)', color: 'white' }}>
                {entry.emotion || 'Processing...'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', color: '#94a3b8', fontSize: '0.85rem' }}>
              <Calendar size={14} style={{ marginRight: '0.4rem' }} />
              {new Date(entry.createdAt).toLocaleDateString()}
            </div>
          </header>
          
          <p style={{ color: '#e2e8f0', marginBottom: '1rem' }}>{entry.text}</p>
          
          {entry.summary && (
            <div style={{ fontSize: '0.9rem', color: '#94a3b8', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '0.75rem' }}>
              <strong>Summary:</strong> {entry.summary}
            </div>
          )}

          <div style={{ marginTop: '0.75rem' }}>
            {entry.keywords?.map((kw, i) => (
              <span key={i} className="keyword-tag" style={{ background: 'rgba(255,255,255,0.05)' }}>{kw}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JournalList;
