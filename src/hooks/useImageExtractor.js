import { useState, useCallback } from 'react';
import { getCleanUrl, ensureAbsoluteUrl } from '../utils/urlHelpers';

const MAX_RETRIES = 2;
const TIMEOUT_MS = 10000; // 10 seconds

export const useImageExtractor = () => {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchWithRetry = async (url, retries = MAX_RETRIES) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl, { signal: controller.signal });
      clearTimeout(timeoutId);

      if (!response.ok) throw new Error(`Proxy returned ${response.status}`);
      
      const data = await response.json();
      if (!data.contents) throw new Error('Proxy returned empty content.');
      
      return data.contents;
    } catch (err) {
      clearTimeout(timeoutId);
      if (retries > 0 && err.name !== 'AbortError') {
        console.warn(`Fetch failed, retrying... (${retries} left)`);
        await new Promise(res => setTimeout(res, 1000)); // Wait 1s before retry
        return fetchWithRetry(url, retries - 1);
      }
      throw err;
    }
  };

  const extractImages = useCallback(async (targetUrl) => {
    if (!targetUrl) return;

    setLoading(true);
    setError('');
    setImages([]);

    try {
      const sanitizedUrl = ensureAbsoluteUrl(targetUrl); //
      const htmlContent = await fetchWithRetry(sanitizedUrl);

      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, 'text/html');
      const imgElements = doc.querySelectorAll('img');
      const processedMap = new Map();

      imgElements.forEach((img, index) => {
        const src = img.getAttribute('src') || 
                   img.getAttribute('data-src') || 
                   img.getAttribute('data-original') ||
                   img.getAttribute('srcset')?.split(' ')[0];

        if (src) {
          try {
            const absoluteUrl = new URL(src, sanitizedUrl).href;
            if (absoluteUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)/i)) {
               const noiseContainer = img.closest('.related, .upsells, footer, header, nav');
               const cleanUrl = getCleanUrl(absoluteUrl);
               
               if (!processedMap.has(cleanUrl)) {
                 processedMap.set(cleanUrl, {
                   id: `img-${index}`,
                   originalUrl: absoluteUrl,
                   cleanUrl: cleanUrl,
                   selected: !noiseContainer,
                   isNoise: !!noiseContainer
                 });
               }
            }
          } catch (e) { /* skip bad URL */ }
        }
      });

      const results = Array.from(processedMap.values());
      if (results.length === 0) throw new Error('No valid images found on this page.');
      setImages(results);

    } catch (err) {
      const msg = err.name === 'AbortError' 
        ? 'Request timed out. The site is taking too long to respond.'
        : 'Could not reach the site. It might be blocking scrapers or the proxy is down.';
      setError(msg);
      console.error('Extraction Error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  return { images, setImages, loading, error, extractImages };
};