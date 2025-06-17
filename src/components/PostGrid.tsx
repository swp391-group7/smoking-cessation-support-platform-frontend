import React from 'react';
import PostCard from './PostCard';
import { motion, AnimatePresence } from 'framer-motion';
import type { Post } from '../pages/platform/blog';

interface PostGridProps {
  posts: Post[];
  isLoading: boolean;
}

export default function PostGrid({ posts, isLoading }: PostGridProps) {
  const items = isLoading ? Array.from({ length: 12 }) : posts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnimatePresence>
        {items.map((item, idx) => (
          <motion.div
            key={isLoading ? `skeleton-${idx}` : (item as Post).id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: idx * 0.03 }}
          >
            <PostCard post={isLoading ? undefined : (item as Post)} isLoading={isLoading} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}