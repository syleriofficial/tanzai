
export default function Sidebar() {
  return (
    <div style={{
      width: "280px",
      background: "#081225",
      padding: "20px",
      borderRight: "1px solid #1e293b"
    }}>
      <h1 style={{fontSize:"42px"}}>Tanzai AI</h1>
      <p>Powered by Syleri Engine</p>

      <button style={{
        marginTop:"20px",
        width:"100%",
        padding:"14px",
        borderRadius:"14px",
        border:"none",
        background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",
        color:"white",
        fontSize:"18px",
        cursor:"pointer"
      }}>
        + New Chat
      </button>
    </div>
  );
}
