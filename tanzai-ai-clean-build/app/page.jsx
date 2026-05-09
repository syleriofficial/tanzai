'use client';
import { useState } from 'react';
import { Send, Sparkles, ShieldCheck, Zap, Globe2 } from 'lucide-react';

export default function Home() {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Namaste 👋 Main Tanzai AI hoon. Aap mujhse Hindi, English ya Hinglish me kuch bhi pooch sakte ho.' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;
    const next = [...messages, { role: 'user', content: text }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: next })
      });
      const data = await res.json();
      setMessages([...next, { role: 'assistant', content: data.reply || data.error || 'Response nahi mila.' }]);
    } catch (e) {
      setMessages([...next, { role: 'assistant', content: 'Server error. OPENROUTER_API_KEY check karo.' }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app-bg">
      <div className="container">
        <nav className="nav">
          <div className="brand"><div className="logo"><Sparkles size={22}/></div><span>Tanzai AI</span></div>
          <div className="pill hide-sm">Global Intelligence by Syleri</div>
        </nav>

        <section className="hero">
          <div className="badge"><Sparkles size={16}/> AI Powered Assistant</div>
          <h1><span className="grad">Think faster.</span><br/>Build bigger.</h1>
          <p className="sub">Tanzai AI is a clean, scalable AI assistant ready for Google Cloud Run and OpenRouter. Built for Hindi, English and global users.</p>
        </section>

        <section className="grid">
          <div className="card glass chat">
            <div className="chat-head">
              <strong>Tanzai Chat</strong>
              <span className="status"><span className="dot"/> Online</span>
            </div>
            <div className="messages">
              {messages.map((m, i) => <div key={i} className={`msg ${m.role === 'user' ? 'user' : 'ai'}`}>{m.content}</div>)}
              {loading && <div className="msg ai">Thinking...</div>}
            </div>
            <div className="composer">
              <textarea value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{ if(e.key==='Enter' && !e.shiftKey){e.preventDefault(); sendMessage();}}} placeholder="Ask Tanzai AI..." />
              <button className="send" onClick={sendMessage} disabled={loading}><Send size={19}/></button>
            </div>
          </div>

          <div className="features">
            <Feature icon={<Zap/>} title="Fast Cloud Ready" text="Docker + Next.js setup, Cloud Run PORT 8080 ready." />
            <Feature icon={<ShieldCheck/>} title="Secure API Key" text="OpenRouter key server-side only. Browser me expose nahi hoti." />
            <Feature icon={<Globe2/>} title="Global Brand UI" text="Modern glass UI, mobile responsive and launch-ready." />
          </div>
        </section>

        <footer className="footer">© 2026 Tanzai AI by Syleri. Built for global scale.</footer>
      </div>
    </main>
  );
}

function Feature({ icon, title, text }) {
  return <div className="feature glass"><div className="icon">{icon}</div><h3>{title}</h3><p>{text}</p></div>;
}
