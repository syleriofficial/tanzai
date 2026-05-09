import './globals.css';

export const metadata = {
  title: 'Tanzai AI | Global Intelligence',
  description: 'Tanzai AI by Syleri — fast, modern AI assistant for everyone.'
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
