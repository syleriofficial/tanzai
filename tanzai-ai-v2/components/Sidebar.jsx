export default function Sidebar({ onNewChat }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="logo">T</div>
        <div>
          <h1>Tanzai AI</h1>
          <p>Built by Syleri</p>
        </div>
      </div>

      <button className="new" onClick={onNewChat}>+ New Chat</button>

      <div className="label">Recent</div>
      <div className="item">What is Syleri Engine?</div>
      <div className="item">Build a business plan</div>
      <div className="item">Explain APIs simply</div>

      <div className="label">Platform</div>
      <div className="item">Tanzai AI for users</div>
      <div className="item">Syleri API for developers</div>
      <div className="item">Enterprise AI Engine</div>

      <div className="sidefoot">
        <strong>Syleri</strong><br/>
        Company: Syleri<br/>
        Engine: Syleri Engine<br/>
        Product: Tanzai AI
      </div>
    </aside>
  );
}
