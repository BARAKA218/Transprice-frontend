import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { FlaskConical, Eye, Check, X, Edit, Send, Clock, AlertTriangle, Filter } from 'lucide-react'
import Card from '../../components/common/Card'
import StatCard from '../../components/common/StatCard'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import Breadcrumb from '../../components/common/Breadcrumb'
import { researchService } from '../../services/api'
import { formatDate, getTransportTypeLabel, formatCurrency } from '../../utils/helpers'
import Select from '../../components/common/Select'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

const typeLabels = { fare: 'Fare', route: 'Route', fuel: 'Fuel', announcement: 'Announcement' }
const typeColors = { fare: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', route: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', fuel: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400', announcement: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400' }

export default function ResearchPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ type: '', status: '' })

  useEffect(() => { loadResearch() }, [search, filters])

  const loadResearch = async () => {
    setLoading(true); setError(null)
    try {
      const result = await researchService.getAll({ search, ...filters })
      setItems(result.data)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  const handleAction = async (item, action) => {
    const statusMap = { approve: 'APPROVED', reject: 'REJECTED', publish: 'PUBLISHED' }
    await researchService.update(item.id, { status: statusMap[action] })
    loadResearch()
  }

  const stats = {
    new: items.filter((i) => i.status === 'NEW').length,
    pending: items.filter((i) => i.status === 'PENDING_VERIFICATION').length,
    approved: items.filter((i) => i.status === 'APPROVED').length,
    rejected: items.filter((i) => i.status === 'REJECTED').length,
    published: items.filter((i) => i.status === 'PUBLISHED').length,
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Research' }]} />
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Research & Discovery</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Review and verify discovered transport data</p>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="grid grid-cols-2 gap-4 sm:grid-cols-5">
        <StatCard icon={Clock} label="New" value={stats.new} color="blue" />
        <StatCard icon={AlertTriangle} label="Pending" value={stats.pending} color="amber" />
        <StatCard icon={Check} label="Approved" value={stats.approved} color="green" />
        <StatCard icon={X} label="Rejected" value={stats.rejected} color="red" />
        <StatCard icon={Send} label="Published" value={stats.published} color="navy" />
      </motion.div>

      <motion.div variants={fadeIn} className="flex flex-wrap items-end gap-4">
        <SearchBar placeholder="Search research..." value={search} onChange={setSearch} className="w-80" />
        <Select placeholder="All Types" options={Object.entries(typeLabels).map(([v, l]) => ({ value: v, label: l }))} value={filters.type} onChange={(e) => setFilters((f) => ({ ...f, type: e.target.value }))} containerClassName="w-48" />
        <Select placeholder="All Status" options={[{ value: 'NEW', label: 'New' }, { value: 'PENDING_VERIFICATION', label: 'Pending' }, { value: 'APPROVED', label: 'Approved' }, { value: 'REJECTED', label: 'Rejected' }, { value: 'PUBLISHED', label: 'Published' }]} value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} containerClassName="w-48" />
      </motion.div>

      <motion.div variants={fadeIn}>
        {loading ? <LoadingSkeleton rows={5} columns={5} className="rounded-xl" /> : error ? <ErrorState message="Failed to load" onRetry={loadResearch} /> : items.length === 0 ? (
          <EmptyState title="No research items found" description="No discoveries match your filters" />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <Card key={item.id} padding="sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-start gap-3">
                    <div className="rounded-lg bg-neutral-100 p-2 dark:bg-neutral-800">
                      <FlaskConical size={18} className="text-neutral-500" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{item.title}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${typeColors[item.type]}`}>{typeLabels[item.type]}</span>
                        <StatusBadge status={item.status} />
                      </div>
                      <p className="mt-1 text-xs text-neutral-500">
                        Source: {item.sourceName} | Discovered: {formatDate(item.discoveryDate)}
                        {item.routeName && ` | Route: ${item.routeName}`}
                      </p>
                      {(item.oldFare || item.newFare) && (
                        <p className="mt-1 text-sm">
                          {item.oldFare && <span className="text-red-500 line-through">{formatCurrency(item.oldFare)}</span>}
                          {item.oldFare && item.newFare && <span className="mx-2">→</span>}
                          {item.newFare && <span className="font-semibold text-green-600">{formatCurrency(item.newFare)}</span>}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" leftIcon={Eye} onClick={() => navigate(`/admin/research/${item.id}`)}>Review</Button>
                    {(item.status === 'NEW' || item.status === 'PENDING_VERIFICATION') && (
                      <>
                        <Button variant="ghost" size="sm" onClick={() => handleAction(item, 'approve')} className="text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"><Check size={14} /></Button>
                        <Button variant="ghost" size="sm" onClick={() => handleAction(item, 'reject')} className="text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"><X size={14} /></Button>
                      </>
                    )}
                    {item.status === 'APPROVED' && (
                      <Button variant="ghost" size="sm" onClick={() => handleAction(item, 'publish')} className="text-blue-600"><Send size={14} /></Button>
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
