
import Sidebar from "../components/Sidebar";
import ChatBox from "../components/ChatBox";

export default function Home() {
  return (
    <main style={{
      display: "flex",
      minHeight: "100vh",
      background: "#020617",
      color: "white",
      fontFamily: "Arial"
    }}>
      <Sidebar />
      <ChatBox />
    </main>
  );
}
