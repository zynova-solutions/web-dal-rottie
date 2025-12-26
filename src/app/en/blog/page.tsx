import Link from "next/link";
import Image from "next/image";
import { setRequestLocale } from 'next-intl/server';
import Head from 'next/head';

// Dynamically import all blog post modules from the posts folder
import top5ChickenDishes from "./posts/top-5-chicken-dishes";
import whyIndianFoodIsHealthy from "./posts/why-indian-food-is-healthy";
import spiceMeetsSimplicity from "./posts/spice-meets-simplicity";
import discoverMagicIndianSpices from "./posts/discover-magic-indian-spices";
import whatMakesIndianCuisineAuthentic from "./posts/what-makes-indian-cuisine-authentic";

const postModules = [
  top5ChickenDishes,
  whyIndianFoodIsHealthy,
  spiceMeetsSimplicity,
  discoverMagicIndianSpices,
  whatMakesIndianCuisineAuthentic,
];

// Example tags/categories for demonstration
const tagMap: Record<string, string[]> = {
  'top-5-chicken-dishes': ['Chicken', 'Popular', 'Spicy'],
  'why-indian-food-is-healthy': ['Health', 'Nutrition'],
  'spice-meets-simplicity': ['Spices', 'Mild', 'Family'],
  'discover-magic-indian-spices': ['Spices', 'Tradition'],
  'what-makes-indian-cuisine-authentic': ['Authentic', 'Culture'],
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
}

function getReadingTime(content: string) {
  const words = content.split(/\s+/).length;
  const minutes = Math.max(1, Math.round(words / 200));
  return `${minutes} min read`;
}

export default function BlogIndex() {
  setRequestLocale('en');
  const posts = postModules.sort((a, b) => b.date.localeCompare(a.date));

  // SEO/OG/LD+JSON
  const canonicalUrl = 'https://dalrotti.com/en/blog';
  const ogImage = '/blog-hero.jpg';
  const blogLdJson = {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    'name': 'Dal Rotti Blog',
    'url': canonicalUrl,
    'description': 'Discover stories, tips, and news from Dal Rotti',
    'blogPost': posts.map(post => ({
      '@type': 'BlogPosting',
      'headline': post.title,
      'image': post.image,
      'datePublished': post.date,
      'url': `${canonicalUrl}/${post.slug}`,
      'description': post.summary
    }))
  };

  return (
    <>
      <Head>
        <title>Dal Rotti Blog | Authentic Indian Food Stories</title>
        <meta name="description" content="Discover stories, tips, and news from Dal Rotti" />
        <link rel="canonical" href={canonicalUrl} />
        <meta property="og:title" content="Dal Rotti Blog | Authentic Indian Food Stories" />
        <meta property="og:description" content="Discover stories, tips, and news from Dal Rotti" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={ogImage} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Dal Rotti Blog | Authentic Indian Food Stories" />
        <meta name="twitter:description" content="Discover stories, tips, and news from Dal Rotti" />
        <meta name="twitter:image" content={ogImage} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(blogLdJson) }} />
      </Head>

      {/* Full-width Hero Section */}
      <section className="hero relative flex items-center h-[40vh] w-full mb-12">
        <div className="absolute inset-0 z-0">
          <Image
            src="/blog-hero.jpg"
            alt="Dal Rotti Blog Hero - Indian food collage"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/60 to-black/50 backdrop-blur-[1px]"></div>
        </div>
        <div className="hero-content container mx-auto px-4 text-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Blog</h1>
            <p className="text-xl max-w-2xl mx-auto">
              Discover stories, tips, and news from Dal Rotti
            </p>
          </div>
        </div>
      </section>

      {/* Blog content - constrained width */}
      <main className="max-w-2xl mx-auto pb-8 px-4">
        {posts.length === 0 ? (
          <div className="text-center text-gray-500 py-12">No blog posts found.</div>
        ) : (
          <ul className="space-y-8">
            {posts.map((post) => (
              <li key={post.slug} className="group border-b pb-6">
                <Link href={`/en/blog/${post.slug}`} className="flex gap-6 items-center rounded-lg transition hover:bg-gray-50 dark:hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-primary p-1 -m-1">
                {post.image && (
                  <Image
                    src={post.image}
                    alt={`Photo for blog post: ${post.title}`}
                    width={128}
                    height={96}
                    className="w-32 h-24 object-cover rounded shadow group-hover:scale-105 transition"
                    loading="lazy"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap gap-2 mb-1">
                    {(tagMap[post.slug] || []).map(tag => (
                      <span key={tag} className="bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <h2 className="text-xl font-semibold group-hover:text-primary transition line-clamp-2">
                    {post.title}
                  </h2>
                  <div className="flex flex-wrap gap-4 text-gray-500 text-xs mb-2">
                    <span>{formatDate(post.date)}</span>
                    <span>By Dal Rotti</span>
                    <span>{getReadingTime(post.content)}</span>
                  </div>
                  <p className="mb-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                    {post.summary.length > 120 ? post.summary.slice(0, 120) + '…' : post.summary}
                  </p>
                  <span className="text-blue-600 hover:underline text-sm font-medium">Read more →</span>
                </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
