import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Save, Send, X, MapPin, Clock, FileText } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Breadcrumb from '../../components/common/Breadcrumb'
import { routeService } from '../../services/api'
import { mockDistricts, mockSectors } from '../../data/mockData'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const routeSchema = z.object({
  name: z.string().min(3, 'Route name is required'),
  origin: z.string().min(2, 'Origin is required'),
  destination: z.string().min(2, 'Destination is required'),
  originDistrict: z.string().min(1, 'District is required'),
  destinationDistrict: z.string().min(1, 'Destination district is required'),
  transportTypes: z.array(z.string()).min(1, 'Select at least one transport type'),
  distance: z.coerce.number().min(0.1, 'Distance must be greater than 0'),
  estimatedTime: z.coerce.number().min(1, 'Travel time is required'),
  description: z.string().optional(),
  originLat: z.coerce.number().optional(),
  originLng: z.coerce.number().optional(),
  destLat: z.coerce.number().optional(),
  destLng: z.coerce.number().optional(),
  status: z.string().default('INACTIVE'),
  source: z.string().optional(),
  effectiveDate: z.string().optional(),
  notes: z.string().optional(),
})

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function RouteFormPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const routeId = searchParams.get('id')
  const isEdit = !!routeId
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(isEdit)

  const { register, handleSubmit, watch, setValue, reset, formState: { errors } } = useForm({
    resolver: zodResolver(routeSchema),
    defaultValues: {
      name: '', origin: '', destination: '', originDistrict: '', destinationDistrict: '',
      transportTypes: [], distance: '', estimatedTime: '', description: '',
      originLat: '', originLng: '', destLat: '', destLng: '',
      status: 'INACTIVE', source: '', effectiveDate: '', notes: '',
    },
  })

  const selectedDistrict = watch('originDistrict')
  const selectedSectors = mockSectors.filter((s) => s.districtId === mockDistricts.find((d) => d.name === selectedDistrict)?.id)

  useEffect(() => {
    if (isEdit) {
      loadRoute()
    }
  }, [routeId])

  const loadRoute = async () => {
    setLoading(true)
    try {
      const route = await routeService.getById(routeId)
      if (route) {
        reset({
          name: route.name, origin: route.origin, destination: route.destination,
          originDistrict: route.originDistrict, destinationDistrict: route.destinationDistrict,
          transportTypes: route.transportTypes, distance: route.distance,
          estimatedTime: route.estimatedTime, description: route.description || '',
          originLat: route.coordinates?.origin?.lat || '', originLng: route.coordinates?.origin?.lng || '',
          destLat: route.coordinates?.destination?.lat || '', destLng: route.coordinates?.destination?.lng || '',
          status: route.status, source: route.source || '', effectiveDate: '', notes: '',
        })
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async (data, asDraft = true) => {
    setSaving(true)
    try {
      const payload = {
        ...data,
        status: asDraft ? 'INACTIVE' : 'ACTIVE',
        transportTypes: data.transportTypes || [],
        coordinates: {
          origin: { lat: Number(data.originLat) || 0, lng: Number(data.originLng) || 0 },
          destination: { lat: Number(data.destLat) || 0, lng: Number(data.destLng) || 0 },
        },
      }
      if (isEdit) {
        await routeService.update(routeId, payload)
      } else {
        await routeService.create(payload)
      }
      navigate('/admin/routes')
    } catch (err) {
      console.error(err)
    } finally {
      setSaving(false)
    }
  }

  const toggleTransportType = (type) => {
    const current = watch('transportTypes') || []
    if (current.includes(type)) {
      setValue('transportTypes', current.filter((t) => t !== type), { shouldValidate: true })
    } else {
      setValue('transportTypes', [...current, type], { shouldValidate: true })
    }
  }

  const transportOptions = ['bus', 'moto', 'taxi', 'minibus']
  const selectedTypes = watch('transportTypes') || []

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Routes', href: '/admin/routes' }, { label: isEdit ? 'Edit Route' : 'New Route' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">{isEdit ? 'Edit Route' : 'Add New Route'}</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">{isEdit ? 'Update route details' : 'Create a new transport route'}</p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/admin/routes')} leftIcon={X}>Cancel</Button>
        </div>
      </motion.div>

      <form onSubmit={handleSubmit((data) => handleSave(data, false))} className="space-y-6">
        <motion.div variants={fadeIn}>
          <Card header={<span className="flex items-center gap-2 text-sm font-semibold"><MapPin size={16} /> Route Information</span>}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="md:col-span-2">
                <Input label="Route Name" {...register('name')} error={errors.name?.message} placeholder="e.g., Kimironko - Downtown" required />
              </div>
              <Input label="Origin" {...register('origin')} error={errors.origin?.message} placeholder="e.g., Kimironko" required />
              <Input label="Destination" {...register('destination')} error={errors.destination?.message} placeholder="e.g., Downtown" required />
              <Select label="Origin District" options={mockDistricts.map((d) => ({ value: d.name, label: d.name }))} {...register('originDistrict')} error={errors.originDistrict?.message} required />
              <Select label="Destination District" options={mockDistricts.map((d) => ({ value: d.name, label: d.name }))} {...register('destinationDistrict')} error={errors.destinationDistrict?.message} required />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card header={<span className="flex items-center gap-2 text-sm font-semibold"><FileText size={16} /> Details</span>}>
            <div className="space-y-4">
              <div>
                <label className="mb-2 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Transport Types</label>
                <div className="flex flex-wrap gap-2">
                  {transportOptions.map((type) => (
                    <button key={type} type="button" onClick={() => toggleTransportType(type)}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
                        selectedTypes.includes(type)
                          ? 'border-navy-900 bg-navy-900 text-white dark:border-green-500 dark:bg-green-600'
                          : 'border-neutral-300 text-neutral-600 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-400'
                      }`}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
                {errors.transportTypes && <p className="mt-1 text-xs text-red-500">{errors.transportTypes.message}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Distance (km)" type="number" step="0.1" {...register('distance')} error={errors.distance?.message} required />
                <Input label="Estimated Travel Time (min)" type="number" {...register('estimatedTime')} error={errors.estimatedTime?.message} required />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Description</label>
                <textarea {...register('description')} rows={3} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Optional route description..." />
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card header={<span className="flex items-center gap-2 text-sm font-semibold"><MapPin size={16} /> Map Coordinates</span>}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase text-neutral-500">Origin Coordinates</p>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Latitude" type="number" step="any" {...register('originLat')} placeholder="-1.9403" />
                  <Input label="Longitude" type="number" step="any" {...register('originLng')} placeholder="29.9246" />
                </div>
              </div>
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase text-neutral-500">Destination Coordinates</p>
                <div className="grid grid-cols-2 gap-3">
                  <Input label="Latitude" type="number" step="any" {...register('destLat')} placeholder="-1.9536" />
                  <Input label="Longitude" type="number" step="any" {...register('destLng')} placeholder="30.0609" />
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn}>
          <Card header={<span className="flex items-center gap-2 text-sm font-semibold"><Clock size={16} /> Additional Info</span>}>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <Select label="Status" options={[{ value: 'ACTIVE', label: 'Active' }, { value: 'INACTIVE', label: 'Inactive' }]} {...register('status')} />
              <Input label="Source" {...register('source')} placeholder="Data source" />
              <Input label="Effective Date" type="date" {...register('effectiveDate')} />
            </div>
            <div className="mt-4">
              <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Notes</label>
              <textarea {...register('notes')} rows={2} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" placeholder="Internal notes..." />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={fadeIn} className="flex justify-end gap-3">
          <Button variant="outline" type="button" onClick={() => navigate('/admin/routes')}>Cancel</Button>
          <Button variant="secondary" type="button" leftIcon={Save} loading={saving} onClick={handleSubmit((data) => handleSave(data, true))}>Save as Draft</Button>
          <Button type="submit" leftIcon={Send} loading={saving}>Publish Route</Button>
        </motion.div>
      </form>
    </motion.div>
  )
}
