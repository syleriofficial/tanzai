
"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: "ai",
      text: "Namaste, I am Tanzai AI powered by Syleri Engine."
    }
  ]);

  const [input, setInput] = useState("");

  const sendMessage = () => {
    if (!input) return;

    const userMessage = {
      role: "user",
      text: input
    };

    const aiMessage = {
      role: "ai",
      text: "Syleri Engine is thinking..."
    };

    setMessages([...messages, userMessage, aiMessage]);
    setInput("");
  };

  return (
    <main style={{
      display:"flex",
      minHeight:"100vh",
      background:"#020617",
      color:"white",
      fontFamily:"Arial"
    }}>
      <Sidebar />

      <div style={{
        flex:1,
        display:"flex",
        flexDirection:"column",
        justifyContent:"space-between",
        padding:"24px"
      }}>

        <div style={{
          display:"flex",
          justifyContent:"space-between",
          marginBottom:"20px"
        }}>
          <div style={{
            background:"#0f172a",
            padding:"12px 20px",
            borderRadius:"999px"
          }}>
            Syleri Engine Active
          </div>

          <div style={{
            display:"flex",
            gap:"10px"
          }}>
            <div style={{
              background:"#0f172a",
              padding:"12px 18px",
              borderRadius:"999px"
            }}>
              Think Mode
            </div>

            <div style={{
              background:"#0f172a",
              padding:"12px 18px",
              borderRadius:"999px"
            }}>
              Syleri API
            </div>
          </div>
        </div>

        <div style={{
          flex:1,
          overflowY:"auto",
          display:"flex",
          flexDirection:"column",
          gap:"18px"
        }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                background: msg.role === "user"
                  ? "linear-gradient(90deg,#06b6d4,#8b5cf6)"
                  : "#1e293b",
                padding:"18px",
                borderRadius:"20px",
                maxWidth:"75%"
              }}
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div style={{
          display:"flex",
          gap:"12px",
          marginTop:"20px"
        }}>
          <input
            value={input}
            onChange={(e)=>setInput(e.target.value)}
            placeholder="Message Tanzai AI..."
            style={{
              flex:1,
              padding:"20px",
              borderRadius:"20px",
              border:"1px solid #334155",
              background:"#020617",
              color:"white",
              outline:"none"
            }}
          />

          <button
            onClick={sendMessage}
            style={{
              border:"none",
              padding:"20px 28px",
              borderRadius:"20px",
              background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",
              color:"white",
              fontWeight:"bold",
              cursor:"pointer"
            }}
          >
            Send
          </button>
        </div>
      </div>
    </main>
  );
}
