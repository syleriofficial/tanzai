"use client";

import { useState } from "react";

const starterChats = [
  "Startup Strategy",
  "Research Mode",
  "Global Workspace",
  "Syleri API"
];

export default function Home(){
  const [messages,setMessages] = useState([
    {role:"ai", text:"Welcome to Tanzai AI Global Workspace 🚀\nPowered by Syleri Engine."}
  ]);
  const [input,setInput] = useState("");
  const [activeChat,setActiveChat] = useState("New Chat");
  const [settingsOpen,setSettingsOpen] = useState(false);
  const [notice,setNotice] = useState("");

  function showNotice(text){
    setNotice(text);
    setTimeout(()=>setNotice(""),1800);
  }

  function newChat(){
    setActiveChat("New Chat");
    setMessages([{role:"ai", text:"New chat started. Ask Tanzai AI anything."}]);
    showNotice("New chat created");
  }

  function openChat(title){
    setActiveChat(title);
    setMessages([
      {role:"ai", text:`${title} opened. I am Tanzai AI powered by Syleri Engine.`}
    ]);
  }

  function send(){
    const text = input.trim();
    if(!text) return;

    setMessages(prev => [
      ...prev,
      {role:"user", text},
      {role:"ai", text:`Syleri Engine response for: "${text}"\n\nThis is a clickable UI demo. Real AI API can be connected next.`}
    ]);
    setInput("");
  }

  function copyText(text){
    navigator.clipboard?.writeText(text);
    showNotice("Copied");
  }

  function regenerate(){
    setMessages(prev => [
      ...prev,
      {role:"ai", text:"Regenerated response from Syleri Engine simulation."}
    ]);
  }

  return(
    <div className="app">
      <aside className="sidebar">
        <div>
          <h1 style={{fontSize:"52px",margin:0,lineHeight:1}}>Tanzai AI</h1>
          <p style={{color:"#94a3b8"}}>Powered by Syleri Engine</p>
        </div>

        <button onClick={newChat} style={primaryBtn}>+ New Chat</button>

        <div style={{marginTop:"28px",display:"flex",flexDirection:"column",gap:"12px"}}>
          {starterChats.map(item=>(
            <button key={item} onClick={()=>openChat(item)} style={chatItem}>
              {item}
            </button>
          ))}
        </div>

        <div style={{
          marginTop:"auto",
          borderRadius:"24px",
          padding:"18px",
          background:"rgba(255,255,255,.05)",
          border:"1px solid rgba(255,255,255,.08)",
          color:"#cbd5e1",
          lineHeight:1.8
        }}>
          Company: Syleri<br/>
          Engine: Syleri Engine<br/>
          Product: Tanzai AI<br/>
          Platform: Syleri API
        </div>
      </aside>

      <main className="main">
        <header style={{
          minHeight:"82px",
          borderBottom:"1px solid rgba(255,255,255,.08)",
          display:"flex",
          justifyContent:"space-between",
          alignItems:"center",
          padding:"0 28px"
        }}>
          <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
            <button onClick={()=>showNotice("Engine is active")} style={pill}>⚡ Syleri Engine Active</button>
            <button onClick={()=>showNotice("Think Mode enabled")} style={pill}>🧠 Think Mode</button>
            <button onClick={()=>showNotice("Global Workspace selected")} style={pill}>🌍 Global Workspace</button>
          </div>

          <div style={{display:"flex",gap:"12px",alignItems:"center"}}>
            <button onClick={()=>setSettingsOpen(true)} style={pill}>Settings</button>
            <button onClick={()=>showNotice("Profile menu")} style={avatar}>S</button>
          </div>
        </header>

        <section className="chat">
          <div style={{color:"#94a3b8",fontSize:"14px"}}>
            Current: {activeChat}
          </div>

          {messages.map((m,i)=>(
            <div key={i} style={{
              alignSelf:m.role==="user"?"flex-end":"flex-start",
              maxWidth:m.role==="user"?"720px":"900px",
              padding:"22px",
              borderRadius:"28px",
              lineHeight:1.8,
              whiteSpace:"pre-wrap",
              background:m.role==="user"?"linear-gradient(90deg,#06b6d4,#8b5cf6)":"rgba(255,255,255,.055)",
              border:m.role==="user"?"none":"1px solid rgba(255,255,255,.08)"
            }}>
              {m.role==="ai" && (
                <div style={{display:"flex",gap:"12px",alignItems:"center",marginBottom:"12px"}}>
                  <div style={aiLogo}>T</div>
                  <div>
                    <strong>Tanzai AI</strong>
                    <div style={{color:"#94a3b8",fontSize:"13px"}}>Powered by Syleri Engine</div>
                  </div>
                </div>
              )}

              <div>{m.text}</div>

              {m.role==="ai" && (
                <div style={{marginTop:"16px",display:"flex",gap:"10px"}}>
                  <button onClick={()=>copyText(m.text)} style={smallBtn}>Copy</button>
                  <button onClick={regenerate} style={smallBtn}>Regenerate</button>
                </div>
              )}
            </div>
          ))}
        </section>

        <div style={{
          borderTop:"1px solid rgba(255,255,255,.08)",
          padding:"22px"
        }}>
          <div style={{
            display:"flex",
            gap:"14px",
            alignItems:"center",
            padding:"14px",
            borderRadius:"30px",
            background:"rgba(255,255,255,.05)",
            border:"1px solid rgba(255,255,255,.08)"
          }}>
            <button onClick={()=>showNotice("Attach file coming soon")} style={icon}>+</button>
            <button onClick={()=>showNotice("Voice mode coming soon")} style={icon}>🎤</button>
            <button onClick={()=>showNotice("Image upload coming soon")} style={icon}>🖼️</button>

            <input
              value={input}
              onChange={(e)=>setInput(e.target.value)}
              onKeyDown={(e)=>{if(e.key==="Enter") send()}}
              placeholder="Message Tanzai AI..."
              style={{
                flex:1,
                background:"transparent",
                border:"none",
                outline:"none",
                color:"white",
                fontSize:"17px"
              }}
            />

            <button onClick={send} style={sendBtn}>Send</button>
          </div>
        </div>
      </main>

      {settingsOpen && (
        <div style={{
          position:"fixed",
          inset:0,
          background:"rgba(0,0,0,.55)",
          display:"grid",
          placeItems:"center",
          zIndex:10
        }}>
          <div style={{
            width:"min(520px,92vw)",
            background:"#081225",
            border:"1px solid rgba(255,255,255,.12)",
            borderRadius:"28px",
            padding:"26px"
          }}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <h2 style={{margin:0}}>Settings</h2>
              <button onClick={()=>setSettingsOpen(false)} style={smallBtn}>Close</button>
            </div>

            <div style={{marginTop:"20px",display:"grid",gap:"14px"}}>
              <button onClick={()=>showNotice("Dark mode active")} style={setting}>Theme: Dark Premium</button>
              <button onClick={()=>showNotice("Memory ready")} style={setting}>Memory: Ready</button>
              <button onClick={()=>showNotice("Syleri API soon")} style={setting}>Syleri API: Coming Soon</button>
            </div>
          </div>
        </div>
      )}

      {notice && (
        <div style={{
          position:"fixed",
          bottom:"22px",
          right:"22px",
          background:"#111827",
          border:"1px solid rgba(255,255,255,.12)",
          padding:"14px 18px",
          borderRadius:"18px",
          zIndex:20
        }}>
          {notice}
        </div>
      )}
    </div>
  )
}

