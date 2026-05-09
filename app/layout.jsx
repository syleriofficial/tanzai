
export const metadata = {
  title: "Tanzai AI",
  description: "Powered by Syleri Engine"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{margin:0}}>
        {children}
      </body>
    </html>
  );
}
