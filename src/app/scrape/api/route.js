import { NextResponse } from 'next/server';
import { scrapeImagesAction } from '@/app/actions/scrape'; 

export async function POST(req) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    const result = await scrapeImagesAction(url); 

    // Return standard JSON response
    return NextResponse.json(result); 
    
  } catch (error) {
    console.error('API Scrape Error:', error);
    return NextResponse.json({ error: 'Failed to scrape' }, { status: 500 });
  }
}