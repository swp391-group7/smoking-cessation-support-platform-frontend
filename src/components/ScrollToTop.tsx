// src/components/ScrollToTop.tsx
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Cuộn về đầu trang mỗi khi 'pathname' (đường dẫn URL) thay đổi
    window.scrollTo(0, 0);
  }, [pathname]); // Dependency array: useEffect sẽ chạy lại khi 'pathname' thay đổi

  return null; // Component này không render gì cả, chỉ xử lý logic
}

export default ScrollToTop;