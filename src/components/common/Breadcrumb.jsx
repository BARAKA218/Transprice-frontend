import { ChevronRight, Home } from 'lucide-react'
import { Link } from 'react-router-dom'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export default function Breadcrumb({ items = [], className }) {
  return (
    <nav
      className={twMerge('flex items-center gap-1 text-sm', className)}
      aria-label="Breadcrumb"
    >
      <Link
        to="/"
        className="flex items-center text-neutral-500 transition-colors hover:text-navy-900 dark:text-neutral-400 dark:hover:text-green-500"
      >
        <Home size={16} />
      </Link>
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-1">
          <ChevronRight size={14} className="text-neutral-400" />
          {item.href && idx < items.length - 1 ? (
            <Link
              to={item.href}
              className="text-neutral-500 transition-colors hover:text-navy-900 dark:text-neutral-400 dark:hover:text-green-500"
            >
              {item.label}
            </Link>
          ) : (
            <span
              className={clsx(
                idx === items.length - 1
                  ? 'font-medium text-neutral-900 dark:text-neutral-100'
                  : 'text-neutral-500 dark:text-neutral-400'
              )}
            >
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
