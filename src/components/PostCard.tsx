import React from 'react';
import type { BlogPost } from '@/api/blog';
import { Skeleton } from '@/components/ui/skeleton';

interface PostCardProps {
  post?: BlogPost;
  isLoading?: boolean;
}

export default function PostCard({ post, isLoading = false }: PostCardProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col space-y-2">
        <Skeleton className="h-32 w-full rounded-lg" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-3 w-5/6" />
        <Skeleton className="h-3 w-4/6" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden shadow-sm bg-white">
      <img
        className="h-32 w-full object-cover"
        src={post.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={post.title}
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{post.title}</h3>
        <p className="text-sm text-gray-700 mt-1">
          {post.content.slice(0, 80)}...
        </p>
        <p className="text-xs text-gray-500 mt-2">
          {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}