import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, PieChart as PieIcon, BarChart3, MessageSquare, Filter } from 'lucide-react';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import ChartSkeletonPlaceholder from '../../components/common/LoadingSkeleton';
import ErrorState from '../../components/common/ErrorState';
import { analyticsService } from '../../services/api';
import { DISTRICTS } from '../../data/mockData';
import { formatCurrency } from '../../utils/helpers';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from 'recharts';

const PIE_COLORS = ['#16a34a', '#0f2645', '#3b5f9f', '#f59e0b', '#ef4444', '#8b5cf6'];

const rangeOptions = [
  { value: '6mo', label: 'Last 6 months' },
  { value: '12mo', label: 'Last 12 months' },
  { value: 'ytd', label: 'Year to date' },
];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState('6mo');
  const [districtFilter, setDistrictFilter] = useState('');
  const [fareData, setFareData] = useState([]);
  const [transportData, setTransportData] = useState([]);
  const [routeData, setRouteData] = useState([]);
  const [complaintData, setComplaintData] = useState([]);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [fareRes, transportRes, routeRes, complaintRes] = await Promise.allSettled([
          analyticsService.getFareTrends(),
          analyticsService.getTransportUsage(),
          analyticsService.getRoutePopularity(),
          analyticsService.getComplaintTrends(),
        ]);
        if (!mounted) return;
        setFareData(fareRes.status === 'fulfilled' ? fareRes.value.data.series : []);
        setTransportData(transportRes.status === 'fulfilled' ? transportRes.value.data : []);
        setRouteData(routeRes.status === 'fulfilled' ? routeRes.value.data : []);
        setComplaintData(complaintRes.status === 'fulfilled' ? complaintRes.value.data : []);
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

  const filteredFareSeries = districtFilter
    ? fareData.filter((s) => s.district === districtFilter)
    : fareData;

  const chartLabels = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const lineData = chartLabels.map((month, i) => {
    const point = { month };
    filteredFareSeries.forEach((series) => {
      point[series.district] = series.values[i];
    });
    return point;
  });

  const trendColors = ['#16a34a', '#0f2645', '#3b5f9f'];

  if (error) {
    return <ErrorState message="Failed to load analytics" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Analytics</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Fare trends, transport usage, route popularity and complaint insights.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Select
            placeholder="Date range"
            options={rangeOptions}
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            containerClassName="w-40"
          />
          <Select
            placeholder="All districts"
            options={DISTRICTS.map((d) => ({ value: d.name, label: d.name }))}
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            containerClassName="w-44"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <ChartSkeletonPlaceholder.ChartSkeleton />
          <ChartSkeletonPlaceholder.ChartSkeleton />
          <ChartSkeletonPlaceholder.ChartSkeleton />
          <ChartSkeletonPlaceholder.ChartSkeleton />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <TrendingUp size={18} className="text-green-600" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">Fare Trends by District</span>
                {districtFilter && (
                  <span className="ml-auto flex items-center gap-1 rounded-full bg-navy-50 px-2 py-0.5 text-xs font-medium text-navy-900 dark:bg-navy-900/40 dark:text-navy-300">
                    <Filter size={12} /> {districtFilter}
                  </span>
                )}
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#737373' }} axisLine={{ stroke: '#e5e5e5' }} tickLine={false} />
                    <YAxis
                      tick={{ fontSize: 12, fill: '#737373' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                    />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Fare']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', background: '#ffffff', fontSize: 13 }}
                    />
                    <Legend />
                    {filteredFareSeries.map((series, idx) => (
                      <Line
                        key={series.district}
                        type="monotone"
                        dataKey={series.district}
                        stroke={trendColors[idx % trendColors.length]}
                        strokeWidth={3}
                        dot={{ r: 4, fill: trendColors[idx % trendColors.length] }}
                      />
                    ))}
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <PieIcon size={18} className="text-navy-900 dark:text-navy-300" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">Transport Usage</span>
              </div>
              <div className="flex h-72 flex-col items-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={transportData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {transportData.map((entry, index) => (
                        <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      formatter={(value, name) => [`${Number(value).toLocaleString()} trips`, name]}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', background: '#ffffff', fontSize: 13 }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <BarChart3 size={18} className="text-blue-600" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">Route Popularity</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={routeData} layout="vertical" margin={{ top: 0, right: 20, left: 20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" horizontal={false} />
                    <XAxis
                      type="number"
                      tick={{ fontSize: 12, fill: '#737373' }}
                      axisLine={false}
                      tickLine={false}
                      tickFormatter={(v) => `${Math.round(v / 1000)}k`}
                    />
                    <YAxis
                      type="category"
                      dataKey="route"
                      width={130}
                      tick={{ fontSize: 11, fill: '#737373' }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <Tooltip
                      formatter={(value) => [`${value.toLocaleString()} trips`, 'Trips']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', background: '#ffffff', fontSize: 13 }}
                    />
                    <Bar dataKey="trips" fill="#0f2645" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <MessageSquare size={18} className="text-amber-500" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">Complaint Trends</span>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={complaintData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#737373' }} axisLine={{ stroke: '#e5e5e5' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} allowDecimals={false} />
                    <Tooltip
                      formatter={(value) => [`${value} complaints`, 'Complaints']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', background: '#ffffff', fontSize: 13 }}
                    />
                    <Line type="monotone" dataKey="complaints" stroke="#f59e0b" strokeWidth={3} dot={{ r: 5, fill: '#f59e0b' }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>

          <p className="text-xs text-neutral-400 dark:text-neutral-500">
            Data reflects the selected period {dateRange === '6mo' ? '(last 6 months)' : dateRange === '12mo' ? '(last 12 months)' : '(year to date)'}
            {districtFilter ? ` for ${districtFilter}` : ' for all districts'}.
          </p>
        </>
      )}
    </div>
  );
}