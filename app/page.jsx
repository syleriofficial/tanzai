
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ChatArea from "../components/ChatArea";
import Composer from "../components/Composer";

export default function Home(){
  return(
    <div className="app">
      <Sidebar />

      <div style={{
        flex:1,
        display:"flex",
        flexDirection:"column"
      }}>
        <Topbar />
        <ChatArea />
        <Composer />
      </div>
    </div>
  )
}
