import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileBarChart,
  Download,
  Loader2,
  Calendar,
  FileText,
  Users,
  DollarSign,
  MessageSquare,
  CheckCircle2,
} from 'lucide-react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import StatusBadge from '../../components/common/StatusBadge';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import { reportService } from '../../services/api';
import { formatCurrency, formatDate } from '../../utils/helpers';

const templates = [
  {
    id: 'trips',
    label: 'National Trips Report',
    icon: Users,
    description: 'All recorded trips across the country, per route and district.',
    color: 'bg-navy-50 text-navy-900 dark:bg-navy-900/40 dark:text-navy-300',
  },
  {
    id: 'revenue',
    label: 'Revenue & Tariff Report',
    icon: DollarSign,
    description: 'Fare collections, tariff adoption rates and trends.',
    color: 'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  },
  {
    id: 'complaints',
    label: 'Complaints Compliance Report',
    icon: MessageSquare,
    description: 'Complaint resolution performance by district and cooperative.',
    color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  },
  {
    id: 'cooperatives',
    label: 'Cooperative Compliance Report',
    icon: FileText,
    description: 'Registered cooperatives, fleet size, membership and status.',
    color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  },
];

export default function AuthorityReportsPage() {
  const [activeTemplate, setActiveTemplate] = useState('trips');
  const [dateRange, setDateRange] = useState({ from: '2025-07-01', to: '2025-12-31' });
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);
  const [exported, setExported] = useState(null);

  useEffect(() => {
    let mounted = true;
    const load = async () => {
      try {
        setLoading(true);
        const res = await reportService.getReport('trips');
        if (!mounted) return;
        setReport(res.data);
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

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    try {
      const mapped = activeTemplate === 'cooperatives' ? 'trips' : activeTemplate;
      const res = await reportService.getReport(mapped, dateRange);
      setReport(res.data);
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleExport = () => {
    setExported(activeTemplate);
    setTimeout(() => setExported(null), 2500);
    window.alert('Export is coming soon. The generated report is displayed below in preview mode.');
  };

  if (error && !report) {
    return <ErrorState message="Failed to load reports" description={error} />;
  }

  const currentTemplate = templates.find((t) => t.id === activeTemplate);

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Reports</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Generate official national transport reports.
          </p>
        </div>
        <Button leftIcon={Download} onClick={handleExport} disabled={!report}>
          {exported ? 'Exporting...' : 'Export (CSV/PDF)'}
        </Button>
      </motion.div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {templates.map((template) => (
          <button
            key={template.id}
            onClick={() => setActiveTemplate(template.id)}
            className={`rounded-xl border p-5 text-left transition-all ${
              activeTemplate === template.id
                ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                : 'border-neutral-200 bg-white hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900'
            }`}
          >
            <div className={`inline-flex rounded-lg p-2.5 ${template.color}`}>
              <template.icon size={20} />
            </div>
            <p className="mt-3 font-semibold text-neutral-900 dark:text-neutral-100">{template.label}</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{template.description}</p>
          </button>
        ))}
      </div>

      <Card className="p-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
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
          <div className="flex items-end">
            <Button fullWidth leftIcon={Loader2} loading={generating} onClick={handleGenerate}>
              Generate Report
            </Button>
          </div>
        </div>
      </Card>

      {loading ? (
        <EmptyState title="Loading report..." />
      ) : (
        report && (
          <Card className="p-6">
            <div className="flex flex-col gap-4 border-b border-neutral-200 pb-4 dark:border-neutral-700 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-3">
                <div className={`rounded-lg p-2.5 ${currentTemplate?.color}`}>
                  <currentTemplate.icon size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{currentTemplate?.label}</h3>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400">
                    Generated {formatDate(report.generatedAt)} &middot; {dateRange.from || 'Jul 2025'} - {dateRange.to || 'Dec 2025'}
                  </p>
                </div>
              </div>
              <StatusBadge status="COMPLETED" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <ReportMetric icon={Calendar} label="Reporting period" value={`${dateRange.from || 'Jul 2025'} - ${dateRange.to || 'Dec 2025'}`} />
              <ReportMetric icon={FileText} label="Report type" value={activeTemplate === 'cooperatives' ? 'Cooperative compliance' : `${activeTemplate} performance`} />
              <ReportMetric icon={CheckCircle2} label="Status" value="Ready for download" />
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.entries(report.summary || {}).map(([key, value]) => (
                <div key={key} className="rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
                  <p className="text-xs capitalize text-neutral-500 dark:text-neutral-400">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </p>
                  <p className="mt-1 text-lg font-bold text-neutral-900 dark:text-neutral-100">
                    {typeof value === 'number' ? value.toLocaleString() : value}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5 rounded-xl bg-green-50 p-4 text-sm text-green-700 dark:bg-green-900/20 dark:text-green-400">
              <p className="flex items-center gap-2 font-medium">
                <CheckCircle2 size={16} />
                Report preview ready
              </p>
              <p className="mt-1">
                Full export with charts and tables will be available in CSV and PDF formats once the export module ships.
              </p>
            </div>
          </Card>
        )
      )}
    </div>
  );
}

function ReportMetric({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-neutral-200 p-4 dark:border-neutral-700">
      <div className="rounded-lg bg-neutral-50 p-2 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
        <Icon size={16} />
      </div>
      <div>
        <p className="text-xs text-neutral-500 dark:text-neutral-400">{label}</p>
        <p className="mt-0.5 text-sm font-medium text-neutral-800 dark:text-neutral-200">{value}</p>
      </div>
    </div>
  );
}