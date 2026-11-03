import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Calendar, Filter } from 'lucide-react'
import Card from '../../components/common/Card'
import Select from '../../components/common/Select'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import ErrorState from '../../components/common/ErrorState'
import Breadcrumb from '../../components/common/Breadcrumb'
import FareTrendChart from '../../components/charts/FareTrendChart'
import TransportUsageChart from '../../components/charts/TransportUsageChart'
import DistrictActivityChart from '../../components/charts/DistrictActivityChart'
import FuelPriceChart from '../../components/charts/FuelPriceChart'
import { analyticsService } from '../../services/api'
import { mockDistricts } from '../../data/mockData'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

const fuelChartData = [
  { date: 'Jan', petrol: 1280, diesel: 1180, lpg: 1050 },
  { date: 'Mar', petrol: 1320, diesel: 1220, lpg: 1100 },
  { date: 'Jun', petrol: 1380, diesel: 1280, lpg: 1150 },
  { date: 'Sep', petrol: 1450, diesel: 1350, lpg: 1200 },
]

const complaintTrendData = [
  { month: 'Jan', complaints: 5, resolved: 4 },
  { month: 'Feb', complaints: 8, resolved: 7 },
  { month: 'Mar', complaints: 6, resolved: 6 },
  { month: 'Apr', complaints: 12, resolved: 10 },
  { month: 'May', complaints: 9, resolved: 8 },
  { month: 'Jun', complaints: 15, resolved: 12 },
  { month: 'Jul', complaints: 11, resolved: 11 },
  { month: 'Aug', complaints: 7, resolved: 6 },
  { month: 'Sep', complaints: 4, resolved: 3 },
]

const researchTrendData = [
  { month: 'Jan', discoveries: 3, approved: 2 },
  { month: 'Feb', discoveries: 5, approved: 4 },
  { month: 'Mar', discoveries: 4, approved: 3 },
  { month: 'Apr', discoveries: 7, approved: 5 },
  { month: 'May', discoveries: 6, approved: 5 },
  { month: 'Jun', discoveries: 8, approved: 6 },
  { month: 'Jul', discoveries: 5, approved: 4 },
  { month: 'Aug', discoveries: 9, approved: 7 },
  { month: 'Sep', discoveries: 4, approved: 2 },
]

export default function AnalyticsPage() {
  const [fareTrends, setFareTrends] = useState([])
  const [transportUsage, setTransportUsage] = useState([])
  const [districtActivity, setDistrictActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [districtFilter, setDistrictFilter] = useState('')

  useEffect(() => { loadAnalytics() }, [])

  const loadAnalytics = async () => {
    setLoading(true); setError(null)
    try {
      const [trends, usage, districts] = await Promise.all([
        analyticsService.getFareTrends(),
        analyticsService.getTransportUsage(),
        analyticsService.getDistrictActivity(),
      ])
      setFareTrends(trends); setTransportUsage(usage); setDistrictActivity(districts)
    } catch (err) { setError(err.message) } finally { setLoading(false) }
  }

  const filteredDistrictActivity = districtFilter
    ? districtActivity.filter((d) => d.district === districtFilter)
    : districtActivity

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Analytics' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Analytics</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Insights and trends across the platform</p>
          </div>
          <div className="flex items-center gap-3">
            <Select placeholder="All Districts" options={mockDistricts.map((d) => ({ value: d.name, label: d.name }))} value={districtFilter} onChange={(e) => setDistrictFilter(e.target.value)} containerClassName="w-48" />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => <LoadingSkeleton key={i} className="h-80 rounded-xl" />)}
        </div>
      ) : error ? (
        <ErrorState message="Failed to load analytics" onRetry={loadAnalytics} />
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div variants={fadeIn}>
            <Card header={<span className="text-sm font-semibold">Fare Trends</span>}>
              <FareTrendChart data={fareTrends} height={300} />
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card header={<span className="text-sm font-semibold">Transport Usage</span>}>
              <TransportUsageChart data={transportUsage} height={300} />
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card header={<span className="text-sm font-semibold">District Activity</span>}>
              <DistrictActivityChart data={filteredDistrictActivity} height={300} />
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card header={<span className="text-sm font-semibold">Fuel Price Trends</span>}>
              <FuelPriceChart data={fuelChartData} height={300} />
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card header={<span className="text-sm font-semibold">Complaint Trends</span>}>
              <FareTrendChart data={complaintTrendData.map((d) => ({ month: d.month, fares: d.complaints, avgFare: d.resolved }))} title="" height={300} />
            </Card>
          </motion.div>

          <motion.div variants={fadeIn}>
            <Card header={<span className="text-sm font-semibold">Research Discoveries</span>}>
              <FareTrendChart data={researchTrendData.map((d) => ({ month: d.month, fares: d.discoveries, avgFare: d.approved }))} title="" height={300} />
            </Card>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
