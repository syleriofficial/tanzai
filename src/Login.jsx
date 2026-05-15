import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function signUp() {
    setLoading(true);

    const { error } = await supabase.auth.signUp({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      alert("Signup successful");
    }
  }

  async function signIn() {
    setLoading(true);

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
    } else {
      onLogin(data.user);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#050816",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        color: "white",
      }}
    >
      <div
        style={{
          width: 380,
          background: "#0f172a",
          padding: 30,
          borderRadius: 24,
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        <h1
          style={{
            fontSize: 42,
            marginBottom: 10,
          }}
        >
          Tanzai AI
        </h1>

        <p
          style={{
            opacity: 0.7,
            marginBottom: 30,
          }}
        >
          Secure AI login powered by Syleri
        </p>

        <input
          placeholder="Email"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 15,
            borderRadius: 14,
            border: "none",
            background: "#020617",
            color: "white",
          }}
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          style={{
            width: "100%",
            padding: 14,
            marginBottom: 20,
            borderRadius: 14,
            border: "none",
            background: "#020617",
            color: "white",
          }}
        />

        <button
          onClick={signIn}
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 14,
            border: "none",
            background:
              "linear-gradient(90deg,#2563eb,#9333ea)",
            color: "white",
            fontWeight: "bold",
            marginBottom: 12,
            cursor: "pointer",
          }}
        >
          {loading ? "Loading..." : "Sign In"}
        </button>

        <button
          onClick={signUp}
          disabled={loading}
          style={{
            width: "100%",
            padding: 14,
            borderRadius: 14,
            border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent",
            color: "white",
            cursor: "pointer",
          }}
        >
          Create Account
        </button>
      </div>
    </div>
  );
}
