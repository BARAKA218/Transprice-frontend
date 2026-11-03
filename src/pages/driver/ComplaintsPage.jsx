import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MessageSquare,
  AlertCircle,
  Send,
  ChevronRight,
  Clock,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { CardSkeleton, TableSkeleton, TextSkeleton } from '../../components/common/LoadingSkeleton';
import { complaintService, routeService } from '../../services/api';
import { mockComplaints, mockRoutes } from '../../data/mockData';
import { formatDate, formatDateTime } from '../../utils/helpers';

const categories = [
  { value: 'FARE', label: 'Fare related' },
  { value: 'SAFETY', label: 'Safety' },
  { value: 'SERVICE', label: 'Service quality' },
  { value: 'ROUTE', label: 'Route issue' },
  { value: 'OTHER', label: 'Other' },
];

const statusFilterOptions = [
  { value: 'OPEN', label: 'Open' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'CLOSED', label: 'Closed' },
];

export default function ComplaintsPage() {
  const [complaints, setComplaints] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCompose, setShowCompose] = useState(false);
  const [selected, setSelected] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  const [form, setForm] = useState({
    category: '',
    routeId: '',
    subject: '',
    description: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

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
        const allComplaints = complaintRes.status === 'fulfilled' ? complaintRes.value.data : mockComplaints;
        setComplaints(allComplaints.filter((c) => c.reporterId === 'u1'));
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

  const filteredComplaints = statusFilter
    ? complaints.filter((c) => c.status === statusFilter)
    : complaints;

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.category || !form.routeId || !form.subject || !form.description) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setSubmitting(true);
    setFormError('');
    try {
      const route = routes.find((r) => r.id === form.routeId);
      const res = await complaintService.createComplaint({
        category: form.category,
        routeId: form.routeId,
        route: route ? `${route.origin} - ${route.destination}` : 'Unknown route',
        district: route?.district,
        subject: form.subject,
        description: form.description,
        reporterId: 'u1',
      });
      setComplaints((prev) => [res.data, ...prev]);
      setShowCompose(false);
      setForm({ category: '', routeId: '', subject: '', description: '' });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
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
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">My Complaints</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Report issues and track their resolution.
          </p>
        </div>
        <Button leftIcon={MessageSquare} onClick={() => setShowCompose(true)}>
          New Complaint
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card className="p-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Open</p>
          <p className="mt-1 text-2xl font-bold text-amber-600 dark:text-amber-400">
            {complaints.filter((c) => c.status === 'OPEN').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">In Progress</p>
          <p className="mt-1 text-2xl font-bold text-blue-600 dark:text-blue-400">
            {complaints.filter((c) => c.status === 'IN_PROGRESS').length}
          </p>
        </Card>
        <Card className="p-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Resolved</p>
          <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">
            {complaints.filter((c) => c.status === 'RESOLVED' || c.status === 'CLOSED').length}
          </p>
        </Card>
      </div>

      <Card
        header={
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-navy-900 dark:text-navy-300" />
            <span className="font-semibold text-neutral-900 dark:text-neutral-100">Complaint list</span>
            <div className="ml-auto w-48">
              <Select
                placeholder="All statuses"
                options={statusFilterOptions}
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              />
            </div>
          </div>
        }
      >
        {loading ? (
          <TableSkeleton rows={5} columns={4} />
        ) : filteredComplaints.length === 0 ? (
          <EmptyState title="No complaints found" description="When you report issues, they will appear here." />
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

      <Modal isOpen={showCompose} onClose={() => setShowCompose(false)} title="Report a Complaint" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Category"
              required
              placeholder="Select category"
              options={categories}
              value={form.category}
              onChange={handleChange('category')}
            />
            <Select
              label="Route"
              required
              placeholder="Select route"
              options={routes.map((r) => ({ value: r.id, label: `${r.origin} - ${r.destination}` }))}
              value={form.routeId}
              onChange={handleChange('routeId')}
            />
          </div>
          <Input
            label="Subject"
            required
            placeholder="Brief summary of the issue"
            icon={AlertCircle}
            value={form.subject}
            onChange={handleChange('subject')}
          />
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Description <span className="text-red-500 ml-0.5">*</span>
            </label>
            <textarea
              required
              rows={4}
              placeholder="Provide details about the issue..."
              value={form.description}
              onChange={handleChange('description')}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
            />
          </div>
          {formError && (
            <p className="text-sm text-red-500">{formError}</p>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowCompose(false)}>Cancel</Button>
            <Button type="submit" loading={submitting} leftIcon={Send}>
              Submit Complaint
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Complaint Details" size="lg">
        {selected ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selected.subject}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {selected.route} &middot; {selected.category} &middot; Submitted {formatDate(selected.createdAt)}
                </p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
              <p className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{selected.description}</p>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                  <Clock size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                    Complaint submitted
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {formatDateTime(selected.createdAt)} &middot; Awaiting review
                  </p>
                </div>
              </div>
              {selected.status !== 'OPEN' && (
                <div className="mt-3 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                  <div className="flex items-center gap-2">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400">
                      <CheckCircle2 size={16} />
                    </span>
                    <div>
                      <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">
                        {selected.status === 'RESOLVED' ? 'Resolved' : `Last updated ${formatDate(selected.updatedAt)}`}
                      </p>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        {selected.status === 'CLOSED' ? 'Closed' : 'No response yet'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <TextSkeleton lines={6} />
        )}
      </Modal>
    </div>
  );
}