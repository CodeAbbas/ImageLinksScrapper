import { Inter } from 'next/font/google'; // Import the font
import "./globals.css";

// Configure the Inter font
const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter', // This must match your tailwind.config.js variable
});

export const metadata = {
  title: "Link Extractor Pro",
  description: "Smart scraper for products",
};

export default function RootLayout({ children }) {
  return (
    // Add the inter.variable class to the html or body tag
    <html lang="en" className={inter.variable} suppressHydrationWarning>
      <body className="bg-slate-50 min-h-screen text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}