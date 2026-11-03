import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Users, Route, FileText, Fuel, FlaskConical, AlertTriangle,
  Plus, ArrowRight, Clock, CheckCircle, TrendingUp,
  DollarSign, MapPin, Activity, Eye
} from 'lucide-react'
import StatCard from '../../components/common/StatCard'
import Card from '../../components/common/Card'
import StatusBadge from '../../components/common/StatusBadge'
import LoadingSkeleton from '../../components/common/LoadingSkeleton'
import ErrorState from '../../components/common/ErrorState'
import FareTrendChart from '../../components/charts/FareTrendChart'
import TransportUsageChart from '../../components/charts/TransportUsageChart'
import DistrictActivityChart from '../../components/charts/DistrictActivityChart'
import { analyticsService } from '../../services/api'
import { formatCurrency, formatDate, getStatusColor } from '../../utils/helpers'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

const quickActions = [
  { label: 'Add Fare', to: '/admin/fares/new', icon: DollarSign, color: 'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400' },
  { label: 'Add Route', to: '/admin/routes/new', icon: MapPin, color: 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' },
  { label: 'Add Update', to: '/admin/updates/new', icon: FileText, color: 'bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400' },
  { label: 'Add Fuel Price', to: '/admin/fuel-prices/new', icon: Fuel, color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' },
  { label: 'Review Research', to: '/admin/research', icon: FlaskConical, color: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-900/30 dark:text-cyan-400' },
  { label: 'Manage Users', to: '/admin/users', icon: Users, color: 'bg-rose-50 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400' },
]

export default function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [fareTrends, setFareTrends] = useState([])
  const [transportUsage, setTransportUsage] = useState([])
  const [districtActivity, setDistrictActivity] = useState([])
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    setLoading(true)
    setError(null)
    try {
      const [statsData, trends, usage, districts, activity] = await Promise.all([
        analyticsService.getDashboardStats(),
        analyticsService.getFareTrends(),
        analyticsService.getTransportUsage(),
        analyticsService.getDistrictActivity(),
        analyticsService.getRecentActivity(),
      ])
      setStats(statsData)
      setFareTrends(trends)
      setTransportUsage(usage)
      setDistrictActivity(districts)
      setRecentActivity(activity)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <LoadingSkeleton key={i} className="h-80 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (error) return <ErrorState message="Failed to load dashboard" description={error} onRetry={loadDashboard} />

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: 0.05 } } }}
      className="space-y-6"
    >
      <motion.div variants={fadeIn}>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
          Dashboard
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Welcome back. Here's what's happening on TransPrice today.
        </p>
      </motion.div>

      <motion.div variants={fadeIn} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard icon={Users} label="Total Users" value={stats?.totalUsers || 0} color="navy" trend="up" trendValue="+3 this month" />
        <StatCard icon={DollarSign} label="Active Fares" value={stats?.activeFares || 0} color="green" trend="up" trendValue="+5 this week" />
        <StatCard icon={Route} label="Published Routes" value={stats?.publishedRoutes || 0} color="blue" />
        <StatCard icon={FileText} label="Pending Updates" value={stats?.pendingUpdates || 0} color="amber" />
        <StatCard icon={FlaskConical} label="Research Items" value={stats?.researchDiscoveries || 0} color="navy" />
        <StatCard icon={AlertTriangle} label="Complaints" value={stats?.totalComplaints || 0} color="red" trend="down" trendValue="2 resolved" />
      </motion.div>

      <motion.div variants={fadeIn} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card header={<span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Fare Trends</span>}>
          <FareTrendChart data={fareTrends} height={260} />
        </Card>
        <Card header={<span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Transport Usage</span>}>
          <TransportUsageChart data={transportUsage} height={260} />
        </Card>
        <Card header={<span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">District Activity</span>}>
          <DistrictActivityChart data={districtActivity} height={260} />
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <h2 className="mb-3 text-lg font-semibold text-neutral-900 dark:text-neutral-100">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {quickActions.map((action) => (
            <Link
              key={action.label}
              to={action.to}
              className="group flex flex-col items-center gap-2 rounded-xl border border-neutral-200 bg-white p-4 shadow-sm transition-all hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
            >
              <div className={`rounded-lg p-2.5 ${action.color}`}>
                <action.icon size={20} />
              </div>
              <span className="text-xs font-medium text-neutral-700 group-hover:text-navy-900 dark:text-neutral-300 dark:group-hover:text-green-500">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </motion.div>

      <motion.div variants={fadeIn} className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Recent Activity</span>
              <Link to="/admin/audit-logs" className="flex items-center gap-1 text-xs text-navy-900 hover:underline dark:text-green-500">
                View all <ArrowRight size={12} />
              </Link>
            </div>
          }
          padding="none"
        >
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {recentActivity.slice(0, 6).map((log) => (
              <div key={log.id} className="flex items-center gap-3 px-6 py-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-800">
                  <Activity size={14} className="text-neutral-500" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-700 dark:text-neutral-300">
                    <span className="font-medium">{log.userName}</span>{' '}
                    {log.action.toLowerCase()}d a {log.recordType}
                  </p>
                  <p className="text-xs text-neutral-400">{formatDate(log.createdAt)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card
          header={
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">Pending Items</span>
            </div>
          }
          padding="none"
        >
          <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
            {stats?.pendingUpdates > 0 && (
              <Link to="/admin/updates" className="flex items-center gap-3 px-6 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
                  <FileText size={14} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{stats.pendingUpdates} updates awaiting publish</p>
                  <p className="text-xs text-neutral-400">Transport updates</p>
                </div>
                <ArrowRight size={14} className="text-neutral-400" />
              </Link>
            )}
            {stats?.researchDiscoveries > 0 && (
              <Link to="/admin/research" className="flex items-center gap-3 px-6 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-100 dark:bg-cyan-900/30">
                  <FlaskConical size={14} className="text-cyan-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{stats.researchDiscoveries} research items to review</p>
                  <p className="text-xs text-neutral-400">Data discoveries</p>
                </div>
                <ArrowRight size={14} className="text-neutral-400" />
              </Link>
            )}
            {stats?.openComplaints > 0 && (
              <Link to="/admin/complaints" className="flex items-center gap-3 px-6 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                  <AlertTriangle size={14} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{stats.openComplaints} open complaints</p>
                  <p className="text-xs text-neutral-400">Requires attention</p>
                </div>
                <ArrowRight size={14} className="text-neutral-400" />
              </Link>
            )}
            {(!stats?.pendingUpdates && !stats?.researchDiscoveries && !stats?.openComplaints) && (
              <div className="flex items-center gap-3 px-6 py-8 text-center">
                <CheckCircle size={20} className="mx-auto text-green-500" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">All caught up! No pending items.</p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
