import { useState } from 'react'
import { motion } from 'framer-motion'
import { Plus, MapPin, Edit, ChevronDown, ChevronRight } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import SearchBar from '../../components/common/SearchBar'
import Modal from '../../components/common/Modal'
import Input from '../../components/common/Input'
import Breadcrumb from '../../components/common/Breadcrumb'
import { mockDistricts, mockSectors, mockRoutes, mockFares } from '../../data/mockData'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const districtSchema = z.object({ name: z.string().min(2, 'Name is required'), province: z.string().min(2, 'Province is required') })
const sectorSchema = z.object({ name: z.string().min(2, 'Name is required') })

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function DistrictsPage() {
  const [districts, setDistricts] = useState(mockDistricts)
  const [sectors, setSectors] = useState(mockSectors)
  const [search, setSearch] = useState('')
  const [showDistrictModal, setShowDistrictModal] = useState(false)
  const [showSectorModal, setShowSectorModal] = useState(false)
  const [editingDistrict, setEditingDistrict] = useState(null)
  const [editingSector, setEditingSector] = useState(null)
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  const [expandedDistricts, setExpandedDistricts] = useState({})

  const { register: regDist, handleSubmit: handleSubmitDist, reset: resetDist, formState: { errors: errDist } } = useForm({ resolver: zodResolver(districtSchema) })
  const { register: regSec, handleSubmit: handleSubmitSec, reset: resetSec, formState: { errors: errSec } } = useForm({ resolver: zodResolver(sectorSchema) })

  const filteredDistricts = districts.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase()) || d.province.toLowerCase().includes(search.toLowerCase())
  )

  const getSectorCount = (districtId) => sectors.filter((s) => s.districtId === districtId).length
  const getRouteCount = (districtName) => mockRoutes.filter((r) => r.originDistrict === districtName || r.destinationDistrict === districtName).length
  const getFareCount = (districtName) => mockFares.filter((f) => f.district === districtName).length

  const toggleExpand = (districtId) => {
    setExpandedDistricts((prev) => ({ ...prev, [districtId]: !prev[districtId] }))
  }

  const handleSaveDistrict = (data) => {
    if (editingDistrict) {
      setDistricts((prev) => prev.map((d) => d.id === editingDistrict.id ? { ...d, ...data } : d))
    } else {
      setDistricts((prev) => [...prev, { id: `d${Date.now()}`, ...data, sectors: [] }])
    }
    setShowDistrictModal(false)
    setEditingDistrict(null)
    resetDist()
  }

  const handleSaveSector = (data) => {
    const district = selectedDistrict || editingSector
    if (editingSector) {
      setSectors((prev) => prev.map((s) => s.id === editingSector.id ? { ...s, ...data } : s))
    } else {
      const newSector = { id: `s${Date.now()}`, ...data, districtId: selectedDistrict.id, districtName: selectedDistrict.name }
      setSectors((prev) => [...prev, newSector])
    }
    setShowSectorModal(false)
    setEditingSector(null)
    resetSec()
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Districts' }]} />
        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Districts</h1>
            <p className="text-sm text-neutral-500 dark:text-neutral-400">Manage Rwanda's districts and sectors</p>
          </div>
          <Button leftIcon={Plus} onClick={() => { setEditingDistrict(null); resetDist(); setShowDistrictModal(true) }}>Add District</Button>
        </div>
      </motion.div>

      <motion.div variants={fadeIn}>
        <SearchBar placeholder="Search districts..." value={search} onChange={setSearch} className="w-80" />
      </motion.div>

      <motion.div variants={fadeIn} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredDistricts.map((district) => (
          <Card key={district.id} className="overflow-hidden">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-navy-50 p-2 dark:bg-green-900/30">
                  <MapPin size={18} className="text-navy-900 dark:text-green-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900 dark:text-neutral-100">{district.name}</h3>
                  <p className="text-xs text-neutral-500">{district.province}</p>
                </div>
              </div>
              <button onClick={() => { setEditingDistrict(district); resetDist({ name: district.name, province: district.province }); setShowDistrictModal(true) }} className="rounded p-1.5 text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800">
                <Edit size={14} />
              </button>
            </div>

            <div className="mt-4 flex gap-4 text-xs text-neutral-500">
              <span>{getSectorCount(district.id)} sectors</span>
              <span>{getRouteCount(district.name)} routes</span>
              <span>{getFareCount(district.name)} fares</span>
            </div>

            <button onClick={() => toggleExpand(district.id)} className="mt-3 flex items-center gap-1 text-xs font-medium text-navy-900 hover:underline dark:text-green-500">
              {expandedDistricts[district.id] ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              Sectors
            </button>

            {expandedDistricts[district.id] && (
              <div className="mt-2 space-y-1">
                {sectors.filter((s) => s.districtId === district.id).map((sector) => (
                  <div key={sector.id} className="flex items-center justify-between rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-800">
                    <span className="text-sm text-neutral-700 dark:text-neutral-300">{sector.name}</span>
                    <button onClick={() => { setEditingSector(sector); setSelectedDistrict(district); resetSec({ name: sector.name }); setShowSectorModal(true) }} className="text-neutral-400 hover:text-blue-600">
                      <Edit size={12} />
                    </button>
                  </div>
                ))}
                <Button variant="ghost" size="sm" leftIcon={Plus} onClick={() => { setSelectedDistrict(district); setEditingSector(null); resetSec({ name: '' }); setShowSectorModal(true) }}>
                  Add Sector
                </Button>
              </div>
            )}
          </Card>
        ))}
      </motion.div>

      <Modal isOpen={showDistrictModal} onClose={() => { setShowDistrictModal(false); setEditingDistrict(null) }} title={editingDistrict ? 'Edit District' : 'Add District'}>
        <form onSubmit={handleSubmitDist(handleSaveDistrict)} className="space-y-4">
          <Input label="District Name" {...regDist('name')} error={errDist.name?.message} required />
          <Input label="Province" {...regDist('province')} error={errDist.province?.message} required />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => { setShowDistrictModal(false); setEditingDistrict(null) }}>Cancel</Button>
            <Button type="submit">{editingDistrict ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>

      <Modal isOpen={showSectorModal} onClose={() => { setShowSectorModal(false); setEditingSector(null) }} title={editingSector ? 'Edit Sector' : 'Add Sector'}>
        <form onSubmit={handleSubmitSec(handleSaveSector)} className="space-y-4">
          <Input label="Sector Name" {...regSec('name')} error={errSec.name?.message} required />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => { setShowSectorModal(false); setEditingSector(null) }}>Cancel</Button>
            <Button type="submit">{editingSector ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  )
}
