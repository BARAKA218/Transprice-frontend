import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Eye, MessageSquare, UserCheck, AlertTriangle } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import Modal from '../../components/common/Modal'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import Breadcrumb from '../../components/common/Breadcrumb'
import { complaintService } from '../../services/api'
import { formatDate, getStatusLabel } from '../../utils/helpers'
import Select from '../../components/common/Select'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

const categoryLabels = {
  OVERCHARGING: 'Overcharging', ROUTE_DEVIATION: 'Route Deviation', VEHICLE_CONDITION: 'Vehicle Condition',
  DRIVER_BEHAVIOR: 'Driver Behavior', SAFETY: 'Safety', LATE_SERVICE: 'Late Service',
  REFUSAL_TO_CARRY: 'Refusal to Carry', OTHER: 'Other',
}

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: '', category: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [showDetail, setShowDetail] = useState(null)
  const [responseText, setResponseText] = useState('')
  const pageSize = 10

  useEffect(() => { loadComplaints() }, [page, search, filters])

  const loadComplaints = async () => {
    setLoading(true); setError(null)
    try {
      const result = await complaintService.getAll({ page, pageSize, search, ...filters })
      setComplaints(result.data); setTotalPages(Math.ceil(result.total / pageSize))
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  const handleStatusChange = async (complaint, status) => {
    await complaintService.update(complaint.id, { status })
    setShowDetail(null); loadComplaints()
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Complaints' }]} />
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Complaints</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage user complaints and feedback</p>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="flex flex-wrap items-end gap-4">
        <SearchBar placeholder="Search complaints..." value={search} onChange={setSearch} className="w-80" />
        <Select placeholder="All Status" options={[{ value: 'OPEN', label: 'Open' }, { value: 'IN_PROGRESS', label: 'In Progress' }, { value: 'RESOLVED', label: 'Resolved' }, { value: 'CLOSED', label: 'Closed' }]} value={filters.status} onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1) }} containerClassName="w-48" />
        <Select placeholder="All Categories" options={Object.entries(categoryLabels).map(([v, l]) => ({ value: v, label: l }))} value={filters.category} onChange={(e) => { setFilters((f) => ({ ...f, category: e.target.value })); setPage(1) }} containerClassName="w-48" />
      </motion.div>

      <motion.div variants={fadeIn}>
        {loading ? <LoadingSkeleton rows={5} columns={6} className="rounded-xl" /> : error ? <ErrorState message="Failed to load" onRetry={loadComplaints} /> : complaints.length === 0 ? (
          <EmptyState title="No complaints found" description="No complaints match your filters" />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">User</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Date</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <tr key={c.id} className="border-b border-neutral-100 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{c.userName}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600">{categoryLabels[c.category] || c.category}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{c.route}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(c.createdAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => { setShowDetail(c); setResponseText('') }} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800"><Eye size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && complaints.length > 0 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      </motion.div>

      <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title="Complaint Details" size="lg">
        {showDetail && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-neutral-500">User</p><p className="text-sm font-medium">{showDetail.userName}</p></div>
              <div><p className="text-xs text-neutral-500">Category</p><p className="text-sm">{categoryLabels[showDetail.category]}</p></div>
              <div><p className="text-xs text-neutral-500">Route</p><p className="text-sm">{showDetail.route}</p></div>
              <div><p className="text-xs text-neutral-500">Status</p><StatusBadge status={showDetail.status} /></div>
            </div>
            <div>
              <p className="text-xs text-neutral-500">Description</p>
              <p className="mt-1 text-sm text-neutral-700 dark:text-neutral-300">{showDetail.description}</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Response</label>
              <textarea value={responseText} onChange={(e) => setResponseText(e.target.value)} rows={3} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Write a response..." />
            </div>
            <div className="flex gap-2">
              {showDetail.status !== 'IN_PROGRESS' && <Button variant="secondary" onClick={() => handleStatusChange(showDetail, 'IN_PROGRESS')}>Mark In Progress</Button>}
              {showDetail.status !== 'RESOLVED' && <Button variant="primary" onClick={() => handleStatusChange(showDetail, 'RESOLVED')}>Resolve</Button>}
              {showDetail.status !== 'CLOSED' && <Button variant="outline" onClick={() => handleStatusChange(showDetail, 'CLOSED')}>Close</Button>}
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
