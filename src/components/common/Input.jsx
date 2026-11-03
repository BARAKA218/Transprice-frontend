import { forwardRef, useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const Input = forwardRef(
  (
    {
      label,
      type = 'text',
      placeholder,
      error,
      helperText,
      icon: Icon,
      className,
      containerClassName,
      id,
      disabled = false,
      required = false,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const isPassword = type === 'password'
    const inputType = isPassword && showPassword ? 'text' : type
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={twMerge('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
              <Icon size={18} />
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={inputType}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            className={twMerge(
              clsx(
                'w-full rounded-lg border bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400',
                'focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900',
                'dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500',
                'dark:focus:ring-green-500/20 dark:focus:border-green-500',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                Icon && 'pl-10',
                isPassword && 'pr-10',
                error
                  ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500 dark:focus:ring-red-500/20 dark:focus:border-red-500'
                  : 'border-neutral-300 dark:border-neutral-600',
                className
              )
            )}
            {...props}
          />
          {isPassword && (
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          )}
        </div>
        {error && (
          <p className="text-xs text-red-500">{error}</p>
        )}
        {!error && helperText && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
