import React, { useEffect, useState } from 'react';
import { fetchInsights } from '../api/api';
import { BarChart, Heart, Sparkles, Map } from 'lucide-react';

const Insights = ({ userId, refreshSignal }) => {
  const [insights, setInsights] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getInsights = async () => {
      try {
        const { data } = await fetchInsights(userId);
        setInsights(data);
      } catch (error) {
        console.error('Error fetching insights:', error);
      } finally {
        setLoading(false);
      }
    };
    getInsights();
  }, [userId, refreshSignal]);

  if (loading) return <div>Loading insights...</div>;
  if (!insights) return null;

  return (
    <div className="glass-card animate-fade-in" style={{ marginTop: '2rem' }}>
      <header style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>Your Progress</h2>
        <p className="subtitle">Trends and session statistics</p>
      </header>

      <div className="stats-grid">
        <div className="stat-card">
          <BarChart className="stat-icon" size={20} color="#6366f1" />
          <span className="stat-value">{insights.totalEntries}</span>
          <span className="stat-label">Total Entries</span>
        </div>
        <div className="stat-card">
          <Heart className="stat-icon" size={20} color="#ef4444" />
          <span className="stat-value" style={{ textTransform: 'capitalize' }}>{insights.topEmotion}</span>
          <span className="stat-label">Top Emotion</span>
        </div>
        <div className="stat-card">
          <Map className="stat-icon" size={20} color="#10b981" />
          <span className="stat-value" style={{ textTransform: 'capitalize' }}>{insights.mostUsedAmbience}</span>
          <span className="stat-label">Common Ambience</span>
        </div>
        <div className="stat-card">
          <Sparkles className="stat-icon" size={20} color="#f59e0b" />
          <span className="stat-value">{insights.recentKeywords.length}</span>
          <span className="stat-label">Key Themes</span>
        </div>
      </div>

      <div style={{ marginTop: '1.5rem' }}>
        <h3 style={{ fontSize: '1rem', marginBottom: '0.75rem', color: '#94a3b8' }}>Recent Themes</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {insights.recentKeywords.map((keyword, i) => (
            <span key={i} className="keyword-tag">{keyword}</span>
          ))}
          {insights.recentKeywords.length === 0 && <p className="subtitle">No themes analyzed yet.</p>}
        </div>
      </div>
    </div>
  );
};

export default Insights;
