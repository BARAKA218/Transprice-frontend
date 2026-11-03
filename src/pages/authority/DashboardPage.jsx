import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Route,
  DollarSign,
  Building2,
  Car,
  ChevronRight,
  FileText,
  MessageSquare,
  Activity,
  TrendingUp,
} from 'lucide-react';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { CardSkeleton, TableSkeleton, ChartSkeleton } from '../../components/common/LoadingSkeleton';
import { proposalService, complaintService, analyticsService, cooperativeService } from '../../services/api';
import { DISTRICTS, mockProposals, mockComplaints, mockCooperatives } from '../../data/mockData';
import { formatCurrency, formatDate, formatDateShort } from '../../utils/helpers';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

const activityFeed = [
  { id: 'a1', user: 'Marie Uwimana', action: 'submitted a tariff proposal for Kigali-Huye', time: '2025-12-22T09:00:00', type: 'proposal' },
  { id: 'a2', user: 'Jean-Pierre Mugabo', action: 'filed a complaint about overcharging', time: '2025-12-18T08:20:00', type: 'complaint' },
  { id: 'a3', user: 'Kigali Transport Cooperative', action: 'added a new vehicle to the fleet', time: '2025-12-17T14:00:00', type: 'vehicle' },
  { id: 'a4', user: 'Southern Transport SACCO', action: 'updated registered routes', time: '2025-12-15T11:30:00', type: 'route' },
  { id: 'a5', user: 'Paul Nshimiyimana', action: 'approved the Musanze-Gicumbi fare proposal', time: '2025-12-05T10:30:00', type: 'approval' },
];

const fareTrendData = [
  { month: 'Jul', Kigali: 2800, Huye: 1300, Musanze: 1500 },
  { month: 'Aug', Kigali: 2900, Huye: 1300, Musanze: 1600 },
  { month: 'Sep', Kigali: 3000, Huye: 1400, Musanze: 1600 },
  { month: 'Oct', Kigali: 3200, Huye: 1400, Musanze: 1700 },
  { month: 'Nov', Kigali: 3400, Huye: 1450, Musanze: 1700 },
  { month: 'Dec', Kigali: 3500, Huye: 1500, Musanze: 1800 },
];

const districtActivityData = [
  { district: 'Kigali', activity: 92 },
  { district: 'Huye', activity: 64 },
  { district: 'Musanze', activity: 58 },
  { district: 'Rubavu', activity: 45 },
  { district: 'Nyagatare', activity: 39 },
];

