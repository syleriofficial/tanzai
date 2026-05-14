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
  MessageSquare,
  Mic,
  ImagePlus,
  X,
  Volume2
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
        text: "Namaste, main Tanzai AI hoon. Aap text, voice aur image ke saath baat kar sakte ho."
      }
    ]
  };
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [input, setInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [listening, setListening] = useState(false);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const stopRef = useRef(false);
  const bottomRef = useRef(null);
  const recognitionRef = useRef(null);

  const [chats, setChats] = useState(() => {
    const saved = localStorage.getItem("tanzai_multimodal_chats");
    return saved ? JSON.parse(saved) : [createChat("Welcome chat")];
  });

  const [activeChatId, setActiveChatId] = useState(() => {
    const saved = localStorage.getItem("tanzai_multimodal_active");
    return saved ? Number(saved) : null;
  });

  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId) || chats[0];
  }, [chats, activeChatId]);

  useEffect(() => {
    if (!activeChat && chats.length > 0) setActiveChatId(chats[0].id);
  }, [activeChat, chats]);

  useEffect(() => {
    localStorage.setItem("tanzai_multimodal_chats", JSON.stringify(chats));
  }, [chats]);

  useEffect(() => {
    if (activeChat?.id) localStorage.setItem("tanzai_multimodal_active", String(activeChat.id));
  }, [activeChat]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, isGenerating]);

  function updateActiveChat(updater) {
    setChats((prev) =>
      prev.map((chat) => (chat.id === activeChat.id ? updater(chat) : chat))
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
    if (id === activeChat.id) setActiveChatId(next[0].id);
  }

  function copyText(text) {
    navigator.clipboard.writeText(text);
  }

  function speakText(text) {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "hi-IN";
    utterance.rate = 1;
    window.speechSynthesis.speak(utterance);
  }

  function startVoiceInput() {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Voice input is not supported in this browser. Chrome use karo.");
      return;
    }

    if (listening && recognitionRef.current) {
      recognitionRef.current.stop();
      setListening(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "hi-IN";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);

    recognition.onresult = (event) => {
      let transcript = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      setInput(transcript);
    };

    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);

    recognitionRef.current = recognition;
    recognition.start();
  }

  function handleImageUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    setImage(file);

    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  }

  function removeImage() {
    setImage(null);
    setImagePreview("");
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

        return { ...chat, messages: nextMessages };
      });

      await new Promise((resolve) => setTimeout(resolve, 10));
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

      return { ...chat, messages: nextMessages };
    });
  }

  async function sendMessage() {
    const text = input.trim();
    if ((!text && !imagePreview) || isGenerating || !activeChat) return;

    stopRef.current = false;
    setIsGenerating(true);

    const userText = text || "Analyze this image.";
    const imageData = imagePreview;

    updateActiveChat((chat) => ({
      ...chat,
      title:
        chat.title === "New Chat" || chat.title === "Welcome chat"
          ? userText.slice(0, 34)
          : chat.title,
      messages: [
        ...chat.messages,
        {
          role: "user",
          text: userText,
          image: imageData
        },
        {
          role: "bot",
          text: "",
          streaming: true
        }
      ]
    }));

    setInput("");
    setImage(null);
    setImagePreview("");

    try {
      const prompt = imageData
        ? `${userText}\n\nUser attached an image. Current Syleri Engine text endpoint does not yet process raw image data. Reply with guidance based on the user's text and ask them to describe the image if needed.`
        : userText;

      const res = await fetch(`${ENGINE_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: prompt,
          image: imageData
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
            <p>Multimodal V6</p>
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
            <p>Text + Voice + Image interface powered by Syleri Engine</p>
          </div>

          <button className="profileBtn">
            <User size={18} />
          </button>
        </header>

        <section className="hero">
          <div className="pill">
            <Brain size={16} />
            Multimodal Interface Active
          </div>
          <h3>Talk. Upload. Create.</h3>
          <p>
            Tanzai AI ab voice input, image upload preview, streaming response aur chat history ke saath ready hai.
          </p>

          <div className="featureRow">
            <span>🎤 Voice Input</span>
            <span>🖼 Image Upload</span>
            <span>⚡ Streaming</span>
            <span>💾 History</span>
          </div>
        </section>

        <section className="messages">
          {activeChat?.messages.map((msg, index) => (
            <div key={index} className={`messageRow ${msg.role}`}>
              <div className="avatar">
                {msg.role === "bot" ? <Sparkles size={16} /> : <User size={16} />}
              </div>

              <div className="bubble">
                {msg.image && <img className="bubbleImage" src={msg.image} alt="uploaded" />}
                <p>
                  {msg.text}
                  {msg.streaming && <span className="cursor">|</span>}
                </p>

                {msg.role === "bot" && msg.text && (
                  <div className="messageActions">
                    <button className="copyBtn" onClick={() => copyText(msg.text)}>
                      <Copy size={14} />
                      Copy
                    </button>
                    <button className="copyBtn" onClick={() => speakText(msg.text)}>
                      <Volume2 size={14} />
                      Speak
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}

          <div ref={bottomRef}></div>
        </section>

        {imagePreview && (
          <div className="imagePreview">
            <img src={imagePreview} alt="preview" />
            <button onClick={removeImage}>
              <X size={16} />
            </button>
          </div>
        )}

        <footer className="composer">
          <label className="toolBtn">
            <ImagePlus size={20} />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
          </label>

          <button
            className={`toolBtn ${listening ? "listening" : ""}`}
            onClick={startVoiceInput}
          >
            <Mic size={20} />
          </button>

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
            <button className="sendBtn" onClick={sendMessage}>
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
