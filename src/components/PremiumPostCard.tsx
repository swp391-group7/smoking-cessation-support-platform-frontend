import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { BlogPost } from '@/api/blog';
import BlogDetailModal from './BlogDetail';

// Định nghĩa giao diện PostCardProps để bao gồm post và isLoading
interface PostCardProps {
  post?: BlogPost;
  isLoading: boolean;
}

// Hoàn thành component PremiumPostCard
// Sử dụng PostCardProps để định nghĩa props cho component
export default function PremiumPostCard({ post, isLoading }: PostCardProps) {
  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'HEALTH':
        return 'Health';
      case 'SMOKEQUIT':
        return 'Smoke Quit';
      case 'SMOKEHARM':
        return 'Smoke Harm';
      case 'PREMIUM':
        return 'Premium Content'; 
      default:
        return type;
    }
  };

// Hàm để lấy màu sắc dựa trên loại bài viết
// Thêm loại PREMIUM vào hàm này
  const getTypeColor = (type: string) => {  
    switch (type) {
      case 'HEALTH':
        return 'bg-blue-100 text-blue-800';
      case 'SMOKEQUIT':
        return 'bg-green-100 text-green-800';
      case 'SMOKEHARM':
        return 'bg-red-100 text-red-800';
      case 'PREMIUM':
        return 'bg-yellow-100 text-yellow-800'; 
      default:
        return 'bg-gray-100 text-gray-800';
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
            <span className={`${getTypeColor(post.blog_type)} px-2 py-1 rounded-full text-xs font-medium`}>
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