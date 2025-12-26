'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaInstagram } from 'react-icons/fa';

interface InstagramPost {
  id: string;
  media_url: string;
  permalink: string;
  caption: string;
  timestamp: string;
}

interface InstagramFeedProps {
  username: string;
  locale: 'en' | 'de';
  count?: number;
}

export default function InstagramFeed({ username, locale, count = 8 }: InstagramFeedProps) {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        setLoading(true);
        console.log('Fetching Instagram posts...');
        
        const response = await fetch(`/instagram?count=${count}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch Instagram posts: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Received Instagram data:', data);
        
        if (data && Array.isArray(data) && data.length > 0) {
          setPosts(data);
        } else {
          throw new Error('No Instagram posts available');
        }
      } catch (err) {
        console.error('Error in Instagram component:', err);
        setError(err instanceof Error ? err.message : 'Failed to load Instagram posts');
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, [count]);

  const viewMoreText = locale === 'en' ? 'View More on Instagram' : 'Mehr auf Instagram ansehen';
  const followUsText = locale === 'en' ? 'Follow Us on Instagram' : 'Folge uns auf Instagram';
  const loadingText = locale === 'en' ? 'Loading posts...' : 'Beiträge werden geladen...';
  const errorText = locale === 'en' ? 'Could not load Instagram feed' : 'Instagram-Feed konnte nicht geladen werden';

  return (
    <div className="text-center">
      <h2 className="section-title text-xl md:text-2xl mb-6">{followUsText}</h2>
      
      <div className="mb-8">
        <a 
          href={`https://www.instagram.com/${username}/`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-primary text-lg font-medium hover:underline flex items-center justify-center gap-2"
        >
          <FaInstagram className="text-2xl text-primary" />
          @{username}
        </a>
      </div>
      
      {loading && (
        <div className="my-8 flex flex-col items-center">
          <p className="text-gray-500 mb-2">{loadingText}</p>
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {error && !loading && (
        <div className="my-8 text-red-500">
          <p>{errorText}</p>
          <p className="text-sm mt-2">{error}</p>
        </div>
      )}
      
      {!loading && !error && posts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6 mb-8">
          {posts.map((post, index) => (
            <div key={post.id || `post-${index}`} className="flex flex-col items-center">
              <p className="text-primary text-sm font-medium text-center line-clamp-2 mb-3">
                {post.caption || `Instagram post ${index + 1}`}
              </p>
              <a 
                href={post.permalink} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="relative group overflow-hidden rounded-lg aspect-square w-full"
              >
                {imgErrors[index] ? (
                  // Fallback image when error occurs
                  <Image 
                    src="/instagram/image-1.jpeg"
                    alt={post.caption?.substring(0, 100) || `Instagram post ${index + 1}`}
                    width={600}
                    height={600}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                ) : (
                  // Primary image with error handling
                  <Image 
                    src={post.media_url}
                    alt={post.caption?.substring(0, 100) || `Instagram post ${index + 1}`}
                    width={600}
                    height={600}
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    onError={() => {
                      console.error('Image failed to load:', post.media_url);
                      setImgErrors(prev => ({ ...prev, [index]: true }));
                    }}
                  />
                )}
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center">
                  <FaInstagram className="text-white text-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </a>
            </div>
          ))}
        </div>
      )}
      
      <div className="mt-8">
        <a 
          href={`https://www.instagram.com/${username}/`} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-outline px-6 py-3 rounded-lg border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-colors"
        >
          {viewMoreText}
        </a>
      </div>
    </div>
  );
} 