import { motion } from 'framer-motion';
import { Building2, Users, Route, BadgeCheck } from 'lucide-react';
import { mockCooperatives } from '../../data/mockData';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

const STATUS_STYLES = {
  ACTIVE: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  PENDING_REVIEW: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  SUSPENDED: 'bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-400',
};

export default function OperatorsPage() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants}>
        <p className="text-sm font-medium text-green-600 dark:text-green-400">Transport Operators</p>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Registered Cooperatives</h1>
        <p className="mt-2 max-w-2xl text-neutral-500 dark:text-neutral-400">
          TransPrice publishes fares submitted by licensed transport cooperatives across Rwanda. Every cooperative is
          verified by the regulator before participating.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {mockCooperatives.map((coop) => (
          <div
            key={coop.id}
            className="rounded-2xl border border-neutral-200 bg-white p-5 transition hover:border-green-400 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-800 text-white">
                <Building2 size={18} />
              </div>
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${STATUS_STYLES[coop.status] || 'bg-neutral-100 text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300'}`}>
                {coop.status.replace('_', ' ')}
              </span>
            </div>
            <h3 className="mt-3 font-semibold text-neutral-900 dark:text-white">{coop.name}</h3>
            <p className="text-xs text-neutral-400">
              {coop.district} · Joined {new Date(coop.joinDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            </p>
            <div className="mt-4 grid grid-cols-3 divide-x divide-neutral-200 text-center dark:divide-neutral-700">
              <div className="px-1">
                <p className="flex items-center justify-center gap-1 text-xs text-neutral-400"><Users size={12} /> Members</p>
                <p className="font-semibold text-neutral-900 dark:text-white">{coop.members}</p>
              </div>
              <div className="px-1">
                <p className="flex items-center justify-center gap-1 text-xs text-neutral-400"><BadgeCheck size={12} /> Drivers</p>
                <p className="font-semibold text-neutral-900 dark:text-white">{coop.drivers}</p>
              </div>
              <div className="px-1">
                <p className="flex items-center justify-center gap-1 text-xs text-neutral-400"><Route size={12} /> Routes</p>
                <p className="font-semibold text-neutral-900 dark:text-white">{coop.routes}</p>
              </div>
            </div>
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}