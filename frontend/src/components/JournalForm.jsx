import React, { useState } from 'react';
import { analyzeText, createEntry } from '../api/api';
import { Send, BrainCircuit, Loader2, RefreshCw } from 'lucide-react';

const JournalForm = ({ userId, onEntryCreated }) => {
  const [text, setText] = useState('');
  const [ambience, setAmbience] = useState('forest');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const handleReset = () => {
    setText('');
    setAnalysis(null);
  };

  const handleAmbienceChange = (newAmbience) => {
    if (newAmbience !== ambience) {
      setAmbience(newAmbience);
      handleReset();
    }
  };

  const handleAnalyze = async () => {
    if (!text.trim()) return;
    setIsAnalyzing(true);
    try {
      const { data } = await analyzeText(text);
      setAnalysis(data);
    } catch (error) {
      alert('Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    setIsSubmitting(true);
    try {
      const entryData = {
        userId,
        ambience,
        text,
        emotion: analysis?.emotion || 'Unknown',
        keywords: analysis?.keywords || [],
        summary: analysis?.summary || 'No summary available'
      };
      await createEntry(entryData);
      setText('');
      setAnalysis(null);
      onEntryCreated();
    } catch (error) {
      alert('Failed to save journal entry.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="glass-card animate-fade-in">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>New Journal Entry</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Select Your Ambience</label>
          <div className="ambience-selector">
            {['forest', 'ocean', 'mountain'].map((a) => (
              <button
                key={a}
                type="button"
                className={`ambience-btn ${a} ${ambience === a ? 'selected' : ''}`}
                onClick={() => handleAmbienceChange(a)}
              >
                {a.charAt(0).toUpperCase() + a.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="form-group">
          <label>How was your session?</label>
          <textarea
            placeholder="I felt calm today after listening to the rain..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
        </div>

        {analysis && (
          <div className="animate-fade-in" style={{ 
            background: 'rgba(99, 102, 241, 0.1)', 
            padding: '1rem', 
            borderRadius: '0.75rem', 
            marginBottom: '1.5rem',
            borderLeft: '4px solid var(--primary)'
          }}>
            <p style={{ fontWeight: '600', marginBottom: '0.25rem' }}>Insights:</p>
            <p style={{ fontStyle: 'italic', color: '#cbd5e1' }}>"{analysis.summary}"</p>
            <div style={{ marginTop: '0.5rem' }}>
              <span className="badge" style={{ background: 'var(--primary)', marginRight: '0.5rem' }}>{analysis.emotion}</span>
              {analysis.keywords.map((kw, i) => (
                <span key={i} className="keyword-tag">{kw}</span>
              ))}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleAnalyze}
            disabled={isAnalyzing || !text.trim()}
            style={{ flex: 1 }}
          >
            {isAnalyzing ? <Loader2 className="spinning" size={18} /> : <BrainCircuit size={18} />}
            {analysis ? 'Re-Analyze' : 'Analyze Text'}
          </button>
          
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || !text.trim()}
            style={{ flex: 1 }}
          >
            {isSubmitting ? <Loader2 className="spinning" size={18} /> : <Send size={18} />}
            Save Entry
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleReset}
            style={{ flex: 0.5, padding: '1rem' }}
            title="Refresh Form"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </form>

      <style>{`
        .spinning {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default JournalForm;
