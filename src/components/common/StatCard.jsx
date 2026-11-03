import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const trendConfig = {
  up: { icon: TrendingUp, color: 'text-green-600 dark:text-green-400' },
  down: { icon: TrendingDown, color: 'text-red-500 dark:text-red-400' },
  neutral: { icon: Minus, color: 'text-neutral-400' },
}

const colorStyles = {
  navy: 'bg-navy-50 text-navy-900 dark:bg-navy-900/30 dark:text-navy-300',
  green: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  red: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  blue: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  amber: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
}

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  trendValue,
  color = 'navy',
  className,
}) {
  const trendInfo = trend ? trendConfig[trend] : null
  const TrendIcon = trendInfo?.icon

  return (
    <div
      className={twMerge(
        'rounded-xl border border-neutral-200 bg-white p-5 shadow-sm dark:border-neutral-700 dark:bg-neutral-900',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
            {label}
          </span>
          <span className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
            {value}
          </span>
        </div>
        {Icon && (
          <div className={twMerge('rounded-lg p-2.5', colorStyles[color])}>
            <Icon size={20} />
          </div>
        )}
      </div>
      {(trend || trendValue) && trendInfo && (
        <div className="mt-3 flex items-center gap-1.5">
          <TrendIcon size={14} className={trendInfo.color} />
          {trendValue && (
            <span className={twMerge('text-xs font-medium', trendInfo.color)}>
              {trendValue}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
