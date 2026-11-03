import { Globe, Building2, Users, Database, CheckCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const categoryConfig = {
  GOVERNMENT: { icon: Building2, color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  COMMUNITY: { icon: Users, color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' },
  API: { icon: Database, color: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400' },
  WEB: { icon: Globe, color: 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400' },
  DEFAULT: { icon: Globe, color: 'bg-neutral-100 text-neutral-700 dark:bg-neutral-700 dark:text-neutral-400' },
}

export default function SourceBadge({ sourceName, sourceCategory = 'DEFAULT', verified = false, className }) {
  const config = categoryConfig[sourceCategory] || categoryConfig.DEFAULT
  const Icon = config.icon

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
          config.color,
          className
        )
      )}
    >
      <Icon size={12} />
      {sourceName}
      {verified && <CheckCircle size={12} className="text-green-500" />}
    </span>
  )
}
