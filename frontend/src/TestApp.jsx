function TestApp() {
  return (
    <div style={{ 
      padding: '20px', 
      backgroundColor: 'lightblue', 
      minHeight: '100vh',
      fontSize: '24px'
    }}>
      <h1>🌦️ Test App - React is Working!</h1>
      <p>If you can see this, React is rendering correctly.</p>
      <button 
        onClick={() => alert('Button works!')}
        style={{ 
          padding: '10px 20px', 
          fontSize: '18px',
          backgroundColor: 'blue',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer'
        }}
      >
        Click me!
      </button>
    </div>
  );
}

export default TestApp;