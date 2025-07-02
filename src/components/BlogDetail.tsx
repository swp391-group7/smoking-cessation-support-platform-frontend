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

export default function BlogDetailModal({ post, children }: BlogDetailModalProps) {
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
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
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