import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, X, Eye, Edit, CheckSquare, Send } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import EmptyState from '../../components/common/EmptyState'
import ErrorState from '../../components/common/ErrorState'
import Breadcrumb from '../../components/common/Breadcrumb'
import { researchService } from '../../services/api'
import { formatDate, formatCurrency } from '../../utils/helpers'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function FareImportPage() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState([])

  useEffect(() => { loadItems() }, [])

  const loadItems = async () => {
    setLoading(true); setError(null)
    try {
      const result = await researchService.getAll({ type: 'fare' })
      setItems(result.data.filter((i) => i.status === 'NEW' || i.status === 'PENDING_VERIFICATION'))
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  const handleAction = async (item, action) => {
    const statusMap = { approve: 'APPROVED', reject: 'REJECTED' }
    await researchService.update(item.id, { status: statusMap[action] })
    loadItems()
    setSelected((s) => s.filter((id) => id !== item.id))
  }

  const toggleSelect = (id) => {
    setSelected((s) => s.includes(id) ? s.filter((i) => i !== id) : [...s, id])
  }

  const toggleSelectAll = () => {
    if (selected.length === items.length) setSelected([])
    else setSelected(items.map((i) => i.id))
  }

  const batchApprove = async () => {
    for (const id of selected) {
      await researchService.update(id, { status: 'APPROVED' })
    }
    setSelected([]); loadItems()
  }

  const batchReject = async () => {
    for (const id of selected) {
      await researchService.update(id, { status: 'REJECTED' })
    }
    setSelected([]); loadItems()
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Fare Import' }]} />
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Fare Import Review</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Review discovered fares before importing</p>
        </div>
      </motion.div>

      {selected.length > 0 && (
        <motion.div variants={fadeIn} className="flex items-center gap-3 rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/50 dark:bg-blue-900/20">
          <CheckSquare size={18} className="text-blue-600" />
          <span className="text-sm text-blue-700 dark:text-blue-400">{selected.length} items selected</span>
          <Button size="sm" variant="primary" leftIcon={Check} onClick={batchApprove}>Batch Approve</Button>
          <Button size="sm" variant="danger" leftIcon={X} onClick={batchReject}>Batch Reject</Button>
        </motion.div>
      )}

      <motion.div variants={fadeIn}>
        {loading ? <LoadingSkeleton rows={5} columns={6} className="rounded-xl" /> : error ? <ErrorState message="Failed to load" onRetry={loadItems} /> : items.length === 0 ? (
          <EmptyState title="No items to review" description="All discovered fares have been processed" />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <button onClick={toggleSelectAll} className="text-neutral-400 hover:text-neutral-600">
                <CheckSquare size={16} />
              </button>
              <span className="text-xs text-neutral-500">Select all</span>
            </div>
            {items.map((item) => (
              <Card key={item.id} padding="sm" className={selected.includes(item.id) ? 'ring-2 ring-blue-500' : ''}>
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleSelect(item.id)} className="text-neutral-400 hover:text-blue-600">
                    {selected.includes(item.id) ? <CheckSquare size={18} className="text-blue-600" /> : <CheckSquare size={18} />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-medium text-neutral-900 dark:text-neutral-100">{item.title}</h3>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-neutral-500">
                      <span>Source: {item.sourceName}</span>
                      <span>Discovered: {formatDate(item.discoveryDate)}</span>
                      {item.routeName && <span>Route: {item.routeName}</span>}
                      {item.transportType && <span>Type: {item.transportType}</span>}
                    </div>
                    {(item.oldFare || item.newFare) && (
                      <div className="mt-2 flex items-center gap-2 text-sm">
                        {item.oldFare && <span className="text-red-500 line-through">{formatCurrency(item.oldFare)}</span>}
                        {item.oldFare && item.newFare && <span>→</span>}
                        {item.newFare && <span className="font-semibold text-green-600">{formatCurrency(item.newFare)}</span>}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="sm" onClick={() => handleAction(item, 'approve')} className="text-green-600"><Check size={14} /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleAction(item, 'reject')} className="text-red-600"><X size={14} /></Button>
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
