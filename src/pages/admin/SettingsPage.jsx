import { useState } from 'react'
import { motion } from 'framer-motion'
import { Save, Settings, Globe, Bell, Database, Shield, Palette } from 'lucide-react'
import Card from '../../components/common/Card'
import Button from '../../components/common/Button'
import Input from '../../components/common/Input'
import Select from '../../components/common/Select'
import Breadcrumb from '../../components/common/Breadcrumb'

const fadeIn = { hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }

export default function SettingsPage() {
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    platformName: 'TransPrice Rwanda',
    platformDescription: 'Rwanda\'s official transport pricing platform',
    contactEmail: 'admin@transprice.rw',
    contactPhone: '+250788000000',
    defaultCurrency: 'RWF',
    defaultLanguage: 'en',
    enableNotifications: true,
    enableEmailAlerts: true,
    enableSMSAlerts: false,
    dataRetentionDays: 365,
    autoApproveVerified: false,
    requireSourceVerification: true,
    enableAuditLogging: true,
    maxFileSize: 10,
    enableDarkMode: true,
    primaryColor: '#0f2645',
    accentColor: '#16a34a',
  })

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
  }

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <motion.div initial="hidden" animate="visible" variants={{ visible: { transition: { staggerChildren: 0.05 } } }} className="space-y-6">
      <motion.div variants={fadeIn}>
        <Breadcrumb items={[{ label: 'Admin', href: '/admin' }, { label: 'Settings' }]} />
        <div className="mt-4">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">Settings</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">Configure platform settings and preferences</p>
        </div>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card header={<span className="flex items-center gap-2 text-sm font-semibold"><Globe size={16} /> General Settings</span>}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Platform Name" value={settings.platformName} onChange={(e) => updateSetting('platformName', e.target.value)} />
            <Input label="Contact Email" type="email" value={settings.contactEmail} onChange={(e) => updateSetting('contactEmail', e.target.value)} />
            <Input label="Contact Phone" value={settings.contactPhone} onChange={(e) => updateSetting('contactPhone', e.target.value)} />
            <Select label="Default Currency" options={[{ value: 'RWF', label: 'RWF (Rwandan Franc)' }]} value={settings.defaultCurrency} onChange={(e) => updateSetting('defaultCurrency', e.target.value)} />
            <div className="md:col-span-2">
              <label className="mb-1 block text-sm font-medium text-neutral-700 dark:text-neutral-300">Description</label>
              <textarea value={settings.platformDescription} onChange={(e) => updateSetting('platformDescription', e.target.value)} rows={2} className="w-full rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100" />
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card header={<span className="flex items-center gap-2 text-sm font-semibold"><Bell size={16} /> Notification Settings</span>}>
          <div className="space-y-3">
            {[
              { key: 'enableNotifications', label: 'Enable Push Notifications' },
              { key: 'enableEmailAlerts', label: 'Enable Email Alerts' },
              { key: 'enableSMSAlerts', label: 'Enable SMS Alerts' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
                <button type="button" onClick={() => updateSetting(key, !settings[key])}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[key] ? 'bg-green-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </label>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card header={<span className="flex items-center gap-2 text-sm font-semibold"><Database size={16} /> Data Settings</span>}>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Input label="Data Retention (days)" type="number" value={settings.dataRetentionDays} onChange={(e) => updateSetting('dataRetentionDays', Number(e.target.value))} />
            <Input label="Max File Size (MB)" type="number" value={settings.maxFileSize} onChange={(e) => updateSetting('maxFileSize', Number(e.target.value))} />
            <Select label="Default Language" options={[{ value: 'en', label: 'English' }, { value: 'rw', label: 'Kinyarwanda' }, { value: 'fr', label: 'French' }]} value={settings.defaultLanguage} onChange={(e) => updateSetting('defaultLanguage', e.target.value)} />
          </div>
          <div className="mt-4 space-y-3">
            {[
              { key: 'autoApproveVerified', label: 'Auto-approve verified sources' },
              { key: 'requireSourceVerification', label: 'Require source verification for fares' },
              { key: 'enableAuditLogging', label: 'Enable audit logging' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
                <button type="button" onClick={() => updateSetting(key, !settings[key])}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[key] ? 'bg-green-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </label>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn}>
        <Card header={<span className="flex items-center gap-2 text-sm font-semibold"><Shield size={16} /> Security Settings</span>}>
          <div className="space-y-3">
            {[
              { key: 'enableAuditLogging', label: 'Enable Audit Logging' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-4 py-3 dark:border-neutral-700 dark:bg-neutral-800">
                <span className="text-sm text-neutral-700 dark:text-neutral-300">{label}</span>
                <button type="button" onClick={() => updateSetting(key, !settings[key])}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${settings[key] ? 'bg-green-600' : 'bg-neutral-300 dark:bg-neutral-600'}`}>
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${settings[key] ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </label>
            ))}
          </div>
          <p className="mt-3 text-xs text-neutral-400 italic">Additional security settings will be available in a future release.</p>
        </Card>
      </motion.div>

      <motion.div variants={fadeIn} className="flex justify-end">
        <Button leftIcon={Save} loading={saving} onClick={handleSave}>Save Settings</Button>
      </motion.div>
    </motion.div>
  )
}
