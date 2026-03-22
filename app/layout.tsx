import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Tumlinson Electric — Electrical & Low Voltage Contractor | Central Texas",
  description: "Full-service electrical and low-voltage contractor serving Central Texas. Division 26 Electrical and Division 27 Low Voltage / Structured Cabling.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="bg-te-dark text-white antialiased">
        {children}
      </body>
    </html>
  );
}
