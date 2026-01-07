'use client';

import React, { useState, useMemo } from 'react';
import Header from './Header';
import UrlInputForm from './UrlInputForm';
import AboutSection from './AboutSection';
import ImageSelector from './ImageSelector';
import OutputPanel from './OutputPanel';
import { useImageExtractor } from '../hooks/useImageExtractor';

export default function LinkExtractor() {
  // --- State Management ---
  const [urlInput, setUrlInput] = useState('');
  const [filterText, setFilterText] = useState('');
  const [useHighRes, setUseHighRes] = useState(true);

  /**
   * UPGRADE: Using the proxy-based hook instead of Server Actions.
   * This bypasses CORS and server-side blocks encountered in cloud environments.
   */
  const { images, setImages, loading, error, extractImages } = useImageExtractor();

  // --- Handlers ---
  const handleExtract = (e) => {
    e.preventDefault();
    if (!urlInput) return;

    /**
     * IMPROVEMENT: URL Hardening.
     * Ensures the scraper receives an absolute URL, preventing "Failed to parse URL" errors.
     */
    const formattedUrl = urlInput.startsWith('http') ? urlInput : `https://${urlInput}`;
    
    extractImages(formattedUrl);
  };

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

  /**
   * UPGRADE: Invert Selection.
   * A "Pro" feature for power users to quickly toggle between sets of images.
   */
  const invertSelection = (targetImages) => {
    const targetIds = new Set(targetImages.map(img => img.id));
    setImages(prev => prev.map(img => 
      targetIds.has(img.id) ? { ...img, selected: !img.selected } : img
    ));
  };

  // --- Output Formatting ---
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
        url={urlInput}
        setUrl={setUrlInput}
        loading={loading} // Now using state from the hook
        error={error}     // Now using error from the hook
        onSubmit={handleExtract}
      />

      {/* Show AboutSection only when idle and empty */}
      {images.length === 0 && !loading && (
        <AboutSection />
      )}

      {/* Grid view appears only when images are found */}
      {images.length > 0 && (
        <div className="grid lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <ImageSelector 
            images={images}
            onToggle={toggleSelection}
            onSelectAll={selectAll}
            onDeselectAll={deselectAll}
            onInvert={() => invertSelection(images)} // Improvement: Batch invert
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
  );
}