import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Route, DollarSign, Search, ChevronRight, Grid3X3, List } from 'lucide-react';
import Card from '../../components/common/Card';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/common/Modal';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';
import { routeService, fareService } from '../../services/api';
import { DISTRICTS, mockRoutes, mockFares } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/helpers';

export default function DistrictsPage() {
  const [routes, setRoutes] = useState([]);
  const [fares, setFares] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('grid');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const [routeRes, fareRes] = await Promise.allSettled([
          routeService.getRoutes(),
          fareService.getFares(),
        ]);
        if (!mounted) return;
        setRoutes(routeRes.status === 'fulfilled' ? routeRes.value.data : mockRoutes);
        setFares(fareRes.status === 'fulfilled' ? fareRes.value.data : mockFares);
      } catch (err) {
      } finally {
        if (mounted) setLoading(false);
      }
    };
    load();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredDistricts = DISTRICTS.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  const districtRoutes = (id) => {
    const name = DISTRICTS.find((d) => d.id === id)?.name;
    return routes.filter((r) => r.district === name);
  };

  const districtFares = (id) => {
    const name = DISTRICTS.find((d) => d.id === id)?.name;
    return fares.filter((f) => f.district === name);
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Districts</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            National overview of districts, routes and active fares.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search districts..."
              className="w-56 rounded-lg border border-neutral-300 bg-white py-2 pl-9 pr-3 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-navy-900 focus:outline-none focus:ring-2 focus:ring-navy-900/20 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100 dark:focus:border-green-500 dark:focus:ring-green-500/20"
            />
          </div>
          <div className="flex rounded-lg bg-neutral-100 p-1 dark:bg-neutral-800">
            <button
              onClick={() => setView('grid')}
              className={`rounded-md p-2 ${view === 'grid' ? 'bg-white text-navy-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100' : 'text-neutral-500'}`}
            >
              <Grid3X3 size={16} />
            </button>
            <button
              onClick={() => setView('list')}
              className={`rounded-md p-2 ${view === 'list' ? 'bg-white text-navy-900 shadow-sm dark:bg-neutral-900 dark:text-neutral-100' : 'text-neutral-500'}`}
            >
              <List size={16} />
            </button>
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => <CardSkeleton key={i} />)}
        </div>
      ) : filteredDistricts.length === 0 ? (
        <EmptyState title="No districts found" />
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredDistricts.map((district) => (
            <motion.div key={district.id} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} whileHover={{ y: -4 }}>
              <Card hover className="h-full" onClick={() => setSelected(district)}>
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-navy-50 p-3 dark:bg-navy-900/40">
                        <MapPin size={22} className="text-navy-900 dark:text-navy-300" />
                      </div>
                      <div>
                        <p className="font-semibold text-neutral-900 dark:text-neutral-100">{district.name}</p>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400">{district.sectors} sectors</p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <StatBlock icon={Route} label="Routes" value={district.routes} />
                    <StatBlock icon={DollarSign} label="Fares" value={district.activeFares} />
                    <StatBlock icon={MapPin} label="Sectors" value={district.sectors} />
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-neutral-200 text-left dark:border-neutral-700">
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">District</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Sectors</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Routes</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">Active Fares</th>
                  <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400"></th>
                </tr>
              </thead>
              <tbody>
                {filteredDistricts.map((district) => (
                  <tr key={district.id} className="border-b border-neutral-100 transition-colors hover:bg-neutral-50 dark:border-neutral-800 dark:hover:bg-neutral-800/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="rounded-lg bg-navy-50 p-2 text-navy-900 dark:bg-navy-900/40 dark:text-navy-300">
                          <MapPin size={16} />
                        </div>
                        <span className="text-sm font-medium text-neutral-800 dark:text-neutral-200">{district.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{district.sectors}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{district.routes}</td>
                    <td className="px-4 py-3 text-sm text-neutral-700 dark:text-neutral-300">{district.activeFares}</td>
                    <td className="px-4 py-3">
                      <button onClick={() => setSelected(district)} className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-600 dark:hover:bg-neutral-800">
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

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="District Details" size="lg">
        {selected ? (
          <div className="space-y-5">
            <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-xl bg-navy-50 p-3 dark:bg-navy-900/40">
                  <MapPin size={24} className="text-navy-900 dark:text-navy-300" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">{selected.name}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">{selected.sectors} sectors</p>
                </div>
              </div>
              <StatusBadge status="ACTIVE" />
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-xl bg-neutral-50 p-4 text-center dark:bg-neutral-800">
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{selected.routes}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Routes</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 text-center dark:bg-neutral-800">
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{selected.activeFares}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Active fares</p>
              </div>
              <div className="rounded-xl bg-neutral-50 p-4 text-center dark:bg-neutral-800">
                <p className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{selected.sectors}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Sectors</p>
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">Routes</p>
              <div className="space-y-2">
                {districtRoutes(selected.id).length === 0 ? (
                  <p className="text-sm text-neutral-500">No routes currently mapped for this district.</p>
                ) : (
                  districtRoutes(selected.id).map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700">
                      <span className="text-neutral-700 dark:text-neutral-300">{r.origin} - {r.destination}</span>
                      <span className="text-neutral-400">{r.distance} km</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div>
              <p className="mb-2 text-sm font-semibold text-neutral-800 dark:text-neutral-200">Sample active fares</p>
              <div className="space-y-2">
                {districtFares(selected.id).slice(0, 3).map((f) => (
                  <div key={f.id} className="flex items-center justify-between rounded-lg border border-neutral-200 px-3 py-2 text-sm dark:border-neutral-700">
                    <span className="text-neutral-700 dark:text-neutral-300">{f.route} ({f.transportType})</span>
                    <span className="font-semibold text-green-600 dark:text-green-400">{formatCurrency(f.fare)}</span>
                  </div>
                ))}
                {districtFares(selected.id).length === 0 && (
                  <p className="text-sm text-neutral-500">No fares currently recorded for this district.</p>
                )}
              </div>
            </div>
          </div>
        ) : (
          <CardSkeleton />
        )}
      </Modal>
    </div>
  );
}

function StatBlock({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-neutral-100 py-3 dark:border-neutral-800">
      <Icon size={16} className="mx-auto text-neutral-400" />
      <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">{value}</p>
      <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
    </div>
  );
}