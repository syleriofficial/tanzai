
export default function Composer(){
 return(
  <div style={{
   borderTop:"1px solid rgba(255,255,255,.08)",
   padding:"22px"
  }}>
   <div style={{
    display:"flex",
    gap:"14px",
    padding:"14px",
    borderRadius:"30px",
    background:"rgba(255,255,255,.05)",
    border:"1px solid rgba(255,255,255,.08)"
   }}>
    <button style={icon}>+</button>
    <button style={icon}>🎤</button>

    <input
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

    <button style={{
     padding:"16px 28px",
     border:"none",
     borderRadius:"18px",
     background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",
     color:"white",
     fontWeight:"bold"
    }}>
     Send
    </button>
   </div>
  </div>
 )
}

const icon={
 width:"54px",
 height:"54px",
 borderRadius:"18px",
 border:"1px solid rgba(255,255,255,.08)",
 background:"rgba(255,255,255,.05)",
 color:"white"
}
