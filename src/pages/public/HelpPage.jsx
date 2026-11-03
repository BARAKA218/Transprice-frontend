import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HelpCircle, PhoneCall, Mail, MessageCircle, ShieldCheck, FileSearch } from 'lucide-react';

const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } };
const itemVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } };

const FAQS = [
  {
    q: 'Where do TransPrice fares come from?',
    a: 'Fares come from verified public sources: regulator-approved tariffs, cooperative submissions and independently collected price checks. Every fare is labelled with its source and verification status.',
  },
  {
    q: 'Why do prices change?',
    a: 'Fuel prices (set by RURA), seasonal demand and regulator tariff reviews affect fares. Fares are re-verified at least monthly, and the history tab shows every revision with a reason.',
  },
  {
    q: 'How do I report an overcharging driver?',
    a: 'From any route page, open the complaint form (or use the AI assistant, then "Report overcharging"). Your report goes to the authority with the route, fare and operator details.',
  },
  {
    q: 'Is the AI assistant accurate?',
    a: 'TRANSPRICE AI answers strictly from the verified dataset. It still recommends confirming the fare with the operator before travelling, especially for long-distance routes.',
  },
  {
    q: 'How do I become a cooperative or driver partner?',
    a: 'Cooperative admins can self-register from the login screen. The authority verifies the cooperative and license documents before fares can be published.',
  },
  {
    q: 'How is public price data kept fair?',
    a: 'The transparency page shows the full pricing methodology, the source database and the audit trail for every published fare.',
  },
];

export default function HelpPage() {
  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
      <motion.div variants={itemVariants}>
        <p className="text-sm font-medium text-green-600 dark:text-green-400">Support Center</p>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white">How can we help you?</h1>
        <p className="mt-2 max-w-2xl text-neutral-500 dark:text-neutral-400">
          Find answers about fares, sources and reporting — or reach the support team.
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-700">
          <PhoneCall size={16} className="text-green-600" />
          <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">Call us</p>
          <p className="text-xs text-neutral-400">+250 788 000 123 · Mon–Fri, 8am–6pm</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-700">
          <Mail size={16} className="text-green-600" />
          <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">Email</p>
          <p className="text-xs text-neutral-400">support@transprice.rw</p>
        </div>
        <div className="rounded-2xl border border-neutral-200 p-4 dark:border-neutral-700">
          <MessageCircle size={16} className="text-green-600" />
          <p className="mt-2 text-sm font-semibold text-neutral-900 dark:text-white">AI Assistant</p>
          <p className="text-xs text-neutral-400">Use the floating AI bubble in the corner of any page.</p>
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="space-y-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-neutral-900 dark:text-white">
          <HelpCircle size={18} /> Frequently asked questions
        </h2>
        {FAQS.map((faq, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-700 dark:bg-neutral-900">
            <p className="text-sm font-medium text-neutral-900 dark:text-white">{faq.q}</p>
            <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">{faq.a}</p>
          </div>
        ))}
      </motion.div>

      <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
        <Link to="/transparency" className="flex items-center gap-2 rounded-xl bg-navy-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-navy-700">
          <ShieldCheck size={16} /> Pricing methodology
        </Link>
        <Link to="/check-fare" className="flex items-center gap-2 rounded-xl border border-neutral-200 px-4 py-2.5 text-sm font-medium text-neutral-700 transition hover:border-green-400 dark:border-neutral-700 dark:text-neutral-300">
          <FileSearch size={16} /> Check a fare
        </Link>
      </motion.div>
    </motion.div>
  );
}