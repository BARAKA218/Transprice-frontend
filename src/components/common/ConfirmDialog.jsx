import { AlertTriangle, Info, AlertCircle } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import Modal from './Modal'
import Button from './Button'

const variantConfig = {
  danger: {
    icon: AlertCircle,
    iconClass: 'text-red-500 bg-red-100 dark:bg-red-900/30',
    buttonVariant: 'danger',
  },
  warning: {
    icon: AlertTriangle,
    iconClass: 'text-amber-500 bg-amber-100 dark:bg-amber-900/30',
    buttonVariant: 'primary',
  },
  info: {
    icon: Info,
    iconClass: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    buttonVariant: 'primary',
  },
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  loading = false,
}) {
  const config = variantConfig[variant]
  const Icon = config.icon

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={false}>
      <div className="flex flex-col items-center text-center">
        <div
          className={twMerge(
            'mb-4 flex h-12 w-12 items-center justify-center rounded-full',
            config.iconClass
          )}
        >
          <Icon size={24} />
        </div>
        <h3 className="mb-2 text-lg font-semibold text-neutral-900 dark:text-neutral-100">
          {title}
        </h3>
        <p className="mb-6 text-sm text-neutral-600 dark:text-neutral-400">{message}</p>
      </div>
      <div className="flex items-center justify-center gap-3">
        <Button variant="outline" onClick={onClose} disabled={loading}>
          {cancelText}
        </Button>
        <Button variant={config.buttonVariant} onClick={onConfirm} loading={loading}>
          {confirmText}
        </Button>
      </div>
    </Modal>
  )
}
