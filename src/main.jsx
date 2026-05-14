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
  MessageSquare,
  LogOut,
  ThumbsUp,
  ThumbsDown,
  Save,
  Database,
  KeyRound
} from "lucide-react";
import { supabase, supabaseReady } from "./supabaseClient";
import "./style.css";

const ENGINE_URL =
  import.meta.env.VITE_SYLERI_ENGINE_URL || "https://engine.syleri.com";

function fallbackChat() {
  return {
    id: "local-" + Date.now(),
    title: "Welcome chat",
    messages: [
      {
        id: "local-msg-" + Date.now(),
        role: "assistant",
        content: "Namaste, main Tanzai AI hoon. Supabase cloud memory ready hai."
      }
    ]
  };
}

function AuthScreen() {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function submit(e) {
    e.preventDefault();
    setStatus("");

    if (!supabaseReady) {
      setStatus("Supabase env variables missing.");
      return;
    }

    const action =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password });

    const { error } = await action;

    if (error) {
      setStatus(error.message);
    } else {
      setStatus(mode === "signin" ? "Signed in." : "Signup done. Check email if confirmation is enabled.");
    }
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authLogo">
          <Sparkles size={28} />
        </div>
        <h1>Tanzai AI</h1>
        <p>Cloud memory + chat history powered by Supabase and Syleri Engine.</p>

        <form onSubmit={submit}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="minimum 6 characters" />

          <button type="submit">
            <KeyRound size={18} />
            {mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button className="ghostBtn" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
          {mode === "signin" ? "Need account? Sign up" : "Already have account? Sign in"}
        </button>

        {status && <div className="statusBox">{status}</div>}

        {!supabaseReady && (
          <div className="warningBox">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in Cloud Run variables.
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [loadingApp, setLoadingApp] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [input, setInput] = useState("");
  const [generating, setGenerating] = useState(false);
  const [chats, setChats] = useState([fallbackChat()]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [memories, setMemories] = useState([]);
  const [memoryText, setMemoryText] = useState("");
  const bottomRef = useRef(null);

  const user = session?.user || null;

  const activeChat = useMemo(() => {
    return chats.find((c) => c.id === activeChatId) || chats[0];
  }, [chats, activeChatId]);

  useEffect(() => {
    async function init() {
      if (!supabaseReady) {
        setLoadingApp(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
        setSession(newSession);
      });

      setLoadingApp(false);

      return () => listener.subscription.unsubscribe();
    }

    init();
  }, []);

  useEffect(() => {
    if (user) {
      loadCloudData();
    }
  }, [user?.id]);

  useEffect(() => {
    if (activeChat?.id) setActiveChatId(activeChat.id);
  }, [activeChat?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeChat?.messages, generating]);

  async function loadCloudData() {
    if (!user || !supabaseReady) return;

    const { data: profileData } = await supabase
      .from("tanzai_profiles")
      .select("*")
      .eq("id", user.id)
      .maybeSingle();

    setProfile(profileData);

    const { data: chatData } = await supabase
      .from("tanzai_chats")
      .select("*")
      .eq("user_id", user.id)
      .order("updated_at", { ascending: false });

    if (!chatData || chatData.length === 0) {
      const { data: newChat } = await supabase
        .from("tanzai_chats")
        .insert({ user_id: user.id, title: "Welcome chat" })
        .select()
        .single();

      await supabase.from("tanzai_messages").insert({
        chat_id: newChat.id,
        user_id: user.id,
        role: "assistant",
        content: "Namaste, main Tanzai AI hoon. Aapki cloud history ready hai."
      });

      return loadCloudData();
    }

    const chatIds = chatData.map((c) => c.id);

    const { data: messageData } = await supabase
      .from("tanzai_messages")
      .select("*")
      .in("chat_id", chatIds)
      .order("created_at", { ascending: true });

    const mapped = chatData.map((chat) => ({
      ...chat,
      messages: (messageData || [])
        .filter((m) => m.chat_id === chat.id)
        .map((m) => ({
          id: m.id,
          role: m.role === "assistant" ? "assistant" : "user",
          content: m.content
        }))
    }));

    setChats(mapped);
    setActiveChatId(mapped[0]?.id);

    const { data: memData } = await supabase
      .from("tanzai_memories")
      .select("*")
      .eq("user_id", user.id)
      .order("importance", { ascending: false });

    setMemories(memData || []);
  }

  async function newChat() {
    if (!user || !supabaseReady) return;

    const { data } = await supabase
      .from("tanzai_chats")
      .insert({ user_id: user.id, title: "New Chat" })
      .select()
      .single();

    const welcome = await supabase
      .from("tanzai_messages")
      .insert({
        chat_id: data.id,
        user_id: user.id,
        role: "assistant",
        content: "New chat started. Ask Tanzai AI anything."
      })
      .select()
      .single();

    const chat = {
      ...data,
      messages: [
        {
          id: welcome.data.id,
          role: "assistant",
          content: welcome.data.content
        }
      ]
    };

    setChats((prev) => [chat, ...prev]);
    setActiveChatId(chat.id);
  }

  async function deleteChat(id) {
    if (!supabaseReady) return;
    await supabase.from("tanzai_chats").delete().eq("id", id);
    const next = chats.filter((c) => c.id !== id);
    setChats(next);
    if (next.length) setActiveChatId(next[0].id);
    else await newChat();
  }

  function buildMemoryPrompt(text) {
    const memoryBlock = memories.map((m) => `- ${m.content}`).join("\n");
    return `User message: ${text}

User profile:
Name/email: ${profile?.display_name || user?.email || "unknown"}
Preferred language: ${profile?.preferred_language || "Hinglish / Hindi"}
Tone: ${profile?.tone || "clear and helpful"}
Goals: ${profile?.goals || "Build Tanzai AI"}

Saved memories:
${memoryBlock || "- No memory saved yet."}

Reply naturally in user's language and use memory only when useful.`;
  }

  async function saveMessage(role, content, chatId = activeChat.id) {
    const { data } = await supabase
      .from("tanzai_messages")
      .insert({
        chat_id: chatId,
        user_id: user.id,
        role,
        content
      })
      .select()
      .single();

    return data;
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || generating || !activeChat || !user || !supabaseReady) return;

    setInput("");
    setGenerating(true);

    const userMsg = { id: "temp-user-" + Date.now(), role: "user", content: text };
    const tempBot = { id: "temp-bot-" + Date.now(), role: "assistant", content: "Tanzai thinking..." };

    setChats((prev) =>
      prev.map((chat) =>
        chat.id === activeChat.id
          ? {
              ...chat,
              title: chat.title === "New Chat" || chat.title === "Welcome chat" ? text.slice(0, 38) : chat.title,
              messages: [...chat.messages, userMsg, tempBot]
            }
          : chat
      )
    );

    try {
      await saveMessage("user", text);

      await supabase
        .from("tanzai_chats")
        .update({
          title: activeChat.title === "New Chat" || activeChat.title === "Welcome chat" ? text.slice(0, 38) : activeChat.title,
          updated_at: new Date().toISOString()
        })
        .eq("id", activeChat.id);

      const res = await fetch(`${ENGINE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: buildMemoryPrompt(text) })
      });

      const data = await res.json();
      const reply = data.reply || "Tanzai AI reply unavailable.";

      const savedBot = await saveMessage("assistant", reply);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat.id
            ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.id === tempBot.id
                    ? { id: savedBot.id, role: "assistant", content: reply }
                    : m
                )
              }
            : chat
        )
      );
    } catch (error) {
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === activeChat.id
            ? {
                ...chat,
                messages: chat.messages.map((m) =>
                  m.id === tempBot.id
                    ? { ...m, content: "Syleri Engine or Supabase error." }
                    : m
                )
              }
            : chat
        )
      );
    } finally {
      setGenerating(false);
    }
  }

  async function saveMemory() {
    const content = memoryText.trim();
    if (!content || !user || !supabaseReady) return;

    const { data } = await supabase
      .from("tanzai_memories")
      .insert({
        user_id: user.id,
        memory_type: "manual",
        content,
        importance: 8
      })
      .select()
      .single();

    setMemories((prev) => [data, ...prev]);
    setMemoryText("");
  }

  async function deleteMemory(id) {
    await supabase.from("tanzai_memories").delete().eq("id", id);
    setMemories((prev) => prev.filter((m) => m.id !== id));
  }

  async function feedback(messageId, rating) {
    if (!messageId || String(messageId).startsWith("temp")) return;

    await supabase.from("tanzai_feedback").insert({
      user_id: user.id,
      message_id: messageId,
      rating
    });
  }

  function copyText(text) {
    navigator.clipboard.writeText(text);
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
  }

  if (loadingApp) return <div className="loading">Loading Tanzai AI...</div>;

  if (!session) return <AuthScreen />;

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="brand">
          <div className="logo">
            <Sparkles size={22} />
          </div>
          <div>
            <h1>Tanzai AI</h1>
            <p>Cloud Memory V7</p>
          </div>
        </div>

        <button className="primaryBtn" onClick={newChat}>
          <Plus size={18} />
          New Chat
        </button>

        <button className="memoryBtn" onClick={() => setMemoryOpen(true)}>
          <Database size={18} />
          Cloud Memory
        </button>

        <div className="smallTitle">Recent Chats</div>

        <div className="chatList">
          {chats.map((chat) => (
            <div key={chat.id} className={`chatItem ${chat.id === activeChat?.id ? "active" : ""}`}>
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

        <button className="logoutBtn" onClick={signOut}>
          <LogOut size={16} />
          Sign out
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="iconBtn" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={22} />
          </button>

          <div>
            <h2>Tanzai AI</h2>
            <p>Supabase cloud memory + Syleri Engine</p>
          </div>

          <button className="profileBtn" onClick={() => setMemoryOpen(true)}>
            <User size={18} />
          </button>
        </header>

        <section className="hero">
          <div className="pill">
            <Brain size={16} />
            Cloud Memory Active
          </div>
          <h3>Train the future Syleri Engine.</h3>
          <p>
            Chats, memory and feedback save hote hain. Ye future me better routing, personalization aur training dataset ka foundation banega.
          </p>
        </section>

        <section className="messages">
          {activeChat?.messages?.map((msg) => (
            <div key={msg.id} className={`messageRow ${msg.role === "assistant" ? "bot" : "user"}`}>
              <div className="avatar">
                {msg.role === "assistant" ? <Sparkles size={16} /> : <User size={16} />}
              </div>

              <div className="bubble">
                <p>{msg.content}</p>

                {msg.role === "assistant" && (
                  <div className="messageActions">
                    <button className="copyBtn" onClick={() => copyText(msg.content)}>
                      <Copy size={14} />
                      Copy
                    </button>
                    <button className="copyBtn" onClick={() => feedback(msg.id, "good")}>
                      <ThumbsUp size={14} />
                      Good
                    </button>
                    <button className="copyBtn" onClick={() => feedback(msg.id, "bad")}>
                      <ThumbsDown size={14} />
                      Bad
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </section>

        <footer className="composer">
          <input
            value={input}
            disabled={generating}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") sendMessage();
            }}
            placeholder={generating ? "Tanzai is thinking..." : "Ask Tanzai AI..."}
          />

          <button onClick={sendMessage} disabled={generating}>
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
                <h2>Cloud Memory</h2>
                <p>Stored securely in Supabase for this signed-in user.</p>
              </div>
              <button className="iconBtn" onClick={() => setMemoryOpen(false)}>×</button>
            </div>

            <div className="profileBox">
              <h3>{profile?.display_name || user.email}</h3>
              <p>{profile?.preferred_language || "Hinglish / Hindi"} · {profile?.tone || "clear helpful"}</p>
            </div>

            <div className="addNote">
              <textarea
                value={memoryText}
                onChange={(e) => setMemoryText(e.target.value)}
                placeholder="Save memory: User likes Hindi replies, working on Syleri Engine..."
              />
              <button onClick={saveMemory}>
                <Save size={16} />
                Save
              </button>
            </div>

            <div className="notes">
              {memories.map((m) => (
                <div className="note" key={m.id}>
                  <div>
                    <p>{m.content}</p>
                    <small>Importance {m.importance} · {m.memory_type}</small>
                  </div>
                  <button onClick={() => deleteMemory(m.id)}>
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
