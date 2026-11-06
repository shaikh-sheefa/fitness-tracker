function toggleTheme() {
  const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try {
    localStorage.setItem('startline-theme', next);
  } catch {
    // Private browsing can block storage; the theme still applies for this visit.
  }
}

export default function Header({ status, onAdd }) {
  return (
    <header className="top">
      <div className="wrap">
        <div className="brand">
          <svg viewBox="0 0 30 22" aria-hidden="true">
            <path d="M3 21 11 1h6L9 21zM14 21 22 1h6l-8 20z" fill="currentColor" />
          </svg>
          Startline
        </div>
        <div className="spacer" />
        <div className={`status ${status.kind}`} id="status" role="status">
          <i />
          <span>{status.text}</span>
        </div>
        <button className="btn icon" id="theme" aria-label="Switch colour theme" title="Switch colour theme" onClick={toggleTheme}>
          <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="currentColor" d="M12 2a10 10 0 1 0 0 20V2z" />
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>
        <button className="btn primary" id="add" onClick={onAdd}>+ Add athlete</button>
      </div>
    </header>
  );
}
