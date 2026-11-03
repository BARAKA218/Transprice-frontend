import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Save, Send, FileCheck, X, Upload } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Breadcrumb from '../../components/common/Breadcrumb'
import { fareService } from '../../services/api'
import { mockDistricts, mockSectors } from '../../data/mockData'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const fareSchema = z.object({
  origin: z.string().min(2, 'Origin is required'),
  destination: z.string().min(2, 'Destination is required'),
  district: z.string().min(1, 'District is required'),
  sector: z.string().optional(),
  transportType: z.string().min(1, 'Transport type is required'),
  fare: z.coerce.number().min(1, 'Fare must be greater than 0'),
  currency: z.string().default('RWF'),
  effectiveDate: z.string().min(1, 'Effective date is required'),
  expiryDate: z.string().optional(),
  source: z.string().min(1, 'Source is required'),
  sourceUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
  sourceDate: z.string().optional(),
  verificationStatus: z.string().default('UNVERIFIED'),
  notes: z.string().optional(),
})

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function FareFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const fareId = searchParams.get('id')
  const isEdit = !!fareId
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(fareSchema),
    defaultValues: {
      origin: '', destination: '', district: '', sector: '', transportType: '',
      fare: '', currency: 'RWF', effectiveDate: '', expiryDate: '',
      source: '', sourceUrl: '', sourceDate: '', verificationStatus: 'UNVERIFIED', notes: '',
    },
  })

  const selectedDistrict = watch('district')
  const filteredSectors = mockSectors.filter((s) => s.districtId === mockDistricts.find((d) => d.name === selectedDistrict)?.id)

  useEffect(() => { if (isEdit) loadFare() }, [fareId])

  const loadFare = async () => {
    setLoading(true)
    try {
      const fare = await fareService.getFare(fareId)
      if (fare) {
        reset({
          origin: fare.origin, destination: fare.destination, district: fare.district || '',
          sector: fare.sector || '', transportType: fare.transportType, fare: fare.fare,
          currency: fare.currency || 'RWF', effectiveDate: fare.effectiveDate || '',
          expiryDate: fare.expiryDate || '', source: fare.source, sourceUrl: fare.sourceUrl || '',
          sourceDate: fare.sourceDate || '', verificationStatus: fare.verificationStatus || 'UNVERIFIED',
          notes: fare.notes || '',
        })
      }
    } catch (err) { console.error(err) } finally { setLoading(false) }
  }

  const handleSave = async (data, status) => {
    setSaving(true)
    try {
      const routeName = `${data.origin} - ${data.destination}`
      const payload = { ...data, routeName, routeId: 'r1', status }
      if (isEdit) {
        await fareService.updateFare(fareId, payload)
      } else {
        await fareService.createFare(payload)
      }
      navigate('/admin/fares')
    } catch (err) { console.error(err) } finally { setSaving(false) }
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Fares', href: '/admin/fares' }, { label: isEdit ? 'Edit Fare' : 'New Fare' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{isEdit ? 'Edit Fare' : 'Add New Fare'}</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{isEdit ? 'Update fare details' : 'Submit a new fare for review'}</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/admin/fares')} leftIcon={X}>Cancel</Button>
        </div>
      </motion.div>

      <form className="space-y-6">
        <motion.div variants={fadeIn}>
          <Card header={<span className="text-sm font-semibold">Route & Transport</span>}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="From (Origin)" {...register('origin')} error={errors.origin?.message} required />
              <Input label="To (Destination)" {...register('destination')} error={errors.destination?.message} required />
              <Select label="District" options={mockDistricts.map((d) => ({ value: d.name, label: d.name }))} {...register('district')} error={errors.district?.message} required />
              <Select label="Sector" options={filteredSectors.map((s) => ({ value: s.name, label: s.name }))} {...register('sector')} placeholder="Select sector" />
              <Select label="Transport Type" options={[{ value: 'bus', label: 'Bus' }, { value: 'moto', label: 'Moto' }, { value: 'taxi', label: 'Taxi' }, { value: 'minibus', label: 'Minibus' }]} {...register('transportType')} error={errors.transportType?.message} required />
              <Input label="Fare Amount (RWF)" type="number" min="0" {...register('fare')} error={errors.fare?.message} required />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card header={<span className="text-sm font-semibold">Dates & Source</span>}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Input label="Effective Date" type="date" {...register('effectiveDate')} error={errors.effectiveDate?.message} required />
              <Input label="Expiry/Review Date" type="date" {...register('expiryDate')} />
              <Input label="Source Publication Date" type="date" {...register('sourceDate')} />
            </div>
            <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Input label="Source" {...register('source')} error={errors.source?.message} placeholder="e.g., Rwanda Transport Board" required />
              <Input label="Source URL" type="url" {...register('sourceUrl')} error={errors.sourceUrl?.message} placeholder="https://..." />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card header={<span className="text-sm font-semibold">Verification & Notes</span>}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <Select label="Verification Status" options={[{ value: 'UNVERIFIED', label: 'Unverified' }, { value: 'UNDER_REVIEW', label: 'Under Review' }, { value: 'VERIFIED', label: 'Verified' }]} {...register('verificationStatus')} />
              <div />
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Notes</label>
              <textarea {...register('notes')} rows={3} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Additional notes..." />
            </div>
            <div className="mt-4 rounded-lg border-2 border-dashed border-neutral-300 p-6 text-center dark:border-neutral-600">
              <Upload size={24} className="mx-auto mb-2 text-neutral-400" />
              <p className="text-sm text-neutral-500">Drag & drop supporting documents here</p>
              <p className="text-xs text-neutral-400">PDF, JPG, PNG up to 10MB</p>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn} className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/fares')}>Cancel</Button>
          <Button variant="secondary" type="button" leftIcon={Save} loading={saving} onClick={handleSubmit((data) => handleSave(data, 'DRAFT'))}>Save as Draft</Button>
          <Button variant="secondary" type="button" leftIcon={FileCheck} loading={saving} onClick={handleSubmit((data) => handleSave(data, 'PENDING_REVIEW'))}>Submit for Review</Button>
          <Button type="button" leftIcon={Send} loading={saving} onClick={handleSubmit((data) => handleSave(data, 'PUBLISHED'))}>Publish</Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
