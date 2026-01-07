import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function OutputPanel({ formattedOutput, selectedCount }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = () => {
    if (!formattedOutput) return;
    navigator.clipboard.writeText(formattedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-3xl shadow-xl border border-slate-800 overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-slate-200">Result</span>
          <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${selectedCount > 0 ? 'bg-blue-500/20 text-blue-300' : 'bg-slate-800 text-slate-500'}`}>
            {selectedCount} selected
          </span>
        </div>
        <button
          onClick={copyToClipboard}
          disabled={selectedCount === 0}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-bold transition-all shadow-lg ${
            copied 
              ? 'bg-green-500 text-white hover:bg-green-600' 
              : selectedCount === 0
                ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                : 'bg-white text-slate-900 hover:bg-slate-100 hover:scale-105'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy JSON'}
        </button>
      </div>
      
      <div className="flex-grow relative bg-slate-950">
        <textarea
          readOnly
          className="w-full h-full p-6 font-mono text-xs md:text-sm text-blue-300 bg-transparent resize-none outline-none border-none focus:ring-0 leading-relaxed"
          value={formattedOutput}
          placeholder="// Selected links will appear here..."
        />
      </div>
    </div>
  );
}