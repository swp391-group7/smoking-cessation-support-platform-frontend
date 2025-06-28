import React from 'react';
import PostCard from './PostCard';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlogPost } from '@/api/blog';

interface PostGridProps {
  posts: BlogPost[];
  isLoading: boolean;
}

export default function PostGrid({ posts, isLoading }: PostGridProps) {
  const skeletons = Array.from({ length: 12 }, (_, idx) => ({ id: `skeleton-${idx}` }));

  const displayItems = isLoading ? skeletons : posts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnimatePresence>
        {displayItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.03 }}
          >
            <PostCard
              post={isLoading ? undefined : (item as BlogPost)}
              isLoading={isLoading}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}