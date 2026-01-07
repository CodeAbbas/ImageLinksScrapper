import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import UrlInputForm from './components/UrlInputForm';
import AboutSection from './components/AboutSection';
import ImageSelector from './components/ImageSelector';
import OutputPanel from './components/OutputPanel';
import { useImageExtractor } from './hooks/useImageExtractor';

export default function App() {
  const [urlInput, setUrlInput] = useState('');
  const [filterText, setFilterText] = useState('');
  const [useHighRes, setUseHighRes] = useState(true);
  
  // Custom hook usage
  const { images, setImages, loading, error, extractImages } = useImageExtractor();

  // --- Handlers ---
  const handleExtract = (e) => {
    e.preventDefault();
    extractImages(urlInput);
  };

  const toggleSelection = (id) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, selected: !img.selected } : img
    ));
  };

  const selectAll = (targetImages) => {
    setImages(prev => prev.map(img => 
      targetImages.includes(img) ? { ...img, selected: true } : img
    ));
  };

  const deselectAll = (targetImages) => {
    setImages(prev => prev.map(img => 
      targetImages.includes(img) ? { ...img, selected: false } : img
    ));
  };

  // --- Computed State ---
  const formattedOutput = useMemo(() => {
    return images
      .filter(img => img.selected)
      .map(img => `"${useHighRes ? img.cleanUrl : img.originalUrl}"`)
      .join(',\n');
  }, [images, useHighRes]);

  const selectedCount = images.filter(i => i.selected).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        
        <Header />
        
        <UrlInputForm 
          url={urlInput}
          setUrl={setUrlInput}
          loading={loading}
          error={error}
          onSubmit={handleExtract}
        />

        {images.length === 0 && !loading && (
          <AboutSection />
        )}

        {images.length > 0 && (
          <div className="grid lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <ImageSelector 
              images={images}
              onToggle={toggleSelection}
              onSelectAll={selectAll}
              onDeselectAll={deselectAll}
              filterText={filterText}
              setFilterText={setFilterText}
              useHighRes={useHighRes}
              setUseHighRes={setUseHighRes}
            />
            
            <OutputPanel 
              formattedOutput={formattedOutput}
              selectedCount={selectedCount}
            />
          </div>
        )}

      </div>
    </div>
  );
}