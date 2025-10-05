function SimpleTest() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#10b981',
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      fontWeight: 'bold'
    }}>
      <h1>🛰️ React Test Working! 🟩</h1>
      <p>If you can see this, React is loading correctly</p>
      <div style={{ marginTop: '20px', fontSize: '1rem' }}>
        <p>✅ Vite dev server running</p>
        <p>✅ React rendering</p>
        <p>✅ CSS styles applied</p>
      </div>
    </div>
  );
}

export default SimpleTest;