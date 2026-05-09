export default function Home() {
  return (
    <div className="shell">
      <aside className="sidebar">
        <div>
          <div className="logo-title">Tanzai AI</div>
          <p className="muted">Powered by Syleri Engine</p>
        </div>

        <button className="new-chat">+ New Chat</button>

        <div className="chat-list">
          <div className="chat-item">Startup ideas</div>
          <div className="chat-item">AI research mode</div>
          <div className="chat-item">Build SaaS product</div>
          <div className="chat-item">Global marketing plan</div>
        </div>

        <div className="brand-card">
          <div>Company: Syleri</div>
          <div>Engine: Syleri Engine</div>
          <div>Product: Tanzai AI</div>
          <div>Platform: Syleri API</div>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="row">
            <div className="pill">⚡ Syleri Engine Active</div>
            <div className="pill">🧠 Think Mode</div>
          </div>

          <div className="row">
            <button className="action-btn">Settings</button>
            <div className="avatar">S</div>
          </div>
        </header>

        <section className="chat-area">
          <div className="ai-card">
            <div className="ai-head">
              <div className="ai-logo">T</div>
              <div>
                <strong>Tanzai AI</strong>
                <div className="muted">Powered by Syleri Engine</div>
              </div>
            </div>

            <div className="ai-text">
              Welcome to Tanzai AI Ultra UI 🚀
              <br />
              This design gives your product a global AI workspace feel with premium dark UI, glassmorphism, Syleri branding, and modern chat layout.
            </div>

            <div className="actions">
              <button className="action-btn">Copy</button>
              <button className="action-btn">Regenerate</button>
            </div>
          </div>

          <div className="user-card">
            Design a global AI platform UI with premium feel.
          </div>

          <div className="thinking">
            Tanzai AI is thinking...
          </div>
        </section>

        <div className="composer-wrap">
          <div className="composer">
            <button className="icon-btn">+</button>
            <input placeholder="Message Tanzai AI..." />
            <button className="send">Send</button>
          </div>
        </div>
      </main>
    </div>
  );
}
