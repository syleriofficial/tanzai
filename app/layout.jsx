import "./globals.css";

export const metadata = {
  title: "Tanzai AI — Powered by Syleri Engine",
  description: "Global AI workspace by Syleri"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
