import PremiumPostCard from './PremiumPostCard';
import { motion, AnimatePresence } from 'framer-motion';
import type { BlogPost } from '@/api/blog';

interface PostGridProps {
  posts: BlogPost[];
  isLoading: boolean;
}

// Component hiển thị lưới các bài viết gồm cả premium
// Sử dụng PostGridProps để định nghĩa props cho component
// Hiển thị skeleton khi isLoading là true     
//hiển thị bài viết với hiệu ứng loading
export default function PremiumPostGrid({ posts, isLoading }: PostGridProps) {
  const skeletons = Array.from({ length: 12 }, (_, idx) => ({ id: `skeleton-${idx}` }));

  const displayItems = isLoading ? skeletons : posts;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <AnimatePresence>
        {displayItems.map((item, idx) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: idx * 0.03 }}
          >
            <PremiumPostCard
              post={isLoading ? undefined : (item as BlogPost)}
              isLoading={isLoading}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}