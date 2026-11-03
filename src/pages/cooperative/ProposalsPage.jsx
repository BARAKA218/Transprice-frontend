import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText,
  Plus,
  Send,
  DollarSign,
  ChevronRight,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  Lock,
  CalendarClock,
  Lightbulb,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import Modal from '../../components/common/Modal';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { CardSkeleton, TableSkeleton } from '../../components/common/LoadingSkeleton';
import { proposalService, routeService, fareService } from '../../services/api';
import { TRANSPORT_TYPES } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function ProposalsPage() {
  const [proposals, setProposals] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [fares, setFares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [selected, setSelected] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const [form, setForm] = useState({
    routeId: '',
    transportType: '',
    proposedFare: '',
    reason: '',
    notes: '',
    effectiveDate: '',
  });

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [proposalRes, routeRes, fareRes] = await Promise.allSettled([
          proposalService.getProposals(),
          routeService.getRoutes(),
          fareService.getFares(),
        ]);
        if (!mounted) return;
        setProposals(proposalRes.status === 'fulfilled' ? proposalRes.value.data : []);
        setRoutes(routeRes.status === 'fulfilled' ? routeRes.value.data : []);
        setFares(fareRes.status === 'fulfilled' ? fareRes.value.data : []);
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

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const currentFareForForm = () => {
    if (!form.routeId || !form.transportType) return null;
    const fare = fares.find((f) => f.routeId === form.routeId && f.transportType === form.transportType);
    return fare?.fare || null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentFare = currentFareForForm();
    if (!form.routeId || !form.transportType || !form.proposedFare || !form.reason || !form.effectiveDate) {
      setFormError('Please fill in all required fields.');
      return;
    }
    if (currentFare === null) {
      setFormError('No published fare exists for this route and transport type. Verify the selection.');
      return;
    }
    if (Number(form.proposedFare) <= currentFare) {
      setFormError('Proposed fare must be higher than the current fare.');
      return;
    }
    const route = routes.find((r) => r.id === form.routeId);
    setSubmitting(true);
    setFormError('');
    try {
      const res = await proposalService.createProposal({
        routeId: form.routeId,
        route: `${route.origin} - ${route.destination}`,
        transportType: form.transportType,
        currentFare,
        proposedFare: Number(form.proposedFare),
        reason: form.reason,
        notes: form.notes,
        effectiveDate: form.effectiveDate,
      });
      setProposals((prev) => [res.data, ...prev]);
      setShowCreate(false);
      setForm({ routeId: '', transportType: '', proposedFare: '', reason: '', notes: '', effectiveDate: '' });
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (error) {
    return <ErrorState message="Failed to load proposals" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Tariff Proposals</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Submit fare change proposals for authority review.
          </p>
        </div>
        <Button leftIcon={Plus} onClick={() => setShowCreate(true)}>
          New Proposal
        </Button>
      </motion.div>

      <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-400">
        <p className="flex items-center gap-2 font-medium">
          <Lock size={16} /> Submissions only
        </p>
        <p className="mt-1 text-amber-700 dark:text-amber-500">
          Proposals are submitted for review by the authority. Your cooperative cannot publish tariffs directly. Decisions are typically provided within 10 working days.
        </p>
      </div>

      {loading ? (
        <TableSkeleton rows={6} columns={5} />
      ) : proposals.length === 0 ? (
        <EmptyState title="No proposals yet" description="Create your first tariff proposal to request a fare change." />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Route</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Type</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Fare change</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Submitted</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"></th>
                </tr>
              </thead>
              <tbody>
                {proposals.map((proposal) => (
                  <tr key={proposal.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">{proposal.route}</td>
                    <td className="px-4 py-3 text-sm capitalize text-neutral-700 dark:text-neutral-300">{proposal.transportType}</td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-sm">
                        <span className="text-neutral-500 line-through">{formatCurrency(proposal.currentFare)}</span>
                        <ChevronRight size={14} className="text-neutral-400" />
                        <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(proposal.proposedFare)}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatDate(proposal.submittedDate)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={proposal.status} />
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(proposal)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800">
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

      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="New Tariff Proposal" size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Select
              label="Route"
              required
              placeholder="Select route"
              options={routes.map((r) => ({ value: r.id, label: `${r.origin} - ${r.destination}` }))}
              value={form.routeId}
              onChange={handleChange('routeId')}
            />
            <Select
              label="Transport type"
              required
              placeholder="Select type"
              options={TRANSPORT_TYPES}
              value={form.transportType}
              onChange={handleChange('transportType')}
            />
          </div>

          {currentFareForForm() !== null && (
            <div className="flex items-center justify-between rounded-lg bg-neutral-50 px-4 py-3 dark:bg-neutral-800">
              <span className="flex items-center gap-2 text-sm text-neutral-600 dark:text-neutral-400">
                <DollarSign size={16} className="text-green-600" />
                Current published fare
              </span>
              <span className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
                {formatCurrency(currentFareForForm())}
              </span>
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Proposed fare <span className="text-red-500 ml-0.5">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-neutral-400">RWF</span>
              <input
                type="number"
                min={100}
                step={100}
                required
                value={form.proposedFare}
                onChange={handleChange('proposedFare')}
                placeholder="e.g. 4000"
                className="w-full rounded-lg border border-neutral-300 bg-white py-2 pl-14 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
              />
            </div>
          </div>

          <Input
            label="Effective date"
            type="date"
            required
            icon={CalendarClock}
            value={form.effectiveDate}
            onChange={handleChange('effectiveDate')}
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              Reason <span className="text-red-500 ml-0.5">*</span>
            </label>
            <textarea
              required
              rows={3}
              placeholder="Explain why this fare change is needed..."
              value={form.reason}
              onChange={handleChange('reason')}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Supporting notes</label>
            <textarea
              rows={2}
              placeholder="Attach any supporting documentation references or additional context..."
              value={form.notes}
              onChange={handleChange('notes')}
              className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
            />
          </div>

          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20">
            <p className="flex items-center gap-2 font-medium">
              <Lightbulb size={14} /> Tip
            </p>
            <p className="mt-1 text-green-600 dark:text-green-400">
              Strong proposals include cost evidence, passenger demand data, and a clear justification. Fares must remain within the authority's regulatory guidelines.
            </p>
          </div>

          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button type="submit" loading={submitting} leftIcon={Send}>
              Submit for Review
            </Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Proposal Details" size="lg">
        {selected ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selected.route}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {selected.transportType} &middot; Submitted by {selected.submittedBy} on {formatDate(selected.submittedDate)}
                </p>
              </div>
              <StatusBadge status={selected.status} />
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
              <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Fare change</p>
              <div className="mt-1 flex items-center gap-3">
                <span className="text-neutral-500 line-through">{formatCurrency(selected.currentFare)}</span>
                <Arrow /> 
                <span className="text-xl font-bold text-green-600 dark:text-green-400">{formatCurrency(selected.proposedFare)}</span>
                <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-semibold text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  +{Math.round(((selected.proposedFare - selected.currentFare) / selected.currentFare) * 100)}%
                </span>
              </div>
              <p className="mt-2 flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                <CalendarClock size={14} /> Proposed effective date: {formatDate(selected.effectiveDate)}
              </p>
            </div>

            <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
              <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Reason</p>
              <p className="mt-2 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">{selected.reason}</p>
            </div>

            {selected.notes && (
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Supporting notes</p>
                <p className="mt-2 text-sm text-neutral-700 dark:text-neutral-300">{selected.notes}</p>
              </div>
            )}

            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Timeline</p>
              <div className="space-y-0">
                <TimelineItem
                  icon={FileText}
                  title="Proposal submitted"
                  date={formatDate(selected.submittedDate)}
                  status={selected.status === 'PENDING' ? 'active' : 'done'}
                  last={selected.status === 'PENDING'}
                />
                {selected.reviewDate && (
                  <TimelineItem
                    icon={selected.status === 'APPROVED' ? CheckCircle2 : selected.status === 'REJECTED' ? XCircle : Clock}
                    title={selected.status === 'APPROVED' ? 'Proposal approved' : selected.status === 'REJECTED' ? 'Proposal rejected' : 'Under review'}
                    date={formatDate(selected.reviewDate)}
                    status="done"
                    last
                  />
                )}
                {selected.status === 'PENDING' && (
                  <TimelineItem
                    icon={Clock}
                    title="Awaiting authority review"
                    date="Pending"
                    status="current"
                    last
                  />
                )}
              </div>
              {selected.reviewerNotes && (
                <div className="mt-3 rounded-lg bg-green-50 p-3 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
                  <p className="font-medium">Reviewer feedback:</p>
                  <p className="mt-1">{selected.reviewerNotes}</p>
                </div>
              )}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        ) : (
          <CardSkeleton />
        )}
      </Modal>
    </div>
  );
}

function Arrow() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-neutral-400">
      <path d="M5 10h9m0 0l-3-3m3 3l-3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TimelineItem({ icon: Icon, title, date, status, last }) {
  const statusStyles = {
    done: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400',
    active: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
    current: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  };
  return (
    <div className="flex gap-3">
      <div className="flex flex-col items-center">
        <span className={`flex h-8 w-8 items-center justify-center rounded-full ${statusStyles[status]}`}>
          <Icon size={15} />
        </span>
        {!last && <span className="w-0.5 flex-1 bg-neutral-200 dark:bg-neutral-700" />}
      </div>
      <div className="pb-5">
        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{title}</p>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{date}</p>
      </div>
    </div>
  );
}