import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { BlogPost } from '@/api/blog';
import BlogDetailModal from './BlogDetail';

interface PostCardProps {
  post?: BlogPost;
  isLoading: boolean;
}

export default function PostCard({ post, isLoading }: PostCardProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'HEALTH':
        return 'Health';
      case 'SMOKEQUIT':
        return 'Smoke Quit';
      case 'SMOKEHARM':
        return 'Smoke Harm';
      default:
        return type;
    }
  };

  if (isLoading || !post) {
    return (
      <Card className="h-80">
        <CardContent className="p-4">
          <Skeleton className="h-40 w-full mb-4" />
          <Skeleton className="h-4 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-2" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  return (
    <BlogDetailModal post={post}>
      <Card className="h-80 cursor-pointer hover:shadow-lg transition-shadow duration-200">
        <CardContent className="p-4">
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-40 object-cover rounded mb-4"
          />
          <div className="flex items-center gap-2 mb-2">
            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
              {getTypeLabel(post.blog_type)}
            </span>
          </div>
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-3">{post.content.slice(0, 80)}...</p>
          <p className="text-xs text-gray-500 mt-2">
            {new Date(post.createdAt).toLocaleDateString()}
          </p>
        </CardContent>
      </Card>
    </BlogDetailModal>
  );
}