
export default function MessageBubble({ ai, user, text }){

if(user){
 return(
  <div style={{
   alignSelf:"flex-end",
   maxWidth:"720px",
   background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",
   padding:"22px",
   borderRadius:"28px",
   lineHeight:1.7
  }}>
   {text}
  </div>
 )
}

return(
<div style={{
 maxWidth:"860px",
 background:"rgba(255,255,255,.05)",
 border:"1px solid rgba(255,255,255,.08)",
 padding:"24px",
 borderRadius:"28px",
 lineHeight:1.8
}}>

 <div style={{
  display:"flex",
  gap:"12px",
  alignItems:"center",
  marginBottom:"14px"
 }}>
  <div style={{
   width:"44px",
   height:"44px",
   borderRadius:"14px",
   display:"grid",
   placeItems:"center",
   background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",
   fontWeight:"bold"
  }}>
   T
  </div>

  <div>
   <div style={{fontWeight:"bold"}}>
    Tanzai AI
   </div>

   <div style={{
    color:"#94a3b8",
    fontSize:"14px"
   }}>
    Powered by Syleri Engine
   </div>
  </div>
 </div>

 <div>
  {text}
 </div>

 <div style={{
  marginTop:"16px",
  display:"flex",
  gap:"10px"
 }}>
  <button style={btn}>Copy</button>
  <button style={btn}>Regenerate</button>
 </div>

</div>
)

}

const btn = {
 border:"1px solid rgba(255,255,255,.08)",
 background:"rgba(255,255,255,.05)",
 color:"white",
 padding:"9px 14px",
 borderRadius:"12px"
};
