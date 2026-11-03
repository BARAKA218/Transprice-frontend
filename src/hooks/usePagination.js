import { useState, useCallback, useMemo } from 'react';

/**
 * A hook that provides pagination state and controls.
 * @param {Object} options
 * @param {number} options.totalItems - Total number of items
 * @param {number} options.pageSize - Items per page (default 10)
 * @param {number} options.initialPage - Starting page (default 1)
 * @returns {Object} Pagination state and controls
 */
export default function usePagination({
  totalItems = 0,
  pageSize = 10,
  initialPage = 1,
} = {}) {
  const [currentPage, setCurrentPage] = useState(initialPage);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(totalItems / pageSize)),
    [totalItems, pageSize]
  );

  const goToPage = useCallback(
    (page) => {
      const p = Math.max(1, Math.min(page, totalPages));
      setCurrentPage(p);
    },
    [totalPages]
  );

  const nextPage = useCallback(() => {
    goToPage(currentPage + 1);
  }, [currentPage, goToPage]);

  const prevPage = useCallback(() => {
    goToPage(currentPage - 1);
  }, [currentPage, goToPage]);

  const firstPage = useCallback(() => {
    goToPage(1);
  }, [goToPage]);

  const lastPage = useCallback(() => {
    goToPage(totalPages);
  }, [goToPage, totalPages]);

  const resetPage = useCallback(() => {
    setCurrentPage(1);
  }, []);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);

  const canNextPage = currentPage < totalPages;
  const canPrevPage = currentPage > 1;

  const pageNumbers = useMemo(() => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let end = Math.min(totalPages, start + maxVisible - 1);
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }, [currentPage, totalPages]);

  return {
    currentPage,
    totalPages,
    totalItems,
    pageSize,
    startIndex,
    endIndex,
    canNextPage,
    canPrevPage,
    pageNumbers,
    goToPage,
    nextPage,
    prevPage,
    firstPage,
    lastPage,
    resetPage,
  };
}
