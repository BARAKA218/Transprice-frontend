import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export default function Tabs({
  tabs = [],
  activeTab,
  onChange,
  className,
}) {
  const [internalActive, setInternalActive] = useState(activeTab || tabs[0]?.key)
  const currentTab = activeTab !== undefined ? activeTab : internalActive
  const [indicatorStyle, setIndicatorStyle] = useState({})
  const containerRef = useRef(null)
  const tabRefs = useRef({})

  useEffect(() => {
    const currentEl = tabRefs.current[currentTab]
    if (currentEl && containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const tabRect = currentEl.getBoundingClientRect()
      setIndicatorStyle({
        left: tabRect.left - containerRect.left,
        width: tabRect.width,
      })
    }
  }, [currentTab])

  const handleChange = (key) => {
    setInternalActive(key)
    onChange?.(key)
  }

  const activeContent = tabs.find((t) => t.key === currentTab)

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative flex gap-1 border-b border-neutral-200 dark:border-neutral-700"
      >
        {tabs.map((tab) => (
          <button
            key={tab.key}
            ref={(el) => (tabRefs.current[tab.key] = el)}
            onClick={() => handleChange(tab.key)}
            className={twMerge(
              'relative px-4 py-2.5 text-sm font-medium transition-colors',
              currentTab === tab.key
                ? 'text-navy-900 dark:text-green-500'
                : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
            )}
          >
            <div className="flex items-center gap-2">
              {tab.icon && <tab.icon size={16} />}
              {tab.label}
              {tab.count !== undefined && (
                <span className="rounded-full bg-neutral-100 px-1.5 py-0.5 text-xs dark:bg-neutral-800">
                  {tab.count}
                </span>
              )}
            </div>
          </button>
        ))}
        <motion.div
          className="absolute bottom-0 h-0.5 bg-navy-900 dark:bg-green-500"
          animate={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      </div>
      {activeContent?.content && (
        <div className="pt-4">{activeContent.content}</div>
      )}
    </div>
  )
}
