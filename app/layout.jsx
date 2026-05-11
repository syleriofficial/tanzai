
import "./globals.css";

export const metadata = {
  title: "Tanzai AI"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
