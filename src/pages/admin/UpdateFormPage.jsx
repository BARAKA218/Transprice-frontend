import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Save, Send, X, Upload } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Breadcrumb from '../../components/common/Breadcrumb'
import { transportUpdateService } from '../../services/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const updateSchema = z.object({
  title: z.string().min(3, 'Title is required'),
  category: z.string().min(1, 'Category is required'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  source: z.string().min(1, 'Source is required'),
  sourceUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  publicationDate: z.string().optional(),
  effectiveDate: z.string().optional(),
  expiryDate: z.string().optional(),
  status: z.string().default('DRAFT'),
  notes: z.string().optional(),
})

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function UpdateFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const updateId = searchParams.get('id')
  const isEdit = !!updateId
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(updateSchema),
    defaultValues: {
      title: '', category: '', description: '', source: '', sourceUrl: '',
      publicationDate: '', effectiveDate: '', expiryDate: '', status: 'DRAFT', notes: '',
    },
  })

  useEffect(() => { if (isEdit) loadUpdate() }, [updateId])

  const loadUpdate = async () => {
    try {
      const update = await transportUpdateService.getById(updateId)
      if (update) reset({ ...update })
    } catch (err) { console.error(err) }
  }

  const handleSave = async (data, status) => {
    setSaving(true)
    try {
      if (isEdit) { await transportUpdateService.update(updateId, { ...data, status }) }
      else { await transportUpdateService.create({ ...data, status }) }
      navigate('/admin/updates')
    } catch (err) { console.error(err) } finally { setSaving(false) }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Updates', href: '/admin/updates' }, { label: isEdit ? 'Edit Update' : 'New Update' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{isEdit ? 'Edit Update' : 'Create New Update'}</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{isEdit ? 'Update transport announcement' : 'Publish a new transport announcement'}</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/admin/updates')} leftIcon={X}>Cancel</Button>
        </div>
      </motion.div>

      <form className="space-y-6">
        <motion.div variants={fadeIn}>
          <Card header={<span className="text-sm font-semibold">Update Details</span>}>
            <div className="space-y-4">
              <Input label="Title" {...register('title')} error={errors.title?.message} required />
              <Select label="Category" options={[{ value: 'FARE', label: 'Fare' }, { value: 'ROUTE', label: 'Route' }, { value: 'FUEL', label: 'Fuel' }, { value: 'ANNOUNCEMENT', label: 'Announcement' }, { value: 'SERVICE_UPDATE', label: 'Service Update' }, { value: 'GENERAL', label: 'General' }]} {...register('category')} error={errors.category?.message} required />
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Description <span className="text-red-500">*</span></label>
                <textarea {...register('description')} rows={6} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Describe the update..." />
                {errors.description && <p className="mt-1 text-xs text-red-500">{errors.description.message}</p>}
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card header={<span className="text-sm font-semibold">Source & Dates</span>}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="Source" {...register('source')} error={errors.source?.message} required />
              <Input label="Source URL" type="url" {...register('sourceUrl')} error={errors.sourceUrl?.message} placeholder="https://..." />
              <Input label="Publication Date" type="date" {...register('publicationDate')} />
              <Input label="Effective Date" type="date" {...register('effectiveDate')} />
              <Input label="Expiry Date" type="date" {...register('expiryDate')} />
              <Select label="Status" options={[{ value: 'DRAFT', label: 'Draft' }, { value: 'PUBLISHED', label: 'Published' }]} {...register('status')} />
            </div>
            <div className="mt-4 rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center dark:border-neutral-600">
              <Upload size={24} className="mx-auto mb-2 text-neutral-400" />
              <p className="text-sm text-neutral-500">Drag & drop images or documents</p>
              <p className="text-xs text-neutral-400">PDF, JPG, PNG up to 10MB</p>
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Notes</label>
              <textarea {...register('notes')} rows={2} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Internal notes..." />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn} className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/updates')}>Cancel</Button>
          <Button variant="secondary" type="button" leftIcon={Save} loading={saving} onClick={handleSubmit((data) => handleSave(data, 'DRAFT'))}>Save Draft</Button>
          <Button type="button" leftIcon={Send} loading={saving} onClick={handleSubmit((data) => handleSave(data, 'PUBLISHED'))}>Publish</Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
