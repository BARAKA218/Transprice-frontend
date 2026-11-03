import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  MessageSquareWarning,
  ChevronRight,
  DollarSign,
  FileText,
  Clock,
  History,
  CalendarClock,
  ShieldCheck,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';
import { CardSkeleton, TableSkeleton } from '../../components/common/LoadingSkeleton';
import { proposalService } from '../../services/api';
import { mockProposals } from '../../data/mockData';
import { formatCurrency, formatDate, formatDateTime } from '../../utils/helpers';

export default function ApprovalsPage() {
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [view, setView] = useState('pending');
  const [reviewState, setReviewState] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [processing, setProcessing] = useState(false);
  const [actionError, setActionError] = useState('');
  const [confirmation, setConfirmation] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await proposalService.getProposals();
        if (!mounted) return;
        setProposals(res.data);
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
  const reviewedProposals = proposals.filter((p) => p.status !== 'PENDING');

  const startReview = (proposal, action) => {
    setSelected(proposal);
    setReviewState(action);
    setReviewNotes('');
    setActionError('');
  };

  const handleConfirm = async () => {
    if (!selected || !reviewState) return;
    if (reviewState !== 'APPROVED' && !reviewNotes.trim() && reviewState !== 'REJECTED' && reviewState !== 'REQUEST_CHANGES') {
      setActionError('Please provide review notes.');
      return;
    }
    setProcessing(true);
    setActionError('');
    try {
      const decisionMap = {
        APPROVED: 'APPROVED',
        REJECTED: 'REJECTED',
        REQUEST_CHANGES: 'REJECTED',
      };
      const finalStatus = decisionMap[reviewState];
      const res = await proposalService.reviewProposal(selected.id, finalStatus, reviewNotes || getDefaultNotes(reviewState));
      setProposals((prev) => prev.map((p) => (p.id === selected.id ? { ...p, ...res.data } : p)));
      setConfirmation(null);
      setReviewState(null);
      setSelected(null);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  const getDefaultNotes = (state) => {
    if (state === 'APPROVED') return 'Approved by the National Transport Authority.';
    if (state === 'REJECTED') return 'Rejected - does not meet fare guideline criteria.';
    return 'Changes requested. Additional justification required.';
  };

  const hasPending = pendingProposals.length > 0;

  if (error) {
    return <ErrorState message="Failed to load approval queue" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Tariff Approvals</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Review and decide on tariff proposals submitted by cooperatives.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-medium text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <Clock size={16} />
          {hasPending ? `${pendingProposals.length} awaiting decision` : 'Queue clear'}
        </div>
      </motion.div>

      <div className="flex rounded-xl bg-neutral-100 p-1 dark:bg-neutral-800">
        <button
          onClick={() => setView('pending')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            view === 'pending'
              ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100'
              : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
          }`}
        >
          Pending Review
          <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${view === 'pending' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400' : 'bg-neutral-200 text-neutral-600 dark:bg-neutral-700'}`}>
            {pendingProposals.length}
          </span>
        </button>
        <button
          onClick={() => setView('history')}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
            view === 'history'
              ? 'bg-white text-neutral-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100'
              : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300'
          }`}
        >
          <History size={16} />
          Approval History
        </button>
      </div>

      {loading ? (
        view === 'pending' ? <TableSkeleton rows={5} columns={5} /> : <CardSkeleton />
      ) : view === 'pending' ? (
        pendingProposals.length === 0 ? (
          <EmptyState
            icon={CheckCircle2}
            title="No pending proposals"
            description="All proposals have been reviewed. New submissions will appear here."
          />
        ) : (
          <div className="space-y-4">
            {pendingProposals.map((proposal) => {
              const increase = Math.round(((proposal.proposedFare - proposal.currentFare) / proposal.currentFare) * 100);
              return (
                <motion.div key={proposal.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
                  <Card hover onClick={() => { setSelected(proposal); setReviewState(null); setActionError(''); }}>
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex items-start gap-4">
                        <div className="rounded-xl bg-amber-50 p-3 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
                          <FileText size={22} />
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <p className="font-semibold text-neutral-900 dark:text-neutral-100">{proposal.route}</p>
                            <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium capitalize text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                              {proposal.transportType}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                            {proposal.cooperativeName} &middot; Submitted {formatDate(proposal.submittedDate)}
                          </p>
                          <div className="mt-2 flex items-center gap-2 text-sm">
                            <span className="text-neutral-500 line-through">{formatCurrency(proposal.currentFare)}</span>
                            <ChevronRight size={14} className="text-neutral-400" />
                            <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(proposal.proposedFare)}</span>
                            <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${increase > 15 ? 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400' : 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
                              +{increase}%
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 lg:justify-end">
                        <Button
                          size="sm"
                          variant="primary"
                          className="bg-green-600 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500"
                          leftIcon={CheckCircle2}
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmation({ proposal, action: 'APPROVED' });
                          }}
                        >
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="danger"
                          leftIcon={XCircle}
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmation({ proposal, action: 'REJECTED' });
                          }}
                        >
                          Reject
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          leftIcon={MessageSquareWarning}
                          onClick={(e) => {
                            e.stopPropagation();
                            setConfirmation({ proposal, action: 'REQUEST_CHANGES' });
                          }}
                        >
                          Request Changes
                        </Button>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )
      ) : reviewedProposals.length === 0 ? (
        <Card>
          <EmptyState title="No approval history yet" />
        </Card>
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Route</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Cooperative</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Fare change</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Reviewed</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Result</th>
                </tr>
              </thead>
              <tbody>
                {reviewedProposals.map((proposal) => (
                  <tr key={proposal.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">{proposal.route}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{proposal.cooperativeName}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className="text-neutral-500 line-through">{formatCurrency(proposal.currentFare)}</span>{' '}
                      &rarr;{' '}
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{formatCurrency(proposal.proposedFare)}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatDate(proposal.reviewDate)}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={proposal.status === 'REJECTED' ? (proposal.reviewerNotes?.toLowerCase().includes('change') ? 'REJECTED' : 'REJECTED') : proposal.status} />
                      <p className="mt-1 max-w-[220px] truncate text-xs text-neutral-400 dark:text-neutral-500">{proposal.reviewerNotes}</p>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal isOpen={!!selected} onClose={() => { setSelected(null); setReviewState(null); setActionError(''); }} title="Proposal Review" size="xl">
        {selected ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selected.route}</h3>
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  {selected.cooperativeName} &middot; {selected.submittedBy} &middot; Submitted {formatDate(selected.submittedDate)}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={selected.status === 'PENDING' ? 'PENDING' : selected.status === 'REJECTED' ? (selected.reviewerNotes?.toLowerCase().includes('change') ? 'REJECTED' : 'REJECTED') : 'APPROVED'} />
                <button onClick={() => setSelected(null)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                  <XIcon />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-xl border border-neutral-200 p-4 text-center dark:border-neutral-700">
                <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Current fare</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{formatCurrency(selected.currentFare)}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4 text-center dark:border-neutral-700">
                <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Proposed fare</p>
                <p className="mt-1 text-2xl font-bold text-green-600 dark:text-green-400">{formatCurrency(selected.proposedFare)}</p>
                <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                  +{Math.round(((selected.proposedFare - selected.currentFare) / selected.currentFare) * 100)}%
                </p>
              </div>
              <div className="rounded-xl border border-neutral-200 p-4 text-center dark:border-neutral-700">
                <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Effective date</p>
                <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">{formatDate(selected.effectiveDate)}</p>
                <p className="mt-1 flex items-center justify-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <CalendarClock size={12} /> Proposed
                </p>
              </div>
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

            {selected.status === 'PENDING' ? (
              <div className="space-y-4 border-t border-neutral-200 pt-4 dark:border-neutral-700">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Review notes (required for rejections / change requests)</label>
                  <textarea
                    rows={3}
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    placeholder="Provide guidance to the cooperative..."
                    className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
                  />
                </div>
                {actionError && <p className="text-sm text-red-500">{actionError}</p>}
                <div className="flex flex-col gap-2 sm:flex-row sm:justify-end">
                  <Button
                    variant="primary"
                    className="bg-green-600 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500"
                    leftIcon={CheckCircle2}
                    onClick={() => setConfirmation({ proposal: selected, action: 'APPROVED' })}
                  >
                    Approve Proposal
                  </Button>
                  <Button
                    variant="danger"
                    leftIcon={XCircle}
                    onClick={() => setConfirmation({ proposal: selected, action: 'REJECTED' })}
                  >
                    Reject Proposal
                  </Button>
                  <Button
                    variant="outline"
                    leftIcon={MessageSquareWarning}
                    onClick={() => setConfirmation({ proposal: selected, action: 'REQUEST_CHANGES' })}
                  >
                    Request Changes
                  </Button>
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={18} className="text-green-600" />
                  <p className="font-medium text-neutral-800 dark:text-neutral-200">
                    Reviewed on {formatDateTime(selected.reviewDate)}
                  </p>
                </div>
                <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">{selected.reviewerNotes}</p>
              </div>
            )}
          </div>
        ) : (
          <CardSkeleton />
        )}
      </Modal>

      <Modal
        isOpen={!!confirmation}
        onClose={() => setConfirmation(null)}
        title={
          confirmation?.action === 'APPROVED'
            ? 'Approve Proposal'
            : confirmation?.action === 'REJECTED'
              ? 'Reject Proposal'
              : 'Request Changes'
        }
        size="sm"
      >
        {confirmation && (
          <div className="space-y-4">
            {confirmation.action === 'REQUEST_CHANGES' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">What changes are required?</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Describe what the cooperative needs to revise..."
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
                />
                {actionError && <p className="text-sm text-red-500">{actionError}</p>}
              </div>
            )}
            {confirmation.action === 'REJECTED' && (
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Reason for rejection</label>
                <textarea
                  rows={3}
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Explain why this proposal is being rejected..."
                  className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
                />
                {actionError && <p className="text-sm text-red-500">{actionError}</p>}
              </div>
            )}
            <p className="rounded-xl bg-neutral-50 p-3 text-sm text-neutral-600 dark:bg-neutral-800 dark:text-neutral-400">
              {confirmation.action === 'APPROVED'
                ? `You are about to approve the fare change for ${confirmation.proposal.route} from ${formatCurrency(confirmation.proposal.currentFare)} to ${formatCurrency(confirmation.proposal.proposedFare)}.`
                : confirmation.action === 'REJECTED'
                  ? `You are about to reject the fare proposal for ${confirmation.proposal.route}. The cooperative will be notified.`
                  : `You are about to request changes to the proposal for ${confirmation.proposal.route}. The cooperative can revise and resubmit.`}
            </p>
            <div className="flex justify-end gap-3 pt-2">
              <Button variant="ghost" onClick={() => setConfirmation(null)}>Cancel</Button>
              <Button
                loading={processing}
                onClick={handleConfirm}
                leftIcon={confirmation.action === 'APPROVED' ? CheckCircle2 : confirmation.action === 'REJECTED' ? XCircle : MessageSquareWarning}
                variant={confirmation.action === 'APPROVED' ? 'primary' : confirmation.action === 'REJECTED' ? 'danger' : 'outline'}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

function XIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-neutral-400">
      <path d="M18 6L6 18M6 6l12 12" />
    </svg>
  );
}