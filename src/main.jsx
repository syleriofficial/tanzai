import React, { useEffect, useMemo, useRef, useState } from "react";
import ReactDOM from "react-dom/client";
import { Sparkles, Send, Plus, Trash2, Copy, Brain, User, Menu, MessageSquare, LogOut, ThumbsUp, ThumbsDown, Save, Database, Mic, ImagePlus, Settings, Search, X } from "lucide-react";
import { supabase } from "./supabaseClient";
import "./style.css";

const ENGINE_URL = import.meta.env.VITE_SYLERI_ENGINE_URL || "https://engine.syleri.com";

function Login({ onLogin }) {
  const [mode, setMode] = useState("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    const action = mode === "signin"
      ? supabase.auth.signInWithPassword({ email, password })
      : supabase.auth.signUp({ email, password });

    const { data, error } = await action;
    setLoading(false);

    if (error) return setStatus(error.message);
    if (mode === "signup") {
      setStatus("Account created. Now sign in.");
      setMode("signin");
      return;
    }
    onLogin(data.user);
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="authLogo"><Sparkles size={28} /></div>
        <h1>Tanzai AI</h1>
        <p>Secure AI workspace powered by Syleri Engine.</p>
        <form onSubmit={submit}>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" />
          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="minimum 6 characters" />
          <button disabled={loading}>{loading ? "Loading..." : mode === "signin" ? "Sign in" : "Create account"}</button>
        </form>
        <button className="ghostBtn" onClick={() => setMode(mode === "signin" ? "signup" : "signin")}>
          {mode === "signin" ? "Need account? Sign up" : "Already have account? Sign in"}
        </button>
        {status && <div className="statusBox">{status}</div>}
      </div>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [memoryOpen, setMemoryOpen] = useState(false);
  const [input, setInput] = useState("");
  const [search, setSearch] = useState("");
  const [generating, setGenerating] = useState(false);
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  const [memories, setMemories] = useState([]);
  const [memoryText, setMemoryText] = useState("");
  const bottomRef = useRef(null);

  const activeChat = useMemo(() => chats.find((chat) => chat.id === activeChatId) || chats[0] || null, [chats, activeChatId]);
  const filteredChats = useMemo(() => chats.filter((chat) => chat.title.toLowerCase().includes(search.toLowerCase())), [chats, search]);

  useEffect(() => {
    async function init() {
      const { data } = await supabase.auth.getUser();
      setUser(data.user || null);
      setBooting(false);
    }
    init();
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user || null));
    return () => listener.subscription.unsubscribe();
  }, []);

  useEffect(() => { if (user) loadData(); }, [user?.id]);
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [activeChat?.messages, generating]);

  async function loadData() {
    await ensureProfile();
    const { data: chatRows, error: chatError } = await supabase.from("chats").select("*").eq("user_id", user.id).order("created_at", { ascending: false });
    if (chatError) return alert(chatError.message);
    if (!chatRows || chatRows.length === 0) return await createNewChat();

    const chatIds = chatRows.map((c) => c.id);
    const { data: messageRows } = await supabase.from("messages").select("*").in("chat_id", chatIds).order("created_at", { ascending: true });

    const mapped = chatRows.map((chat) => ({
      ...chat,
      messages: (messageRows || []).filter((m) => m.chat_id === chat.id).map((m) => ({ id: m.id, role: m.role, content: m.content }))
    }));
    setChats(mapped);
    setActiveChatId(mapped[0]?.id);
    setMemories(JSON.parse(localStorage.getItem(`tanzai_memories_${user.id}`) || "[]"));
  }

  async function ensureProfile() {
    await supabase.from("profiles").upsert({ id: user.id, email: user.email, full_name: user.email?.split("@")[0] || "User" });
  }

  async function createNewChat() {
    if (!user) return;
    const { data: chat, error } = await supabase.from("chats").insert({ user_id: user.id, title: "New Chat" }).select().single();
    if (error) return alert(error.message);

    const welcomeText = "Namaste, main Tanzai AI hoon. Aap mujhse kisi bhi language me baat kar sakte ho.";
    const { data: welcome } = await supabase.from("messages").insert({ chat_id: chat.id, role: "assistant", content: welcomeText }).select().single();
    const newChat = { ...chat, messages: [{ id: welcome.id, role: "assistant", content: welcomeText }] };
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
  }

  async function deleteChat(id) {
    await supabase.from("chats").delete().eq("id", id);
    const next = chats.filter((chat) => chat.id !== id);
    setChats(next);
    if (next.length === 0) await createNewChat();
    else if (id === activeChatId) setActiveChatId(next[0].id);
  }

  async function saveMessage(chatId, role, content) {
    const { data, error } = await supabase.from("messages").insert({ chat_id: chatId, role, content }).select().single();
    if (error) throw error;
    return data;
  }

  function buildPrompt(text) {
    const memoryBlock = memories.map((m) => `- ${m.text}`).join("\\n");
    return `User message: ${text}\n\nSaved Tanzai Memory:\n${memoryBlock || "- No saved memory yet."}\n\nReply in the user's language. Understand cultural context, mixed language, local meaning, and answer naturally.`;
  }

  async function sendMessage() {
    const text = input.trim();
    if (!text || generating || !activeChat) return;
    setInput("");
    setGenerating(true);

    const tempUser = { id: "temp-user-" + Date.now(), role: "user", content: text };
    const tempBot = { id: "temp-bot-" + Date.now(), role: "assistant", content: "Tanzai thinking..." };

    setChats((prev) => prev.map((chat) => chat.id === activeChat.id ? { ...chat, title: chat.title === "New Chat" ? text.slice(0, 40) : chat.title, messages: [...chat.messages, tempUser, tempBot] } : chat));

    try {
      await saveMessage(activeChat.id, "user", text);
      if (activeChat.title === "New Chat") await supabase.from("chats").update({ title: text.slice(0, 40) }).eq("id", activeChat.id);

      const res = await fetch(`${ENGINE_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: buildPrompt(text) })
      });
      const data = await res.json();
      const reply = data.reply || "Tanzai AI reply unavailable.";
      const savedBot = await saveMessage(activeChat.id, "assistant", reply);

      setChats((prev) => prev.map((chat) => chat.id === activeChat.id ? { ...chat, title: chat.title === "New Chat" ? text.slice(0, 40) : chat.title, messages: chat.messages.map((m) => m.id === tempBot.id ? { id: savedBot.id, role: "assistant", content: reply } : m) } : chat));
    } catch (error) {
      setChats((prev) => prev.map((chat) => chat.id === activeChat.id ? { ...chat, messages: chat.messages.map((m) => m.id === tempBot.id ? { ...m, content: "Syleri Engine or Supabase error: " + error.message } : m) } : chat));
    }
    setGenerating(false);
  }

  function saveMemory() {
    const text = memoryText.trim();
    if (!text || !user) return;
    const next = [{ id: Date.now(), text, createdAt: new Date().toLocaleString() }, ...memories];
    setMemories(next);
    localStorage.setItem(`tanzai_memories_${user.id}`, JSON.stringify(next));
    setMemoryText("");
  }

  function deleteMemory(id) {
    const next = memories.filter((m) => m.id !== id);
    setMemories(next);
    localStorage.setItem(`tanzai_memories_${user.id}`, JSON.stringify(next));
  }

  function copyText(text) { navigator.clipboard.writeText(text); }
  function feedback(type) { alert(type === "good" ? "Thanks! Marked helpful." : "Thanks! We will improve this."); }
  async function logout() { await supabase.auth.signOut(); setUser(null); }

  if (booting) return <div className="loading">Loading Tanzai AI...</div>;
  if (!user) return <Login onLogin={setUser} />;

  return (
    <div className="app">
      <aside className={`sidebar ${sidebarOpen ? "open" : "closed"}`}>
        <div className="brand"><div className="logo"><Sparkles size={22} /></div><div><h1>Tanzai AI</h1><p>Powered by Syleri Engine</p></div></div>
        <button className="primaryBtn" onClick={createNewChat}><Plus size={18} />New Chat</button>
        <button className="memoryBtn" onClick={() => setMemoryOpen(true)}><Brain size={18} />Memory</button>
        <div className="searchBox"><Search size={15} /><input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search chats..." /></div>
        <div className="smallTitle">Recent Chats</div>
        <div className="chatList">
          {filteredChats.map((chat) => (
            <div key={chat.id} className={`chatItem ${chat.id === activeChat?.id ? "active" : ""}`}>
              <button onClick={() => setActiveChatId(chat.id)}><MessageSquare size={15} /><span>{chat.title}</span></button>
              <button className="danger" onClick={() => deleteChat(chat.id)}><Trash2 size={14} /></button>
            </div>
          ))}
        </div>
        <div className="accountBox"><User size={16} /><span>{user.email}</span></div>
        <button className="logoutBtn" onClick={logout}><LogOut size={16} />Logout</button>
      </aside>

      <main className="main">
        <header className="topbar">
          <button className="iconBtn" onClick={() => setSidebarOpen(!sidebarOpen)}><Menu size={22} /></button>
          <div><h2>Tanzai AI</h2><p>World-native AI with cloud history, memory and Syleri Engine.</p></div>
          <button className="profileBtn" onClick={() => setMemoryOpen(true)}><Settings size={18} /></button>
        </header>

        <section className="hero">
          <div className="pill"><Database size={16} />Cloud History Active</div>
          <h3>Ask anything. Remember everything.</h3>
          <p>Tanzai AI understands language, culture, goals and context. Your chats are saved in Supabase and answers come from Syleri Engine.</p>
        </section>

        <section className="messages">
          {activeChat?.messages?.map((msg) => (
            <div key={msg.id} className={`messageRow ${msg.role === "assistant" ? "bot" : "user"}`}>
              <div className="avatar">{msg.role === "assistant" ? <Sparkles size={16} /> : <User size={16} />}</div>
              <div className="bubble">
                <p>{msg.content}</p>
                {msg.role === "assistant" && (
                  <div className="messageActions">
                    <button className="copyBtn" onClick={() => copyText(msg.content)}><Copy size={14} />Copy</button>
                    <button className="copyBtn" onClick={() => feedback("good")}><ThumbsUp size={14} />Good</button>
                    <button className="copyBtn" onClick={() => feedback("bad")}><ThumbsDown size={14} />Bad</button>
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={bottomRef}></div>
        </section>

        <footer className="composer">
          <button className="toolBtn"><Mic size={20} /></button>
          <button className="toolBtn"><ImagePlus size={20} /></button>
          <input value={input} disabled={generating} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }} placeholder={generating ? "Tanzai is thinking..." : "Ask Tanzai AI..."} />
          <button className="sendBtn" onClick={sendMessage} disabled={generating}><Send size={18} />Send</button>
        </footer>
      </main>

      {memoryOpen && (
        <div className="modalOverlay">
          <div className="memoryModal">
            <div className="modalHead"><div><h2>Tanzai Memory</h2><p>Save important user preferences, goals and project details.</p></div><button className="iconBtn" onClick={() => setMemoryOpen(false)}><X size={20} /></button></div>
            <div className="addNote"><textarea value={memoryText} onChange={(e) => setMemoryText(e.target.value)} placeholder="Example: User prefers Hindi/Hinglish replies. User is building Tanzai AI and Syleri Engine." /><button onClick={saveMemory}><Save size={16} />Save</button></div>
            <div className="notes">{memories.map((m) => <div className="note" key={m.id}><div><p>{m.text}</p><small>{m.createdAt}</small></div><button onClick={() => deleteMemory(m.id)}><Trash2 size={14} /></button></div>)}</div>
          </div>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
