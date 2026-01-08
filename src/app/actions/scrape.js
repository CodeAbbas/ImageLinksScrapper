"use server";

import * as cheerio from 'cheerio';
import { getCleanUrl } from '@/utils/urlHelpers';

export async function scrapeImagesAction(targetUrl) {
  try {
    const response = await fetch(targetUrl, {
      headers: { 
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      },
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000) // Built-in Node fetch timeout
    });

    if (response.status === 403) throw new Error('Access Denied: This site blocks automated scraping.');
    if (!response.ok) throw new Error(`Site returned error code: ${response.status}`);

    const html = await response.text();
    const $ = cheerio.load(html);
    const images = [];

    $('img').each((index, element) => {
      const src = $(element).attr('src') || $(element).attr('data-src') || $(element).attr('srcset')?.split(' ')[0];
      if (src) {
        try {
          const absoluteUrl = new URL(src, targetUrl).href;
          if (absoluteUrl.match(/\.(jpeg|jpg|gif|png|webp|svg)/i)) {
            const cleanUrl = getCleanUrl(absoluteUrl);
            const parent = $(element).closest('footer, header, nav, .related').length > 0;
            images.push({
              id: `img-${index}`,
              originalUrl: absoluteUrl,
              cleanUrl: cleanUrl,
              selected: !parent,
              isNoise: parent
            });
          }
        } catch (e) {}
      }
    });

    return { success: true, data: Array.from(new Map(images.map(img => [img.cleanUrl, img])).values()) };
  } catch (error) {
    return { success: false, error: error.message };
  }
}