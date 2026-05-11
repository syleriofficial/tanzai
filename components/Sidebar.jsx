
export default function Sidebar(){
 return(
  <div style={{
   width:"300px",
   background:"rgba(255,255,255,.04)",
   borderRight:"1px solid rgba(255,255,255,.08)",
   padding:"22px",
   display:"flex",
   flexDirection:"column"
  }}>
   <h1 style={{fontSize:"52px",margin:0}}>Tanzai AI</h1>
   <p style={{color:"#94a3b8"}}>Powered by Syleri Engine</p>

   <button style={{
    marginTop:"20px",
    padding:"16px",
    borderRadius:"20px",
    border:"none",
    background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",
    color:"white",
    fontWeight:"bold"
   }}>
    + New Chat
   </button>

   <div style={{marginTop:"30px",display:"flex",flexDirection:"column",gap:"12px"}}>
    <div style={item}>Startup Strategy</div>
    <div style={item}>Research Mode</div>
    <div style={item}>Global Workspace</div>
   </div>
  </div>
 )
}

const item={
 padding:"15px",
 borderRadius:"18px",
 background:"rgba(255,255,255,.05)",
 border:"1px solid rgba(255,255,255,.08)"
}
