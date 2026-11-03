import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  children,
  header,
  footer,
  hover = false,
  padding = 'md',
  className,
  ...props
}) {
  return (
    <div
      className={twMerge(
        clsx(
          'rounded-xl border border-neutral-200 bg-white shadow-sm',
          'dark:border-neutral-700 dark:bg-neutral-900',
          hover && 'transition-shadow duration-200 hover:shadow-md cursor-pointer',
          !header && padding !== 'none' && paddingStyles[padding],
          className
        ))}
      >
        {header && (
          <div
            className={twMerge(
              'border-b border-neutral-200 dark:border-neutral-700',
              paddingStyles[padding]
            )}
          >
            {header}
          </div>
        )}
        {header ? (
          <div className={paddingStyles[padding]}>{children}</div>
        ) : (
          children
        )}
        {footer && (
          <div
            className={twMerge(
              'border-t border-neutral-200 dark:border-neutral-700',
              paddingStyles[padding]
            )}
          >
            {footer}
          </div>
        )}
      </div>
  )
}
