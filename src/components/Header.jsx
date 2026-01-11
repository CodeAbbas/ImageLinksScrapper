import React from 'react';
import Image from 'next/image';
import logo from '../app/LinkExtractor.webp'; 

export default function Header() {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-3">
        <div className="p-1 rounded-xl shadow-lg flex items-center justify-center overflow-hidden">
          <Image 
            src={logo} 
            alt="Link Extractor Logo" 
            width={48} 
            height={48} 
            className="object-contain"
          />
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