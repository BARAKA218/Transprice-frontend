import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  History,
  ChevronRight,
  User,
  Filter,
  ArrowRight,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Select from '../../components/common/Select';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { TableSkeleton } from '../../components/common/LoadingSkeleton';
import { auditService } from '../../services/api';
import { mockAuditLogs } from '../../data/mockData';
import { formatDateTime } from '../../utils/helpers';

const actionOptions = ['CREATE', 'UPDATE', 'APPROVE', 'REJECT', 'DELETE'];
const recordTypes = ['PROPOSAL', 'FARE', 'COMPLAINT', 'COOPERATIVE', 'VEHICLE', 'ROUTE'];

function ActionBadge({ action }) {
  const styles = {
    CREATE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    UPDATE: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    APPROVE: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    REJECT: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[action] || styles.UPDATE}`}>
      {action}
    </span>
  );
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionFilter, setActionFilter] = useState('');
  const [recordTypeFilter, setRecordTypeFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateRange, setDateRange] = useState({ from: '', to: '' });
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await auditService.getAuditLogs();
        if (!mounted) return;
        setLogs(res.data);
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

  const userOptions = [...new Set(logs.map((l) => l.userName))];

  const filteredLogs = logs.filter((log) => {
    if (actionFilter && log.action !== actionFilter) return false;
    if (recordTypeFilter && log.recordType !== recordTypeFilter) return false;
    if (userFilter && log.userName !== userFilter) return false;
    if (dateRange.from && log.date < dateRange.from) return false;
    if (dateRange.to && log.date > `${dateRange.to}T23:59:59`) return false;
    return true;
  });

  if (error) {
    return <ErrorState message="Failed to load audit logs" description={error} />;
  }

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Audit Logs</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          Full audit trail of all system actions.
        </p>
      </motion.div>

      <Card className="p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
          <Select
            label="Action"
            placeholder="All actions"
            options={actionOptions}
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
          />
          <Select
            label="Record type"
            placeholder="All records"
            options={recordTypes}
            value={recordTypeFilter}
            onChange={(e) => setRecordTypeFilter(e.target.value)}
          />
          <Select
            label="User"
            placeholder="All users"
            options={userOptions}
            value={userFilter}
            onChange={(e) => setUserFilter(e.target.value)}
          />
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
        </div>
        {(actionFilter || recordTypeFilter || userFilter || dateRange.from || dateRange.to) && (
          <button
            onClick={() => {
              setActionFilter('');
              setRecordTypeFilter('');
              setUserFilter('');
              setDateRange({ from: '', to: '' });
            }}
            className="mt-3 flex items-center gap-1 text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-300"
          >
            <Filter size={14} /> Clear all filters
          </button>
        )}
      </Card>

      {loading ? (
        <TableSkeleton rows={8} columns={6} />
      ) : filteredLogs.length === 0 ? (
        <EmptyState title="No log entries found" description="Adjust your filters." />
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">User</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Action</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Record</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Date</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Details</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"></th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-2 text-sm text-neutral-700 dark:text-neutral-300">
                        <User size={14} className="text-neutral-400" />
                        {log.userName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <ActionBadge action={log.action} />
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">
                      {log.recordType} #{log.recordId}
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{formatDateTime(log.date)}</td>
                    <td className="px-4 py-3 text-sm text-neutral-500 dark:text-neutral-400">{log.details}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(log)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800">
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

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Audit Log Details" size="lg">
        {selected ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy-50 text-navy-900 dark:bg-navy-900/40 dark:text-navy-300">
                  <History size={18} />
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-neutral-100">{selected.details}</p>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    {formatDateTime(selected.date)}
                  </p>
                </div>
              </div>
              <ActionBadge action={selected.action} />
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Performed by</p>
                <p className="mt-1 flex items-center gap-1.5 font-medium text-neutral-800 dark:text-neutral-200">
                  <User size={14} className="text-neutral-400" /> {selected.userName}
                </p>
                <p className="mt-0.5 text-xs text-neutral-400 dark:text-neutral-500">User ID: {selected.userId}</p>
              </div>
              <div className="rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Target record</p>
                <p className="mt-1 font-medium text-neutral-800 dark:text-neutral-200">
                  {selected.recordType} #{selected.recordId}
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Value change</p>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div>
                  <p className="mb-2 flex items-center gap-1 text-xs font-medium text-red-500">
                    Old value <ArrowRight size={12} className="rotate-180" />
                  </p>
                  <div className="rounded-lg bg-red-50 p-3 font-mono text-xs text-red-700 dark:bg-red-900/20 dark:text-red-400">
                    {selected.oldValue ? (
                      <pre className="whitespace-pre-wrap font-mono">{JSON.stringify(selected.oldValue, null, 2)}</pre>
                    ) : (
                      <span className="italic opacity-70">None (creation)</span>
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-2 flex items-center gap-1 text-xs font-medium text-green-600 dark:text-green-400">
                    <ArrowRight size={12} /> New value
                  </p>
                  <div className="rounded-lg bg-green-50 p-3 font-mono text-xs text-green-700 dark:bg-green-900/20 dark:text-green-400">
                    {selected.newValue ? (
                      <pre className="whitespace-pre-wrap font-mono">{JSON.stringify(selected.newValue, null, 2)}</pre>
                    ) : (
                      <span className="italic opacity-70">None</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setSelected(null)}>Close</Button>
            </div>
          </div>
        ) : (
          <TableSkeleton rows={3} columns={3} />
        )}
      </Modal>
    </div>
  );
}