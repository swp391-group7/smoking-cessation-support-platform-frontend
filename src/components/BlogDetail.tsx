import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { BlogPost } from '@/api/blog';

interface BlogDetailModalProps {
  post: BlogPost;
  children: React.ReactNode;
}

// dùng url ảnh 16:9 để hiển thị ảnh đẹp hơn
// ví dụ: https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fimages.wondershare.com%2Ffilmora%2Farticle-images%2F2021%2Fimportance-with-video-walls-1.jpg&f=1&nofb=1&ipt=...

export default function BlogDetailModal({ post, children }: BlogDetailModalProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'HEALTH':
        return 'Health';
      case 'SMOKEQUIT':
        return 'Smoke Quit';
      case 'SMOKEHARM':
        return 'Smoke Harm';
      case 'PREMIUM':
        return 'Premium Content'; //  Thêm dòng này
      default:
        return type;
    }
  };

  // style riêng cho premium
  const getBadgeStyle = (type: string) => {
    switch (type) {
      case 'PREMIUM':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{post.title}</DialogTitle>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-4">
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className={`${getBadgeStyle(post.blog_type)} px-2 py-1 rounded-full`}>
                {getTypeLabel(post.blog_type)}
              </span>
              <span>{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                {post.content}
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}