import React from 'react';
import { ImageIcon } from 'lucide-react';

export default function Header() {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl shadow-lg">
          <ImageIcon className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Link Extractor <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Pro</span>
          </h1>
          <p className="text-sm text-slate-500">Smart scraper for products</p>
        </div>
      </div>
    </header>
  );
}