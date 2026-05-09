export const metadata = {
  title: "Tanzai AI",
  description: "AI by Syleri"
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}