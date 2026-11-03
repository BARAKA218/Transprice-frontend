import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export default function SearchBar({
  placeholder = 'Search...',
  value: controlledValue,
  onChange,
  onClear,
  className,
}) {
  const [internalValue, setInternalValue] = useState(controlledValue || '')

  useEffect(() => {
    if (controlledValue !== undefined) {
      setInternalValue(controlledValue)
    }
  }, [controlledValue])

  const debouncedOnChange = useCallback(
    (() => {
      let timer
      return (val) => {
        clearTimeout(timer)
        timer = setTimeout(() => onChange?.(val), 300)
      }
    })(),
    [onChange]
  )

  const handleChange = (e) => {
    const val = e.target.value
    setInternalValue(val)
    debouncedOnChange(val)
  }

  const handleClear = () => {
    setInternalValue('')
    onChange?.('')
    onClear?.()
  }

  return (
    <div className={twMerge('relative', className)}>
      <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400">
        <Search size={18} />
      </div>
      <input
        type="text"
        value={internalValue}
        onChange={handleChange}
        placeholder={placeholder}
        className={twMerge(
          'w-full rounded-lg border border-neutral-300 bg-white py-2 pl-10 pr-10 text-sm text-neutral-900 placeholder:text-neutral-400',
          'focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20',
          'dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:placeholder:text-neutral-500',
          'dark:focus:border-green-500 dark:focus:ring-green-500/20'
        )}
      />
      {internalValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300"
        >
          <X size={16} />
        </button>
      )}
    </div>
  )
}
