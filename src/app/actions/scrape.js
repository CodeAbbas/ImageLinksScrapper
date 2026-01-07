"use server";

import * as cheerio from 'cheerio';
import { getCleanUrl } from '@/utils/urlHelpers';

export async function scrapeImagesAction(targetUrl) {
  try {
    const response = await fetch(targetUrl, {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
      next: { revalidate: 3600 } // Cache results for an hour
    });

    if (!response.ok) throw new Error('Failed to fetch the page.');

    const html = await response.text();
    const $ = cheerio.load(html);
    const images = [];

    $('img').each((index, element) => {
      const src = $(element).attr('src') || $(element).attr('data-src') || $(element).attr('srcset')?.split(' ')[0];
      
      if (src) {
        try {
          const absoluteUrl = new URL(src, targetUrl).href;
          
          // Filter for image extensions
          if (absoluteUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)/i)) {
            const cleanUrl = getCleanUrl(absoluteUrl);
            const parent = $(element).closest('footer, header, nav, .related, .widget').length > 0;
            
            images.push({
              id: `img-${index}`,
              originalUrl: absoluteUrl,
              cleanUrl: cleanUrl,
              selected: !parent, // Auto-select if not in noise containers
              isNoise: parent
            });
          }
        } catch (e) { /* skip invalid urls */ }
      }
    });

    // Remove duplicates
    const uniqueImages = Array.from(new Map(images.map(img => [img.cleanUrl, img])).values());

    return { success: true, data: uniqueImages };
  } catch (error) {
    return { success: false, error: error.message };
  }
}