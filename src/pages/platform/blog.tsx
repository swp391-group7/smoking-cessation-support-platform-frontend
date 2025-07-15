import React, { useState, useEffect } from 'react';
import FilterBar from '@/components/FilterBar';
import LatestPost from '@/components/LastestPost';
import PostGrid from '@/components/PostGrid';
import PaginationControl from '@/components/PaginationControl';
import type { BlogPost } from '@/api/blog';
import { fetchAllBlogs, BlogType } from '@/api/blog';

const POSTS_PER_PAGE = 12;

export default function BlogPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [allPosts, setPosts] = useState<BlogPost[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([]);
  const [selectedType, setSelectedType] = useState<BlogType | 'ALL' | 'RECOMMENDED'>('RECOMMENDED');
  const [page, setPage] = useState(1);

  // Load tất cả blogs khi component mount
  useEffect(() => {
    setIsLoading(true);
    fetchAllBlogs()
  .then((data) => {
    const nonPremium = data.filter(post => post.blog_type !== BlogType.PREMIUM);
    setPosts(nonPremium);
    setFilteredPosts(nonPremium);
  })
      .finally(() => setIsLoading(false));
  }, []);

  // Xử lý filter
  useEffect(() => {
    setPage(1); // Reset về trang 1 khi filter thay đổi
    
    if (selectedType === 'ALL') {
      setFilteredPosts(allPosts);
    } else if (selectedType === 'RECOMMENDED') {
      // Sắp xếp theo thời gian tạo mới nhất
      const sorted = [...allPosts].sort((a, b) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setFilteredPosts(sorted);
    } else {
      // Filter theo type cụ thể
      const filtered = allPosts.filter(post => post.blog_type === selectedType);
      setFilteredPosts(filtered);
    }
  }, [selectedType, allPosts]);

  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const currentPosts = filteredPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const latestPost = currentPosts[0] || null;
  const posts = currentPosts.slice(1);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);

  const handleTypeChange = (type: BlogType | 'ALL' | 'RECOMMENDED') => {
    setSelectedType(type);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <FilterBar selectedType={selectedType} onTypeChange={handleTypeChange} />
      <LatestPost post={latestPost} isLoading={isLoading} />
      <PostGrid posts={posts} isLoading={isLoading} />
      <div className="flex justify-center mt-8">
        <PaginationControl page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
}