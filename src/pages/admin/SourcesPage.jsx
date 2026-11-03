import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Activity, Globe, CheckCircle, AlertTriangle } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import Modal from '../../components/common/Modal'
import Breadcrumb from '../../components/common/Breadcrumb'
import { sourceService } from '../../services/api'
import { formatDate, getSourceCategoryLabel, getStatusColor, getStatusLabel } from '../../utils/helpers'
import Select from '../../components/common/Select'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function SourcesPage() {
  const navigate = useNavigate()
  const [sources, setSources] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ category: '', status: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [checkingId, setCheckingId] = useState(null)
  const [showDetail, setShowDetail] = useState(null)
  const pageSize = 10

  useEffect(() => { loadSources() }, [page, search, filters])

  const loadSources = async () => {
    setLoading(true); setError(null)
    try {
      const result = await sourceService.getAll({ page, pageSize, search, ...filters })
      setSources(result.data); setTotalPages(Math.ceil(result.total / pageSize))
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  const checkHealth = async (source) => {
    setCheckingId(source.id)
    await new Promise((r) => setTimeout(r, 1500))
    await sourceService.update(source.id, { lastChecked: new Date().toISOString().split('T')[0] })
    setCheckingId(null)
    loadSources()
  }

  const reliabilityColor = (level) => {
    const c = { high: 'text-green-600 bg-green-50', medium: 'text-amber-600 bg-amber-50', low: 'text-red-600 bg-red-50' }
    return c[level] || c.medium
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Sources' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Sources</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage data sources for fare information</p>
          </div>
          <Button leftIcon={Plus} onClick={() => navigate('/admin/sources/new')}>Add Source</Button>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="flex flex-wrap items-end gap-4">
        <SearchBar placeholder="Search sources..." value={search} onChange={setSearch} className="w-80" />
        <Select placeholder="All Categories" options={[{ value: 'OFFICIAL', label: 'Official' }, { value: 'PUBLIC_INSTITUTION', label: 'Public Institution' }, { value: 'OPERATOR', label: 'Operator' }, { value: 'NEWS', label: 'News' }, { value: 'API', label: 'API' }]} value={filters.category} onChange={(e) => { setFilters((f) => ({ ...f, category: e.target.value })); setPage(1) }} containerClassName="w-48" />
        <Select placeholder="All Status" options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }, { value: 'PENDING_REVIEW', label: 'Pending Review' }, { value: 'BLOCKED', label: 'Blocked' }]} value={filters.status} onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1) }} containerClassName="w-48" />
      </motion.div>

      <motion.div variants={fadeIn}>
        {loading ? <LoadingSkeleton rows={5} columns={7} className="rounded-xl" /> : error ? <ErrorState message="Failed to load sources" onRetry={loadSources} /> : sources.length === 0 ? (
          <EmptyState title="No sources found" actionLabel="Add Source" onAction={() => navigate('/admin/sources/new')} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Website</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Reliability</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Last Checked</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {sources.map((source) => (
                  <tr key={source.id} className="border-b border-neutral-100 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3">
                      <button onClick={() => setShowDetail(source)} className="font-medium text-neutral-900 hover:underline dark:text-neutral-100">{source.name}</button>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{source.website || 'N/A'}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{getSourceCategoryLabel(source.category)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${reliabilityColor(source.reliabilityLevel)}`}>{source.reliabilityLevel}</span>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={source.status} /></td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(source.lastChecked)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => checkHealth(source)} disabled={checkingId === source.id} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-green-600 dark:hover:bg-neutral-800 disabled:opacity-50">
                          {checkingId === source.id ? <Activity size={16} className="animate-spin" /> : <Activity size={16} />}
                        </button>
                        <button onClick={() => navigate(`/admin/sources/new?id=${source.id}`)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800"><Edit size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {!loading && sources.length > 0 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      </motion.div>

      <Modal isOpen={!!showDetail} onClose={() => setShowDetail(null)} title="Source Details" size="lg">
        {showDetail && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-navy-50 p-2 dark:bg-green-900/30"><Globe size={20} className="text-navy-900 dark:text-green-500" /></div>
              <div>
                <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{showDetail.name}</h3>
                <p className="text-sm text-neutral-500">{showDetail.website || 'No website'}</p>
              </div>
            </div>
            <p className="text-sm text-neutral-600 dark:text-neutral-400">{showDetail.description}</p>
            <div className="grid grid-cols-2 gap-4">
              <div><p className="text-xs text-neutral-500">Category</p><p className="text-sm">{getSourceCategoryLabel(showDetail.category)}</p></div>
              <div><p className="text-xs text-neutral-500">Reliability</p><span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${reliabilityColor(showDetail.reliabilityLevel)}`}>{showDetail.reliabilityLevel}</span></div>
              <div><p className="text-xs text-neutral-500">Status</p><StatusBadge status={showDetail.status} /></div>
              <div><p className="text-xs text-neutral-500">Last Checked</p><p className="text-sm">{formatDate(showDetail.lastChecked)}</p></div>
            </div>
            {showDetail.notes && <div><p className="text-xs text-neutral-500">Notes</p><p className="text-sm text-neutral-600">{showDetail.notes}</p></div>}
          </div>
        )}
      </Modal>
    </motion.div>
  )
}
