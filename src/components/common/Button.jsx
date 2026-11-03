import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const variantStyles = {
  primary:
    'bg-navy-900 text-white hover:bg-navy-800 dark:bg-green-600 dark:hover:bg-green-500 shadow-sm',
  secondary:
    'bg-neutral-100 text-neutral-800 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600',
  outline:
    'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300 dark:hover:bg-neutral-800',
  ghost:
    'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800',
  danger:
    'bg-red-600 text-white hover:bg-red-700 shadow-sm',
}

const sizeStyles = {
  sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-md',
  md: 'px-4 py-2 text-sm gap-2 rounded-lg',
  lg: 'px-6 py-3 text-base gap-2.5 rounded-lg',
}

const Button = forwardRef(
  (
    {
      children,
      variant = 'primary',
      size = 'md',
      loading = false,
      disabled = false,
      leftIcon: LeftIcon,
      rightIcon: RightIcon,
      fullWidth = false,
      className,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading

    return (
      <motion.button
        ref={ref}
        type={type}
        disabled={isDisabled}
        whileHover={isDisabled ? undefined : { scale: 1.02 }}
        whileTap={isDisabled ? undefined : { scale: 0.98 }}
        className={twMerge(
          clsx(
            'inline-flex items-center justify-center font-medium transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-900 dark:focus-visible:outline-green-500',
            variantStyles[variant],
            sizeStyles[size],
            fullWidth && 'w-full',
            isDisabled && 'opacity-50 cursor-not-allowed',
            className
          )
        )}
        {...props}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        ) : (
          LeftIcon && <LeftIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        )}
        {children}
        {!loading && RightIcon && (
          <RightIcon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />
        )}
      </motion.button>
    )
  }
)

Button.displayName = 'Button'

export default Button
