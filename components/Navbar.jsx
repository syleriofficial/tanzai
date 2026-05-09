export default function Navbar() {
  return (
    <nav style={{
      display:"flex",
      justifyContent:"space-between",
      padding:"20px 40px",
      borderBottom:"1px solid #1e293b"
    }}>
      <h2 style={{fontSize:"28px",fontWeight:"bold"}}>Tanzai AI</h2>

      <div style={{display:"flex",gap:"20px"}}>
        <a href="#" style={{color:"white",textDecoration:"none"}}>Home</a>
        <a href="#" style={{color:"white",textDecoration:"none"}}>Pricing</a>
        <a href="#" style={{color:"white",textDecoration:"none"}}>About</a>
      </div>
    </nav>
  );
}