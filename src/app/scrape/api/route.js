import { NextResponse } from 'next/server';
import { scrape } from '@/app/actions/scrape'; // Import your existing logic!

export async function POST(req) {
  try {
    const body = await req.json();
    const { url } = body;

    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }

    // Call your existing server action logic here
    const result = await scrape(url); 

    // Return it as standard JSON so your Furniture App can read it
    return NextResponse.json(result); 
    
  } catch (error) {
    console.error('API Scrape Error:', error);
    return NextResponse.json({ error: 'Failed to scrape' }, { status: 500 });
  }
}