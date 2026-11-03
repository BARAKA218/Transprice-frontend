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
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6 max-w-2xl">
      <motion.div variants={itemVariants}>
        <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Settings</h1>
        <p className="text-neutral-500 dark:text-neutral-400 text-sm mt-1">Customize your experience</p>
      </motion.div>

      {saved && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 text-sm text-green-600 dark:text-green-400">
          Settings saved successfully!
        </motion.div>
      )}

      {/* Theme */}
      <motion.div variants={itemVariants}>
        <Card header={<h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2"><Sun size={18} /> Theme</h2>}>
          <div className="grid grid-cols-3 gap-3">
            {THEME_OPTIONS.map((option) => {
              const Icon = option.icon;
              const isActive = theme === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setTheme(option.value)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    isActive
                      ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      : 'border-neutral-200 dark:border-neutral-700 hover:border-neutral-300 dark:hover:border-neutral-600'
                  }`}
                >
                  <Icon size={24} className={isActive ? 'text-green-600 dark:text-green-400' : 'text-neutral-500 dark:text-neutral-400'} />
                  <span className={`text-sm font-medium ${isActive ? 'text-green-600 dark:text-green-400' : 'text-neutral-700 dark:text-neutral-300'}`}>{option.label}</span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 text-center">{option.desc}</span>
                </button>
              );
            })}
          </div>
        </Card>
      </motion.div>

      {/* Notifications */}
      <motion.div variants={itemVariants}>
        <Card header={<h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2"><Bell size={18} /> Notifications</h2>}>
          <div className="space-y-4">
            {[
              { key: 'fareUpdates', label: 'Fare Updates', desc: 'Get notified when fares change' },
              { key: 'routeUpdates', label: 'Route Updates', desc: 'Get notified about new routes' },
              { key: 'reportUpdates', label: 'Report Updates', desc: 'Get notified about your reports' },
              { key: 'announcements', label: 'Announcements', desc: 'Platform announcements and news' },
            ].map((item) => (
              <div key={item.key} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">{item.label}</p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.desc}</p>
                </div>
                <button
                  onClick={() => toggleNotification(item.key)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    notifications[item.key] ? 'bg-green-600' : 'bg-neutral-300 dark:bg-neutral-600'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    notifications[item.key] ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Language */}
      <motion.div variants={itemVariants}>
        <Card header={<h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2"><Globe size={18} /> Language</h2>}>
          <div className="flex gap-3">
            {[
              { value: 'en', label: 'English' },
              { value: 'rw', label: 'Kinyarwanda' },
              { value: 'fr', label: 'Français' },
            ].map((lang) => (
              <button
                key={lang.value}
                onClick={() => setLanguage(lang.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  language === lang.value
                    ? 'bg-green-600 text-white'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </Card>
      </motion.div>

      {/* Privacy */}
      <motion.div variants={itemVariants}>
        <Card header={<h2 className="text-base font-semibold text-neutral-900 dark:text-white flex items-center gap-2"><Lock size={18} /> Privacy</h2>}>
          <div className="space-y-3 text-sm">
            <p className="text-neutral-600 dark:text-neutral-400">
              Your personal data is stored securely and is only used to provide you with transport pricing information.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#" className="text-green-600 hover:text-green-700 dark:text-green-400 font-medium">Privacy Policy</a>
              <a href="#" className="text-green-600 hover:text-green-700 dark:text-green-400 font-medium">Terms of Service</a>
              <a href="#" className="text-red-500 hover:text-red-600 font-medium">Delete Account</a>
            </div>
          </div>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Button onClick={handleSave} leftIcon={Save} className="w-full sm:w-auto">Save Settings</Button>
      </motion.div>
    </motion.div>
  );
}
