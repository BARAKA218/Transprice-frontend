import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Clock, ArrowRight, Search } from 'lucide-react'
import Card from '../../components/common/Card'
import SearchBar from '../../components/common/SearchBar'
import Breadcrumb from '../../components/common/Breadcrumb'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import { auditLogService } from '../../services/api'
import { formatDate } from '../../utils/helpers'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function FareHistoryPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => { loadHistory() }, [search])

  const loadHistory = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await auditLogService.getAll({ recordType: 'fare', search })
      setLogs(result.data)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Fares', href: '/admin/fares' }, { label: 'Fare History' }]} />
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Fare History</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Track all fare changes and updates</p>
        </div>
      </motion.div>

      <motion.div variants={fadeIn}>
        <SearchBar placeholder="Search fare history..." value={search} onChange={setSearch} className="w-80" />
      </motion.div>

      <motion.div variants={fadeIn}>
        {loading ? (
          <LoadingSkeleton rows={5} columns={5} className="rounded-xl" />
        ) : error ? (
          <ErrorState message="Failed to load history" onRetry={loadHistory} />
        ) : logs.length === 0 ? (
          <EmptyState title="No history found" description="No fare changes recorded yet" />
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log.id} padding="sm">
                <div className="flex items-center gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-50 dark:bg-green-900/30">
                    <Clock size={18} className="text-navy-900 dark:text-green-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-neutral-900 dark:text-neutral-100">{log.userName}</p>
                      <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs text-neutral-500 dark:bg-neutral-700 dark:text-neutral-400">{log.action}</span>
                    </div>
                    <p className="text-sm text-neutral-500">
                      Record: {log.recordId} | {formatDate(log.createdAt)}
                    </p>
                    {log.oldValue && log.newValue && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        <span className="rounded bg-red-50 px-2 py-0.5 font-mono text-red-600 dark:bg-red-900/20 dark:text-red-400">
                          {JSON.stringify(log.oldValue)}
                        </span>
                        <ArrowRight size={14} className="text-neutral-400" />
                        <span className="rounded bg-green-50 px-2 py-0.5 font-mono text-green-600 dark:bg-green-900/20 dark:text-green-400">
                          {JSON.stringify(log.newValue)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
