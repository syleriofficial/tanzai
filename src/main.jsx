import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";

const ENGINE_URL = "https://engine.syleri.com";

function App() {

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Namaste, main Tanzai AI hoon. Ask me anything."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {

    if (!input.trim()) return;

    const userMessage = {
      role: "user",
      content: input
    };

    setMessages((prev) => [...prev, userMessage]);

    const text = input;

    setInput("");
    setLoading(true);

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

      const aiMessage = {
        role: "assistant",
        content:
          data.reply ||
          "No response from Syleri Engine"
      };

      setMessages((prev) => [...prev, aiMessage]);

    } catch (err) {

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            "Syleri Engine connection error"
        }
      ]);

    }

    setLoading(false);

  }

  return (
    <div className="app">

      <aside className="sidebar">

        <div className="logoBox">
          <div className="logo">
            ✦
          </div>

          <div>
            <h1>Tanzai AI</h1>
            <p>
              Powered by Syleri Engine
            </p>
          </div>
        </div>

        <button className="newChat">
          + New Chat
        </button>

        <div className="recent">
          <p className="recentTitle">
            RECENT
          </p>

          <div className="recentItem">
            Welcome chat
          </div>
        </div>

        <div className="engineStatus">
          Engine:
          {" "}
          {ENGINE_URL}
        </div>

      </aside>

      <main className="main">

        <header className="topbar">

          <div className="menuBtn">
            ☰
          </div>

          <div>
            <h2>Tanzai AI</h2>
            <p>
              Fast, modern, secure AI assistant
            </p>
          </div>

          <div className="profile">
            ⌾
          </div>

        </header>

        <div className="hero">

          <div className="heroBadge">
            ⚡ Connected with Syleri Engine
          </div>

          <h1>
            Build. Think. Create.
          </h1>

          <p>
            Tanzai AI ka frontend yahan hai.
            Real AI processing engine.syleri.com
            par hogi.
          </p>

          <div className="heroTags">

            <span>
              🧠 Smart Chat
            </span>

            <span>
              🛡 API Key Safe
            </span>

            <span>
              🌍 Global Ready
            </span>

          </div>

        </div>

        <div className="chatArea">

          {messages.map((msg, index) => (

            <div
              key={index}
              className={`message ${msg.role}`}
            >

              <div className="avatar">
                {msg.role === "assistant"
                  ? "✦"
                  : "👤"}
              </div>

              <div className="bubble">

                <p>
                  {msg.content}
                </p>

                <button
                  className="copyBtn"
                  onClick={() =>
                    navigator.clipboard.writeText(
                      msg.content
                    )
                  }
                >
                  Copy
                </button>

              </div>

            </div>

          ))}

          {loading && (
            <div className="typing">
              Tanzai AI thinking...
            </div>
          )}

        </div>

        <div className="inputBar">

          <button className="micBtn">
            🎤
          </button>

          <input
            type="text"
            placeholder="Ask Tanzai AI..."
            value={input}
            onChange={(e) =>
              setInput(e.target.value)
            }
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />

          <button
            className="sendBtn"
            onClick={sendMessage}
          >
            ➤ Send
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
