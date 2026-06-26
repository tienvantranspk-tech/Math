import type { Metadata, Viewport } from "next";
import { Nunito } from "next/font/google";
import "./globals.css";

const nunito = Nunito({ 
  subsets: ["latin", "vietnamese"],
  weight: ["400", "700", "900"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevent pinch-zoom on kids tablet
};

export const metadata: Metadata = {
  title: "Toán Vui KNTT",
  description: "Ứng dụng học toán vui nhộn cho học sinh lớp 2",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body className={nunito.className} suppressHydrationWarning>
        <main className="app-container">
          {children}
        </main>
      </body>
    </html>
  );
}
