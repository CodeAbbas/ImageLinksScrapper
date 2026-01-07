import "./globals.css";

export const metadata = {
  title: "Link Extractor Pro",
  description: "Smart scraper for products",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-slate-50 min-h-screen text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}