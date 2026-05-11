
export default function Topbar(){
 return(
  <div style={{
   height:"82px",
   borderBottom:"1px solid rgba(255,255,255,.08)",
   display:"flex",
   justifyContent:"space-between",
   alignItems:"center",
   padding:"0 28px"
  }}>
   <div style={{display:"flex",gap:"12px"}}>
    <div style={pill}>⚡ Syleri Engine Active</div>
    <div style={pill}>🧠 Think Mode</div>
   </div>

   <div style={{
    width:"42px",
    height:"42px",
    borderRadius:"999px",
    display:"grid",
    placeItems:"center",
    background:"linear-gradient(90deg,#06b6d4,#8b5cf6)"
   }}>
    S
   </div>
  </div>
 )
}

const pill={
 padding:"11px 18px",
 borderRadius:"999px",
 background:"rgba(255,255,255,.05)",
 border:"1px solid rgba(255,255,255,.08)"
}
