import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function PageButton({ page, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'inline-flex h-9 min-w-[36px] items-center justify-center rounded-lg px-3 text-sm font-medium transition-colors',
        active
          ? 'bg-navy-900 text-white dark:bg-green-600'
          : 'text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800'
      )}
    >
      {page}
    </button>
  )
}

export default function Pagination({
  currentPage,
  totalPages,
  totalItems,
  perPage,
  onPageChange,
  onPerPageChange,
  className,
}) {
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    let start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
    let end = Math.min(totalPages, start + maxVisible - 1)

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    return pages
  }

  const pages = getPageNumbers()

  return (
    <div
      className={twMerge(
        'flex flex-wrap items-center justify-between gap-4',
        className
      )}
    >
      {totalItems !== undefined && (
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {totalItems} item{totalItems !== 1 ? 's' : ''}
        </p>
      )}

      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="inline-flex h-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <ChevronsLeft size={16} />
        </button>
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="inline-flex h-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <ChevronLeft size={16} />
        </button>

        {pages[0] > 1 && <span className="px-1 text-neutral-400">...</span>}
        {pages.map((page) => (
          <PageButton
            key={page}
            page={page}
            active={page === currentPage}
            onClick={() => onPageChange(page)}
          />
        ))}
        {pages[pages.length - 1] < totalPages && (
          <span className="px-1 text-neutral-400">...</span>
        )}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="inline-flex h-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <ChevronRight size={16} />
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="inline-flex h-9 items-center justify-center rounded-lg text-neutral-500 hover:bg-neutral-100 disabled:opacity-30 dark:text-neutral-400 dark:hover:bg-neutral-800"
        >
          <ChevronsRight size={16} />
        </button>
      </div>

      {onPerPageChange && (
        <div className="flex items-center gap-2">
          <span className="text-sm text-neutral-500 dark:text-neutral-400">Per page</span>
          <select
            value={perPage}
            onChange={(e) => onPerPageChange(Number(e.target.value))}
            className="rounded-lg border border-neutral-300 bg-white px-2 py-1.5 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          >
            {[10, 25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  )
}
