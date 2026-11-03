import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  Fuel,
  Droplets,
  Flame,
  Calendar,
  Info,
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { fuelPriceService } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';
import { CardSkeleton } from '../../components/common/LoadingSkeleton';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const fuelIcons = {
  Petrol: Droplets,
  Diesel: Fuel,
  LPG: Flame,
};

const fuelColors = {
  Petrol: 'from-green-500 to-green-600',
  Diesel: 'from-blue-500 to-blue-600',
  LPG: 'from-amber-500 to-amber-600',
};

const chartFuelColors = {
  Petrol: '#16a34a',
  Diesel: '#2563eb',
  LPG: '#d97706',
};

export default function FuelPricesPage() {
  const [currentPrices, setCurrentPrices] = useState([]);
  const [allPrices, setAllPrices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [current, allRes] = await Promise.all([
          fuelPriceService.getCurrentFuelPrices(),
          fuelPriceService.getFuelPrices(),
        ]);
        setCurrentPrices(current);
        setAllPrices(allRes.data);
      } catch {
        setCurrentPrices([]);
        setAllPrices([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const chartData = useMemo(() => {
    const sorted = [...allPrices].sort((a, b) => new Date(a.effectiveDate) - new Date(b.effectiveDate));
    const dateMap = {};
    sorted.forEach((fp) => {
      if (!dateMap[fp.effectiveDate]) dateMap[fp.effectiveDate] = { date: fp.effectiveDate };
      dateMap[fp.effectiveDate][fp.fuelType] = fp.price;
    });
    return Object.values(dateMap);
  }, [allPrices]);

  const historicalTable = useMemo(() => {
    return [...allPrices]
      .sort((a, b) => new Date(b.effectiveDate) - new Date(a.effectiveDate));
  }, [allPrices]);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-navy-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible">
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Fuel Prices
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-neutral-300 text-lg">
              Current and historical fuel prices in Rwanda
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Current Prices */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <motion.div initial="hidden" animate="visible">
              <motion.h2 variants={fadeUp} className="text-xl font-semibold text-navy-900 mb-4">
                Current Prices
              </motion.h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {currentPrices.map((price, i) => {
                  const Icon = fuelIcons[price.fuelType] || Fuel;
                  const gradient = fuelColors[price.fuelType] || 'from-neutral-500 to-neutral-600';
                  return (
                    <motion.div
                      key={price.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.1 }}
                      className={`rounded-xl bg-gradient-to-br ${gradient} p-6 text-white shadow-lg`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="rounded-lg bg-white/20 p-2.5">
                          <Icon size={24} />
                        </div>
                        <span className="text-xs bg-white/20 rounded-full px-2.5 py-1 font-medium">
                          Per Litre
                        </span>
                      </div>
                      <p className="text-sm font-medium text-white/80 mb-1">{price.fuelType}</p>
                      <p className="text-4xl font-bold mb-3">
                        {formatCurrency(price.price)}
                      </p>
                      <div className="flex items-center justify-between text-xs text-white/70">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={12} /> Since {formatDate(price.effectiveDate)}
                        </span>
                        <span>{price.source}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Chart */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
              <motion.h2 variants={fadeUp} className="text-xl font-semibold text-navy-900 mb-1">
                Price Trends
              </motion.h2>
              <p variants={fadeUp} custom={1} className="text-sm text-neutral-500 mb-6">
                Historical fuel price changes over time
              </p>
              {chartData.length > 0 ? (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="date"
                        tick={{ fontSize: 12, fill: '#737373' }}
                        tickFormatter={(val) => {
                          const d = new Date(val);
                          return d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                        }}
                      />
                      <YAxis
                        tick={{ fontSize: 12, fill: '#737373' }}
                        tickFormatter={(val) => `${val.toLocaleString()}`}
                      />
                      <Tooltip
                        contentStyle={{ borderRadius: '8px', border: '1px solid #e5e5e5' }}
                        formatter={(val) => [`RWF ${val.toLocaleString()}`, '']}
                        labelFormatter={(val) => formatDate(val)}
                      />
                      <Legend />
                      {Object.keys(chartFuelColors).map((fuel) => (
                        <Line
                          key={fuel}
                          type="monotone"
                          dataKey={fuel}
                          stroke={chartFuelColors[fuel]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              ) : (
                <p className="text-sm text-neutral-400 text-center py-12">No chart data available</p>
              )}
            </motion.div>

            {/* Historical Table */}
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
              <div className="p-6 border-b border-neutral-200">
                <h2 className="text-xl font-semibold text-navy-900">Historical Prices</h2>
                <p className="text-sm text-neutral-500 mt-1">Complete record of fuel price changes</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200 bg-neutral-50">
                      <th className="px-6 py-3 text-left font-medium text-neutral-600">Fuel Type</th>
                      <th className="px-6 py-3 text-left font-medium text-neutral-600">Price</th>
                      <th className="px-6 py-3 text-left font-medium text-neutral-600">Effective Date</th>
                      <th className="px-6 py-3 text-left font-medium text-neutral-600">Status</th>
                      <th className="px-6 py-3 text-left font-medium text-neutral-600">Source</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalTable.map((fp) => (
                      <tr key={fp.id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-3">
                          <span className="flex items-center gap-2 font-medium text-navy-900">
                            {(() => {
                              const Icon = fuelIcons[fp.fuelType] || Fuel;
                              return <Icon size={16} className="text-neutral-400" />;
                            })()}
                            {fp.fuelType}
                          </span>
                        </td>
                        <td className="px-6 py-3 font-semibold text-navy-900">{formatCurrency(fp.price)}</td>
                        <td className="px-6 py-3 text-neutral-500">{formatDate(fp.effectiveDate)}</td>
                        <td className="px-6 py-3">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            fp.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-500'
                          }`}>
                            {fp.status === 'ACTIVE' ? 'Current' : 'Previous'}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-neutral-500">{fp.source}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            {/* Source */}
            <div className="rounded-lg bg-neutral-100 p-4 flex items-start gap-3">
              <Info size={18} className="text-neutral-400 shrink-0 mt-0.5" />
              <div className="text-sm text-neutral-500">
                <p className="font-medium text-neutral-700 mb-1">Data Source</p>
                <p>
                  All fuel prices are sourced from the Rwanda Energy Board (REB) and verified before publication.
                  Prices shown are retail prices per litre in Rwandan Francs (RWF).
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
