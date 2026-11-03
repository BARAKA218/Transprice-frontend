import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  AlertTriangle, Plus, Send, ChevronDown, ChevronUp,
  MessageSquare, Calendar, MapPin, X,
} from 'lucide-react';
import { useAuthStore } from '../../store';
import { complaintService } from '../../services/api';
import { formatDate, getStatusColor, getStatusLabel } from '../../utils/helpers';
import { COMPLAINT_CATEGORIES } from '../../types/index';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Select from '../../components/common/Select';
import EmptyState from '../../components/common/EmptyState';
import StatusBadge from '../../components/common/StatusBadge';

const reportSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  route: z.string().optional(),
});

const CATEGORY_OPTIONS = [
  { value: 'OVERCHARGING', label: 'Overcharging' },
  { value: 'DRIVER_BEHAVIOR', label: 'Rude Driver / Behavior' },
  { value: 'ROUTE_DEVIATION', label: 'Route Deviation' },
  { value: 'VEHICLE_CONDITION', label: 'Vehicle Condition' },
  { value: 'SAFETY', label: 'Safety Concern' },
  { value: 'LATE_SERVICE', label: 'Late Service' },
  { value: 'REFUSAL_TO_CARRY', label: 'Refusal to Carry' },
  { value: 'OTHER', label: 'Other' },
];

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.06 } } };
const itemVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } };

export default function ReportsPage() {
  const { user } = useAuthStore();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(reportSchema),
  });

  useEffect(() => {
    loadComplaints();
  }, [user]);

  async function loadComplaints() {
    setLoading(true);
    try {
      const data = await complaintService.getComplaints(user?.id);
      setComplaints(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await complaintService.createComplaint({
        userId: user?.id,
        userName: user?.name,
        category: data.category,
        description: data.description,
        route: data.route,
      });
      setSubmitSuccess(true);
      reset();
      setShowForm(false);
      await loadComplaints();
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Reports</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Submit and track your reports</p>
        </div>
        <Button leftIcon={Plus} onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancel' : 'New Report'}
        </Button>
      </motion.div>

      {/* Success message */}
      <AnimatePresence>
        {submitSuccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-600 dark:text-green-400"
          >
            Report submitted successfully!
          </motion.div>
        )}
      </AnimatePresence>

      {/* New Report Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Submit a Report</h2>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <Select
                  label="Category"
                  placeholder="Select a category"
                  options={CATEGORY_OPTIONS}
                  error={errors.category?.message}
                  {...register('category')}
                />
                <Input
                  label="Route (optional)"
                  placeholder="e.g. Kimironko - Downtown"
                  icon={MapPin}
                  {...register('route')}
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                    Description <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Describe the issue in detail..."
                    className="w-full rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 px-3 py-2 text-sm text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-navy-900/20 focus:border-navy-900 dark:focus:ring-green-500/20 dark:focus:border-green-500 resize-none"
                    {...register('description')}
                  />
                  {errors.description && <p className="text-xs text-red-500">{errors.description.message}</p>}
                </div>
                <div className="flex justify-end gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                  <Button type="submit" loading={submitting} leftIcon={Send}>Submit Report</Button>
                </div>
              </form>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Reports List */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-white dark:bg-neutral-900 rounded-xl border border-neutral-200 dark:border-neutral-700 p-4">
              <div className="h-5 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3 mb-2" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
            </div>
          ))}
        </div>
      ) : complaints.length === 0 ? (
        <EmptyState
          icon={AlertTriangle}
          title="No reports yet"
          description="Submit a report if you experience any issues with transport services."
          actionLabel="Submit Report"
          onAction={() => setShowForm(true)}
        />
      ) : (
        <div className="space-y-3">
          {complaints.map((complaint) => (
            <motion.div key={complaint.id} variants={itemVariants}>
              <Card>
                <button
                  onClick={() => setExpandedId(expandedId === complaint.id ? null : complaint.id)}
                  className="w-full flex items-start justify-between gap-3"
                >
                  <div className="text-left flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={complaint.status} />
                      <span className="text-xs text-neutral-500 dark:text-neutral-400">
                        {formatDate(complaint.createdAt)}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {CATEGORY_OPTIONS.find((c) => c.value === complaint.category)?.label || complaint.category}
                    </p>
                    {complaint.route && (
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">{complaint.route}</p>
                    )}
                  </div>
                  {expandedId === complaint.id ? <ChevronUp size={18} className="text-neutral-400" /> : <ChevronDown size={18} className="text-neutral-400" />}
                </button>
                <AnimatePresence>
                  {expandedId === complaint.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                        <p className="text-sm text-neutral-600 dark:text-neutral-400">{complaint.description}</p>
                        <div className="flex items-center gap-4 mt-3 text-xs text-neutral-500 dark:text-neutral-400">
                          <span className="flex items-center gap-1"><Calendar size={12} /> {formatDate(complaint.createdAt)}</span>
                          <span className="flex items-center gap-1"><MessageSquare size={12} /> {getStatusLabel(complaint.status)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
