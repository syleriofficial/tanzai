
import MessageBubble from "./MessageBubble";

export default function ChatArea(){

return(
<div style={{
 flex:1,
 overflowY:"auto",
 padding:"28px",
 display:"flex",
 flexDirection:"column",
 gap:"22px"
}}>

 <MessageBubble
  ai
  text="Welcome to Tanzai AI Ultra UI powered by Syleri Engine 🚀"
 />

 <MessageBubble
  user
  text="Design a global AI workspace with premium feel."
 />

 <div style={{
  width:"280px",
  background:"rgba(255,255,255,.05)",
  border:"1px solid rgba(255,255,255,.08)",
  padding:"18px",
  borderRadius:"22px"
 }}>
  Tanzai AI is thinking...
 </div>

</div>
)

}
