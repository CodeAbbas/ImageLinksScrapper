import { useState } from 'react';
import { getCleanUrl } from '../utils/urlHelpers';

export const useImageExtractor = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractImages = async (url) => {
    if (!url) return;

    setLoading(true);
    setError('');
    setImages([]);

    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      
      if (!response.ok) throw new Error('Network response was not ok');
      
      const data = await response.json();
      if (!data.contents) throw new Error('Could not retrieve page content.');

      const parser = new DOMParser();
      const doc = parser.parseFromString(data.contents, 'text/html');
      
      const imgElements = doc.querySelectorAll('img');
      const processedMap = new Map();

      imgElements.forEach((img, index) => {
        const src = img.getAttribute('src') || 
                   img.getAttribute('data-src') || 
                   img.getAttribute('data-original') ||
                   img.getAttribute('srcset')?.split(' ')[0];

        if (src) {
          try {
            const absoluteUrl = new URL(src, url).href;
            
            if (!absoluteUrl.startsWith('data:') && absoluteUrl.match(/\.(jpeg|jpg|gif|png|webp|svg|bmp|tiff)/i)) {
               
               const noiseContainer = img.closest('.related, .upsells, .cross-sells, .widget, footer, header, .navigation');
               const isIcon = img.classList.contains('icon') || img.classList.contains('logo');
               const isTiny = img.width > 0 && img.width < 50;

               const cleanUrl = getCleanUrl(absoluteUrl);
               
               if (!processedMap.has(cleanUrl)) {
                 processedMap.set(cleanUrl, {
                   id: `img-${index}`,
                   originalUrl: absoluteUrl,
                   cleanUrl: cleanUrl,
                   selected: !noiseContainer && !isIcon && !isTiny,
                   isNoise: !!(noiseContainer || isIcon)
                 });
               }
            }
          } catch (err) {
            // Ignore invalid URLs
          }
        }
      });

      const finalImages = Array.from(processedMap.values());

      if (finalImages.length === 0) {
        setError('No images found on this page.');
      } else {
        setImages(finalImages);
      }

    } catch (err) {
      setError('Failed to fetch. The site might block proxies or requires headers we cannot send.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return { images, setImages, loading, error, extractImages };
};