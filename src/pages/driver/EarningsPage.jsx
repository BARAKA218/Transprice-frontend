import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  Calendar,
  Wallet,
  TrendingUp,
  Download,
  ArrowUpRight,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { CardSkeleton, TableSkeleton, ChartSkeleton } from '../../components/common/LoadingSkeleton';
import { userService, tripService } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';

const weeklyData = [
  { day: 'Mon', earned: 36000 },
  { day: 'Tue', earned: 42000 },
  { day: 'Wed', earned: 38500 },
  { day: 'Thu', earned: 45000 },
  { day: 'Fri', earned: 51000 },
  { day: 'Sat', earned: 62000 },
  { day: 'Sun', earned: 58000 },
];

const monthlyData = [
  { month: 'Jul', earned: 410000 },
  { month: 'Aug', earned: 435000 },
  { month: 'Sep', earned: 420000 },
  { month: 'Oct', earned: 468000 },
  { month: 'Nov', earned: 452000 },
  { month: 'Dec', earned: 486200 },
];

const paymentHistory = [
  { id: 'pay1', date: '2025-12-15', amount: 452000, method: 'Mobile Money', status: 'COMPLETED', ref: 'MM-2025-12-88231' },
  { id: 'pay2', date: '2025-11-15', amount: 468000, method: 'Bank Transfer', status: 'COMPLETED', ref: 'BT-2025-11-44120' },
  { id: 'pay3', date: '2025-10-15', amount: 420000, method: 'Mobile Money', status: 'COMPLETED', ref: 'MM-2025-10-22018' },
  { id: 'pay4', date: '2025-09-15', amount: 435000, method: 'Cheque', status: 'PENDING', ref: 'CH-2025-09-33557' },
  { id: 'pay5', date: '2025-08-15', amount: 410000, method: 'Mobile Money', status: 'COMPLETED', ref: 'MM-2025-08-11093' },
];

export default function EarningsPage() {
  const [driver, setDriver] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartPeriod, setChartPeriod] = useState('week');

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [driverRes, tripRes] = await Promise.allSettled([
          userService.getCurrentDriver(),
          tripService.getTrips(),
        ]);
        if (!mounted) return;
        setDriver(driverRes.status === 'fulfilled' ? driverRes.value.data : null);
        setTrips(tripRes.status === 'fulfilled' ? tripRes.value.data : []);
      } catch (err) {
        if (mounted) setError(err.message);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const chartData = chartPeriod === 'week' ? weeklyData : monthlyData;
  const dataKey = chartPeriod === 'week' ? 'day' : 'month';

  const latestTrips = trips.slice(0, 6);

  const handleExport = () => {
    window.alert('Export functionality is not yet available. Reports will be downloadable soon.');
  };

  if (error) {
    return <ErrorState message="Failed to load earnings" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Earnings</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Track your income and payment history.
          </p>
        </div>
        <Button variant="outline" size="sm" leftIcon={Download} onClick={handleExport}>
          Export data
        </Button>
      </motion.div>

      {loading ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[0, 1, 2, 3].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <ChartSkeleton className="lg:col-span-2" />
            <CardSkeleton />
          </div>
        </>
      ) : (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            <StatCard
              icon={Calendar}
              label="Today"
              value={formatCurrency(driver?.earnings?.today || 0)}
              color="green"
            />
            <StatCard
              icon={Calendar}
              label="This Week"
              value={formatCurrency(driver?.earnings?.week || 0)}
              trend="up"
              trendValue="+6.2% vs last week"
              color="navy"
            />
            <StatCard
              icon={Calendar}
              label="This Month"
              value={formatCurrency(driver?.earnings?.month || 0)}
              trend="up"
              trendValue="+7.5% vs last month"
              color="blue"
            />
            <StatCard
              icon={Wallet}
              label="Total Earnings"
              value={formatCurrency(driver?.earnings?.total || 0)}
              color="green"
            />
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <Card
              className="lg:col-span-2"
              header={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp size={18} className="text-green-600" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Earnings Chart</span>
                  </div>
                  <div className="flex rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
                    {['week', 'month'].map((period) => (
                      <button
                        key={period}
                        onClick={() => setChartPeriod(period)}
                        className={`rounded-md px-3 py-1 text-xs font-medium capitalize transition-colors ${
                          chartPeriod === period
                            ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100'
                            : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'
                        }`}
                      >
                        {period === 'week' ? 'This week' : 'This month'}
                      </button>
                    ))}
                  </div>
                </div>
              }
            >
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey={dataKey} tick={{ fontSize: 12, fill: '#737373' }} axisLine={{ stroke: '#e5e5e5' }} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#737373' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Earned']}
                      contentStyle={{
                        borderRadius: 12,
                        border: '1px solid #e5e5e5',
                        background: '#ffffff',
                        fontSize: 13,
                      }}
                    />
                    <Bar dataKey="earned" fill="#16a34a" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card
              header={
                <div className="flex items-center gap-2">
                  <Wallet size={18} className="text-navy-900 dark:text-navy-300" />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Payment History</span>
                </div>
              }
            >
              <div className="space-y-3">
                {paymentHistory.map((payment) => (
                  <div key={payment.id} className="rounded-xl border border-neutral-100 p-3.5 dark:border-neutral-800">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{formatDate(payment.date)}</p>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">
                          {payment.method} &middot; {payment.ref}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{formatCurrency(payment.amount)}</p>
                        <StatusBadge status={payment.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card
            header={
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-green-600" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">Earnings Breakdown</span>
              </div>
            }
          >
            {latestTrips.length === 0 ? (
              <EmptyState title="No trips recorded" />
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Date</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Route</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Passengers</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Fare</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {latestTrips.map((trip) => (
                      <tr key={trip.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                        <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatDate(trip.date)}</td>
                        <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{trip.route}</td>
                        <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{trip.passengers}</td>
                        <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatCurrency(trip.fare)}</td>
                        <td className="px-4 py-3">
                          <span className="flex items-center gap-1 text-sm font-medium text-green-600 dark:text-green-400">
                            <ArrowUpRight size={14} /> {formatCurrency(trip.earnings)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}