import "./globals.css";

export const metadata = {
  title: "Ultra Chat",
  description: "Chat App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
