import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Send,
  Sparkles,
  Menu,
  Plus,
  MessageSquare,
  Copy,
  Mic,
  User,
  Zap,
  Shield,
  Brain,
  Globe2
} from "lucide-react";
import "./style.css";

const ENGINE_URL = "https://engine.syleri.com";

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "bot",
      text: "Namaste, main Tanzai AI hoon. Ask me anything."
    }
  ]);
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${ENGINE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: text })
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: data.reply || "Syleri Engine se empty response aaya."
        }
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: "Engine connection error. Pehle engine.syleri.com backend deploy aur CORS check karo."
        }
      ]);
    } finally {
      setLoading(false);
    }
  }

  function copyText(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="app-shell">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="brand">
          <div className="brand-mark">
            <Sparkles size={22} />
          </div>
          <div>
            <h1>Tanzai AI</h1>
            <p>Powered by Syleri Engine</p>
          </div>
        </div>

        <button className="new-chat">
          <Plus size={18} />
          New Chat
        </button>

        <div className="section-title">Recent</div>

        <div className="recent-card active">
          <MessageSquare size={17} />
          <span>Welcome chat</span>
        </div>

        <div className="sidebar-footer">
          <div className="status-dot"></div>
          <span>Engine: {ENGINE_URL}</span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="icon-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={22} />
          </button>

          <div className="top-title">
            <h2>Tanzai AI</h2>
            <p>Fast, modern, secure AI assistant</p>
          </div>

          <button className="profile-btn">
            <User size={18} />
          </button>
        </header>

        <section className="hero">
          <div className="pill">
            <Zap size={16} />
            Connected with Syleri Engine
          </div>

          <h3>Build. Think. Create.</h3>
          <p>
            Tanzai AI ka frontend yahan hai. Real AI processing engine.syleri.com par hogi.
          </p>

          <div className="feature-grid">
            <div className="feature">
              <Brain size={20} />
              <span>Smart Chat</span>
            </div>
            <div className="feature">
              <Shield size={20} />
              <span>API Key Safe</span>
            </div>
            <div className="feature">
              <Globe2 size={20} />
              <span>Global Ready</span>
            </div>
          </div>
        </section>

        <section className="chat-window">
          {messages.map((msg, index) => (
            <div key={index} className={`message-row ${msg.role}`}>
              <div className="avatar">
                {msg.role === "bot" ? <Sparkles size={17} /> : <User size={17} />}
              </div>

              <div className="bubble">
                <p>{msg.text}</p>
                {msg.role === "bot" && (
                  <button className="copy-btn" onClick={() => copyText(msg.text)}>
                    <Copy size={14} />
                    Copy
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="message-row bot">
              <div className="avatar">
                <Sparkles size={17} />
              </div>
              <div className="bubble typing">
                Tanzai thinking...
              </div>
            </div>
          )}
        </section>

        <footer className="composer">
          <button className="round-btn">
            <Mic size={20} />
          </button>

          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Ask Tanzai AI..."
          />

          <button className="send-btn" onClick={sendMessage}>
            <Send size={19} />
            Send
          </button>
        </footer>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
