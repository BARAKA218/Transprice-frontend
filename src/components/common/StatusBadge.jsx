import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const statusMap = {
  DRAFT: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-300',
  PENDING_REVIEW: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  PENDING: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  VERIFIED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  PUBLISHED: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  EXPIRED: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400',
  REJECTED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  ARCHIVED: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400',
  ACTIVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  INACTIVE: 'bg-neutral-100 text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400',
  NEW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  APPROVED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  SUBMITTED: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  PROCESSING: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  COMPLETED: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
}

function formatLabel(status) {
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

export default function StatusBadge({ status, className }) {
  const styles = statusMap[status] || statusMap.DRAFT

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
          styles,
          className
        )
      )}
    >
      {formatLabel(status)}
    </span>
  )
}
