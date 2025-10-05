import { useState } from 'react';

function App() {
  const [location, setLocation] = useState('');
  const [activity, setActivity] = useState('');
  const [date, setDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);

  const handleAnalyze = async () => {
    if (!location || !date) {
      alert('Please enter location and date');
      return;
    }

    setLoading(true);
    
    // Mock analysis
    setTimeout(() => {
      setResults({
        location: { name: location },
        date: date,
        activity: activity,
        forecast: 'Sunny with 20% chance of rain'
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f8ff', padding: '20px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        
        {/* Hero Section */}
        <div style={{ 
          background: 'linear-gradient(to right, #2563eb, #9333ea)', 
          color: 'white', 
          padding: '40px 20px', 
          borderRadius: '12px',
          textAlign: 'center',
          marginBottom: '20px'
        }}>
          <h1 style={{ fontSize: '3rem', fontWeight: 'bold', margin: '0 0 16px 0' }}>
            🌦️ Will It Rain on My Parade?
          </h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, margin: 0 }}>
            NASA-powered weather analysis for your outdoor adventures
          </p>
        </div>

        {/* Input Section */}
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '12px', 
          boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
          padding: '32px',
          marginBottom: '20px'
        }}>
          <h2 style={{ 
            fontSize: '2rem', 
            fontWeight: 'bold', 
            color: '#1f2937',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            Weather Risk Analysis
          </h2>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
            gap: '20px',
            marginBottom: '24px'
          }}>
            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                📍 Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Enter location..."
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                🎯 Activity
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              >
                <option value="">Select activity...</option>
                <option value="wedding">Wedding</option>
                <option value="hiking">Hiking</option>
                <option value="farming">Farming</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                📅 Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '16px'
                }}
              />
            </div>
          </div>

          <button
            onClick={handleAnalyze}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: loading ? '#9ca3af' : '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: loading ? 'not-allowed' : 'pointer',
              background: loading ? '#9ca3af' : 'linear-gradient(to right, #2563eb, #9333ea)'
            }}
          >
            {loading ? '🛰️ Analyzing NASA Data...' : '🔍 Analyze Weather Risk'}
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
            padding: '32px',
            textAlign: 'center',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '16px' }}>🛰️</div>
            <p style={{ color: '#6b7280', fontSize: '18px' }}>Analyzing NASA satellite data...</p>
            <div style={{ 
              width: '100%', 
              height: '8px', 
              backgroundColor: '#e5e7eb', 
              borderRadius: '4px',
              marginTop: '16px',
              overflow: 'hidden'
            }}>
              <div style={{ 
                width: '60%', 
                height: '100%', 
                background: 'linear-gradient(to right, #2563eb, #9333ea)',
                animation: 'pulse 2s infinite'
              }}></div>
            </div>
          </div>
        )}

        {/* Results */}
        {results && !loading && (
          <div style={{ 
            backgroundColor: 'white', 
            borderRadius: '12px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', 
            padding: '32px',
            marginBottom: '20px'
          }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '16px', color: '#059669' }}>
              ✅ Analysis Complete!
            </h3>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              Weather analysis results for your outdoor event
            </p>
            <div style={{ 
              padding: '16px', 
              backgroundColor: '#f0fdf4', 
              borderRadius: '8px',
              border: '2px solid #10b981'
            }}>
              <p style={{ color: '#065f46', marginBottom: '8px' }}>
                <strong>📍 Location:</strong> {results.location?.name}
              </p>
              <p style={{ color: '#065f46', marginBottom: '8px' }}>
                <strong>📅 Date:</strong> {results.date}
              </p>
              <p style={{ color: '#065f46', marginBottom: '8px' }}>
                <strong>🎯 Activity:</strong> {results.activity || 'General outdoor event'}
              </p>
              <p style={{ color: '#065f46' }}>
                <strong>🌤️ Forecast:</strong> {results.forecast}
              </p>
            </div>
          </div>
        )}

        {/* Footer */}
        <div style={{ 
          backgroundColor: '#1f2937', 
          color: 'white', 
          padding: '32px 20px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <span style={{ fontWeight: 'bold' }}>
              🛰️ Parade's Guardian - Powered by NASA Earth Observation Data
            </span>
          </div>
          <p style={{ color: '#d1d5db', fontSize: '14px', marginBottom: '8px' }}>
            NASA Space Apps Challenge 2025 • American Corner Kazakhstan
          </p>
          <p style={{ color: '#9ca3af', fontSize: '12px' }}>
            Data sources: NASA POWER API, Giovanni Platform, Worldview
          </p>
        </div>

      </div>
    </div>
  );
}

export default App;