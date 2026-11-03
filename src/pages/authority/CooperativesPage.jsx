import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2,
  Users,
  Car,
  Route,
  DollarSign,
  ChevronRight,
  Mail,
  Phone,
  ShieldBan,
  ShieldCheck,
  Search,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { cooperativeService, proposalService } from '../../services/api';
import { mockCooperatives, mockProposals } from '../../data/mockData';
import { formatDate } from '../../utils/helpers';

export default function CooperativesPage() {
  const [cooperatives, setCooperatives] = useState([]);
  const [proposals, setProposals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [coopRes, proposalRes] = await Promise.allSettled([
          cooperativeService.getCooperatives(),
          proposalService.getProposals(),
        ]);
        if (!mounted) return;
        setCooperatives(coopRes.status === 'fulfilled' ? coopRes.value.data : mockCooperatives);
        setProposals(proposalRes.status === 'fulfilled' ? proposalRes.value.data : mockProposals);
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

  const filteredCoops = cooperatives.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  const pendingForCoop = (id) => proposals.filter((p) => p.cooperativeId === id && p.status === 'PENDING').length;

  const handleStatusChange = async () => {
    if (!selected || !confirmAction) return;
    setProcessing(true);
    try {
      const newStatus = selected.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await cooperativeService.updateCooperative(selected.id, { status: newStatus });
      setCooperatives((prev) => prev.map((c) => (c.id === selected.id ? { ...c, status: newStatus } : c)));
      setSelected((prev) => ({ ...prev, status: newStatus }));
      setConfirmAction(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  if (error) {
    return <ErrorState message="Failed to load cooperatives" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Cooperatives</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Registered transport cooperatives and their statistics.
          </p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search cooperatives..."
            className="w-64 rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[0, 1].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredCoops.length === 0 ? (
        <EmptyState title="No cooperatives found" />
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {filteredCoops.map((coop) => (
            <motion.div key={coop.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <Card hover className="h-full" onClick={() => setSelected(coop)}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-navy-50 p-3 dark:bg-navy-900/40">
                        <Building2 size={22} className="text-navy-900 dark:text-navy-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{coop.name}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{coop.district} &middot; Since {formatDate(coop.joinDate)}</p>
                      </div>
                    </div>
                    <StatusBadge status={coop.status} />
                  </div>

                  <div className="grid grid-cols-4 gap-2 text-center">
                    <Metric icon={Users} value={coop.members} label="Members" />
                    <Metric icon={Car} value={coop.drivers} label="Drivers" />
                    <Metric icon={Route} value={coop.routes} label="Routes" />
                    <Metric icon={DollarSign} value={coop.activeTariffs} label="Fares" />
                  </div>

                  <div className="flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-neutral-800">
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {pendingForCoop(coop.id) > 0 ? (
                        <span className="font-medium text-amber-600 dark:text-amber-400">{pendingForCoop(coop.id)} pending proposal(s)</span>
                      ) : (
                        'No pending proposals'
                      )}
                    </span>
                    <button onClick={() => setSelected(coop)} className="flex items-center gap-1 text-sm font-medium text-green-600 hover:text-green-700 dark:text-green-400">
                      View details <ChevronRight size={14} />
                    </button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Cooperative Details" size="lg">
        {selected ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-navy-50 p-4 dark:bg-navy-900/40">
                  <Building2 size={28} className="text-navy-900 dark:text-navy-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selected.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {selected.district} district &middot; Registered {formatDate(selected.joinDate)}
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <StatusBadge status={selected.status} />
                <Button
                  size="sm"
                  variant={selected.status === 'ACTIVE' ? 'outline' : 'primary'}
                  leftIcon={selected.status === 'ACTIVE' ? ShieldBan : ShieldCheck}
                  onClick={() => setConfirmAction(true)}
                >
                  {selected.status === 'ACTIVE' ? 'Set Inactive' : 'Activate'}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <Metric icon={Users} value={selected.members} label="Members" />
              <Metric icon={Car} value={selected.drivers} label="Drivers" />
              <Metric icon={Car} value={selected.vehicles} label="Vehicles" />
              <Metric icon={Route} value={selected.routes} label="Routes" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 text-sm dark:border-neutral-700">
                <Mail size={16} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Contact email</p>
                  <p className="text-neutral-800 dark:text-neutral-200">{selected.contactEmail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-xl border border-neutral-200 p-3 text-sm dark:border-neutral-700">
                <Phone size={16} className="text-neutral-400" />
                <div>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">Contact phone</p>
                  <p className="text-neutral-800 dark:text-neutral-200">{selected.contactPhone}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl bg-neutral-50 p-4 dark:bg-neutral-800">
                <p className="text-xs uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Active tariffs</p>
                <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">{selected.activeTariffs}</p>
              </div>
              <div className="rounded-xl bg-amber-50 p-4 dark:bg-amber-900/20">
                <p className="text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400">Pending proposals</p>
                <p className="mt-1 text-2xl font-bold text-amber-700 dark:text-amber-400">{pendingForCoop(selected.id)}</p>
              </div>
            </div>
          </div>
        ) : (
          <CardSkeleton />
        )}
      </Modal>

      <Modal
        isOpen={confirmAction}
        onClose={() => setConfirmAction(false)}
        title={selected?.status === 'ACTIVE' ? 'Set Cooperative Inactive' : 'Activate Cooperative'}
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {selected?.status === 'ACTIVE'
              ? `Setting ${selected?.name} inactive will prevent it from operating on registered routes and submitting new proposals.`
              : `Activating ${selected?.name} will allow it to resume operation and submit proposals.`}
          </p>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setConfirmAction(false)}>Cancel</Button>
            <Button
              loading={processing}
              variant={selected?.status === 'ACTIVE' ? 'danger' : 'primary'}
              onClick={handleStatusChange}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function Metric({ icon: Icon, value, label }) {
  return (
    <div className="rounded-xl border border-neutral-100 py-3 dark:border-neutral-800">
      <Icon size={16} className="mx-auto text-neutral-400" />
      <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
    </div>
  );
}