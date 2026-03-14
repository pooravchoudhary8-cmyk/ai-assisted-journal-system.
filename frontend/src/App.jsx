import React, { useState, useEffect } from 'react';
import JournalForm from './components/JournalForm';
import JournalList from './components/JournalList';
import Insights from './components/Insights';
import { fetchEntries } from './api/api';
import { Brain, Wind } from 'lucide-react';

const USER_ID = 'user_123';

function App() {
  const [entries, setEntries] = useState([]);
  const [refreshSignal, setRefreshSignal] = useState(0);

  const getEntries = async () => {
    try {
      const { data } = await fetchEntries(USER_ID);
      setEntries(data);
    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  useEffect(() => {
    getEntries();
  }, [refreshSignal]);

  const handleEntryCreated = () => {
    setRefreshSignal(prev => prev + 1);
  };

  return (
    <div className="container">
      <header>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
          <div style={{ padding: '0.4rem', background: 'white', borderRadius: '1rem', display: 'flex', alignItems: 'center' }}>
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L4.5 9C4.5 9 3 11 3 14C3 18.97 7.03 23 12 23C16.97 23 21 18.97 21 14C21 11 19.5 9 19.5 9L12 2Z" fill="#10B981"/>
              <path d="M12 23C15.5 23 18.5 21 19.5 18C16.5 20 12 19 9 16C6 13 5 8.5 7 5.5C4.5 7.5 3 10.5 3 14C3 18.97 7.03 23 12 23Z" fill="#3B82F6"/>
            </svg>
          </div>
          <h1>NatureJournal</h1>
        </div>
        <p className="subtitle">Reflection and emotional insights for your nature sessions.</p>
      </header>

      <main className="app-grid">
        <section className="left-column">
          <JournalForm userId={USER_ID} onEntryCreated={handleEntryCreated} />
          <Insights userId={USER_ID} refreshSignal={refreshSignal} />
        </section>

        <section className="right-column">
          <JournalList entries={entries} />
        </section>
      </main>

      <footer style={{ marginTop: '5rem', textAlign: 'center', padding: '2rem', color: '#64748b', fontSize: '0.9rem' }}>
        <p>© 2026 NatureJournal System</p>
      </footer>
    </div>
  );
}

export default App;
