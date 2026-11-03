import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export default function NotificationItem({
  icon: Icon,
  title,
  description,
  time,
  read = false,
  onClick,
  className,
}) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        'flex gap-3 rounded-lg border border-transparent p-3 transition-colors',
        onClick && 'cursor-pointer',
        read
          ? 'bg-transparent hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
          : 'bg-navy-50/50 hover:bg-navy-50 dark:bg-green-900/10 dark:hover:bg-green-900/20',
        className
      )}
    >
      {Icon && (
        <div
          className={twMerge(
            'flex h-9 w-9 shrink-0 items-center justify-center rounded-full',
            read
              ? 'bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400'
              : 'bg-navy-100 text-navy-900 dark:bg-green-900/30 dark:text-green-400'
          )}
        >
          <Icon size={16} />
        </div>
      )}
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p
            className={twMerge(
              'text-sm truncate',
              read
                ? 'font-normal text-neutral-600 dark:text-neutral-400'
                : 'font-semibold text-neutral-900 dark:text-neutral-100'
            )}
          >
            {title}
          </p>
          {!read && (
            <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
          )}
        </div>
        {description && (
          <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">
            {description}
          </p>
        )}
        {time && (
          <p className="mt-1 text-xs text-neutral-400 dark:text-neutral-500">{time}</p>
        )}
      </div>
    </div>
  )
}
