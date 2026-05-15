import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import Login from "./Login";
import { supabase } from "./supabaseClient";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#030712",
        color: "white",
        padding: 40,
      }}
    >
      <h1>Tanzai AI</h1>

      <p>
        Logged in as:
        <br />
        {user.email}
      </p>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          location.reload();
        }}
      >
        Logout
      </button>
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
