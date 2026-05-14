import React, { useEffect, useMemo, useState } from "react";
import ReactDOM from "react-dom/client";
import {
  Activity,
  BarChart3,
  Brain,
  Database,
  Download,
  KeyRound,
  LogOut,
  MessageSquare,
  RefreshCw,
  Server,
  Shield,
  Sparkles,
  ThumbsDown,
  ThumbsUp,
  Users
} from "lucide-react";
import { supabase, supabaseReady } from "./supabaseClient";
import "./style.css";

const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || "";
const ENGINE_URL = import.meta.env.VITE_SYLERI_ENGINE_URL || "https://engine.syleri.com";
const DATASET_URL = import.meta.env.VITE_DATASET_BUILDER_URL || "";
const DATASET_TOKEN = import.meta.env.VITE_DATASET_ADMIN_TOKEN || "";

function StatCard({ icon, label, value, note }) {
  return (
    <div className="statCard">
      <div className="statIcon">{icon}</div>
      <div>
        <p>{label}</p>
        <h2>{value}</h2>
        {note && <span>{note}</span>}
      </div>
    </div>
  );
}

function AuthScreen() {
  const [email, setEmail] = useState(ADMIN_EMAIL);
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState("");

  async function signIn(e) {
    e.preventDefault();
    setStatus("");

    if (!supabaseReady) {
      setStatus("Supabase env variables missing.");
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) setStatus(error.message);
  }

  return (
    <div className="authPage">
      <div className="authCard">
        <div className="logoBig">
          <Shield size={30} />
        </div>
        <h1>Syleri Admin</h1>
        <p>Secure dashboard for Tanzai AI metrics, feedback and dataset export.</p>

        <form onSubmit={signIn}>
          <label>Admin Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />

          <label>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

          <button>
            <KeyRound size={18} />
            Sign in
          </button>
        </form>

        {status && <div className="warning">{status}</div>}

        {!supabaseReady && (
          <div className="warning">
            Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.
          </div>
        )}
      </div>
    </div>
  );
}

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    profiles: 0,
    chats: 0,
    messages: 0,
    memories: 0,
    good: 0,
    bad: 0
  });
  const [recentMessages, setRecentMessages] = useState([]);
  const [recentFeedback, setRecentFeedback] = useState([]);
  const [engineHealth, setEngineHealth] = useState(null);
  const [datasetPreview, setDatasetPreview] = useState(null);
  const [error, setError] = useState("");

  const user = session?.user;

  const isAdmin = useMemo(() => {
    if (!ADMIN_EMAIL) return true;
    return user?.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase();
  }, [user]);

  useEffect(() => {
    async function init() {
      if (!supabaseReady) {
        setLoading(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      setSession(data.session);

      supabase.auth.onAuthStateChange((_event, nextSession) => {
        setSession(nextSession);
      });

      setLoading(false);
    }

    init();
  }, []);

  useEffect(() => {
    if (user && isAdmin) {
      refreshAll();
    }
  }, [user?.id, isAdmin]);

  async function countTable(table, filter) {
    let query = supabase.from(table).select("*", { count: "exact", head: true });

    if (filter) {
      query = query.eq(filter.column, filter.value);
    }

    const { count, error } = await query;
    if (error) return 0;
    return count || 0;
  }

  async function loadStats() {
    const [profiles, chats, messages, memories, good, bad] = await Promise.all([
      countTable("tanzai_profiles"),
      countTable("tanzai_chats"),
      countTable("tanzai_messages"),
      countTable("tanzai_memories"),
      countTable("tanzai_feedback", { column: "rating", value: "good" }),
      countTable("tanzai_feedback", { column: "rating", value: "bad" })
    ]);

    setStats({ profiles, chats, messages, memories, good, bad });
  }

  async function loadRecent() {
    const { data: messages } = await supabase
      .from("tanzai_messages")
      .select("id,role,content,created_at,user_id")
      .order("created_at", { ascending: false })
      .limit(8);

    const { data: feedback } = await supabase
      .from("tanzai_feedback")
      .select("id,rating,note,created_at,message_id,user_id")
      .order("created_at", { ascending: false })
      .limit(8);

    setRecentMessages(messages || []);
    setRecentFeedback(feedback || []);
  }

  async function checkEngine() {
    try {
      const res = await fetch(`${ENGINE_URL}/health`);
      const data = await res.json();
      setEngineHealth({
        ok: res.ok,
        data
      });
    } catch (e) {
      setEngineHealth({
        ok: false,
        data: { error: e.message }
      });
    }
  }

  async function loadDatasetPreview() {
    if (!DATASET_URL || !DATASET_TOKEN) {
      setDatasetPreview({
        count: 0,
        note: "Dataset builder URL/token not configured."
      });
      return;
    }

    try {
      const res = await fetch(`${DATASET_URL}/admin/dataset/preview?limit=20`, {
        headers: {
          Authorization: `Bearer ${DATASET_TOKEN}`
        }
      });
      const data = await res.json();
      setDatasetPreview(data);
    } catch (e) {
      setDatasetPreview({
        count: 0,
        error: e.message
      });
    }
  }

  async function refreshAll() {
    setError("");
    try {
      await Promise.all([
        loadStats(),
        loadRecent(),
        checkEngine(),
        loadDatasetPreview()
      ]);
    } catch (e) {
      setError(e.message);
    }
  }

  async function signOut() {
    await supabase.auth.signOut();
    setSession(null);
  }

  function downloadDataset() {
    if (!DATASET_URL || !DATASET_TOKEN) {
      alert("Dataset builder URL/token not configured.");
      return;
    }

    alert("Open this in browser with Authorization header using Postman/curl, because browser download cannot attach secret header safely.");
  }

  if (loading) return <div className="loading">Loading Syleri Admin...</div>;

  if (!session) return <AuthScreen />;

  if (!isAdmin) {
    return (
      <div className="authPage">
        <div className="authCard">
          <div className="logoBig">
            <Shield size={30} />
          </div>
          <h1>Access denied</h1>
          <p>This dashboard is only for the configured admin email.</p>
          <button onClick={signOut}>
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="logo">
            <Sparkles size={22} />
          </div>
          <div>
            <h1>Syleri Admin</h1>
            <p>Tanzai AI Control Center</p>
          </div>
        </div>

        <div className="navItem active">
          <BarChart3 size={18} />
          Overview
        </div>

        <div className="navItem">
          <Database size={18} />
          Dataset
        </div>

        <div className="navItem">
          <Server size={18} />
          Engine Health
        </div>

        <button className="logout" onClick={signOut}>
          <LogOut size={17} />
          Sign out
        </button>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <h2>Admin Dashboard</h2>
            <p>Users, chats, memory, feedback and dataset readiness.</p>
          </div>

          <button onClick={refreshAll}>
            <RefreshCw size={17} />
            Refresh
          </button>
        </header>

        {error && <div className="errorBox">{error}</div>}

        <section className="hero">
          <div className="pill">
            <Activity size={16} />
            System Overview
          </div>
          <h3>Syleri Engine is becoming data-ready.</h3>
          <p>
            Track Tanzai users, feedback, memories and dataset quality before future fine-tuning.
          </p>
        </section>

        <section className="grid statsGrid">
          <StatCard icon={<Users size={22} />} label="Users" value={stats.profiles} note="Supabase profiles" />
          <StatCard icon={<MessageSquare size={22} />} label="Chats" value={stats.chats} note="Cloud conversations" />
          <StatCard icon={<Database size={22} />} label="Messages" value={stats.messages} note="Training source" />
          <StatCard icon={<Brain size={22} />} label="Memories" value={stats.memories} note="Personalization" />
          <StatCard icon={<ThumbsUp size={22} />} label="Good Feedback" value={stats.good} note="Dataset candidates" />
          <StatCard icon={<ThumbsDown size={22} />} label="Bad Feedback" value={stats.bad} note="Improve answers" />
        </section>

        <section className="twoCol">
          <div className="panel">
            <div className="panelHead">
              <h3>Syleri Engine Health</h3>
              <Server size={20} />
            </div>
            <div className={engineHealth?.ok ? "health good" : "health bad"}>
              {engineHealth?.ok ? "ONLINE" : "CHECK"}
            </div>
            <pre>{JSON.stringify(engineHealth?.data || {}, null, 2)}</pre>
          </div>

          <div className="panel">
            <div className="panelHead">
              <h3>Dataset Builder</h3>
              <Download size={20} />
            </div>

            <div className="datasetCount">
              {datasetPreview?.count ?? 0}
              <span>ready examples</span>
            </div>

            <pre>{JSON.stringify(datasetPreview || {}, null, 2)}</pre>

            <button className="secondaryBtn" onClick={downloadDataset}>
              <Download size={17} />
              Export JSONL
            </button>
          </div>
        </section>

        <section className="twoCol">
          <div className="panel">
            <div className="panelHead">
              <h3>Recent Messages</h3>
              <MessageSquare size={20} />
            </div>

            <div className="list">
              {recentMessages.map((m) => (
                <div className="row" key={m.id}>
                  <strong>{m.role}</strong>
                  <p>{m.content}</p>
                  <span>{new Date(m.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panelHead">
              <h3>Recent Feedback</h3>
              <ThumbsUp size={20} />
            </div>

            <div className="list">
              {recentFeedback.map((f) => (
                <div className="row" key={f.id}>
                  <strong className={f.rating === "good" ? "greenText" : "redText"}>
                    {f.rating}
                  </strong>
                  <p>{f.note || "No note"}</p>
                  <span>{new Date(f.created_at).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
