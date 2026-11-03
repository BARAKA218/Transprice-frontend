import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Save, Send, X } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Breadcrumb from '../../components/common/Breadcrumb'
import { sourceService } from '../../services/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const sourceSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  website: z.string().url('Invalid URL').optional().or(z.literal('')),
  type: z.string().min(1, 'Type is required'),
  description: z.string().optional(),
  country: z.string().default('Rwanda'),
  category: z.string().min(1, 'Category is required'),
  reliabilityLevel: z.string().min(1, 'Reliability level is required'),
  notes: z.string().optional(),
  status: z.string().default('ACTIVE'),
})

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function SourceFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const sourceId = searchParams.get('id')
  const isEdit = !!sourceId
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(sourceSchema),
    defaultValues: { name: '', website: '', type: '', description: '', country: 'Rwanda', category: '', reliabilityLevel: '', notes: '', status: 'ACTIVE' },
  })

  useEffect(() => { if (isEdit) loadSource() }, [sourceId])

  const loadSource = async () => {
    try {
      const source = await sourceService.getById(sourceId)
      if (source) reset({ name: source.name, website: source.website || '', type: source.type, description: source.description || '', country: source.country || 'Rwanda', category: source.category, reliabilityLevel: source.reliabilityLevel, notes: source.notes || '', status: source.status })
    } catch (err) { console.error(err) }
  }

  const handleSave = async (data) => {
    setSaving(true)
    try {
      if (isEdit) { await sourceService.update(sourceId, data) }
      else { await sourceService.create(data) }
      navigate('/admin/sources')
    } catch (err) { console.error(err) } finally { setSaving(false) }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Sources', href: '/admin/sources' }, { label: isEdit ? 'Edit Source' : 'New Source' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{isEdit ? 'Edit Source' : 'Add New Source'}</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{isEdit ? 'Update source information' : 'Register a new data source'}</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/admin/sources')} leftIcon={X}>Cancel</Button>
        </div>
      </motion.div>

      <form className="space-y-6">
        <motion.div variants={fadeIn}>
          <Card header={<span className="text-sm font-semibold">Source Information</span>}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input label="Source Name" {...register('name')} error={errors.name?.message} required />
              </div>
              <Input label="Website / Domain" {...register('website')} error={errors.website?.message} placeholder="https://example.rw" />
              <Select label="Source Type" options={[{ value: 'OFFICIAL', label: 'Official Government' }, { value: 'PUBLIC_INSTITUTION', label: 'Public Institution' }, { value: 'OPERATOR', label: 'Transport Operator' }, { value: 'NEWS', label: 'News & Media' }, { value: 'API', label: 'API / Data Feed' }, { value: 'OTHER', label: 'Other' }]} {...register('type')} error={errors.type?.message} required />
              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Description</label>
                <textarea {...register('description')} rows={3} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Describe the source..." />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card header={<span className="text-sm font-semibold">Classification</span>}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input label="Country" {...register('country')} />
              <Select label="Category" options={[{ value: 'OFFICIAL', label: 'Official Government' }, { value: 'PUBLIC_INSTITUTION', label: 'Public Institution' }, { value: 'OPERATOR', label: 'Transport Operator' }, { value: 'NEWS', label: 'News & Media' }, { value: 'API', label: 'API' }, { value: 'OTHER', label: 'Other' }]} {...register('category')} error={errors.category?.message} required />
              <Select label="Reliability Level" options={[{ value: 'high', label: 'High' }, { value: 'medium', label: 'Medium' }, { value: 'low', label: 'Low' }]} {...register('reliabilityLevel')} error={errors.reliabilityLevel?.message} required />
              <Select label="Status" options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }, { value: 'PENDING_REVIEW', label: 'Pending Review' }, { value: 'BLOCKED', label: 'Blocked' }]} {...register('status')} />
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Notes</label>
              <textarea {...register('notes')} rows={2} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Internal notes..." />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn} className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/sources')}>Cancel</Button>
          <Button type="button" leftIcon={Save} loading={saving} onClick={handleSubmit(handleSave)}>{isEdit ? 'Update Source' : 'Create Source'}</Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
