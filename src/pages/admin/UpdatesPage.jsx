import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Send, Archive, Eye, Edit } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import Breadcrumb from '../../components/common/Breadcrumb'
import { transportUpdateService } from '../../services/api'
import { formatDate, getSourceCategoryLabel } from '../../utils/helpers'
import Select from '../../components/common/Select'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

const categoryLabels = { FARE: 'Fare', ROUTE: 'Route', FUEL: 'Fuel', ANNOUNCEMENT: 'Announcement', SERVICE_UPDATE: 'Service Update', GENERAL: 'General' }

export default function UpdatesPage() {
  const navigate = useNavigate()
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ category: '', status: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const pageSize = 10

  useEffect(() => { loadUpdates() }, [page, search, filters])

  const loadUpdates = async () => {
    setLoading(true); setError(null)
    try {
      const result = await transportUpdateService.getAll({ page, pageSize, search, ...filters })
      setUpdates(result.data); setTotalPages(Math.ceil(result.total / pageSize))
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  const handleStatusChange = async (update, status) => {
    await transportUpdateService.update(update.id, { status })
    loadUpdates()
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Updates' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Transport Updates</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage transport announcements and updates</p>
          </div>
          <Button leftIcon={Plus} onClick={() => navigate('/admin/updates/new')}>New Update</Button>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <SearchBar placeholder="Search updates..." value={search} onChange={setSearch} className="w-80" />
          <Select placeholder="All Categories" options={Object.entries(categoryLabels).map(([v, l]) => ({ value: v, label: l }))} value={filters.category} onChange={(e) => { setFilters((f) => ({ ...f, category: e.target.value })); setPage(1) }} containerClassName="w-48" />
          <Select placeholder="All Status" options={[{ value: 'PUBLISHED', label: 'Published' }, { value: 'DRAFT', label: 'Draft' }, { value: 'ARCHIVED', label: 'Archived' }]} value={filters.status} onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1) }} containerClassName="w-48" />
        </div>

        {loading ? <LoadingSkeleton rows={5} columns={6} className="rounded-xl" /> : error ? <ErrorState message="Failed to load updates" onRetry={loadUpdates} /> : updates.length === 0 ? (
          <EmptyState title="No updates found" description="Create your first update" actionLabel="New Update" onAction={() => navigate('/admin/updates/new')} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Title</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Category</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Published</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {updates.map((update) => (
                  <tr key={update.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{update.title}</td>
                    <td className="px-4 py-3">
                      <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400">{categoryLabels[update.category] || update.category}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={update.status} /></td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{update.source}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(update.publicationDate)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/admin/updates/new?id=${update.id}`)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800"><Edit size={16} /></button>
                        {update.status !== 'PUBLISHED' && <button onClick={() => handleStatusChange(update, 'PUBLISHED')} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-green-600 dark:hover:bg-neutral-800"><Send size={16} /></button>}
                        {update.status === 'PUBLISHED' && <button onClick={() => handleStatusChange(update, 'ARCHIVED')} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-amber-600 dark:hover:bg-neutral-800"><Archive size={16} /></button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && updates.length > 0 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      </motion.div>
    </motion.div>
  )
}
