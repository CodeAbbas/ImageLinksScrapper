import { useState, useCallback } from 'react';
import { ensureAbsoluteUrl } from '../utils/urlHelpers';
import { scrapeImagesAction } from '../app/actions/scrape'; 

export const useImageExtractor = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const extractImages = useCallback(async (targetUrl) => {
    if (!targetUrl) return;

    setLoading(true);
    setError('');
    setImages([]);

    try {
      // 1. Sanitize the URL
      const sanitizedUrl = ensureAbsoluteUrl(targetUrl);

      const result = await scrapeImagesAction(sanitizedUrl);

      if (result.success) {
        if (result.data.length === 0) {
          throw new Error('No valid images found on this page.');
        }
        setImages(result.data);
      } else {
        throw new Error(result.error || 'Failed to extract images.');
      }

    } catch (err) {
      const msg = err.message.includes('timeout') 
        ? 'The server is taking too long to respond. Try again.'
        : err.message || 'An unexpected error occurred.';
      
      setError(msg);
      console.error('Extraction Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { images, setImages, loading, error, extractImages };
};