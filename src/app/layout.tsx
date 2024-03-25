import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Creator connect",
  description: "Ask questions to yout favourite creators",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <html lang="en">
          <body className={inter.className}>
            <Providers>
              {children}
              <Toaster position="top-center"/>
            </Providers>  
          </body>
        </html>
  );
}
