import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Edit, Send, Fuel, TrendingUp, TrendingDown } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import StatCard from '../../components/common/StatCard'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import ErrorState from '../../components/common/ErrorState'
import Breadcrumb from '../../components/common/Breadcrumb'
import FuelPriceChart from '../../components/charts/FuelPriceChart'
import { fuelPriceService } from '../../services/api'
import { formatCurrency, formatDate } from '../../utils/helpers'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

const fuelChartData = [
  { date: 'Mar', petrol: 1320, diesel: 1220, lpg: 1100 },
  { date: 'Jun', petrol: 1380, diesel: 1280, lpg: 1150 },
  { date: 'Sep', petrol: 1450, diesel: 1350, lpg: 1200 },
]

export default function FuelPricesPage() {
  const navigate = useNavigate()
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => { loadPrices() }, [])

  const loadPrices = async () => {
    setLoading(true); setError(null)
    try {
      const result = await fuelPriceService.getAll()
      setPrices(result.data)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  const currentPrices = prices.filter((p) => p.status === 'ACTIVE')
  const petrolCurrent = currentPrices.find((p) => p.fuelType === 'Petrol')
  const dieselCurrent = currentPrices.find((p) => p.fuelType === 'Diesel')
  const lpgCurrent = currentPrices.find((p) => p.fuelType === 'LPG')

  const handlePublish = async (price) => {
    await fuelPriceService.update(price.id, { status: price.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' })
    loadPrices()
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Fuel Prices' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Fuel Prices</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Monitor fuel prices across Rwanda</p>
          </div>
          <Button leftIcon={Plus} onClick={() => navigate('/admin/fuel-prices/new')}>Add Fuel Price</Button>
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard icon={Fuel} label="Petrol" value={petrolCurrent ? `${formatCurrency(petrolCurrent.price)}/L` : 'N/A'} color="navy" />
        <StatCard icon={Fuel} label="Diesel" value={dieselCurrent ? `${formatCurrency(dieselCurrent.price)}/L` : 'N/A'} color="green" />
        <StatCard icon={Fuel} label="LPG" value={lpgCurrent ? `${formatCurrency(lpgCurrent.price)}/L` : 'N/A'} color="amber" />
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card header={<span className="text-sm font-semibold">Price Trends</span>}>
          <FuelPriceChart data={fuelChartData} height={300} />
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card header={<span className="text-sm font-semibold">Price History</span>}>
          {loading ? <LoadingSkeleton rows={4} columns={6} /> : error ? <ErrorState message="Failed to load" onRetry={loadPrices} /> : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-neutral-200 dark:border-neutral-700">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Fuel Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Price (RWF/L)</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Effective Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Source</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-500">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {prices.map((price) => (
                    <tr key={price.id} className="border-b border-neutral-100 hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                      <td className="px-4 py-3 font-medium text-neutral-900 dark:text-neutral-100">{price.fuelType}</td>
                      <td className="px-4 py-3 font-semibold text-navy-900 dark:text-green-500">{formatCurrency(price.price)}/L</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">{formatDate(price.effectiveDate)}</td>
                      <td className="px-4 py-3 text-sm text-neutral-500">{price.source}</td>
                      <td className="px-4 py-3"><StatusBadge status={price.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button onClick={() => navigate(`/admin/fuel-prices/new?id=${price.id}`)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-blue-600 dark:hover:bg-neutral-800"><Edit size={16} /></button>
                          <button onClick={() => handlePublish(price)} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-green-600 dark:hover:bg-neutral-800"><Send size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </motion.div>
    </motion.div>
  )
}
