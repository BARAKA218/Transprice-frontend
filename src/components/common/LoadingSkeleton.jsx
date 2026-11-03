import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

function Skeleton({ className }) {
  return (
    <div
      className={twMerge(
        'animate-pulse rounded-md bg-neutral-200 dark:bg-neutral-700',
        className
      )}
    />
  )
}

export function TextSkeleton({ lines = 3, className }) {
  return (
    <div className={twMerge('space-y-3', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={twMerge(
            'h-4',
            i === lines - 1 ? 'w-3/4' : 'w-full'
          )}
        />
      ))}
    </div>
  )
}

export function CardSkeleton({ className }) {
  return (
    <div
      className={twMerge(
        'rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900',
        className
      )}
    >
      <div className="flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-lg" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  )
}

export function TableSkeleton({ rows = 5, columns = 4, className }) {
  return (
    <div className={twMerge('w-full', className)}>
      <div className="flex gap-4 border-b border-neutral-200 pb-3 dark:border-neutral-700">
        {Array.from({ length: columns }).map((_, i) => (
          <Skeleton key={i} className="h-4 flex-1" />
        ))}
      </div>
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="flex gap-4 border-b border-neutral-100 py-3 dark:border-neutral-800">
          {Array.from({ length: columns }).map((_, colIdx) => (
            <Skeleton key={colIdx} className="h-3 flex-1" />
          ))}
        </div>
      ))}
    </div>
  )
}

export function ChartSkeleton({ className }) {
  return (
    <div
      className={twMerge(
        'rounded-xl border border-neutral-200 bg-white p-6 dark:border-neutral-700 dark:bg-neutral-900',
        className
      )}
    >
      <Skeleton className="mb-4 h-4 w-1/4" />
      <div className="flex items-end gap-2 h-48">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton
            key={i}
            className="flex-1"
            style={{ height: `${30 + Math.random() * 70}%` }}
          />
        ))}
      </div>
    </div>
  )
}

export default Skeleton
