import { MapPin, Clock, ArrowRight, Bus } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import StatusBadge from './StatusBadge'

const transportIcons = {
  bus: '🚌',
  moto: '🏍️',
  taxi: '🚕',
  boat: '⛴️',
}

export default function RouteCard({
  name,
  origin,
  destination,
  distance,
  estimatedTime,
  transportTypes = [],
  status,
  onClick,
  className,
}) {
  return (
    <div
      onClick={onClick}
      className={twMerge(
        'rounded-xl border border-neutral-200 bg-white p-5 shadow-sm transition-all hover:shadow-md',
        'dark:border-neutral-700 dark:bg-neutral-900',
        onClick && 'cursor-pointer',
        className
      )}
    >
      <div className="mb-3 flex items-start justify-between">
        <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">
          {name}
        </h3>
        {status && <StatusBadge status={status} />}
      </div>

      <div className="mb-4 flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-green-600 dark:text-green-400" />
          <span>{origin}</span>
        </div>
        <ArrowRight size={14} className="text-neutral-400" />
        <div className="flex items-center gap-1.5">
          <MapPin size={14} className="text-red-500" />
          <span>{destination}</span>
        </div>
      </div>

      <div className="mb-4 flex items-center gap-4 text-xs text-neutral-500 dark:text-neutral-400">
        {distance && (
          <span className="flex items-center gap-1">
            <MapPin size={12} />
            {distance}
          </span>
        )}
        {estimatedTime && (
          <span className="flex items-center gap-1">
            <Clock size={12} />
            {estimatedTime}
          </span>
        )}
      </div>

      {transportTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {transportTypes.map((type) => (
            <span
              key={type}
              className="inline-flex items-center gap-1 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400"
            >
              {transportIcons[type.toLowerCase()] && (
                <span>{transportIcons[type.toLowerCase()]}</span>
              )}
              {type}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
