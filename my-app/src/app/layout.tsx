import Loading from "@/components/Loading";
import "./globals.css";
import SessionProvider from "./SessionProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <SessionProvider><Loading/></SessionProvider>
      </body>
    </html>
  );
}
