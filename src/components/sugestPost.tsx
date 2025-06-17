import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface Post {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  type: string;
}

const CATEGORIES = ['Recommended', 'Specialized', 'Related', 'Proficiency'];
const DEFAULT_COUNT = 4;
const EXPAND_COUNT = 8;

const PostsGrid: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [category, setCategory] = useState(CATEGORIES[0]);

  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const sample = Array.from({ length: 12 }, (_, i) => ({
        id: String(i + 1),
        image: `/images/image${(i % 6) + 1}.jpg`,
        title: `Quit Smoking Topic ${i + 1}`,
        subtitle: `Resource ${i + 1}`,
        type: category,
      }));
      setPosts(sample);
      setLoading(false);
    }, 800);
  }, [category]);

  const visible = posts.slice(0, expanded ? EXPAND_COUNT : DEFAULT_COUNT);

  return (
    <section className="bg-white rounded-2xl shadow-lg py-6 px-4 md:px-6 lg:px-8">
      {/* Category Tabs and Blog Link */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex space-x-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setExpanded(false); }}
              className={`px-4 py-1 rounded-full text-sm font-medium transition ${
                category === cat ? 'bg-green-700 text-white' : 'bg-gray-100 text-gray-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <Link
          to="/blog"
          className="text-green-600 font-medium hover:underline text-sm"
        >
          View more articles
        </Link>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: DEFAULT_COUNT }).map((_, idx) => (
              <div key={idx} className="space-y-1">
                <Skeleton className="h-32 w-full rounded-lg bg-green-100" />
                <Skeleton className="h-4 w-2/3 rounded" />
                <Skeleton className="h-3 w-1/2 rounded" />
              </div>
            ))
          : visible.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <Card className="rounded-lg border border-gray-100 hover:shadow-md transition-shadow duration-200">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="h-32 w-full object-cover rounded-t-lg"
                  />
                  <CardContent className="p-3">
                    <div className="text-[10px] text-green-700 font-semibold uppercase mb-1">
                      {post.type}
                    </div>
                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {post.subtitle}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      {/* Show More / Collapse Button */}
      {posts.length > DEFAULT_COUNT && (
        <div className="mt-4 flex">
          <Button
            variant="outline"
            className="rounded-full px-4 py-1 text-xs text-green-700 border-green-700 hover:bg-green-50"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Show Less' : 'Show More'}
          </Button>
        </div>
      )}
    </section>
  );
};

export default PostsGrid;
