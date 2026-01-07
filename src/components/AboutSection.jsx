import React from 'react';
import { Check, Filter } from 'lucide-react';

export default function AboutSection() {
  return (
    <div className="grid md:grid-cols-2 gap-8 items-center mt-12 mb-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="space-y-6 px-2">
        <div className="lg:hidden inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-wider">
          About this Tool
        </div>
        <h2 className="text-3xl font-bold text-slate-800 leading-tight">
          Streamline Your <br/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">Product Workflow</span>
        </h2>
        <p className="text-slate-600 leading-relaxed text-lg">
          Extracting high-quality image links from supplier sites or reference pages shouldn't be a chore. 
          Our smart extractor filters out the noise, auto-fixes low-res thumbnails, and gives you a 
          clean JSON list ready for your database or spreadsheet.
        </p>
        <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3 text-slate-700">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600"><Check className="w-4 h-4" /></div>
              <span>Auto-detects high resolution images</span>
            </div>
            <div className="flex items-center gap-3 text-slate-700">
              <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center text-purple-600"><Filter className="w-4 h-4" /></div>
              <span>Filters out related products & icons</span>
            </div>
        </div>
      </div>
      
      <div className="relative group">
         <div className="absolute rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
         <div className="relative rounded-2xl overflow-hidden  border border-slate-100 bg-white">
            <img 
              src="https://woocommerce.com/wp-content/uploads/2019/04/single-page-checkout.gif" 
              alt="Workflow Demo" 
              className="w-full h-full pt-4 object-cover transform transition duration-500 hover:scale-[1.02]"
            />           
         </div>
      </div>
    </div>
  );
}