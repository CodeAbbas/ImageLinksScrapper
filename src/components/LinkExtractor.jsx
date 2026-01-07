'use client';

import React, { useState, useMemo } from 'react';
import Header from './Header';
import UrlInputForm from './UrlInputForm';
import AboutSection from './AboutSection';
import ImageSelector from './ImageSelector';
import OutputPanel from './OutputPanel';
// Import the hook that contains your working proxy logic
import { useImageExtractor } from '../hooks/useImageExtractor'; 

export default function LinkExtractor() {
  const [urlInput, setUrlInput] = useState('');
  const [filterText, setFilterText] = useState('');
  const [useHighRes, setUseHighRes] = useState(true);

  // Use the hook state instead of manual transitions
  const { images, setImages, loading, error, extractImages } = useImageExtractor();

  const handleExtract = (e) => {
    e.preventDefault();
    if (!urlInput) return;

    const formattedUrl = urlInput.startsWith('http') ? urlInput : `https://${urlInput}`;
    extractImages(formattedUrl);
  };

  // Selection logic
  const toggleSelection = (id) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, selected: !img.selected } : img
    ));
  };

  const selectAll = (targetImages) => {
    const targetIds = new Set(targetImages.map(img => img.id));
    setImages(prev => prev.map(img => 
      targetIds.has(img.id) ? { ...img, selected: true } : img
    ));
  };

  const deselectAll = (targetImages) => {
    const targetIds = new Set(targetImages.map(img => img.id));
    setImages(prev => prev.map(img => 
      targetIds.has(img.id) ? { ...img, selected: false } : img
    ));
  };

  const formattedOutput = useMemo(() => {
    return images
      .filter(img => img.selected)
      .map(img => `"${useHighRes ? img.cleanUrl : img.originalUrl}"`)
      .join(',\n');
  }, [images, useHighRes]);

  const selectedCount = images.filter(i => i.selected).length;

  return (
    <div className="max-w-5xl mx-auto space-y-6 py-8 px-4">
      <Header />
      <UrlInputForm 
        url={urlInput} setUrl={setUrlInput} 
        loading={loading} error={error} onSubmit={handleExtract} 
      />
      {images.length === 0 && !loading && <AboutSection />}
      {images.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <ImageSelector 
            images={images} onToggle={toggleSelection}
            onSelectAll={selectAll} onDeselectAll={deselectAll}
            filterText={filterText} setFilterText={setFilterText}
            useHighRes={useHighRes} setUseHighRes={setUseHighRes}
          />
          <OutputPanel formattedOutput={formattedOutput} selectedCount={selectedCount} />
        </div>
      )}
    </div>
  );
}