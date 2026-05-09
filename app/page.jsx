import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="container">
        <h1 className="title">Tanzai AI</h1>
        <p className="subtitle">
          Built by Syleri • Next Generation AI Platform
        </p>

        <a className="button" href="#">
          START AI CHAT
        </a>
      </main>
      <Footer />
    </>
  );
}