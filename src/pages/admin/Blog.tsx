import React, { useEffect, useState } from 'react';
import PaginationControl from '@/components/PaginationControl';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';

//tai su dung form blog user
export interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

const POSTS_PER_PAGE = 12;
const TOTAL_PAGES = 3;

export default function BlogAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const mockPosts: Post[] = Array.from({ length: POSTS_PER_PAGE }, (_, i) => ({
        id: (page - 1) * POSTS_PER_PAGE + i + 1,
        title: `Blog #${(page - 1) * POSTS_PER_PAGE + i + 1}`,
        excerpt: 'This is a sample blog post for admin management.',
        date: new Date().toLocaleDateString(),
        image: 'https://via.placeholder.com/600x400?text=Admin+Post',
      }));
      setPosts(mockPosts);
      setIsLoading(false);
    }, 600);
  }, [page]);

  // chuc nang edit va xoa cho admin
  // Trong thuc te, se su dung API RIENG de cap nhat va xoa bai viet
  const handleEdit = (id: number) => {
    alert(`Edit post ${id}`);
  };
  
  const handleDelete = (id: number) => {
    if (confirm(`Are you sure you want to delete post ${id}?`)) {
      setPosts((prev) => prev.filter((post) => post.id !== id));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Controller</h1>
        <Button variant="default" className="flex gap-2">
          <PlusIcon className="w-4 h-4" /> Add Post
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: POSTS_PER_PAGE }).map((_, idx) => (
              <div key={idx} className="h-64 bg-muted rounded-lg animate-pulse" />
            ))
          : posts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow p-4 relative group">
                <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded" />
                <h2 className="mt-3 text-lg font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{post.date}</p>
                <p className="text-gray-700 text-sm line-clamp-3">{post.excerpt}</p>

                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition">
                  <Button size="icon" variant="outline" onClick={() => handleEdit(post.id)}>
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="destructive" onClick={() => handleDelete(post.id)}>
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
      </div>

      <div className="flex justify-center mt-8">
        <PaginationControl page={page} setPage={setPage} totalPages={TOTAL_PAGES} />
      </div>
    </div>
  );
}