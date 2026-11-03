import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Eye, Edit, Archive, Clock, ArrowRight } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import Pagination from '../../components/common/Pagination'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import Breadcrumb from '../../components/common/Breadcrumb'
import { routeService } from '../../services/api'
import { mockDistricts } from '../../data/mockData'
import { formatDate, getTransportTypeLabel, formatDistance, formatTime } from '../../utils/helpers'
import Select from '../../components/common/Select'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function RoutesPage() {
  const navigate = useNavigate()
  const [routes, setRoutes] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ district: '', transportType: '', status: '' })
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const pageSize = 10

  useEffect(() => { loadRoutes() }, [page, search, filters])

  const loadRoutes = async () => {
    setLoading(true)
    setError(null)
    try {
      const result = await routeService.getAll({ page, pageSize, search, ...filters })
      setRoutes(result.data)
      setTotalPages(Math.ceil(result.total / pageSize))
      setTotalItems(result.total)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handlePublish = async (route) => {
    const newStatus = route.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE'
    await routeService.update(route.id, { status: newStatus })
    loadRoutes()
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Routes' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Routes</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage transport routes across Rwanda</p>
          </div>
          <Button leftIcon={Plus} onClick={() => navigate('/admin/routes/new')}>Add Route</Button>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="space-y-4">
        <div className="flex flex-wrap items-end gap-4">
          <SearchBar placeholder="Search routes..." value={search} onChange={setSearch} className="w-80" />
          <Select placeholder="All Districts" options={mockDistricts.map((d) => ({ value: d.name, label: d.name }))} value={filters.district} onChange={(e) => { setFilters((f) => ({ ...f, district: e.target.value })); setPage(1) }} containerClassName="w-48" />
          <Select placeholder="All Transport" options={[{ value: 'bus', label: 'Bus' }, { value: 'moto', label: 'Moto' }, { value: 'taxi', label: 'Taxi' }, { value: 'minibus', label: 'Minibus' }]} value={filters.transportType} onChange={(e) => { setFilters((f) => ({ ...f, transportType: e.target.value })); setPage(1) }} containerClassName="w-48" />
          <Select placeholder="All Status" options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }, { value: 'ARCHIVED', label: 'Archived' }]} value={filters.status} onChange={(e) => { setFilters((f) => ({ ...f, status: e.target.value })); setPage(1) }} containerClassName="w-48" />
        </div>

        {loading ? (
          <LoadingSkeleton rows={5} columns={7} className="rounded-xl" />
        ) : error ? (
          <ErrorState message="Failed to load routes" onRetry={loadRoutes} />
        ) : routes.length === 0 ? (
          <EmptyState title="No routes found" description="Create your first route to get started" actionLabel="Add Route" onAction={() => navigate('/admin/routes/new')} />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 dark:border-neutral-700">
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Route</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Distance</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Time</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Transport</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Updated</th>
                  <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {routes.map((route) => (
                  <tr key={route.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{route.name}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">
                      <span className="flex items-center gap-1.5">
                        <span className="text-green-600">{route.origin}</span>
                        <ArrowRight size={12} className="text-neutral-400" />
                        <span className="text-red-500">{route.destination}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{formatDistance(route.distance)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-600 dark:text-neutral-400">{formatTime(route.estimatedTime)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {route.transportTypes.map((t) => (
                          <span key={t} className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-700 dark:text-neutral-400">{getTransportTypeLabel(t)}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3"><StatusBadge status={route.status} /></td>
                    <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(route.updatedAt)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => navigate(`/admin/routes/new?id=${route.id}`)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800"><Edit size={16} /></button>
                        <button onClick={() => handlePublish(route)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-green-600 dark:hover:bg-neutral-800"><Archive size={16} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && routes.length > 0 && (
          <Pagination currentPage={page} totalPages={totalPages} totalItems={totalItems} perPage={pageSize} onPageChange={setPage} />
        )}
      </motion.div>
    </motion.div>
  )
}
