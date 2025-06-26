import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaginationControl from '@/components/PaginationControl';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { fetchAllBlogs, deleteBlog, type BlogPost } from '@/api/blog';

export default function BlogAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  const POSTS_PER_PAGE = 12;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  useEffect(() => {
    setIsLoading(true);
    fetchAllBlogs()
      .then(setPosts)
      .finally(() => setIsLoading(false));
  }, []);

  const handleEdit = (id: string) => {
    navigate(`/admin/blog/edit/${id}`);
  };

  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete post ${id}?`)) {
      await deleteBlog(id);
      setPosts((prev) => prev.filter((post) => post.id !== id));
    }
  };

  const handleAddPost = () => {
    navigate('/admin/blog/create');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Controller</h1>
        <Button onClick={handleAddPost} variant="default" className="flex gap-2">
          <PlusIcon className="w-4 h-4" /> Add Post
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: POSTS_PER_PAGE }).map((_, idx) => (
              <div key={idx} className="h-64 bg-muted rounded-lg animate-pulse" />
            ))
          : currentPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow p-4 relative group">
                <img src={post.imageUrl} alt={post.title} className="w-full h-40 object-cover rounded" />
                <h2 className="mt-3 text-lg font-semibold">{post.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-700 text-sm line-clamp-3">{post.content.slice(0, 80)}...</p>

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
        <PaginationControl page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
}