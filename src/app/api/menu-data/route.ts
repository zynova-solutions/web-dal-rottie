import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    // Load CSV file from secure src/data directory
    const csvPath = path.join(process.cwd(), 'src', 'data', 'menu-items.csv');
    
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json({ error: 'Menu data not found' }, { status: 404 });
    }
    
    const csvText = fs.readFileSync(csvPath, 'utf8');
    
    return new NextResponse(csvText, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
      },
    });
  } catch (error) {
    console.error('Error loading menu data:', error);
    return NextResponse.json({ error: 'Failed to load menu data' }, { status: 500 });
  }
}