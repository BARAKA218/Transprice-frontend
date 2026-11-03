import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const sizeStyles = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
}

const modalVariants = {
  hidden: { opacity: 0, scale: 0.95, y: 10 },
  visible: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: 10 },
}

export default function Modal({
  isOpen,
  onClose,
  title,
  size = 'md',
  children,
  footer,
  showCloseButton = true,
  closeOnOverlay = true,
  closeOnEscape = true,
  className,
}) {
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape' && closeOnEscape) {
        onClose()
      }
    },
    [closeOnEscape, onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="absolute inset-0 bg-black/50 dark:bg-black/70"
            onClick={closeOnOverlay ? onClose : undefined}
          />
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={twMerge(
              clsx(
                'relative w-full rounded-xl bg-white shadow-xl dark:bg-neutral-900',
                sizeStyles[size],
                className
              )
            )}
          >
            {(title || showCloseButton) && (
              <div className="flex items-center justify-between border-b border-neutral-200 px-6 py-4 dark:border-neutral-700">
                {title && (
                  <h2 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">
                    {title}
                  </h2>
                )}
                {showCloseButton && (
                  <button
                    onClick={onClose}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800 dark:hover:text-neutral-300"
                  >
                    <X size={18} />
                  </button>
                )}
              </div>
            )}
            <div className="px-6 py-4">{children}</div>
            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-neutral-200 px-6 py-4 dark:border-neutral-700">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
