import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bell, CheckCheck, Check, Search } from 'lucide-react';
import { mockNotifications } from '../../data/mockData';
import { formatDate } from '../../utils/helpers';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

const TYPE_STYLES = {
  FARE_UPDATED: 'bg-green-50 text-green-700 ring-green-200',
  TARIFF_APPROVED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  FUEL_UPDATE: 'bg-amber-50 text-amber-700 ring-amber-200',
  COMPLAINT_UPDATE: 'bg-red-50 text-red-700 ring-red-200',
  TARIFF_REJECTED: 'bg-rose-50 text-rose-700 ring-rose-200',
  TRANSPORT_ANNOUNCEMENT: 'bg-sky-50 text-sky-700 ring-sky-200',
  ROUTE_ADDED: 'bg-violet-50 text-violet-700 ring-violet-200',
  SYSTEM: 'bg-neutral-100 text-neutral-600 ring-neutral-200',
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState('ALL');

  const unread = notifications.filter((n) => !n.isRead).length;

  const filtered = useMemo(() => {
    if (filter === 'ALL') return notifications;
    if (filter === 'UNREAD') return notifications.filter((n) => !n.isRead);
    return notifications.filter((n) => n.type === filter);
  }, [notifications, filter]);

  const types = useMemo(() => ['ALL', 'UNREAD', ...new Set(notifications.map((n) => n.type))], [notifications]);

  const markAllRead = () =>
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));

  const markRead = (id) =>
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Notifications</h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            {unread > 0 ? `${unread} unread update${unread > 1 ? 's' : ''}` : 'You are all caught up'}
          </p>
        </div>
        <button
          onClick={markAllRead}
          className="flex items-center gap-2 rounded-lg border border-neutral-200 px-3 py-2 text-sm text-neutral-600 transition hover:border-green-400 dark:border-neutral-700 dark:text-neutral-300"
        >
          <CheckCheck size={15} /> Mark all read
        </button>
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap gap-2">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
              filter === t
                ? 'bg-navy-800 text-white'
                : 'border border-neutral-200 text-neutral-600 hover:border-green-400 dark:border-neutral-700 dark:text-neutral-300'
            }`}
          >
            {t.charAt(0) + t.slice(1).toLowerCase().replace('_', ' ')}
          </button>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-2">
        {filtered.length === 0 && (
          <div className="flex flex-col items-center gap-2 py-16 text-center">
            <Bell size={28} className="text-neutral-300" />
            <p className="text-sm text-neutral-400">No notifications here.</p>
          </div>
        )}
        {filtered.map((n) => (
          <button
            key={n.id}
            onClick={() => markRead(n.id)}
            className={`flex w-full items-start gap-3 rounded-2xl border p-4 text-left transition ${
              n.isRead
                ? 'border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900'
                : 'border-navy-200 bg-navy-50/60 dark:border-navy-700 dark:bg-navy-900/30'
            }`}
          >
            <span className={`mt-0.5 rounded-lg px-2 py-1 font-mono text-[10px] font-semibold ring-1 ${TYPE_STYLES[n.type] || 'bg-neutral-100 text-neutral-600'}`}>
              {n.type}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-neutral-900 dark:text-white">{n.title}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                {n.message} · {formatDate(n.createdAt)}
              </p>
              {n.link && (
                <Link to={n.link} className="mt-1 inline-block text-xs font-medium text-green-600 hover:underline dark:text-green-400">
                  View details →
                </Link>
              )}
            </div>
            {!n.isRead && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-green-500" />}
          </button>
        ))}
      </motion.div>
    </motion.div>
  );
}