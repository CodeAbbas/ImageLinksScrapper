'use client';

import React, { useState, useMemo, useTransition } from 'react';
import Header from './Header';
import UrlInputForm from './UrlInputForm';
import AboutSection from './AboutSection';
import ImageSelector from './ImageSelector';
import OutputPanel from './OutputPanel';
import { scrapeImagesAction } from '@/app/actions/scrape'; // Ensure this server action is created

export default function LinkExtractor() {
  // --- State Management ---
  const [urlInput, setUrlInput] = useState('');
  const [images, setImages] = useState([]);
  const [error, setError] = useState('');
  const [filterText, setFilterText] = useState('');
  const [useHighRes, setUseHighRes] = useState(true);
  
  // useTransition manages the loading state for the Server Action
  const [isPending, startTransition] = useTransition();

  // --- Handlers ---
  const handleExtract = (e) => {
    e.preventDefault();
    if (!urlInput) return;

    setError('');
    
    // Executes the scraping logic on the server
    startTransition(async () => {
      try {
        const result = await scrapeImagesAction(urlInput);
        
        if (result.success) {
          setImages(result.data);
        } else {
          setError(result.error || 'Failed to extract images.');
          setImages([]);
        }
      } catch (err) {
        setError('A network error occurred. Please try again.');
        setImages([]);
      }
    });
  };

  const toggleSelection = (id) => {
    setImages(prev => prev.map(img => 
      img.id === id ? { ...img, selected: !img.selected } : img
    ));
  };

  const selectAll = (targetImages) => {
    // targetImages refers to the current filtered set from ImageSelector
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
        loading={isPending} // transition state replaces manual loading state
        error={error}
        onSubmit={handleExtract}
      />

      {images.length === 0 && !isPending && (
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
  );
}