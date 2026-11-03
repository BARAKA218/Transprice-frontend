import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, X, Send, Edit, ArrowLeft, Clock } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import ErrorState from '../../components/common/ErrorState'
import Breadcrumb from '../../components/common/Breadcrumb'
import { researchService } from '../../services/api'
import { formatDate, formatCurrency, getTransportTypeLabel } from '../../utils/helpers'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function ResearchDetailPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [item, setItem] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [notes, setNotes] = useState('')

  useEffect(() => { loadItem() }, [id])

  const loadItem = async () => {
    setLoading(true); setError(null)
    try {
      const data = await researchService.getById(id)
      setItem(data); setNotes(data?.adminNotes || '')
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  const handleAction = async (action) => {
    const statusMap = { approve: 'APPROVED', reject: 'REJECTED', publish: 'PUBLISHED' }
    await researchService.update(id, { status: statusMap[action], adminNotes: notes })
    navigate('/admin/research')
  }

  if (loading) return <LoadingSkeleton rows={8} columns={2} className="rounded-xl" />
  if (error) return <ErrorState message="Failed to load" onRetry={loadItem} />
  if (!item) return <ErrorState message="Research item not found" />

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Research', href: '/admin/research' }, { label: item.title }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{item.title}</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Research item from {item.sourceName}</p>
          </div>
          <Button variant="ghost" leftIcon={ArrowLeft} onClick={() => navigate('/admin/research')}>Back</Button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <motion.div variants={fadeIn}>
            <Card header={<span className="text-sm font-semibold">Source Information</span>}>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-xs text-neutral-500">Source</p><p className="text-sm font-medium">{item.sourceName}</p></div>
                <div><p className="text-xs text-neutral-500">Type</p><p className="text-sm font-medium capitalize">{item.type}</p></div>
                <div><p className="text-xs text-neutral-500">Discovery Date</p><p className="text-sm">{formatDate(item.discoveryDate)}</p></div>
                <div><p className="text-xs text-neutral-500">Status</p><StatusBadge status={item.status} /></div>
                {item.routeName && <div><p className="text-xs text-neutral-500">Route</p><p className="text-sm">{item.routeName}</p></div>}
                {item.transportType && <div><p className="text-xs text-neutral-500">Transport</p><p className="text-sm">{getTransportTypeLabel(item.transportType)}</p></div>}
              </div>
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card header={<span className="text-sm font-semibold">Discovered Data</span>}>
              {(item.oldFare || item.newFare) && (
                <div className="rounded-lg bg-neutral-50 p-4 dark:bg-neutral-800">
                  <p className="mb-2 text-xs font-semibold uppercase text-neutral-500">Fare Comparison</p>
                  <div className="flex items-center gap-4">
                    {item.oldFare && (
                      <div>
                        <p className="text-xs text-neutral-500">Previous Fare</p>
                        <p className="text-lg font-bold text-red-500">{formatCurrency(item.oldFare)}</p>
                      </div>
                    )}
                    {item.oldFare && item.newFare && <span className="text-2xl text-neutral-400">→</span>}
                    {item.newFare && (
                      <div>
                        <p className="text-xs text-neutral-500">New Fare</p>
                        <p className="text-lg font-bold text-green-600">{formatCurrency(item.newFare)}</p>
                      </div>
                    )}
                    {item.oldFare && item.newFare && (
                      <div className="ml-4 rounded-lg bg-blue-50 px-3 py-1 dark:bg-blue-900/20">
                        <p className="text-xs text-blue-600 dark:text-blue-400">
                          {item.newFare > item.oldFare ? '+' : ''}{Math.round(((item.newFare - item.oldFare) / item.oldFare) * 100)}% change
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
              {!item.oldFare && !item.newFare && (
                <p className="text-sm text-neutral-500 italic">No fare data in this discovery</p>
              )}
            </Card>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div variants={fadeIn}>
            <Card header={<span className="text-sm font-semibold">Admin Review</span>}>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Review Notes</label>
                  <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Add review notes..." />
                </div>
                {(item.status === 'NEW' || item.status === 'PENDING_VERIFICATION') && (
                  <div className="space-y-2">
                    <Button variant="primary" fullWidth leftIcon={Check} onClick={() => handleAction('approve')}>Approve</Button>
                    <Button variant="outline" fullWidth leftIcon={Edit} onClick={() => navigate(`/admin/fares/new`)}>Edit & Publish</Button>
                    <Button variant="danger" fullWidth leftIcon={X} onClick={() => handleAction('reject')}>Reject</Button>
                  </div>
                )}
                {item.status === 'APPROVED' && (
                  <Button variant="primary" fullWidth leftIcon={Send} onClick={() => handleAction('publish')}>Publish</Button>
                )}
              </div>
            </Card>
          </motion.div>

          {item.verifiedBy && (
            <motion.div variants={fadeIn}>
              <Card header={<span className="text-sm font-semibold">Verification History</span>}>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between"><span className="text-neutral-500">Verified by:</span><span>{item.verifiedBy}</span></div>
                  <div className="flex justify-between"><span className="text-neutral-500">Verified at:</span><span>{formatDate(item.verifiedAt)}</span></div>
                  {item.publishedAt && <div className="flex justify-between"><span className="text-neutral-500">Published:</span><span>{formatDate(item.publishedAt)}</span></div>}
                </div>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  )
}
