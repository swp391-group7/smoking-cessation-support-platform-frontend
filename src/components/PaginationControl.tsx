import React from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from '@/components/ui/pagination';

interface PaginationControlProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
}

export default function PaginationControl({ page, setPage, totalPages }: PaginationControlProps) {
  return (
    <Pagination>
      <PaginationContent>
        {/* Previous button: nếu page === 1 thì không gọi setPage */}
        <PaginationItem>
          <PaginationPrevious
            onClick={() => {
              if (page > 1) setPage(prev => prev - 1);
            }}
          />
        </PaginationItem>

        {/* Page numbers */}
        {[...Array(totalPages)].map((_, idx) => {
          const pageNum = idx + 1;
          return (
            <PaginationItem key={pageNum}>
              <PaginationLink
                onClick={() => {
                  if (page !== pageNum) setPage(pageNum);
                }}
                isActive={page === pageNum}
              >
                {pageNum}
              </PaginationLink>
            </PaginationItem>
          );
        })}

        {/* Ellipsis */}
        <PaginationItem><PaginationEllipsis /></PaginationItem>

        {/* Next button */}
        <PaginationItem>
          <PaginationNext
            onClick={() => {
              if (page < totalPages) setPage(prev => prev + 1);
            }}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
