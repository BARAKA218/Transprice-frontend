import { AlertTriangle } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Button from './Button'

export default function ErrorState({
  icon: Icon = AlertTriangle,
  message = 'Something went wrong',
  description,
  onRetry,
  retryText = 'Try Again',
  className,
}) {
  return (
    <div
      className={twMerge(
        'flex flex-col items-center justify-center py-16 text-center',
        className
      )}
    >
      <div className="mb-4 rounded-full bg-red-100 p-4 dark:bg-red-900/30">
        <Icon size={32} className="text-red-500" />
      </div>
      <h3 className="mb-1 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
        {message}
      </h3>
      {description && (
        <p className="mb-4 max-w-sm text-sm text-neutral-500 dark:text-neutral-400">
          {description}
        </p>
      )}
      {onRetry && (
        <Button variant="outline" size="sm" onClick={onRetry}>
          {retryText}
        </Button>
      )}
    </div>
  )
}
