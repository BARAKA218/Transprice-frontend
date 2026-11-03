import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  ChevronRight,
  Send,
  CheckCircle2,
  User,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Select from '../../components/common/Select';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { complaintService, routeService } from '../../services/api';
import { DISTRICTS, mockComplaints, mockRoutes } from '../../data/mockData';
import { formatDate } from '../../utils/helpers';

const statusOptions = ['OPEN', 'IN_PROGRESS', 'RESOLVED', 'CLOSED', 'DISMISSED'];
const categoryOptions = ['FARE', 'SAFETY', 'SERVICE', 'ROUTE', 'OTHER'];

export default function AuthorityComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [routeFilter, setRouteFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selected, setSelected] = useState(null);
  const [response, setResponse] = useState('');
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState('');

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

  const routeOptions = routes.map((r) => `${r.origin} - ${r.destination}`);

  const filteredComplaints = complaints.filter((c) => {
    if (statusFilter && c.status !== statusFilter) return false;
    if (districtFilter && c.district !== districtFilter) return false;
    if (routeFilter && c.route !== routeFilter) return false;
    if (categoryFilter && c.category !== categoryFilter) return false;
    return true;
  });

  const updateComplaintInList = (id, updates) => {
    setComplaints((prev) => prev.map((c) => (c.id === id ? { ...c, ...updates } : c)));
    setSelected((prev) => (prev ? { ...prev, ...updates } : prev));
  };

  const handleRespond = async () => {
    if (!response.trim()) {
      setActionError('Please write a response before sending.');
      return;
    }
    setProcessing(true);
    setActionError('');
    try {
      await complaintService.respondToComplaint(selected.id, response.trim());
      updateComplaintInList(selected.id, {
        response: response.trim(),
        status: 'IN_PROGRESS',
        updatedAt: new Date().toISOString().slice(0, 10),
      });
      setResponse('');
    } catch (err) {
      setActionError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleResolve = async () => {
    setProcessing(true);
    setActionError('');
    try {
      await complaintService.updateComplaint(selected.id, { status: 'RESOLVED' });
      updateComplaintInList(selected.id, {
        status: 'RESOLVED',
        updatedAt: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      setActionError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleClose = async () => {
    setProcessing(true);
    setActionError('');
    try {
      await complaintService.updateComplaint(selected.id, { status: 'CLOSED' });
      updateComplaintInList(selected.id, {
        status: 'CLOSED',
        updatedAt: new Date().toISOString().slice(0, 10),
      });
    } catch (err) {
      setActionError(err.message);
    } finally {
      setProcessing(false);
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
          National view of all passenger and driver complaints.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total', count: complaints.length, color: 'text-navy-900 dark:text-navy-300' },
          { label: 'Open', count: complaints.filter((c) => c.status === 'OPEN').length, color: 'text-blue-600 dark:text-blue-400' },
          { label: 'In progress', count: complaints.filter((c) => c.status === 'IN_PROGRESS').length, color: 'text-amber-600 dark:text-amber-400' },
          { label: 'Resolved', count: complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length, color: 'text-green-600 dark:text-green-400' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{stat.label}</p>
            <p className={`mt-1 text-2xl font-bold ${stat.color}`}>{stat.count}</p>
          </div>
        ))}
      </div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Select
            label="Status"
            placeholder="All statuses"
            options={statusOptions}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          />
          <Select
            label="District"
            placeholder="All districts"
            options={DISTRICTS.map((d) => ({ value: d.name, label: d.name }))}
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
          />
          <Select
            label="Route"
            placeholder="All routes"
            options={routeOptions}
            value={routeFilter}
            onChange={(e) => setRouteFilter(e.target.value)}
          />
          <Select
            label="Category"
            placeholder="All categories"
            options={categoryOptions}
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          />
        </div>
      </Card>

      {loading ? (
        <TableSkeleton rows={6} columns={6} />
      ) : filteredComplaints.length === 0 ? (
        <EmptyState title="No complaints found" description="Adjust your filters." />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Subject</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Reporter</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">District</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Category</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"></th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((complaint) => (
                  <tr key={complaint.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatDate(complaint.createdAt)}</td>
                    <td className="px-4 py-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">{complaint.subject}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-sm text-neutral-700 dark:text-neutral-300">
                        <User size={12} className="text-neutral-400" />
                        {complaint.reporterName}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{complaint.district}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{complaint.category}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={complaint.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => { setSelected(complaint); setResponse(''); setActionError(''); }} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800">
                        <ChevronRight size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Complaint Details" size="xl">
        {selected ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selected.subject}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {selected.route} &middot; {selected.district} &middot; Reported by {selected.reporterName}
                </p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Category</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{selected.category}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Filed</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{formatDate(selected.createdAt)}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Updated</p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">{formatDate(selected.updatedAt)}</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-3 text-center dark:bg-neutral-800">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Route</p>
                <p className="text-sm font-semibold truncate text-neutral-900 dark:text-neutral-100">{selected.route}</p>
              </div>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Description</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{selected.description}</p>
            </div>

            {selected.response && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/40 dark:bg-blue-900/20">
                <p className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400">Authority response</p>
                <p className="mt-2 text-sm text-blue-800 dark:text-blue-300">{selected.response}</p>
              </div>
            )}

            {selected.status !== 'CLOSED' && selected.status !== 'DISMISSED' && (
              <div className="space-y-4 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Respond to complaint</label>
                  <textarea
                    rows={3}
                    value={response}
                    onChange={(e) => setResponse(e.target.value)}
                    placeholder="Write an official response..."
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
                  />
                </div>
                {actionError && <p className="text-sm text-red-500">{actionError}</p>}
                <div className="flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    leftIcon={Send}
                    loading={processing}
                    onClick={handleRespond}
                    disabled={!response.trim()}
                  >
                    Send Response
                  </Button>
                  <Button
                    size="sm"
                    variant="primary"
                    className="bg-green-600 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500"
                    leftIcon={CheckCircle2}
                    loading={processing}
                    onClick={handleResolve}
                  >
                    Mark Resolved
                  </Button>
                  <Button size="sm" variant="outline" onClick={handleClose} loading={processing}>
                    Close Complaint
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <TableSkeleton rows={3} columns={3} />
        )}
      </Modal>
    </div>
  );
}