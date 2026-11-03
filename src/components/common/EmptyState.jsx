import { Inbox } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Button from './Button'

export default function EmptyState({
  icon: Icon = Inbox,
  title = 'No data found',
  description,
  actionLabel,
  onAction,
  className,
}) {
  return (
    <div
      className={twMerge(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
    >
      <div className="mb-4 rounded-full bg-neutral-100 p-4 dark:bg-neutral-800">
        <Icon size={32} className="text-neutral-400" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {title}
      </h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  )
}
