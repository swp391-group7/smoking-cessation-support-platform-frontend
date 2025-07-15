import React from 'react';
import type { BlogPost } from '@/api/blog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { motion } from 'framer-motion';
import BlogDetailModal from './BlogDetail';

interface LatestPostProps {
  post: BlogPost | null;
  isLoading: boolean;
}

// Component hiển thị bài viết mới nhất với hiệu ứng loading
// Sử dụng LatestPostProps để định nghĩa props cho component
//dao diện bài viết mới nhất, kèm nút đọc thêm
export default function PremiumLatestPost({ post, isLoading }: LatestPostProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'HEALTH':
        return 'Health';
      case 'SMOKEQUIT':
        return 'Smoke Quit';
      case 'SMOKEHARM':
        return 'Smoke Harm';
      case 'PREMIUM':
        return 'Premium Content'; // THÊM label cho premium
      default:
        return type;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'HEALTH':
        return 'bg-blue-100 text-blue-800';
      case 'SMOKEQUIT':
        return 'bg-green-100 text-green-800';
      case 'SMOKEHARM':
        return 'bg-red-100 text-red-800';
      case 'PREMIUM':
        return 'bg-yellow-100 text-yellow-800'; //  THÊM màu riêng cho premium
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          src={post.imageUrl}
          alt={post.title}
        />
        <div className="p-6 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`${getTypeColor(post.blog_type)} px-2 py-1 rounded-full text-xs font-medium`}>
                {getTypeLabel(post.blog_type)}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">{post.title}</h2>
            <p className="mt-4 text-gray-700">{post.content.slice(0, 100)}...</p>
          </div>
          <div className="mt-6">
            <BlogDetailModal post={post}>
              <Button variant="outline" className="border-yellow-600 text-yellow-600">
                Read More
              </Button>
            </BlogDetailModal>
            <p className="text-sm text-gray-500 mt-2">
              {new Date(post.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}