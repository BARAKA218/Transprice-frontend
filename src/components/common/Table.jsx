import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import EmptyState from './EmptyState'

export default function Table({
  columns = [],
  data = [],
  emptyMessage = 'No data available',
  onSort,
  className,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null })

  const handleSort = (key, sortable) => {
    if (!sortable) return
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc'
    }
    setSortConfig({ key, direction })
    onSort?.(key, direction)
  }

  const getSortIcon = (key, sortable) => {
    if (!sortable) return null
    if (sortConfig.key !== key) return <ArrowUpDown size={14} className="opacity-40" />
    return sortConfig.direction === 'asc' ? (
      <ArrowUp size={14} />
    ) : (
      <ArrowDown size={14} />
    )
  }

  if (data.length === 0) {
    return (
      <div className="rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
        <EmptyState title={emptyMessage} />
      </div>
    )
  }

  return (
    <div className={twMerge('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            {columns.map((col) => (
              <th
                key={col.key}
                className={twMerge(
                  'px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400',
                  col.sortable && 'cursor-pointer select-none hover:text-neutral-700 dark:hover:text-neutral-300'
                )}
                onClick={() => handleSort(col.key, col.sortable)}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  {getSortIcon(col.key, col.sortable)}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row.id || rowIdx}
              className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50"
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300"
                >
                  {col.render ? col.render(row[col.key], row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
