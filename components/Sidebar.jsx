
export default function Sidebar() {
  return (
    <div style={{
      width:"300px",
      background:"#081225",
      borderRight:"1px solid #1e293b",
      padding:"24px"
    }}>
      <h1 style={{
        fontSize:"56px",
        marginBottom:"0"
      }}>
        Tanzai AI
      </h1>

      <p style={{
        color:"#cbd5e1"
      }}>
        Powered by Syleri Engine
      </p>

      <button style={{
        width:"100%",
        marginTop:"20px",
        padding:"18px",
        border:"none",
        borderRadius:"20px",
        background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",
        color:"white",
        fontSize:"20px",
        cursor:"pointer"
      }}>
        + New Chat
      </button>

      <div style={{
        marginTop:"40px",
        display:"flex",
        flexDirection:"column",
        gap:"12px"
      }}>
        <div style={itemStyle}>What is Syleri Engine?</div>
        <div style={itemStyle}>Build startup idea</div>
        <div style={itemStyle}>Explain APIs simply</div>
      </div>
    </div>
  );
}

const itemStyle = {
  background:"#111827",
  padding:"16px",
  borderRadius:"16px",
  cursor:"pointer"
};
