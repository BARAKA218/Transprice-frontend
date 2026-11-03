import { Clock, MapPin, Bus } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import StatusBadge from './StatusBadge'
import SourceBadge from './SourceBadge'

export default function FareCard({
  route,
  transportType,
  fare,
  status,
  sourceName,
  sourceCategory,
  sourceVerified,
  lastUpdated,
  className,
}) {
  return (
    <div
      className={twMerge(
        'rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md',
        'dark:border-neutral-700 dark:bg-neutral-900',
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-lg bg-navy-50 p-2 dark:bg-navy-900/30">
            <Bus size={20} className="text-navy-900 dark:text-navy-300" />
          </div>
          <div>
            <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
              {route}
            </h3>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {transportType}
            </p>
          </div>
        </div>
        {status && <StatusBadge status={status} />}
      </div>

      <div className="mb-4">
        <span className="text-3xl font-bold text-navy-900 dark:text-green-500">
          {typeof fare === 'number' ? fare.toLocaleString() : fare}
        </span>
        <span className="ml-1 text-sm font-medium text-neutral-500 dark:text-neutral-400">
          RWF
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
        {sourceName && (
          <SourceBadge
            sourceName={sourceName}
            sourceCategory={sourceCategory}
            verified={sourceVerified}
          />
        )}
        {lastUpdated && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {lastUpdated}
          </span>
        )}
      </div>
    </div>
  )
}
