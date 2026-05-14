import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Sparkles,
  Send,
  Plus,
  Trash2,
  Copy,
  Brain,
  User,
  Menu,
  Save,
  X,
  MessageSquare
} from "lucide-react";
import "./style.css";

const ENGINE_URL = "https://engine.syleri.com";

const starterMemory = {
  name: "",
  language: "Hinglish / Hindi",
  tone: "clear, helpful, founder-style",
  goals: "Build Tanzai AI with Syleri Engine",
  notes: []
};

function createChat(title = "New Chat") {
  return {
    id: Date.now() + Math.floor(Math.random() * 9999),
    title,
    createdAt: new Date().toISOString(),
    messages: [
      {
        role: "bot",
        text: "Namaste, main Tanzai AI hoon. Main aapki memory aur chat history yaad rakh sakta hoon."
      }
    ]
  };
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [input, setInput] = useState("");
  const [memoryDraft, setMemoryDraft] = useState("");
  const [loading, setLoading] = useState(false);

  const [memory, setMemory] = useState(() => {
    const saved = localStorage.getItem("tanzai_memory");
    return saved ? JSON.parse(saved) : starterMemory;
  });

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("tanzai_chats_v4");
    return saved ? JSON.parse(saved) : [createChat("Welcome chat")];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    const saved = localStorage.getItem("tanzai_active_chat");
    return saved ? Number(saved) : null;
  });

  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId) || chats[0];
  }, [chats, activeChatId]);

  useEffect(() => {
    if (!activeChat && chats.length > 0) {
      setActiveChatId(chats[0].id);
    }
  }, [activeChat, chats]);

  useEffect(() => {
    localStorage.setItem("tanzai_memory", JSON.stringify(memory));
  }, [memory]);

  useEffect(() => {
    localStorage.setItem("tanzai_chats_v4", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (activeChat?.id) {
      localStorage.setItem("tanzai_active_chat", String(activeChat.id));
    }
  }, [activeChat]);

  function updateActiveChat(updater) {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id ? updater(chat) : chat
      )
    );
  }

  function newChat() {
    const chat = createChat();
    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
  }

  function deleteChat(id) {
    const next = chats.filter((chat) => chat.id !== id);
    if (next.length === 0) {
      const fresh = createChat();
      setChats([fresh]);
      setActiveChatId(fresh.id);
      return;
    }
    setChats(next);
    if (id === activeChat.id) {
      setActiveChatId(next[0].id);
    }
  }

  function addMemoryNote() {
    const note = memoryDraft.trim();
    if (!note) return;
    setMemory((prev) => ({
      ...prev,
      notes: [
        {
          id: Date.now(),
          text: note,
          createdAt: new Date().toLocaleString()
        },
        ...prev.notes
      ]
    }));
    setMemoryDraft("");
  }

  function deleteMemoryNote(id) {
    setMemory((prev) => ({
      ...prev,
      notes: prev.notes.filter((n) => n.id !== id)
    }));
  }

  function buildMemoryPrompt(userText) {
    const notes = memory.notes.map((n) => `- ${n.text}`).join("\n");

    return `User message: ${userText}

Tanzai AI Memory:
Name: ${memory.name || "unknown"}
Preferred language: ${memory.language}
Tone: ${memory.tone}
Goals: ${memory.goals}
Important notes:
${notes || "- No saved notes yet."}

Reply using this memory when useful.`;
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || loading || !activeChat) return;

    const userMsg = { role: "user", text };

    updateActiveChat((chat) => ({
      ...chat,
      title:
        chat.title === "New Chat" || chat.title === "Welcome chat"
          ? text.slice(0, 34)
          : chat.title,
      messages: [...chat.messages, userMsg]
    }));

    setInput("");
    setLoading(true);

    try {
      const res = await fetch(`${ENGINE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: buildMemoryPrompt(text)
        })
      });

      const data = await res.json();

      updateActiveChat((chat) => ({
        ...chat,
        messages: [
          ...chat.messages,
          {
            role: "bot",
            text: data.reply || "Tanzai AI reply unavailable."
          }
        ]
      }));
    } catch (err) {
      updateActiveChat((chat) => ({
        ...chat,
        messages: [
          ...chat.messages,
          {
            role: "bot",
            text: "Syleri Engine connection error."
          }
        ]
      }));
    } finally {
      setLoading(false);
    }
  }

  function copyText(text) {
    navigator.clipboard.writeText(text);
  }

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="brand">
          <div className="logo">
            <Sparkles size={22} />
          </div>
          <div>
            <h1>Tanzai AI</h1>
            <p>Memory + History</p>
          </div>
        </div>

        <button className="primaryBtn" onClick={newChat}>
          <Plus size={18} />
          New Chat
        </button>

        <button className="memoryBtn" onClick={() => setMemoryOpen(true)}>
          <Brain size={18} />
          Open Memory
        </button>

        <div className="smallTitle">Recent Chats</div>

        <div className="chatList">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chatItem ${chat.id === activeChat?.id ? "active" : ""}`}
            >
              <button onClick={() => setActiveChatId(chat.id)}>
                <MessageSquare size={15} />
                <span>{chat.title}</span>
              </button>
              <button className="danger" onClick={() => deleteChat(chat.id)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>

        <div className="engineStatus">
          <span></span>
          Engine: {ENGINE_URL}
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="iconBtn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={22} />
          </button>

          <div>
            <h2>Tanzai AI</h2>
            <p>Powered by Syleri Engine</p>
          </div>

          <button className="profileBtn" onClick={() => setMemoryOpen(true)}>
            <User size={18} />
          </button>
        </header>

        <section className="hero">
          <div className="pill">
            <Brain size={16} />
            Memory System Active
          </div>
          <h3>Personal AI Workspace</h3>
          <p>
            Tanzai AI chat history save karta hai aur local memory se answers ko personalized banata hai.
          </p>
        </section>

        <section className="messages">
          {activeChat?.messages.map((msg, index) => (
            <div key={index} className={`messageRow ${msg.role}`}>
              <div className="avatar">
                {msg.role === "bot" ? <Sparkles size={16} /> : <User size={16} />}
              </div>
              <div className="bubble">
                <p>{msg.text}</p>
                {msg.role === "bot" && (
                  <button className="copyBtn" onClick={() => copyText(msg.text)}>
                    <Copy size={14} />
                    Copy
                  </button>
                )}
              </div>
            </div>
          ))}

          {loading && (
            <div className="messageRow bot">
              <div className="avatar">
                <Sparkles size={16} />
              </div>
              <div className="bubble typing">Tanzai thinking with memory...</div>
            </div>
          )}
        </section>

        <footer className="composer">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder="Ask Tanzai AI..."
          />
          <button onClick={sendMessage}>
            <Send size={18} />
            Send
          </button>
        </footer>
      </main>

      {memoryOpen && (
        <div className="modalOverlay">
          <div className="memoryModal">
            <div className="modalHead">
              <div>
                <h2>Tanzai Memory</h2>
                <p>Ye memory browser localStorage me save hoti hai.</p>
              </div>
              <button className="iconBtn" onClick={() => setMemoryOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <div className="memoryGrid">
              <label>
                Name
                <input
                  value={memory.name}
                  onChange={(e) =>
                    setMemory((prev) => ({ ...prev, name: e.target.value }))
                  }
                  placeholder="Your name"
                />
              </label>

              <label>
                Language
                <input
                  value={memory.language}
                  onChange={(e) =>
                    setMemory((prev) => ({ ...prev, language: e.target.value }))
                  }
                />
              </label>

              <label>
                Tone
                <input
                  value={memory.tone}
                  onChange={(e) =>
                    setMemory((prev) => ({ ...prev, tone: e.target.value }))
                  }
                />
              </label>

              <label>
                Goals
                <textarea
                  value={memory.goals}
                  onChange={(e) =>
                    setMemory((prev) => ({ ...prev, goals: e.target.value }))
                  }
                />
              </label>
            </div>

            <div className="addNote">
              <textarea
                value={memoryDraft}
                onChange={(e) => setMemoryDraft(e.target.value)}
                placeholder="Add important memory note..."
              />
              <button onClick={addMemoryNote}>
                <Save size={16} />
                Save Memory
              </button>
            </div>

            <div className="notes">
              {memory.notes.map((note) => (
                <div className="note" key={note.id}>
                  <div>
                    <p>{note.text}</p>
                    <small>{note.createdAt}</small>
                  </div>
                  <button onClick={() => deleteMemoryNote(note.id)}>
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