const primaryBtn={
  marginTop:"20px",
  padding:"16px",
  borderRadius:"20px",
  border:"none",
  background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",
  color:"white",
  fontWeight:"bold"
};

const chatItem={
  padding:"15px",
  borderRadius:"18px",
  background:"rgba(255,255,255,.055)",
  border:"1px solid rgba(255,255,255,.08)",
  color:"white",
  textAlign:"left"
};

const pill={
  padding:"11px 18px",
  borderRadius:"999px",
  border:"1px solid rgba(255,255,255,.08)",
  background:"rgba(255,255,255,.055)",
  color:"white"
};

const avatar={
  width:"44px",
  height:"44px",
  borderRadius:"999px",
  border:"none",
  display:"grid",
  placeItems:"center",
  background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",
  color:"white",
  fontWeight:"bold"
};

const aiLogo={
  width:"44px",
  height:"44px",
  borderRadius:"14px",
  display:"grid",
  placeItems:"center",
  background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",
  fontWeight:"bold"
};

const smallBtn={
  padding:"9px 14px",
  borderRadius:"12px",
  border:"1px solid rgba(255,255,255,.08)",
  background:"rgba(255,255,255,.055)",
  color:"white"
};

const icon={
  width:"54px",
  height:"54px",
  borderRadius:"18px",
  border:"1px solid rgba(255,255,255,.08)",
  background:"rgba(255,255,255,.055)",
  color:"white"
};

const sendBtn={
  padding:"16px 30px",
  borderRadius:"20px",
  border:"none",
  background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",
  color:"white",
  fontWeight:"bold"
};

const setting={
  padding:"15px",
  borderRadius:"16px",
  background:"rgba(255,255,255,.055)",
  border:"1px solid rgba(255,255,255,.08)",
  color:"white",
  textAlign:"left"
};
