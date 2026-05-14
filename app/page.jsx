"use client";

import { useState } from "react";

const starterChats = ["Startup Strategy","Research Mode","Global Workspace","Syleri API"];

export default function Home(){
  const [messages,setMessages]=useState([{role:"ai",text:"Welcome to Tanzai AI Global Workspace 🚀\nPowered by Syleri Engine."}]);
  const [input,setInput]=useState("");
  const [loading,setLoading]=useState(false);
  const [notice,setNotice]=useState("");

  function showNotice(t){setNotice(t);setTimeout(()=>setNotice(""),1800)}
  function newChat(){setMessages([{role:"ai",text:"New chat started. Ask Tanzai AI anything."}]);showNotice("New chat created")}

  async function send(){
    const text=input.trim();
    if(!text||loading)return;
    const next=[...messages,{role:"user",text}];
    setMessages(next);
    setInput("");
    setLoading(true);

    try{
      const res=await fetch("/api/chat",{
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          messages:next.map(m=>({role:m.role==="ai"?"assistant":"user",content:m.text}))
        })
      });
      const data=await res.json();
      setMessages([...next,{role:"ai",text:data.reply||"No response from Syleri Engine."}]);
    }catch(e){
      setMessages([...next,{role:"ai",text:"Connection error with Syleri Engine."}]);
    }finally{
      setLoading(false);
    }
  }

  function copyText(t){navigator.clipboard?.writeText(t);showNotice("Copied")}

  return <div className="app">
    <aside className="sidebar">
      <div>
        <h1 style={{fontSize:"52px",margin:0,lineHeight:1}}>Tanzai AI</h1>
        <p style={{color:"#94a3b8"}}>Powered by Syleri Engine</p>
      </div>

      <button onClick={newChat} style={primaryBtn}>+ New Chat</button>

      <div style={{marginTop:"28px",display:"flex",flexDirection:"column",gap:"12px"}}>
        {starterChats.map(item=><button key={item} onClick={()=>setInput(item)} style={chatItem}>{item}</button>)}
      </div>

      <div style={{marginTop:"auto",borderRadius:"24px",padding:"18px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)",color:"#cbd5e1",lineHeight:1.8}}>
        Company: Syleri<br/>Engine: Syleri Engine<br/>Product: Tanzai AI<br/>Platform: Syleri API
      </div>
    </aside>

    <main className="main">
      <header style={{minHeight:"82px",borderBottom:"1px solid rgba(255,255,255,.08)",display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 28px"}}>
        <div style={{display:"flex",gap:"12px",flexWrap:"wrap"}}>
          <button onClick={()=>showNotice("Connected to engine.syleri.com")} style={pill}>⚡ Syleri Engine Active</button>
          <button onClick={()=>showNotice("Think Mode ready")} style={pill}>🧠 Think Mode</button>
          <button onClick={()=>showNotice("Global Workspace")} style={pill}>🌍 Global Workspace</button>
        </div>
        <button onClick={()=>showNotice("Profile")} style={avatar}>S</button>
      </header>

      <section className="chat">
        {messages.map((m,i)=><div key={i} style={{
          alignSelf:m.role==="user"?"flex-end":"flex-start",
          maxWidth:m.role==="user"?"720px":"900px",
          padding:"22px",
          borderRadius:"28px",
          lineHeight:1.8,
          whiteSpace:"pre-wrap",
          background:m.role==="user"?"linear-gradient(90deg,#06b6d4,#8b5cf6)":"rgba(255,255,255,.055)",
          border:m.role==="user"?"none":"1px solid rgba(255,255,255,.08)"
        }}>
          {m.role==="ai"&&<div style={{display:"flex",gap:"12px",alignItems:"center",marginBottom:"12px"}}>
            <div style={aiLogo}>T</div>
            <div><strong>Tanzai AI</strong><div style={{color:"#94a3b8",fontSize:"13px"}}>Powered by Syleri Engine</div></div>
          </div>}
          <div>{m.text}</div>
          {m.role==="ai"&&<div style={{marginTop:"16px"}}><button onClick={()=>copyText(m.text)} style={smallBtn}>Copy</button></div>}
        </div>)}

        {loading&&<div style={{width:"280px",padding:"18px",borderRadius:"22px",background:"rgba(255,255,255,.055)",border:"1px solid rgba(255,255,255,.08)"}}>Syleri Engine is thinking...</div>}
      </section>

      <div style={{borderTop:"1px solid rgba(255,255,255,.08)",padding:"22px"}}>
        <div style={{display:"flex",gap:"14px",alignItems:"center",padding:"14px",borderRadius:"30px",background:"rgba(255,255,255,.05)",border:"1px solid rgba(255,255,255,.08)"}}>
          <button onClick={()=>showNotice("Attach file coming soon")} style={icon}>+</button>
          <button onClick={()=>showNotice("Voice mode coming soon")} style={icon}>🎤</button>
          <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>{if(e.key==="Enter")send()}} placeholder="Message Tanzai AI..." style={{flex:1,background:"transparent",border:"none",outline:"none",color:"white",fontSize:"17px"}}/>
          <button onClick={send} style={sendBtn}>Send</button>
        </div>
      </div>
    </main>

    {notice&&<div style={{position:"fixed",bottom:"22px",right:"22px",background:"#111827",border:"1px solid rgba(255,255,255,.12)",padding:"14px 18px",borderRadius:"18px",zIndex:20}}>{notice}</div>}
  </div>
}

const primaryBtn={marginTop:"20px",padding:"16px",borderRadius:"20px",border:"none",background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",color:"white",fontWeight:"bold"};
const chatItem={padding:"15px",borderRadius:"18px",background:"rgba(255,255,255,.055)",border:"1px solid rgba(255,255,255,.08)",color:"white",textAlign:"left"};
const pill={padding:"11px 18px",borderRadius:"999px",border:"1px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.055)",color:"white"};
const avatar={width:"44px",height:"44px",borderRadius:"999px",border:"none",display:"grid",placeItems:"center",background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",color:"white",fontWeight:"bold"};
const aiLogo={width:"44px",height:"44px",borderRadius:"14px",display:"grid",placeItems:"center",background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",fontWeight:"bold"};
const smallBtn={padding:"9px 14px",borderRadius:"12px",border:"1px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.055)",color:"white"};
const icon={width:"54px",height:"54px",borderRadius:"18px",border:"1px solid rgba(255,255,255,.08)",background:"rgba(255,255,255,.055)",color:"white"};
const sendBtn={padding:"16px 30px",borderRadius:"20px",border:"none",background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",color:"white",fontWeight:"bold"};
