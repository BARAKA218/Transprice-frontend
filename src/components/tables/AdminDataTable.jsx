import { useState } from 'react'
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, CheckSquare, Square } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import EmptyState from '../common/EmptyState'

function SortIcon({ direction }) {
  if (!direction) return <ArrowUpDown size={14} className="opacity-40" />
  return direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />
}

export default function AdminDataTable({
  columns = [],
  data = [],
  emptyMessage = 'No data available',
  onSort,
  onRowClick,
  bulkActions = [],
  selectable = false,
  className,
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null })
  const [selectedIds, setSelectedIds] = useState([])
  const [openDropdown, setOpenDropdown] = useState(null)

  const handleSort = (key, sortable) => {
    if (!sortable) return
    let direction = 'asc'
    if (sortConfig.key === key && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ key, direction })
    onSort?.(key, direction)
  }

  const toggleSelectAll = () => {
    if (selectedIds.length === data.length) {
      setSelectedIds([])
    } else {
      setSelectedIds(data.map((row) => row.id))
    }
  }

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
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
    <div className={twMerge('overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900', className)}>
      {selectedIds.length > 0 && bulkActions.length > 0 && (
        <div className="flex items-center gap-3 border-b border-neutral-200 bg-neutral-50 px-4 py-2 dark:border-neutral-700 dark:bg-neutral-800">
          <span className="text-sm text-neutral-600 dark:text-neutral-400">
            {selectedIds.length} selected
          </span>
          {bulkActions.map((action) => (
            <button
              key={action.label}
              onClick={() => action.onClick(selectedIds)}
              className="rounded-md bg-navy-900 px-3 py-1.5 text-xs font-medium text-white hover:bg-navy-800 dark:bg-green-600 dark:hover:bg-green-500"
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-200 dark:border-neutral-700">
            {selectable && (
              <th className="w-10 px-4 py-3">
                <button onClick={toggleSelectAll} className="text-neutral-400 hover:text-neutral-600">
                  {selectedIds.length === data.length && data.length > 0 ? (
                    <CheckSquare size={16} />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
              </th>
            )}
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
                  {col.sortable && <SortIcon direction={sortConfig.key === col.key ? sortConfig.direction : null} />}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIdx) => (
            <tr
              key={row.id || rowIdx}
              className={twMerge(
                'border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50',
                onRowClick && 'cursor-pointer',
                selectedIds.includes(row.id) && 'bg-navy-50/50 dark:bg-green-900/10'
              )}
              onClick={() => onRowClick?.(row)}
            >
              {selectable && (
                <td className="w-10 px-4 py-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSelect(row.id)
                    }}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    {selectedIds.includes(row.id) ? (
                      <CheckSquare size={16} className="text-navy-900 dark:text-green-500" />
                    ) : (
                      <Square size={16} />
                    )}
                  </button>
                </td>
              )}
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300"
                  onClick={col.key === 'actions' ? (e) => e.stopPropagation() : undefined}
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
