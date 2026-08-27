import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Providers from "./providers";
import Header from "@/components/Header";

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
          <body>
            <Providers>
              <Header />
              {children}
              <Toaster position="top-center"/>
            </Providers>  
          </body>
        </html>
  );
}
