"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import Footer from "@/components/Footer";

export default function Home() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "assistant", content: "Namaste, I am Tanzai AI — powered by Syleri Engine. Ask me anything." }
  ]);

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading) return;

    const next = [...messages, { role: "user", content: text }];
    setMessages(next);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next })
      });
      const data = await res.json();
      setMessages([...next, { role: "assistant", content: data.reply || "Syleri Engine returned empty response." }]);
    } catch {
      setMessages([...next, { role: "assistant", content: "Connection error. Check Cloud Run logs." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <Sidebar onNewChat={() => setMessages([])} />
      <main className="main">
        <Navbar />
        <section className="wrap">
          {messages.length <= 1 && (
            <>
              <div className="hero">
                <span className="badge">Powered by Syleri Engine</span>
                <h2>Tanzai AI</h2>
                <p>A premium AI assistant by Syleri. Built for users, developers and businesses. Future-ready for Syleri API.</p>
              </div>
              <div className="cards">
                <div className="card"><strong>Consumer AI</strong>Ask, learn, write, code and plan faster with Tanzai AI.</div>
                <div className="card"><strong>Syleri Engine</strong>The AI orchestration layer behind Tanzai AI.</div>
                <div className="card"><strong>Syleri API</strong>Coming soon: developer APIs for chat, voice, vision and tools.</div>
              </div>
            </>
          )}

          <div className="messages">
            {messages.map((m, i) => (
              <div key={i} className={`msg ${m.role === "user" ? "user" : "ai"}`}>{m.content}</div>
            ))}
            {loading && <div className="msg ai">Syleri Engine is thinking...</div>}
          </div>

          <div className="composer">
            <div className="input">
              <textarea
                placeholder="Message Tanzai AI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
              />
              <button className="send" onClick={sendMessage} disabled={loading}>➤</button>
            </div>
            <div className="note">Tanzai AI can make mistakes. Built by Syleri.</div>
          </div>
          <Footer />
        </section>
      </main>
    </div>
  );
}
