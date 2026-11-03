import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileBarChart,
  Download,
  Loader2,
  Calendar,
  Users,
  Car,
  MessageSquare,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatCard from '../../components/common/StatCard';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { reportService } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const reportTypes = [
  { id: 'trips', label: 'Trips Report', description: 'Total trips, passengers and route performance over the selected period.', icon: Users },
  { id: 'revenue', label: 'Revenue Report', description: 'Revenue collected, per-route breakdown and month-over-month trends.', icon: FileBarChart },
  { id: 'complaints', label: 'Complaints Report', description: 'Complaint volume, categories and resolution performance.', icon: MessageSquare },
];

const sampleTrends = [
  { month: 'Jul', trips: 3200, revenue: 8400000, complaints: 9 },
  { month: 'Aug', trips: 3480, revenue: 9120000, complaints: 12 },
  { month: 'Sep', trips: 3310, revenue: 8680000, complaints: 8 },
  { month: 'Oct', trips: 3940, revenue: 10320000, complaints: 15 },
  { month: 'Nov', trips: 4210, revenue: 11040000, complaints: 11 },
  { month: 'Dec', trips: 4520, revenue: 11880000, complaints: 13 },
];

export default function CooperativeReportsPage() {
  const [activeType, setActiveType] = useState('trips');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [exported, setExported] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await reportService.getReport('trips');
        if (!mounted) return;
        setReport(res.data);
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

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const res = await reportService.getReport(activeType, {
        from: dateRange.from || '2025-07-01',
        to: dateRange.to || '2025-12-31',
      });
      setReport(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = () => {
    setExported(activeType);
    setTimeout(() => setExported(null), 2500);
    window.alert('Export will be available soon. Your report is ready for download in a future update.');
  };

  if (error && loading === false && !report) {
    return <ErrorState message="Failed to load reports" description={error} />;
  }

  const currentType = reportTypes.find((r) => r.id === activeType);
  const chartSeries =
    activeType === 'trips' ? 'trips' : activeType === 'revenue' ? 'revenue' : 'complaints';
  const chartColor =
    activeType === 'trips' ? '#0f2645' : activeType === 'revenue' ? '#16a34a' : '#f59e0b';

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Reports</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Generate reports on trips, revenue, and complaints.
          </p>
        </div>
        <Button leftIcon={Download} onClick={handleExport} disabled={!report}>
          {exported ? 'Exporting...' : 'Export Report'}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {reportTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => setActiveType(type.id)}
            className={`rounded-xl border p-5 text-left transition-all ${
              activeType === type.id
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900'
            }`}
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2.5 ${activeType === type.id ? 'bg-green-600 text-white' : 'bg-navy-50 text-navy-900 dark:bg-navy-900/40 dark:text-navy-300'}`}>
                <type.icon size={20} />
              </div>
            </div>
            <p className="mt-3 font-semibold text-neutral-900 dark:text-neutral-100">{type.label}</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{type.description}</p>
          </button>
        ))}
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">From</label>
            <input
              type="date"
              value={dateRange.from}
              onChange={(e) => setDateRange((prev) => ({ ...prev, from: e.target.value }))}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">To</label>
            <input
              type="date"
              value={dateRange.to}
              onChange={(e) => setDateRange((prev) => ({ ...prev, to: e.target.value }))}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
            />
          </div>
          <div className="flex items-end">
            <Button leftIcon={Loader2} loading={generating} onClick={handleGenerate} fullWidth>
              Generate {currentType?.label.replace(' Report', '')} Report
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <EmptyState title="Loading report..." />
      ) : (
        report && (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <StatCard
                icon={Users}
                label="Total Trips"
                value={report.summary?.totalTrips?.toLocaleString() || '--'}
                color="navy"
              />
              <StatCard
                icon={FileBarChart}
                label="Total Revenue"
                value={formatCurrency(report.summary?.total ?? 0)}
                color="green"
              />
              <StatCard
                icon={MessageSquare}
                label="Complaints"
                value={report.summary?.total ?? '--'}
                color="amber"
              />
            </div>

            {(report.summary?.totalTrips || report.summary?.total) && (
              <Card className="p-5">
                <div className="mb-4 flex items-center justify-between">
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">
                    {currentType?.label} Trend
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {dateRange.from || 'Jul 2025'} - {dateRange.to || 'Dec 2025'}
                  </p>
                </div>
                <div className="h-72">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={sampleTrends} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                      <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#737373' }} axisLine={{ stroke: '#e5e5e5' }} tickLine={false} />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#737373' }}
                        axisLine={false}
                        tickLine={false}
                        tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', background: '#ffffff', fontSize: 13 }}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey={chartSeries}
                        name={currentType?.label.replace(' Report', '')}
                        stroke={chartColor}
                        strokeWidth={3}
                        dot={{ r: 4, fill: chartColor }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            )}

            <Card className="p-5">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-navy-900 dark:text-navy-300" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">Report summary</span>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Object.entries(report.summary || {}).map(([key, value]) => (
                  <div key={key} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                    <p className="text-xs capitalize text-neutral-500 dark:text-neutral-400">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="mt-1 font-semibold text-neutral-900 dark:text-neutral-100">
                      {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </>
        )
      )}
    </div>
  );
}