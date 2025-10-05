import React from 'react';

// This is a placeholder App.jsx file 
// The actual app uses BeautifulApp.jsx (imported in main.jsx)
// This file exists to prevent import errors

const App = () => {
  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      fontFamily: 'system-ui',
      background: 'linear-gradient(135deg, #10b981, #34d399)'
    }}>
      <div style={{ textAlign: 'center', color: 'white', padding: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>⛏️ NASA Weather Mining Station 🟩</h1>
        <p>This is a placeholder. The main app is in BeautifulApp.jsx</p>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          Check main.jsx - it imports BeautifulApp.jsx as the main component
        </p>
      </div>
    </div>
  );
};

export default App;