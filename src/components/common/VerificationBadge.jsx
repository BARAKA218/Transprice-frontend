import { Shield, ShieldCheck, ShieldAlert, ShieldQuestion } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const stateConfig = {
  UNVERIFIED: {
    icon: Shield,
    label: 'Unverified',
    styles: 'bg-neutral-100 text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400',
  },
  UNDER_REVIEW: {
    icon: ShieldQuestion,
    label: 'Under Review',
    styles: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  VERIFIED: {
    icon: ShieldCheck,
    label: 'Verified',
    styles: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  REJECTED: {
    icon: ShieldAlert,
    label: 'Rejected',
    styles: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
  },
}

export default function VerificationBadge({ status = 'UNVERIFIED', className }) {
  const config = stateConfig[status] || stateConfig.UNVERIFIED
  const Icon = config.icon

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
          config.styles,
          className
        )
      )}
    >
      <Icon size={14} />
      {config.label}
    </span>
  )
}
