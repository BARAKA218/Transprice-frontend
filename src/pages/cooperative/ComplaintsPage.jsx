import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  Send,
  ChevronRight,
  Filter,
  BarChart3,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { complaintService, routeService } from '../../services/api';
import { mockComplaints, mockRoutes } from '../../data/mockData';
import { formatDate } from '../../utils/helpers';

const complaintCategories = [
  'FARE', 'SAFETY', 'SERVICE', 'ROUTE', 'OTHER',
];

export default function CooperativeComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');
  const [responding, setResponding] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [complaintRes, routeRes] = await Promise.allSettled([
          complaintService.getComplaints(),
          routeService.getRoutes(),
        ]);
        if (!mounted) return;
        setComplaints(complaintRes.status === 'fulfilled' ? complaintRes.value.data : mockComplaints);
        setRoutes(routeRes.status === 'fulfilled' ? routeRes.value.data : mockRoutes);
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

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (categoryFilter && c.category !== categoryFilter) return false;
    return true;
  });

  const statsData = [
    { category: 'FARE', count: complaints.filter((c) => c.category === 'FARE').length },
    { category: 'SAFETY', count: complaints.filter((c) => c.category === 'SAFETY').length },
    { category: 'SERVICE', count: complaints.filter((c) => c.category === 'SERVICE').length },
    { category: 'ROUTE', count: complaints.filter((c) => c.category === 'ROUTE').length },
    { category: 'OTHER', count: complaints.filter((c) => c.category === 'OTHER').length },
  ];

  const handleRespond = async () => {
    if (!response.trim() || !selected) return;
    setResponding(true);
    try {
      await complaintService.respondToComplaint(selected.id, response.trim());
      setComplaints((prev) =>
        prev.map((c) =>
          c.id === selected.id ? { ...c, response, status: 'IN_PROGRESS', updatedAt: new Date().toISOString().slice(0, 10) } : c
        )
      );
      setSelected((prev) => ({ ...prev, response, status: 'IN_PROGRESS' }));
      setResponse('');
    } catch (err) {
      setError(err.message);
    } finally {
      setResponding(false);
    }
  };

  if (error) {
    return <ErrorState message="Failed to load complaints" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Complaints</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Complaints related to routes operated by your cooperative.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 size={18} className="text-navy-900 dark:text-navy-300" />
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Complaints by Category</span>
          </div>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={statsData} margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: '#737373' }} axisLine={{ stroke: '#e5e5e5' }} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: '#737373' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 12, border: '1px solid #e5e5e5', background: '#ffffff', fontSize: 13 }}
                />
                <Bar dataKey="count" name="Complaints" fill="#0f2645" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <div className="space-y-3">
          {[
            { label: 'Open', count: complaints.filter((c) => c.status === 'OPEN').length, color: 'text-blue-600 dark:text-blue-400' },
            { label: 'In progress', count: complaints.filter((c) => c.status === 'IN_PROGRESS').length, color: 'text-amber-600 dark:text-amber-400' },
            { label: 'Resolved', count: complaints.filter((c) => c.status === 'RESOLVED').length, color: 'text-green-600 dark:text-green-400' },
            { label: 'Closed', count: complaints.filter((c) => c.status === 'CLOSED').length, color: 'text-neutral-500 dark:text-neutral-400' },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center justify-between rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
              <span className="text-sm text-neutral-600 dark:text-neutral-400">{stat.label}</span>
              <span className={`text-xl font-bold ${stat.color}`}>{stat.count}</span>
            </div>
          ))}
        </div>
      </div>

      <Card
        header={
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Filter size={18} className="text-navy-900 dark:text-navy-300" />
              <span className="font-semibold text-neutral-900 dark:text-neutral-100">All complaints</span>
            </div>
            <div className="ml-auto flex gap-3">
              <div className="w-44">
                <Select
                  placeholder="All statuses"
                  options={['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED']}
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                />
              </div>
              <div className="w-44">
                <Select
                  placeholder="All categories"
                  options={complaintCategories}
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        }
      >
        {loading ? (
          <TableSkeleton rows={5} columns={5} />
        ) : filteredComplaints.length === 0 ? (
          <EmptyState title="No complaints found" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Subject</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Route</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"></th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatDate(complaint.createdAt)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">{complaint.subject}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{complaint.category}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{complaint.route}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(complaint)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800">
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Complaint Detail" size="lg">
        {selected ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selected.subject}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {selected.route} &middot; {selected.category} &middot; Reported by {selected.reporterName}
                </p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Description</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{selected.description}</p>
            </div>

            {selected.response && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900/40 dark:bg-green-900/20">
                <p className="text-xs font-semibold uppercase tracking-wider text-green-600 dark:text-green-400">Cooperative response</p>
                <p className="mt-2 text-sm text-green-800 dark:text-green-300">{selected.response}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Filed</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{formatDate(selected.createdAt)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Last updated</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{formatDate(selected.updatedAt)}</span>
              </div>
            </div>

            {selected.status === 'OPEN' && (
              <div className="border-t border-neutral-200 pt-4 dark:border-neutral-700">
                <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                  Your response
                </label>
                <textarea
                  rows={3}
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  placeholder="Acknowledge the issue and describe the action being taken..."
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
                />
                <div className="mt-3 flex justify-end">
                  <Button size="sm" leftIcon={Send} loading={responding} onClick={handleRespond} disabled={!response.trim()}>
                    Send Response
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <TableSkeleton rows={3} columns={2} />
        )}
      </Modal>
    </div>
  );
}