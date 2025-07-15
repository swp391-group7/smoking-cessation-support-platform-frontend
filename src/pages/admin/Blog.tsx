//pages/admin/blog.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PaginationControl from '@/components/PaginationControl';
import { Button } from '@/components/ui/button';
import { PencilIcon, TrashIcon, PlusIcon } from 'lucide-react';
import { fetchAllBlogs, deleteBlog, type BlogPost, BlogType } from '@/api/blog';

// State quản lý danh sách bài viết, trạng thái loading, và trang hiện tại
export default function BlogAdminPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

  // Cấu hình phân trang
  const POSTS_PER_PAGE = 12;
  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const currentPosts = posts.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);

  // Trả về nhãn hiển thị theo từng loại bài viết
  const getTypeLabel = (type: BlogType) => {
    switch (type) {
      case BlogType.HEALTH:
        return 'Health';
      case BlogType.SMOKEQUIT:
        return 'Smoke Quit';
      case BlogType.SMOKEHARM:
        return 'Smoke Harm';
      case BlogType.PREMIUM: //Thêm dòng này
        return 'Premium';
      default:
        return type;
    }
  };

// Trả về màu nền và màu chữ tương ứng với loại bài viết
  const getTypeColor = (type: BlogType) => {
    switch (type) {
      case BlogType.HEALTH:
        return 'bg-blue-100 text-blue-800';
      case BlogType.SMOKEQUIT:
        return 'bg-green-100 text-green-800';
      case BlogType.SMOKEHARM:
        return 'bg-red-100 text-red-800';
      case BlogType.PREMIUM:
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Gọi API lấy tất cả bài viết khi trang được load
  useEffect(() => {
    setIsLoading(true);
    fetchAllBlogs()
      .then(setPosts)
      .finally(() => setIsLoading(false));
  }, []);

  // Chuyển hướng đến trang chỉnh sửa bài viết
  const handleEdit = (id: string) => {
    navigate(`/admin/blog/edit/${id}`);
  };

// Xác nhận và xóa bài viết
  const handleDelete = async (id: string) => {
    if (confirm(`Are you sure you want to delete this blog post?`)) {
      try {
        await deleteBlog(id);
        setPosts((prev) => prev.filter((post) => post.id !== id));
      } catch {
        alert('Failed to delete blog post');
      }
    }
  };

// Chuyển hướng đến trang tạo bài viết mới
  const handleAddPost = () => {
    navigate('/admin/blog/create');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Blog Management</h1>
        <Button onClick={handleAddPost} className="bg-green-600 hover:bg-green-700 flex items-center gap-2">
          <PlusIcon className="w-4 h-4" /> Add New Post
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: POSTS_PER_PAGE }).map((_, idx) => (
              <div key={idx} className="h-80 bg-gray-200 rounded-lg animate-pulse" />
            ))
          : currentPosts.map((post) => (
              <div key={post.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-4 relative group">
                {/* Hiển thị hình ảnh bài viết */}
                <img 
                  src={post.imageUrl} 
                  alt={post.title} 
                  className="w-full h-40 object-cover rounded-lg mb-3" 
                />
                {/* Hiển thị nhãn loại bài viết */}
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(post.blog_type)}`}>
                    {getTypeLabel(post.blog_type)}
                  </span>
                </div>
                {/* Tiêu đề, ngày tạo, nội dung tóm tắt */}
                <h2 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h2>
                <p className="text-sm text-gray-500 mb-2">{new Date(post.createdAt).toLocaleDateString()}</p>
                <p className="text-gray-700 text-sm line-clamp-3 mb-4">{post.content.slice(0, 100)}...</p>

                {/* Nút chỉnh sửa / xóa hiện khi hover */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleEdit(post.id)}
                    className="bg-white/90 hover:bg-white"
                  >
                    <PencilIcon className="w-4 h-4" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="destructive" 
                    onClick={() => handleDelete(post.id)}
                    className="bg-red-500/90 hover:bg-red-600"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
      </div>
            {/* Trường hợp không có bài viết nào */}
      {!isLoading && posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No blog posts found</p>
          <Button onClick={handleAddPost} className="mt-4 bg-green-600 hover:bg-green-700">
            Create your first blog post
          </Button>
        </div>
      )}
{/* Phân trang nếu có nhiều bài viết */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-8">
          <PaginationControl page={page} setPage={setPage} totalPages={totalPages} />
        </div>
      )}
    </div>
  );
}