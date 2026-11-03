import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Monitor, Bell, Globe, Lock, Save } from 'lucide-react';
import { useThemeStore } from '../../store';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

const THEME_OPTIONS = [
  { value: 'light', label: 'Light', icon: Sun, desc: 'Always use light mode' },
  { value: 'dark', label: 'Dark', icon: Moon, desc: 'Always use dark mode' },
  { value: 'system', label: 'System', icon: Monitor, desc: 'Match your device settings' },
];

export default function SettingsPage() {
  const { theme, setTheme } = useThemeStore();
  const [notifications, setNotifications] = useState({
    fareUpdates: true,
    routeUpdates: true,
    reportUpdates: true,
    announcements: false,
  });
  const [language, setLanguage] = useState('en');
  const [saved, setSaved] = useState(false);

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    localStorage.setItem('tp_notifications', JSON.stringify(notifications));
    localStorage.setItem('tp_language', language);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  useEffect(() => {
    try {
      const savedNotifs = JSON.parse(localStorage.getItem('tp_notifications') || '{}');
      setNotifications((prev) => ({ ...prev, ...savedNotifs }));
    } catch {}
    setLanguage(localStorage.getItem('tp_language') || 'en');
  }, []);

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-2xl space-y-6">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Settings</h1>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">Customize your experience</p>
      </motion.div>

      {saved && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-600 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
        >
          Settings saved successfully!
        </motion.div>
      )}

      <motion.div variants={itemVariants}>
        <Card header={<h2 className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-white"><Sun size={18} /> Theme</h2>}>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all ${
                    isActive
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-neutral-200 hover:border-neutral-300 dark:border-neutral-700 dark:hover:border-neutral-600'
                  }`}
                >
                  <Icon size={24} className={isActive ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'} />
                  <span className={`text-sm font-medium ${isActive ? 'text-green-600 dark:text-green-400' : 'text-neutral-700 dark:text-neutral-300'}`}>{option.label}</span>
                  <span className="text-center text-xs text-neutral-500 dark:text-neutral-400">{option.desc}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card header={<h2 className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-white"><Bell size={18} /> Notification Preferences</h2>}>
          <div className="space-y-3">
            {Object.entries(notifications).map(([key, value]) => (
              <label key={key} className="flex cursor-pointer items-center justify-between rounded-xl border border-neutral-200 p-3 dark:border-neutral-700">
                <span className="text-sm capitalize text-neutral-700 dark:text-neutral-300">
                  {key.replace(/([A-Z])/g, ' $1').trim()} alerts
                </span>
                <button
                  role="switch"
                  aria-checked={value}
                  onClick={() => toggleNotification(key)}
                  className={`relative h-6 w-11 rounded-full transition-colors ${value ? 'bg-green-500' : 'bg-neutral-300 dark:bg-neutral-600'}`}
                >
                  <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${value ? 'left-5.5' : 'left-0.5'}`} />
                </button>
              </label>
            ))}
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card header={<h2 className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-white"><Globe size={18} /> Language</h2>}>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-3 py-2 text-sm text-neutral-900 outline-none focus:border-green-500 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-100"
          >
            <option value="en">English</option>
            <option value="fr">Français</option>
            <option value="rw">Kinyarwanda</option>
            <option value="sw">Kiswahili</option>
          </select>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card header={<h2 className="flex items-center gap-2 text-base font-semibold text-neutral-900 dark:text-white"><Lock size={18} /> Security</h2>}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">Change password</p>
              <p className="text-xs text-neutral-400">Use a strong password with at least 8 characters.</p>
            </div>
            <Button variant="outline" size="sm">Update</Button>
          </div>
        </Card>
      </motion.div>

      <div className="flex justify-end">
        <Button onClick={handleSave} size="sm"><Save size={15} className="mr-1" /> Save changes</Button>
      </div>
    </motion.div>
  );
}