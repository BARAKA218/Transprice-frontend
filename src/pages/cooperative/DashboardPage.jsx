import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Users,
  Car,
  Route,
  FileText,
  Plus,
  AlertCircle,
  ChevronRight,
  MessageSquare,
  TrendingUp,
  Building2,
} from 'lucide-react';
import Card from '../../components/common/Card';
import StatCard from '../../components/common/StatCard';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import ErrorState from '../../components/common/ErrorState';
import { CardSkeleton, TableSkeleton } from '../../components/common/LoadingSkeleton';
import { cooperativeService, complaintService, proposalService } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function CooperativeDashboardPage() {
  const [coop, setCoop] = useState(null);
  const [complaints, setComplaints] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [coopRes, complaintRes, proposalRes] = await Promise.allSettled([
          cooperativeService.getCooperative('coop1'),
          complaintService.getComplaints(),
          proposalService.getProposals(),
        ]);
        if (!mounted) return;
        setCoop(coopRes.status === 'fulfilled' ? coopRes.value.data : null);
        setComplaints(complaintRes.status === 'fulfilled' ? complaintRes.value.data : []);
        setProposals(proposalRes.status === 'fulfilled' ? proposalRes.value.data : []);
        setError(null);
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

  const quickActions = [
    { label: 'Add Member', icon: Users, to: '/cooperative/members' },
    { label: 'Add Vehicle', icon: Car, to: '/cooperative/vehicles' },
    { label: 'View Routes', icon: Route, to: '/cooperative/routes' },
    { label: 'New Tariff Proposal', icon: FileText, to: '/cooperative/proposals' },
  ];

  if (error) {
    return <ErrorState message="Failed to load cooperative dashboard" description={error} />;
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
              <Building2 size={16} />
              {loading || !coop ? 'Loading...' : coop.district} District
            </div>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              {loading || !coop ? 'Cooperative Dashboard' : coop.name}
            </h1>
            <p className="mt-1 text-sm text-navy-300">
              Manage your members, vehicles, routes and tariffs.
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <Link to="/cooperative/proposals">
                <Button variant="primary" className="bg-green-600 hover:bg-green-500 dark:bg-green-600 dark:hover:bg-green-500" leftIcon={FileText}>
                  New Tariff Proposal
                </Button>
              </Link>
              <Link to="/cooperative/members">
                <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 dark:border-white/20">
                  Manage Members
                </Button>
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-600 text-xl font-bold text-white">
              {loading || !coop ? 'C' : coop.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
            </div>
            <div>
              <p className="text-sm text-navy-300">Cooperative status</p>
              <StatusBadge status={coop?.status || 'ACTIVE'} />
            </div>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard icon={Users} label="Members" value={coop?.members || 0} trend="up" trendValue="+3 this month" color="navy" />
          <StatCard icon={Car} label="Drivers" value={coop?.drivers || 0} color="green" />
          <StatCard icon={Car} label="Vehicles" value={coop?.vehicles || 0} color="blue" />
          <StatCard icon={Route} label="Routes" value={coop?.routes || 0} color="amber" />
        </motion.div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {loading ? (
              <>
                <CardSkeleton /><CardSkeleton />
              </>
            ) : (
              <>
                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-green-50 p-3 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                        <FileText size={22} />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Active tariffs</p>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{coop?.activeTariffs || 0}</p>
                      </div>
                    </div>
                    <Link to="/cooperative/tariffs" className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                      View <ChevronRight size={14} />
                    </Link>
                  </div>
                  <div className="mt-4 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                    <p className="flex items-center gap-1 text-sm text-neutral-500 dark:text-neutral-400">
                      <TrendingUp size={14} className="text-green-500" />
                      8 published fares across 12 routes
                    </p>
                  </div>
                </Card>
                <Card className="p-5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-amber-50 p-3 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        <FileText size={22} />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">Pending proposals</p>
                        <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                          {proposals.filter((p) => p.status === 'PENDING').length}
                        </p>
                      </div>
                    </div>
                    <Link to="/cooperative/proposals" className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                      Review <ChevronRight size={14} />
                    </Link>
                  </div>
                  <div className="mt-4 border-t border-neutral-100 pt-3 dark:border-neutral-800">
                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                      Awaiting authority review
                    </p>
                  </div>
                </Card>
              </>
            )}
          </div>

          {loading ? (
            <TableSkeleton rows={5} columns={5} />
          ) : (
            <Card
              header={
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={18} className="text-navy-900 dark:text-navy-300" />
                    <span className="font-semibold text-neutral-900 dark:text-neutral-100">Recent Complaints</span>
                  </div>
                  <Link to="/cooperative/complaints" className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                    View all <ChevronRight size={14} />
                  </Link>
                </div>
              }
            >
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Date</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Subject</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Route</th>
                      <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {complaints.slice(0, 5).map((complaint) => (
                      <tr key={complaint.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                        <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatDate(complaint.createdAt)}</td>
                        <td className="px-4 py-3 text-sm font-medium text-neutral-800 dark:text-neutral-200">{complaint.subject}</td>
                        <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{complaint.route}</td>
                        <td className="px-4 py-3">
                          <StatusBadge status={complaint.status} />
                        </td>
                      </tr>
                    ))}
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
            <Card
              header={
                <div className="flex items-center gap-2">
                  <Plus size={18} className="text-green-600" />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Quick Actions</span>
                </div>
              }
            >
              <div className="grid grid-cols-2 gap-3">
                {quickActions.map((action) => (
                  <Link key={action.label} to={action.to}>
                    <div className="flex flex-col items-start gap-3 rounded-xl border border-neutral-200 p-4 transition-all hover:border-green-500/50 hover:shadow-sm dark:border-neutral-700">
                      <div className="rounded-lg bg-navy-50 p-2 text-navy-900 dark:bg-navy-900/30 dark:text-navy-300">
                        <action.icon size={20} />
                      </div>
                      <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{action.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}

          {loading ? (
            <CardSkeleton />
          ) : (
            <Card
              header={
                <div className="flex items-center gap-2">
                  <AlertCircle size={18} className="text-amber-500" />
                  <span className="font-semibold text-neutral-900 dark:text-neutral-100">Latest Proposals</span>
                </div>
              }
            >
              <div className="space-y-3">
                {proposals.slice(0, 4).map((proposal) => (
                  <Link key={proposal.id} to="/cooperative/proposals">
                    <div className="rounded-xl border border-neutral-100 p-3 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{proposal.route}</p>
                        <StatusBadge status={proposal.status} />
                      </div>
                      <p className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
                        {formatCurrency(proposal.currentFare)} &rarr; {formatCurrency(proposal.proposedFare)}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">
                        {formatDate(proposal.submittedDate)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}