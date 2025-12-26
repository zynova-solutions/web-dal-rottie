import { NextRequest, NextResponse } from 'next/server';

// Define types for Instagram posts
interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption: string;
  timestamp: string;
}

// Cache the Instagram API responses for better performance
let cachedData: InstagramPost[] | null = null;
let cacheTimestamp: number | null = null;

// Define a cache refresh interval (e.g., 1 hour)
const CACHE_REFRESH_INTERVAL = 60 * 60 * 1000; // 1 hour

// Example Instagram posts for development/demo
// This is used when we can't connect to the Instagram API or during development
const examplePosts: InstagramPost[] = [
  {
    id: 'example1',
    media_url: '/instagram/image-1.jpeg',
    permalink: 'https://www.instagram.com/dalrotti/',
    caption: 'Enjoying our delicious Indian cuisine',
    timestamp: new Date().toISOString()
  },
  {
    id: 'example2',
    media_url: '/instagram/image-1.jpeg',
    permalink: 'https://www.instagram.com/dalrotti/',
    caption: 'Authentic Indian food spread',
    timestamp: new Date().toISOString()
  },
  {
    id: 'example3',
    media_url: '/instagram/image-1.jpeg',
    permalink: 'https://www.instagram.com/dalrotti/',
    caption: 'Our beautiful restaurant interior',
    timestamp: new Date().toISOString()
  },
  {
    id: 'example4',
    media_url: '/instagram/image-1.jpeg',
    permalink: 'https://www.instagram.com/dalrotti/',
    caption: 'Ready to serve',
    timestamp: new Date().toISOString()
  },
  {
    id: 'example5',
    media_url: '/instagram/image-1.jpeg',
    permalink: 'https://www.instagram.com/dalrotti/',
    caption: 'Perfect pairing of cocktails and Indian food',
    timestamp: new Date().toISOString()
  },
  {
    id: 'example6',
    media_url: '/instagram/image-1.jpeg',
    permalink: 'https://www.instagram.com/dalrotti/',
    caption: 'Namaste! Welcome to Dal Rotti',
    timestamp: new Date().toISOString()
  },
  {
    id: 'example7',
    media_url: '/instagram/image-1.jpeg',
    permalink: 'https://www.instagram.com/dalrotti/',
    caption: 'Our signature Palak Paneer',
    timestamp: new Date().toISOString()
  },
  {
    id: 'example8',
    media_url: '/instagram/image-1.jpeg',
    permalink: 'https://www.instagram.com/dalrotti/',
    caption: 'A feast for the senses',
    timestamp: new Date().toISOString()
  }
];

/**
 * Fetches Instagram posts from the Instagram API
 * @param count Number of posts to fetch
 * @returns Array of Instagram posts
 */
async function fetchInstagramPosts(count: number): Promise<InstagramPost[]> {
  // If we have fresh cached data, use it
  if (cachedData && cacheTimestamp && Date.now() - cacheTimestamp < CACHE_REFRESH_INTERVAL) {
    console.log('Using cached Instagram data');
    return cachedData.slice(0, count);
  }

  // Access token should be stored in environment variables
  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN;
  
  if (!accessToken) {
    console.log('No Instagram access token found in environment variables');
    throw new Error('Instagram access token is not configured');
  }

  try {
    console.log('Fetching fresh data from Instagram API');
    const response = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp&access_token=${accessToken}&limit=${count}`
    );
    
    if (!response.ok) {
      throw new Error(`Instagram API error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data || !data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format from Instagram API');
    }
    
    // Transform the data to match our expected format
    const transformedData = data.data.map((post: {
      id: string;
      media_url: string;
      permalink: string;
      caption?: string;
      timestamp: string;
    }) => ({
      id: post.id,
      media_url: post.media_url,
      permalink: post.permalink,
      caption: post.caption || '',
      timestamp: post.timestamp
    }));
    
    // Cache the results
    cachedData = transformedData;
    cacheTimestamp = Date.now();
    
    return transformedData.slice(0, count);
  } catch (error) {
    console.error('Error fetching from Instagram API:', error);
    throw error;
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const count = parseInt(searchParams.get('count') || '8', 10);
    
    console.log('Instagram API request received for', count, 'posts');
    
    try {
      // Try to fetch from the real Instagram API
      const posts = await fetchInstagramPosts(count);
      console.log('Successfully fetched Instagram posts:', posts.length);
      return NextResponse.json(posts);
    } catch (error) {
      console.error('Using example posts due to error:', error);
      // Fall back to example posts if we can't access the Instagram API
      return NextResponse.json(examplePosts.slice(0, count));
    }
  } catch (error) {
    console.error('Instagram API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch Instagram posts' },
      { status: 500 }
    );
  }
} 