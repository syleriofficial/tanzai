
export default function Sidebar(){

return(
<div style={{
 width:"300px",
 background:"rgba(8,18,37,.92)",
 borderRight:"1px solid rgba(255,255,255,.08)",
 padding:"22px",
 display:"flex",
 flexDirection:"column",
 gap:"18px"
}}>

 <div>
  <h1 style={{
   fontSize:"50px",
   lineHeight:1,
   margin:0,
   fontWeight:900
  }}>
   Tanzai AI
  </h1>

  <p style={{
   color:"#94a3b8"
  }}>
   Powered by Syleri Engine
  </p>
 </div>

 <button style={{
  padding:"16px",
  border:"none",
  borderRadius:"20px",
  background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",
  color:"white",
  fontWeight:"bold",
  cursor:"pointer"
 }}>
  + New Chat
 </button>

 <div style={{
  display:"flex",
  flexDirection:"column",
  gap:"12px"
 }}>
  <div style={item}>Startup ideas</div>
  <div style={item}>Research Mode</div>
  <div style={item}>Global AI</div>
  <div style={item}>Syleri API</div>
 </div>

 <div style={{
  marginTop:"auto",
  background:"rgba(255,255,255,.05)",
  border:"1px solid rgba(255,255,255,.08)",
  borderRadius:"24px",
  padding:"18px",
  lineHeight:1.8,
  color:"#cbd5e1"
 }}>
  Company: Syleri<br/>
  Engine: Syleri Engine<br/>
  Product: Tanzai AI
 </div>

</div>
)

}

const item = {
 background:"rgba(255,255,255,.05)",
 border:"1px solid rgba(255,255,255,.08)",
 padding:"14px",
 borderRadius:"18px"
};
