import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Navigation, Clock, Route as RouteIcon } from 'lucide-react';
import RouteMap from '../../components/maps/RouteMap';
import { mockRoutes } from '../../data/mockData';
import { getTransportTypeLabel } from '../../utils/helpers';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

export default function MapsPage() {
  const [selectedId, setSelectedId] = useState(mockRoutes[0]?.id || null);
  const selected = mockRoutes.find((r) => r.id === selectedId) || mockRoutes[0];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants}>
        <p className="text-sm font-medium text-green-600 dark:text-green-400">Interactive Map</p>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">Route Map of Rwanda</h1>
        <p className="mt-2 max-w-2xl text-neutral-500 dark:text-neutral-400">
          Explore the corridors covered by TransPrice. Select a route to preview its path, distance and the transport options available.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1 space-y-2">
          <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Pick a route</label>
          <div className="max-h-[420px] space-y-2 overflow-y-auto pr-1">
            {mockRoutes.map((r) => (
              <button
                key={r.id}
                onClick={() => setSelectedId(r.id)}
                className={`flex w-full items-center gap-3 rounded-xl border p-3 text-left transition ${
                  r.id === selected?.id
                    ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                    : 'border-neutral-200 bg-white hover:border-green-300 dark:border-neutral-700 dark:bg-neutral-900'
                }`}
              >
                <RouteIcon size={16} className="shrink-0 text-navy-700 dark:text-navy-300" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-neutral-900 dark:text-white">{r.name}</p>
                  <p className="text-xs text-neutral-400">
                    {r.distance} km · ~{r.estimatedTime} min
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="lg:col-span-2">
          {selected && (
            <div className="overflow-hidden rounded-2xl border border-neutral-200 shadow-sm dark:border-neutral-700">
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800/50">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white">{selected.name}</p>
                <span className="flex items-center gap-1 text-xs text-neutral-500 dark:text-neutral-400">
                  <MapPin size={12} /> {selected.originDistrict} → {selected.destinationDistrict}
                </span>
              </div>
              <RouteMap
                origin={selected.origin}
                destination={selected.destination}
                originCoords={selected.coordinates?.origin}
                destinationCoords={selected.coordinates?.destination}
                routePoints={selected.coordinates ? [selected.coordinates.origin, selected.coordinates.destination] : []}
              />
              <div className="grid grid-cols-3 divide-x divide-neutral-200 dark:divide-neutral-700">
                <div className="p-3 text-center">
                  <p className="flex items-center justify-center gap-1 text-xs text-neutral-400"><Navigation size={12} /> Distance</p>
                  <p className="font-semibold text-neutral-900 dark:text-white">{selected.distance} km</p>
                </div>
                <div className="p-3 text-center">
                  <p className="flex items-center justify-center gap-1 text-xs text-neutral-400"><Clock size={12} /> Est. time</p>
                  <p className="font-semibold text-neutral-900 dark:text-white">~{selected.estimatedTime} min</p>
                </div>
                <div className="p-3 text-center">
                  <p className="flex items-center justify-center gap-1 text-xs text-neutral-400"><RouteIcon size={12} /> Options</p>
                  <p className="font-semibold text-neutral-900 dark:text-white">
                    {selected.transportTypes.map(getTransportTypeLabel).join(', ')}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}