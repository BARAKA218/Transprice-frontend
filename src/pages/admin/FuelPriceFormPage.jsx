import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Save, Send, X } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Breadcrumb from '../../components/common/Breadcrumb'
import { fuelPriceService } from '../../services/api'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const fuelSchema = z.object({
  fuelType: z.string().min(1, 'Fuel type is required'),
  price: z.coerce.number().min(1, 'Price must be greater than 0'),
  currency: z.string().default('RWF'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  source: z.string().min(1, 'Source is required'),
  sourceUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  notes: z.string().optional(),
  status: z.string().default('ACTIVE'),
})

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function FuelPriceFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const priceId = searchParams.get('id')
  const isEdit = !!priceId
  const [saving, setSaving] = useState(false)

  const { register, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(fuelSchema),
    defaultValues: { fuelType: '', price: '', currency: 'RWF', effectiveDate: '', source: '', sourceUrl: '', notes: '', status: 'ACTIVE' },
  })

  useEffect(() => { if (isEdit) loadPrice() }, [priceId])

  const loadPrice = async () => {
    try {
      const price = await fuelPriceService.getById(priceId)
      if (price) reset({ fuelType: price.fuelType, price: price.price, currency: price.currency, effectiveDate: price.effectiveDate, source: price.source, sourceUrl: price.sourceUrl || '', notes: price.notes || '', status: price.status })
    } catch (err) { console.error(err) }
  }

  const handleSave = async (data, status) => {
    setSaving(true)
    try {
      if (isEdit) { await fuelPriceService.update(priceId, { ...data, status }) }
      else { await fuelPriceService.create({ ...data, status }) }
      navigate('/admin/fuel-prices')
    } catch (err) { console.error(err) } finally { setSaving(false) }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Fuel Prices', href: '/admin/fuel-prices' }, { label: isEdit ? 'Edit' : 'New' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{isEdit ? 'Edit Fuel Price' : 'Add New Fuel Price'}</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{isEdit ? 'Update fuel price information' : 'Record a new fuel price entry'}</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/admin/fuel-prices')} leftIcon={X}>Cancel</Button>
        </div>
      </motion.div>

      <form className="space-y-6">
        <motion.div variants={fadeIn}>
          <Card header={<span className="text-sm font-semibold">Fuel Price Details</span>}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select label="Fuel Type" options={[{ value: 'Petrol', label: 'Petrol' }, { value: 'Diesel', label: 'Diesel' }, { value: 'LPG', label: 'LPG' }]} {...register('fuelType')} error={errors.fuelType?.message} required />
              <Input label="Price (RWF per litre)" type="number" min="0" {...register('price')} error={errors.price?.message} required />
              <Input label="Effective Date" type="date" {...register('effectiveDate')} error={errors.effectiveDate?.message} required />
              <Input label="Source" {...register('source')} error={errors.source?.message} required />
              <Input label="Source URL" type="url" {...register('sourceUrl')} error={errors.sourceUrl?.message} placeholder="https://..." />
              <Select label="Status" options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }]} {...register('status')} />
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Notes</label>
              <textarea {...register('notes')} rows={3} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Additional notes..." />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn} className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/fuel-prices')}>Cancel</Button>
          <Button variant="secondary" type="button" leftIcon={Save} loading={saving} onClick={handleSubmit((data) => handleSave(data, 'INACTIVE'))}>Save</Button>
          <Button type="button" leftIcon={Send} loading={saving} onClick={handleSubmit((data) => handleSave(data, 'ACTIVE'))}>Publish</Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
