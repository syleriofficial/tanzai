
export default function ChatBox() {
  return (
    <div style={{
      flex:1,
      display:"flex",
      flexDirection:"column",
      justifyContent:"space-between",
      padding:"30px"
    }}>
      <div>
        <div style={{
          background:"#111827",
          padding:"20px",
          borderRadius:"20px",
          marginBottom:"20px"
        }}>
          Namaste, I am Tanzai AI powered by Syleri Engine.
        </div>

        <div style={{
          background:"#1e293b",
          padding:"20px",
          borderRadius:"20px"
        }}>
          Hello! Ask me anything 🚀
        </div>
      </div>

      <div style={{
        display:"flex",
        gap:"10px",
        marginTop:"20px"
      }}>
        <input
          placeholder="Message Tanzai AI..."
          style={{
            flex:1,
            padding:"18px",
            borderRadius:"20px",
            border:"1px solid #334155",
            background:"#020617",
            color:"white"
          }}
        />
        <button style={{
          padding:"18px 26px",
          borderRadius:"18px",
          border:"none",
          background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",
          color:"white",
          cursor:"pointer"
        }}>
          Send
        </button>
      </div>
    </div>
  );
}