export default function AuthorityDashboardPage() {
  const [proposals, setProposals] = useState([]);
  const [complaints, setComplaints] = useState([]);
  const [cooperatives, setCooperatives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [proposalRes, complaintRes, coopRes, trendsRes] = await Promise.allSettled([
          proposalService.getProposals(),
          complaintService.getComplaints(),
          cooperativeService.getCooperatives(),
          analyticsService.getFareTrends(),
        ]);
        if (!mounted) return;
        setProposals(proposalRes.status === 'fulfilled' ? proposalRes.value.data : mockProposals);
        setComplaints(complaintRes.status === 'fulfilled' ? complaintRes.value.data : mockComplaints);
        setCooperatives(coopRes.status === 'fulfilled' ? coopRes.value.data : mockCooperatives);
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

  const pendingProposals = proposals.filter((p) => p.status === 'PENDING');
  const activeCooperatives = cooperatives.filter((c) => c.status === 'ACTIVE');

  if (error) {
    return <ErrorState message="Failed to load dashboard" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-2xl bg-navy-900 p-6 text-white shadow-lg md:p-8"
      >
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2 text-sm font-medium text-navy-200">
              <Activity size={16} />
              National Transport Authority &middot; Rwanda
            </div>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">Regulatory Dashboard</h1>
            <p className="mt-1 text-sm text-navy-300">
              National overview of routes, fares, cooperatives and complaints.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/authority/approvals">
                <Button variant="primary" className="bg-green-600 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500" leftIcon={FileText}>
                  Review Proposals ({pendingProposals.length})
                </Button>
              </Link>
              <Link to="/authority/complaints">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 dark:border-white/20" leftIcon={MessageSquare}>
                  View Complaints
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
              AN
            </div>
            <div>
              <p className="font-semibold">Paul Nshimiyimana</p>
              <p className="text-sm text-navy-300">Authority Officer</p>
              <p className="text-sm text-navy-300">Kigali District</p>
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[0, 1, 2, 3, 4].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <StatCard icon={MapPin} label="Districts" value={DISTRICTS.length} color="navy" />
          <StatCard icon={Route} label="Routes" value={DISTRICTS.reduce((s, d) => s + d.routes, 0)} color="blue" />
          <StatCard icon={DollarSign} label="Published Fares" value={DISTRICTS.reduce((s, d) => s + d.activeFares, 0)} color="green" />
          <StatCard icon={Building2} label="Cooperatives" value={activeCooperatives.length} color="amber" />
          <StatCard icon={Car} label="Registered Drivers" value={cooperatives.reduce((s, c) => s + c.drivers, 0)} color="green" />
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {loading ? (
            <ChartSkeleton />
          ) : (
            <Card className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TrendingUp size={18} className="text-green-600" />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Fare Trends by District</span>
                </div>
                <Link to="/authority/analytics" className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                  View analytics <ChevronRight size={14} />
                </Link>
              </div>
              <div className="h-72">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={fareTrendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#737373' }} axisLine={{ stroke: '#e5e5e5' }} tickLine={false} />
                    <YAxis tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${Math.round(v / 1000)}k`} />
                    <Tooltip
                      formatter={(value) => [formatCurrency(value), 'Fare']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', background: '#ffffff', fontSize: 13 }}
                    />
                    <Legend />
                    <Line type="monotone" dataKey="Kigali" stroke="#16a34a" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Huye" stroke="#0f2645" strokeWidth={3} dot={{ r: 4 }} />
                    <Line type="monotone" dataKey="Musanze" stroke="#3b5f9f" strokeWidth={3} dot={{ r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {loading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : (
            <Card
              header={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileText size={18} className="text-amber-500" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Proposals Pending Review</span>
                  </div>
                  <Link to="/authority/approvals" className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                    Review queue <ChevronRight size={14} />
                  </Link>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Route</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Cooperative</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Fare change</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Submitted</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingProposals.slice(0, 4).map((proposal) => (
                      <tr key={proposal.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                        <td className="px-4 py-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">{proposal.route}</td>
                        <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{proposal.cooperativeName}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className="text-neutral-500 line-through">{formatCurrency(proposal.currentFare)}</span>{' '}
                          &rarr;{' '}
                          <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(proposal.proposedFare)}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatDateShort(proposal.submittedDate)}</td>
                        <td className="px-4 py-3">
                          <Link to="/authority/approvals" className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800">
                            <ChevronRight size={16} />
                          </Link>
                        </td>
                      </tr>
                    ))}
                    {pendingProposals.length === 0 && <EmptyState title="No pending proposals" />}
                  </tbody>
                </table>
              </div>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          {loading ? (
            <CardSkeleton />
          ) : (
            <Card className="p-5">
              <div className="mb-4 flex items-center gap-2">
                <MapPin size={18} className="text-navy-900 dark:text-navy-300" />
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">District Activity</span>
              </div>
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={districtActivityData} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                    <XAxis dataKey="district" tick={{ fontSize: 10, fill: '#737373' }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip
                      formatter={(value) => [`${value}%`, 'Activity level']}
                      contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', background: '#ffffff', fontSize: 13 }}
                    />
                    <Bar dataKey="activity" fill="#0f2645" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>
          )}

          {loading ? (
            <CardSkeleton />
          ) : (
            <Card
              header={
                <div className="flex items-center gap-2">
                  <MessageSquare size={18} className="text-navy-900 dark:text-navy-300" />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Complaint Summary</span>
                </div>
              }
            >
              <div className="space-y-3">
                {[
                  { label: 'Open', count: complaints.filter((c) => c.status === 'OPEN').length, color: 'text-blue-600 dark:text-blue-400' },
                  { label: 'In progress', count: complaints.filter((c) => c.status === 'IN_PROGRESS').length, color: 'text-amber-600 dark:text-amber-400' },
                  { label: 'Resolved', count: complaints.filter((c) => c.status === 'RESOLVED').length, color: 'text-green-600 dark:text-green-400' },
                  { label: 'Closed', count: complaints.filter((c) => c.status === 'CLOSED').length, color: 'text-neutral-500 dark:text-neutral-400' },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600 dark:text-neutral-400">{item.label}</span>
                    <span className={`font-semibold ${item.color}`}>{item.count}</span>
                  </div>
                ))}
              </div>
              <Link to="/authority/complaints" className="mt-4 flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                View all complaints <ChevronRight size={14} />
              </Link>
            </Card>
          )}

          {loading ? (
            <CardSkeleton />
          ) : (
            <Card
              header={
                <div className="flex items-center gap-2">
                  <Activity size={18} className="text-green-600" />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Activity Feed</span>
                </div>
              }
            >
              <div className="space-y-3">
                {activityFeed.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-start gap-3">
                    <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${item.type === 'approval' ? 'bg-green-500' : item.type === 'complaint' ? 'bg-red-500' : item.type === 'proposal' ? 'bg-amber-500' : 'bg-navy-500'}`} />
                    <div>
                      <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        <span className="font-medium text-neutral-900 dark:text-neutral-100">{item.user}</span> {item.action}
                      </p>
                      <p className="text-xs text-neutral-400 dark:text-neutral-500">{formatDateShort(item.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}