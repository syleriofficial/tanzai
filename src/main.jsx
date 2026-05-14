import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Send,
  Sparkles,
  Plus,
  Trash2,
  Copy
} from "lucide-react";
import "./style.css";

const ENGINE_URL = "https://engine.syleri.com";

function App() {

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const defaultChat = {
    id: Date.now(),
    title: "New Chat",
    messages: [
      {
        role: "bot",
        text: "Namaste, main Tanzai AI hoon."
      }
    ]
  };

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("tanzai_chats");

    if (saved) {
      return JSON.parse(saved);
    }

    return [defaultChat];
  });

  const [activeChatId, setActiveChatId] = useState(chats[0].id);

  useEffect(() => {
    localStorage.setItem(
      "tanzai_chats",
      JSON.stringify(chats)
    );
  }, [chats]);

  const activeChat =
    chats.find(c => c.id === activeChatId) || chats[0];

  async function sendMessage() {

    const text = input.trim();

    if (!text || loading) return;

    setLoading(true);

    const updatedChats = chats.map(chat => {

      if (chat.id === activeChatId) {

        const newMessages = [
          ...chat.messages,
          {
            role: "user",
            text
          }
        ];

        return {
          ...chat,
          title:
            chat.title === "New Chat"
              ? text.slice(0, 25)
              : chat.title,
          messages: newMessages
        };

      }

      return chat;

    });

    setChats(updatedChats);
    setInput("");

    try {

      const res = await fetch(
        `${ENGINE_URL}/api/chat`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            message: text
          })
        }
      );

      const data = await res.json();

      setChats(prev =>
        prev.map(chat => {

          if (chat.id === activeChatId) {

            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  role: "bot",
                  text:
                    data.reply ||
                    "No response"
                }
              ]
            };

          }

          return chat;

        })
      );

    } catch {

      setChats(prev =>
        prev.map(chat => {

          if (chat.id === activeChatId) {

            return {
              ...chat,
              messages: [
                ...chat.messages,
                {
                  role: "bot",
                  text:
                    "Engine connection error"
                }
              ]
            };

          }

          return chat;

        })
      );

    }

    setLoading(false);

  }

  function newChat() {

    const chat = {
      id: Date.now(),
      title: "New Chat",
      messages: [
        {
          role: "bot",
          text:
            "Namaste, main Tanzai AI hoon."
        }
      ]
    };

    setChats(prev => [chat, ...prev]);
    setActiveChatId(chat.id);

  }

  function deleteChat(id) {

    const filtered =
      chats.filter(c => c.id !== id);

    if (filtered.length === 0) {

      newChat();
      return;

    }

    setChats(filtered);
    setActiveChatId(filtered[0].id);

  }

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="brand">
          <div className="logo">
            <Sparkles size={22} />
          </div>

          <div>
            <h1>Tanzai AI</h1>
            <p>
              Powered by Syleri Engine
            </p>
          </div>
        </div>

        <button
          className="newBtn"
          onClick={newChat}
        >
          <Plus size={18} />
          New Chat
        </button>

        <div className="historyTitle">
          RECENT CHATS
        </div>

        <div className="historyList">

          {chats.map(chat => (

            <div
              key={chat.id}
              className={
                chat.id === activeChatId
                  ? "chatItem active"
                  : "chatItem"
              }
            >

              <button
                className="chatSelect"
                onClick={() =>
                  setActiveChatId(chat.id)
                }
              >
                {chat.title}
              </button>

              <button
                className="deleteBtn"
                onClick={() =>
                  deleteChat(chat.id)
                }
              >
                <Trash2 size={14} />
              </button>

            </div>

          ))}

        </div>

      </aside>

      <main className="main">

        <div className="topbar">
          Tanzai AI
        </div>

        <div className="messages">

          {activeChat.messages.map(
            (msg, index) => (

              <div
                key={index}
                className={
                  msg.role === "user"
                    ? "message user"
                    : "message bot"
                }
              >

                <div className="bubble">

                  <p>{msg.text}</p>

                  {msg.role === "bot" && (

                    <button
                      className="copyBtn"
                      onClick={() =>
                        navigator.clipboard.writeText(
                          msg.text
                        )
                      }
                    >
                      <Copy size={14} />
                    </button>

                  )}

                </div>

              </div>

            )
          )}

          {loading && (
            <div className="typing">
              Tanzai thinking...
            </div>
          )}

        </div>

        <div className="inputBar">

          <input
            value={input}
            onChange={e =>
              setInput(e.target.value)
            }
            placeholder="Ask Tanzai AI..."
            onKeyDown={e => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            onClick={sendMessage}
          >
            <Send size={18} />
          </button>

        </div>

      </main>

    </div>
  );

}

ReactDOM.createRoot(
  document.getElementById("root")
).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
