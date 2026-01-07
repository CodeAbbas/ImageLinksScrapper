import React, { useMemo } from 'react';
import { Search, Check, Filter, CheckSquare, Square, Wand2 } from 'lucide-react';

export default function ImageSelector({ 
  images, 
  onToggle, 
  onSelectAll, 
  onDeselectAll, 
  filterText, 
  setFilterText, 
  useHighRes, 
  setUseHighRes 
}) {
  
  const filteredImages = useMemo(() => {
    if (!filterText) return images;
    const lowerFilter = filterText.toLowerCase();
    return images.filter(img => 
      (useHighRes ? img.cleanUrl : img.originalUrl).toLowerCase().includes(lowerFilter)
    );
  }, [images, filterText, useHighRes]);

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden flex flex-col h-[600px]">
      {/* Toolbar */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/80 backdrop-blur flex flex-col gap-3">
        <div className="flex items-center gap-2 w-full">
           <div className="relative flex-grow">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filter by name..." 
                className="w-full pl-9 pr-3 py-2 text-sm bg-white border border-slate-200 rounded-full focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-50 transition-all"
                value={filterText}
                onChange={e => setFilterText(e.target.value)}
              />
           </div>
           <div className="flex gap-1 bg-white p-1 rounded-full border border-slate-200">
             <button onClick={() => onSelectAll(filteredImages)} className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors" title="Select All">
                <CheckSquare className="w-4 h-4" />
             </button>
             <button onClick={() => onDeselectAll(filteredImages)} className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-full transition-colors" title="Deselect All">
                <Square className="w-4 h-4" />
             </button>
           </div>
        </div>
        
        <label className="flex items-center gap-2 text-xs font-medium text-slate-600 cursor-pointer select-none px-1">
          <input 
            type="checkbox" 
            checked={useHighRes} 
            onChange={e => setUseHighRes(e.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="flex items-center gap-1.5">
            <Wand2 className="w-3.5 h-3.5 text-purple-500" />
            Auto-fix High Res
          </span>
        </label>
      </div>

      {/* Grid */}
      <div className="flex-grow overflow-y-auto p-4 bg-slate-50/50">
        <div className="grid grid-cols-3 gap-3">
          {filteredImages.map((img) => (
            <div 
              key={img.id} 
              onClick={() => onToggle(img.id)}
              className={`group relative aspect-square rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                img.selected 
                  ? 'border-blue-500 shadow-lg transform scale-[1.02] ring-2 ring-blue-200 ring-offset-2' 
                  : 'border-white bg-white shadow-sm opacity-80 hover:opacity-100 hover:shadow-md'
              }`}
            >
              <img 
                src={useHighRes ? img.cleanUrl : img.originalUrl} 
                loading="lazy"
                alt="extracted"
                className="w-full h-full object-cover bg-slate-100"
                onError={(e) => {
                  if (useHighRes && e.target.src !== img.originalUrl) {
                     e.target.src = img.originalUrl;
                  } else {
                     e.target.style.opacity = '0.2';
                  }
                }}
              />
              <div className={`absolute top-2 right-2 p-1.5 rounded-full shadow-sm transition-all ${
                img.selected ? 'bg-blue-500 text-white scale-100' : 'bg-slate-100 text-slate-300 scale-90'
              }`}>
                <Check className="w-3 h-3" />
              </div>
            </div>
          ))}
          
          {filteredImages.length === 0 && (
            <div className="col-span-3 flex flex-col items-center justify-center py-12 text-slate-400 gap-2">
              <Filter className="w-8 h-8 opacity-20" />
              <p className="text-sm">No images match your filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}