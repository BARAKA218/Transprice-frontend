import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Route as RoutesIcon, DollarSign } from 'lucide-react';
import { mockDistricts, mockSectors, DISTRICTS } from '../../data/mockData';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

const PROVINCE_COLORS = {
  'Kigali City': 'text-navy-800 dark:text-navy-200',
  Northern: 'text-emerald-700 dark:text-emerald-300',
  Southern: 'text-violet-700 dark:text-violet-300',
  Western: 'text-amber-700 dark:text-amber-300',
  Eastern: 'text-sky-700 dark:text-sky-300',
};

export default function ZonesPage() {
  const [search, setSearch] = useState('');

  const grouped = useMemo(() => {
    const map = {};
    mockDistricts.forEach((d, i) => {
      const summary = DISTRICTS[i] || { routes: 0, activeFares: 0 };
      if (!map[d.province]) map[d.province] = [];
      map[d.province].push({
        ...d,
        routes: summary.routes || 0,
        activeFares: summary.activeFares || 0,
        sectors: mockSectors.filter((s) => s.districtId === d.id).length,
      });
    });
    return map;
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return grouped;
    const out = {};
    Object.entries(grouped).forEach(([province, districts]) => {
      const matched = districts.filter(
        (d) => d.name.toLowerCase().includes(q) || province.toLowerCase().includes(q)
      );
      if (matched.length > 0) out[province] = matched;
    });
    return out;
  }, [grouped, search]);

  const totals = useMemo(() => {
    let routes = 0;
    let fares = 0;
    Object.values(grouped).forEach((list) =>
      list.forEach((d) => {
        routes += d.routes;
        fares += d.activeFares;
      })
    );
    return { districts: mockDistricts.length, routes, fares };
  }, [grouped]);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants}>
        <p className="text-sm font-medium text-green-600 dark:text-green-400">Country Coverage</p>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Transport Zones in Rwanda</h1>
        <p className="mt-2 max-w-2xl text-neutral-500 dark:text-neutral-400">
          Every district of Rwanda is covered by verified transport price data — from Kigali's congested corridors
          to the Volcanoes, Lake Kivu and the Eastern savannah.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-3 gap-3">
        {[
          { label: 'Districts covered', value: totals.districts, icon: MapPin },
          { label: 'Active routes', value: totals.routes, icon: RoutesIcon },
          { label: 'Verified fares', value: totals.fares, icon: DollarSign },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-700">
              <Icon size={16} className="text-green-600 dark:text-green-400" />
              <p className="mt-1 text-2xl font-bold text-neutral-900 dark:text-white">{stat.value}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">{stat.label}</p>
            </div>
          );
        })}
      </motion.div>

      <div className="relative max-w-md">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search districts or provinces…"
          className="w-full rounded-xl border border-neutral-300 bg-white dark:bg-neutral-800 px-4 py-2.5 pr-10 text-sm text-neutral-900 dark:text-neutral-100 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/30"
        />
      </div>

      {Object.entries(filtered).length === 0 && (
        <p className="py-10 text-center text-sm text-neutral-400">
          No zones match "{search}".
        </p>
      )}

      {Object.entries(filtered).map(([province, districts]) => (
        <motion.div key={province} variants={itemVariants}>
          <h2 className={`mb-3 flex items-center gap-2 text-lg font-semibold ${PROVINCE_COLORS[province] || 'text-neutral-900 dark:text-white'}`}>
            <MapPin size={16} /> {province}
            <span className="text-xs font-normal text-neutral-400">({districts.length} districts)</span>
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {districts.map((d) => (
              <div
                key={d.id}
                className="group rounded-2xl border border-neutral-200 bg-white p-4 transition hover:border-green-400 hover:shadow-md dark:border-neutral-700 dark:bg-neutral-900"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-neutral-900 dark:text-white">{d.name}</p>
                    <p className="text-xs text-neutral-400">{d.sectors} sectors</p>
                  </div>
                  <span className="rounded-full bg-green-50 px-2 py-0.5 text-[10px] font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    {d.activeFares} fares
                  </span>
                </div>
                <div className="mt-3 flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <RoutesIcon size={12} /> <span>{d.routes} active routes</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}