import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, Download, Filter } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import Pagination from '../../components/common/Pagination'
import Modal from '../../components/common/Modal'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import Breadcrumb from '../../components/common/Breadcrumb'
import { auditLogService } from '../../services/api'
import { formatDate, formatDateTime } from '../../utils/helpers'
import Select from '../../components/common/Select'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

const actionLabels = { CREATE: 'Created', UPDATE: 'Updated', DELETE: 'Deleted', PUBLISH: 'Published', UNPUBLISH: 'Unpublished', REJECT: 'Rejected', APPROVE: 'Approved', LOGIN: 'Login', LOGOUT: 'Logout', EXPORT: 'Exported' }
const actionColors = { CREATE: 'bg-green-100 text-green-700', UPDATE: 'bg-blue-100 text-blue-700', DELETE: 'bg-red-100 text-red-700', PUBLISH: 'bg-emerald-100 text-emerald-700', UNPUBLISH: 'bg-yellow-100 text-yellow-700', REJECT: 'bg-red-100 text-red-700', APPROVE: 'bg-green-100 text-green-700', LOGIN: 'bg-neutral-100 text-neutral-700', LOGOUT: 'bg-neutral-100 text-neutral-700', EXPORT: 'bg-purple-100 text-purple-700' }

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ action: '', recordType: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showDetail, setShowDetail] = useState(null)
  const pageSize = 15

  useEffect(() => { loadLogs() }, [page, search, filters])

  const loadLogs = async () => {
    setLoading(true); setError(null)
    try {
      const result = await auditLogService.getAll({ page, pageSize, search, ...filters })
      setLogs(result.data); setTotalPages(Math.ceil(result.total / pageSize))
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Audit Logs' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Audit Logs</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Track all system changes and user actions</p>
          </div>
          <Button variant="outline" leftIcon={Download}>Export</Button>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="flex flex-wrap items-end gap-4">
        <SearchBar placeholder="Search logs..." value={search} onChange={setSearch} className="w-80" />
        <Select placeholder="All Actions" options={Object.entries(actionLabels).map(([v, l]) => ({ value: v, label: l }))} value={filters.action} onChange={(e) => { setFilters((f) => ({ ...f, action: e.target.value })); setPage(1) }} containerClassName="w-48" />
        <Select placeholder="All Record Types" options={[{ value: 'fare', label: 'Fare' }, { value: 'route', label: 'Route' }, { value: 'source', label: 'Source' }, { value: 'user', label: 'User' }, { value: 'fuel_price', label: 'Fuel Price' }, { value: 'research', label: 'Research' }, { value: 'complaint', label: 'Complaint' }]} value={filters.recordType} onChange={(e) => { setFilters((f) => ({ ...f, recordType: e.target.value })); setPage(1) }} containerClassName="w-48" />
      </motion.div>

      <motion.div variants={fadeIn}>
        {loading ? <LoadingSkeleton rows={8} columns={7} className="rounded-xl" /> : error ? <ErrorState message="Failed to load logs" onRetry={loadLogs} /> : logs.length === 0 ? (
          <EmptyState title="No logs found" description="No audit logs match your filters" />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Timestamp</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Record Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Record ID</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">IP</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Details</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((log) => (
                  <tr key={log.id} className="border-b border-neutral-100 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 text-sm text-neutral-500">{formatDateTime(log.createdAt)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-900 dark:text-neutral-100">{log.userName}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${actionColors[log.action] || 'bg-neutral-100 text-neutral-700'}`}>{actionLabels[log.action] || log.action}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 capitalize">{log.recordType}</td>
                    <td className="px-4 py-3 font-mono text-xs text-neutral-500">{log.recordId}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{log.ipAddress || 'N/A'}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setShowDetail(log)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800"><Eye size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && logs.length > 0 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      </motion.div>

      <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title="Log Details" size="lg">
        {showDetail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-neutral-500">Timestamp</p><p className="text-sm">{formatDateTime(showDetail.createdAt)}</p></div>
              <div><p className="text-xs text-neutral-500">User</p><p className="text-sm font-medium">{showDetail.userName}</p></div>
              <div><p className="text-xs text-neutral-500">Action</p><p className="text-sm">{actionLabels[showDetail.action]}</p></div>
              <div><p className="text-xs text-neutral-500">Record</p><p className="text-sm capitalize">{showDetail.recordType} ({showDetail.recordId})</p></div>
              <div><p className="text-xs text-neutral-500">IP Address</p><p className="text-sm font-mono">{showDetail.ipAddress || 'N/A'}</p></div>
            </div>
            {showDetail.oldValue && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-neutral-500">Old Value</p>
                <pre className="overflow-auto rounded-lg bg-red-50 p-3 text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">{JSON.stringify(showDetail.oldValue, null, 2)}</pre>
              </div>
            )}
            {showDetail.newValue && (
              <div>
                <p className="mb-1 text-xs font-semibold uppercase text-neutral-500">New Value</p>
                <pre className="overflow-auto rounded-lg bg-green-50 p-3 text-xs text-green-700 dark:bg-green-900/20 dark:text-green-400">{JSON.stringify(showDetail.newValue, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
