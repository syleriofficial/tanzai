
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ChatArea from "../components/ChatArea";
import Composer from "../components/Composer";

export default function Home(){
 return(
  <div className="app">
   <Sidebar />
   <div className="main">
    <Topbar />
    <ChatArea />
    <Composer />
   </div>
  </div>
 )
}
