import React, { useState, useEffect } from 'react';
import FilterBar from './../../components/FilterBar';
import LatestPost from './../../components/LastestPost';
import PostGrid from './../../components/PostGrid';
import PaginationControl from './../../components/PaginationControl';

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  date: string;
  image: string;
}

const POSTS_PER_PAGE = 13;
const TOTAL_PAGES = 3;

export default function BlogPost() {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [latestPost, setLatestPost] = useState<Post | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [page, setPage] = useState<number>(1);

  useEffect(() => {
    setIsLoading(true);
    setTimeout(() => {
      const allPosts: Post[] = Array.from({ length: POSTS_PER_PAGE }, (_, i) => ({
        id: (page - 1) * POSTS_PER_PAGE + i + 1,
        title: `Blog Post Title ${(page - 1) * POSTS_PER_PAGE + i + 1}`,
        excerpt: `This is a short excerpt of the blog post #${(page - 1) * POSTS_PER_PAGE + i + 1}.`,
        date: new Date().toLocaleDateString(),
        image: 'https://via.placeholder.com/600x400?text=Post+Image'
      }));
      setLatestPost(allPosts[0]);
      setPosts(allPosts.slice(1));
      setIsLoading(false);
    }, 1000);
  }, [page]);

  return (
    <div className="container mx-auto px-4 py-8">
      <FilterBar />
      <LatestPost post={latestPost} isLoading={isLoading} />
      <PostGrid posts={posts} isLoading={isLoading} />
      <div className="flex justify-center mt-8">
        <PaginationControl page={page} setPage={setPage} totalPages={TOTAL_PAGES} />
      </div>
    </div>
  );
}