import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const Select = forwardRef(
  (
    {
      label,
      placeholder = 'Select an option',
      options = [],
      error,
      helperText,
      className,
      containerClassName,
      id,
      disabled = false,
      required = false,
      value,
      ...props
    },
    ref
  ) => {
    const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined)

    return (
      <div className={twMerge('flex flex-col gap-1.5', containerClassName)}>
        {label && (
          <label
            htmlFor={selectId}
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {label}
            {required && <span className="text-red-500 ml-0.5">*</span>}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            disabled={disabled}
            required={required}
            value={value}
            className={twMerge(
              clsx(
                'w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-10 text-sm text-neutral-900',
                'focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900',
                'dark:bg-neutral-800 dark:text-neutral-100',
                'dark:focus:ring-green-500/20 dark:focus:border-green-500',
                'disabled:opacity-50 disabled:cursor-not-allowed',
                error
                  ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                  : 'border-neutral-300 dark:border-neutral-600',
                !value && 'text-neutral-400 dark:text-neutral-500',
                className
              )
            )}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => {
              const optValue = typeof opt === 'string' ? opt : opt.value
              const optLabel = typeof opt === 'string' ? opt : opt.label
              return (
                <option key={optValue} value={optValue}>
                  {optLabel}
                </option>
              )
            })}
          </select>
          <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400">
            <ChevronDown size={18} />
          </div>
        </div>
        {error && <p className="text-xs text-red-500">{error}</p>}
        {!error && helperText && (
          <p className="text-xs text-neutral-500 dark:text-neutral-400">{helperText}</p>
        )}
      </div>
    )
  }
)

Select.displayName = 'Select'

export default Select
