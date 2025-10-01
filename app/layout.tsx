import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { Chivo } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/authContext";

const chivo = Chivo({
  subsets: ["latin"],
  variable: "--font-chivo",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${GeistSans.className} ${chivo.variable}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
