import React from 'react';
import type { Post } from '../pages/platform/blog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';

interface LatestPostProps {
  post: Post | null;
  isLoading: boolean;
}

export default function LatestPost({ post, isLoading }: LatestPostProps) {
  if (isLoading || !post) {
    return (
      <div className="mb-8">
        <Skeleton className="h-64 w-full rounded-lg" />
        <div className="mt-4 space-y-2">
          <Skeleton className="h-6 w-3/5" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-6 w-2/5" />
        </div>
      </div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="mb-8 flex flex-col md:flex-row bg-white shadow-md rounded-lg overflow-hidden">
        <img
          className="md:w-1/2 h-64 object-cover"
          src={post.image}
          alt={post.title}
        />
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
            <p className="mt-4 text-gray-700">{post.excerpt}</p>
          </div>
          <div className="mt-6">
            <Button variant="outline" className="border-green-600 text-green-600">
              Read More
            </Button>
            <p className="text-sm text-gray-500 mt-2">{post.date}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}