import { Filter, X } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Select from './Select'
import Button from './Button'

export default function FilterBar({ filters = [], onChange, onClear, className }) {
  const hasActiveFilters = filters.some((f) => f.value && f.value !== '')

  return (
    <div
      className={twMerge(
        'flex flex-wrap items-end gap-3 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm',
        'dark:border-neutral-700 dark:bg-neutral-900',
        className
      )}
    >
      <div className="flex items-center gap-2 text-sm font-medium text-neutral-600 dark:text-neutral-400">
        <Filter size={16} />
        Filters
      </div>
      <div className="flex flex-1 flex-wrap items-end gap-3">
        {filters.map((filter) => (
          <div key={filter.name} className="min-w-[160px]">
            <Select
              label={filter.label}
              placeholder={`All ${filter.label}s`}
              options={filter.options}
              value={filter.value || ''}
              onChange={(e) =>
                onChange?.(filter.name, e.target.value)
              }
            />
          </div>
        ))}
      </div>
      {hasActiveFilters && (
        <Button variant="ghost" size="sm" onClick={onClear}>
          <X size={14} />
          Clear
        </Button>
      )}
    </div>
  )
}
