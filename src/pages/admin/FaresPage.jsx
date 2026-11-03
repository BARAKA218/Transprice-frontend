import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, MoreVertical, Eye, Edit, Copy, Send, Archive, History } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import Breadcrumb from '../../components/common/Breadcrumb'
import { fareService } from '../../services/api'
import { mockDistricts } from '../../data/mockData'
import { formatDate, formatCurrency, getTransportTypeLabel } from '../../utils/helpers'
import Select from '../../components/common/Select'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function FaresPage() {
  const navigate = useNavigate()
  const [fares, setFares] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ status: '', transportType: '', district: '', source: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const [activeDropdown, setActiveDropdown] = useState(null)
  const pageSize = 10

  useEffect(() => { loadFares() }, [page, search, filters])

  const loadFares = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await fareService.getFares({ page, pageSize, search, ...filters })
      setFares(result.data)
      setTotalPages(Math.ceil(result.total / pageSize))
      setTotalItems(result.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async (action, fare) => {
    setActiveDropdown(null)
    switch (action) {
      case 'publish':
        await fareService.updateFare(fare.id, { status: 'PUBLISHED' })
        break
      case 'unpublish':
        await fareService.updateFare(fare.id, { status: 'DRAFT' })
        break
      case 'archive':
        await fareService.updateFare(fare.id, { status: 'ARCHIVED' })
        break
      case 'duplicate':
        await fareService.createFare({ ...fare, id: undefined, status: 'DRAFT', verificationStatus: 'UNVERIFIED' })
        break
      case 'history':
        navigate('/admin/fares/history')
        return
    }
    loadFares()
  }

  const dropdownActions = [
    { key: 'view', label: 'View Details', icon: Eye },
    { key: 'edit', label: 'Edit', icon: Edit },
    { key: 'duplicate', label: 'Duplicate', icon: Copy },
    { key: 'publish', label: 'Publish', icon: Send },
    { key: 'unpublish', label: 'Unpublish', icon: Send },
    { key: 'archive', label: 'Archive', icon: Archive },
    { key: 'history', label: 'View History', icon: History },
  ]

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Fares' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Fares</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage transport fares across Rwanda</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" leftIcon={History} onClick={() => navigate('/admin/fares/history')}>History</Button>
            <Button leftIcon={Plus} onClick={() => navigate('/admin/fares/new')}>Add Fare</Button>
          </div>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <SearchBar placeholder="Search fares..." value={search} onChange={setSearch} className="w-80" />
          <Select placeholder="All Status" options={[{ value: 'PUBLISHED', label: 'Published' }, { value: 'DRAFT', label: 'Draft' }, { value: 'PENDING_REVIEW', label: 'Pending Review' }, { value: 'EXPIRED', label: 'Expired' }, { value: 'ARCHIVED', label: 'Archived' }]} value={filters.status} onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1) }} containerClassName="w-48" />
          <Select placeholder="All Transport" options={[{ value: 'bus', label: 'Bus' }, { value: 'moto', label: 'Moto' }, { value: 'taxi', label: 'Taxi' }, { value: 'minibus', label: 'Minibus' }]} value={filters.transportType} onChange={(e) => { setFilters((f) => ({ ...f, transportType: e.target.value })); setPage(1) }} containerClassName="w-48" />
          <Select placeholder="All Districts" options={mockDistricts.map((d) => ({ value: d.name, label: d.name }))} value={filters.district} onChange={(e) => { setFilters((f) => ({ ...f, district: e.target.value })); setPage(1) }} containerClassName="w-48" />
        </div>

        {loading ? (
          <LoadingSkeleton rows={5} columns={9} className="rounded-xl" />
        ) : error ? (
          <ErrorState message="Failed to load fares" onRetry={loadFares} />
        ) : fares.length === 0 ? (
          <EmptyState title="No fares found" description="Create your first fare to get started" actionLabel="Add Fare" onAction={() => navigate('/admin/fares/new')} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Transport</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Fare (RWF)</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Source</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Effective</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Updated By</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {fares.map((fare) => (
                  <tr key={fare.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3">
                      <span className="font-medium text-neutral-900 dark:text-neutral-100">{fare.routeName}</span>
                      <p className="text-xs text-neutral-500">{fare.origin} → {fare.destination}</p>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{getTransportTypeLabel(fare.transportType)}</td>
                    <td className="px-4 py-3 font-semibold text-navy-900 dark:text-green-500">{formatCurrency(fare.fare)}</td>
                    <td className="px-4 py-3"><StatusBadge status={fare.status} /></td>
                    <td className="px-4 py-3 text-xs text-neutral-500">{fare.source}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(fare.effectiveDate)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{fare.updatedBy}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="relative inline-block">
                        <button onClick={() => setActiveDropdown(activeDropdown === fare.id ? null : fare.id)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                          <MoreVertical size={16} />
                        </button>
                        {activeDropdown === fare.id && (
                          <div className="absolute right-0 z-10 mt-1 w-48 rounded-lg border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
                            {dropdownActions.filter((a) => {
                              if (a.key === 'publish') return fare.status !== 'PUBLISHED'
                              if (a.key === 'unpublish') return fare.status === 'PUBLISHED'
                              return true
                            }).map((action) => (
                              <button key={action.key} onClick={() => {
                                if (action.key === 'view') navigate(`/admin/fares/new?id=${fare.id}`)
                                else if (action.key === 'edit') navigate(`/admin/fares/new?id=${fare.id}`)
                                else handleAction(action.key, fare)
                              }} className="flex w-full items-center gap-2 px-4 py-2 text-sm text-neutral-700 hover:bg-neutral-50 dark:text-neutral-300 dark:hover:bg-neutral-800">
                                <action.icon size={14} /> {action.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && fares.length > 0 && (
          <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} perPage={pageSize} onPageChange={setPage} />
        )}
      </motion.div>
    </motion.div>
  )
}
