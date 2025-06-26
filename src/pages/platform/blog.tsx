import React, { useState, useEffect } from 'react';
import FilterBar from '@/components/FilterBar';
import LatestPost from '@/components/LastestPost';
import PostGrid from '@/components/PostGrid';
import PaginationControl from '@/components/PaginationControl';
import type { BlogPost } from '@/api/blog';
import { fetchAllBlogs } from '@/api/blog';

const POSTS_PER_PAGE = 12;

export default function BlogPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [allPosts, setAllPosts] = useState<BlogPost[]>([]);
  const [page, setPage] = useState(1);

  const startIndex = (page - 1) * POSTS_PER_PAGE;
  const currentPosts = allPosts.slice(startIndex, startIndex + POSTS_PER_PAGE);
  const latestPost = currentPosts[0] || null;
  const posts = currentPosts.slice(1);

  useEffect(() => {
    setIsLoading(true);
    fetchAllBlogs()
      .then(setAllPosts)
      .finally(() => setIsLoading(false));
  }, []);

  const totalPages = Math.ceil(allPosts.length / POSTS_PER_PAGE);

  return (
    <div className="container mx-auto px-4 py-8">
      <FilterBar />
      <LatestPost post={latestPost} isLoading={isLoading} />
      <PostGrid posts={posts} isLoading={isLoading} />
      <div className="flex justify-center mt-8">
        <PaginationControl page={page} setPage={setPage} totalPages={totalPages} />
      </div>
    </div>
  );
}