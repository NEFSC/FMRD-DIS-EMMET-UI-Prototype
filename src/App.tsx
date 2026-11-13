function App() {
  return (
    <main className="page">
      <header className="topbar">
        <a className="brand" href="/" aria-label="EMMET home">
          <span className="brand-mark" aria-hidden="true">
            E
          </span>
          <span>EMMET</span>
        </a>
        <span className="prototype-label">UI PROTOTYPE</span>
      </header>

      <section className="welcome" aria-labelledby="welcome-title">
        <p className="eyebrow">A workspace for what comes next</p>
        <h1 id="welcome-title">Your prototype starts here.</h1>
        <p className="welcome-copy">
          This is a starting point for the EMMET interface. Build out the
          experience one component at a time.
        </p>
        <div className="welcome-note">
          <span className="note-indicator" aria-hidden="true" />
          <p>Ready to shape your next idea?</p>
        </div>
      </section>

      <footer className="footer">
        <span>EMMET UI Prototype</span>
        <span>Built for exploration</span>
      </footer>
    </main>
  );
}

export default App;
