import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Square,
  MessageSquare
} from "lucide-react";
import "./style.css";

const ENGINE_URL = "https://engine.syleri.com";

function createChat(title = "New Chat") {
  return {
    id: Date.now() + Math.floor(Math.random() * 9999),
    title,
    messages: [
      {
        role: "bot",
        text: "Namaste, main Tanzai AI hoon. Main ChatGPT jaisa streaming typing effect de sakta hoon."
      }
    ]
  };
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const stopRef = useRef(false);
  const bottomRef = useRef(null);

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("tanzai_stream_chats");
    return saved ? JSON.parse(saved) : [createChat("Welcome chat")];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    const saved = localStorage.getItem("tanzai_stream_active");
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
    localStorage.setItem("tanzai_stream_chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (activeChat?.id) {
      localStorage.setItem("tanzai_stream_active", String(activeChat.id));
    }
  }, [activeChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isGenerating]);

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

  function copyText(text) {
    navigator.clipboard.writeText(text);
  }

  async function typeReply(fullText) {
    const chars = fullText.split("");
    let current = "";

    for (let i = 0; i < chars.length; i++) {
      if (stopRef.current) break;

      current += chars[i];

      updateActiveChat((chat) => {
        const nextMessages = [...chat.messages];
        const lastIndex = nextMessages.length - 1;

        if (nextMessages[lastIndex]?.streaming) {
          nextMessages[lastIndex] = {
            role: "bot",
            text: current,
            streaming: true
          };
        }

        return {
          ...chat,
          messages: nextMessages
        };
      });

      await new Promise((resolve) => setTimeout(resolve, 12));
    }

    updateActiveChat((chat) => {
      const nextMessages = [...chat.messages];
      const lastIndex = nextMessages.length - 1;

      if (nextMessages[lastIndex]?.streaming) {
        nextMessages[lastIndex] = {
          role: "bot",
          text: current || "Stopped."
        };
      }

      return {
        ...chat,
        messages: nextMessages
      };
    });
  }

  async function sendMessage() {
    const text = input.trim();

    if (!text || isGenerating || !activeChat) return;

    stopRef.current = false;
    setIsGenerating(true);

    updateActiveChat((chat) => ({
      ...chat,
      title:
        chat.title === "New Chat" || chat.title === "Welcome chat"
          ? text.slice(0, 34)
          : chat.title,
      messages: [
        ...chat.messages,
        {
          role: "user",
          text
        },
        {
          role: "bot",
          text: "",
          streaming: true
        }
      ]
    }));

    setInput("");

    try {
      const res = await fetch(`${ENGINE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: text
        })
      });

      const data = await res.json();

      await typeReply(data.reply || "Tanzai AI reply unavailable.");
    } catch (error) {
      await typeReply("Syleri Engine connection error.");
    } finally {
      setIsGenerating(false);
      stopRef.current = false;
    }
  }

  function stopGenerating() {
    stopRef.current = true;
    setIsGenerating(false);
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
            <p>Streaming V5</p>
          </div>
        </div>

        <button className="primaryBtn" onClick={newChat}>
          <Plus size={18} />
          New Chat
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
            <p>Live typing response powered by Syleri Engine</p>
          </div>

          <button className="profileBtn">
            <User size={18} />
          </button>
        </header>

        <section className="hero">
          <div className="pill">
            <Brain size={16} />
            Streaming Reply Active
          </div>
          <h3>Answers feel alive.</h3>
          <p>
            Response engine se aane ke baad Tanzai AI usko smooth typing effect ke saath dikhata hai.
          </p>
        </section>

        <section className="messages">
          {activeChat?.messages.map((msg, index) => (
            <div key={index} className={`messageRow ${msg.role}`}>
              <div className="avatar">
                {msg.role === "bot" ? <Sparkles size={16} /> : <User size={16} />}
              </div>

              <div className="bubble">
                <p>
                  {msg.text}
                  {msg.streaming && <span className="cursor">|</span>}
                </p>

                {msg.role === "bot" && msg.text && (
                  <button className="copyBtn" onClick={() => copyText(msg.text)}>
                    <Copy size={14} />
                    Copy
                  </button>
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef}></div>
        </section>

        <footer className="composer">
          <input
            value={input}
            disabled={isGenerating}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder={isGenerating ? "Tanzai is generating..." : "Ask Tanzai AI..."}
          />

          {isGenerating ? (
            <button className="stopBtn" onClick={stopGenerating}>
              <Square size={17} />
              Stop
            </button>
          ) : (
            <button onClick={sendMessage}>
              <Send size={18} />
              Send
            </button>
          )}
        </footer>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
