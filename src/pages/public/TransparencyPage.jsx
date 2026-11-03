import { motion } from 'framer-motion';
import {
  Shield,
  ShieldCheck,
  ShieldQuestion,
  CheckCircle,
  AlertTriangle,
  ChevronDown,
  Database,
  Search,
} from 'lucide-react';
import { useState } from 'react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const trustLevels = [
  {
    level: 'Sample',
    icon: Database,
    color: 'bg-neutral-100 text-neutral-600 border-neutral-300',
    description: 'Initial data gathered from public sources. May not be verified yet.',
  },
  {
    level: 'Unverified',
    icon: Search,
    color: 'bg-neutral-100 text-neutral-600 border-neutral-300',
    description: 'Data has been collected but not yet reviewed by our team.',
  },
  {
    level: 'Under Review',
    icon: ShieldQuestion,
    color: 'bg-amber-50 text-amber-700 border-amber-300',
    description: 'Currently being verified by our data team against official sources.',
  },
  {
    level: 'Verified',
    icon: ShieldCheck,
    color: 'bg-green-50 text-green-700 border-green-300',
    description: 'Confirmed accurate by cross-referencing multiple trusted sources.',
  },
  {
    level: 'Published',
    icon: CheckCircle,
    color: 'bg-blue-50 text-blue-700 border-blue-300',
    description: 'Made available to the public after verification and review.',
  },
  {
    level: 'Official',
    icon: Shield,
    color: 'bg-green-50 text-green-700 border-green-300',
    description: 'Sourced directly from official government or regulatory body publications.',
  },
];

const sections = [
  {
    title: 'How TransPrice Organizes Data',
    content: `TransPrice collects transport pricing data from multiple sources across Rwanda. Our team gathers fare information, route details, and fuel prices from government publications, transport cooperatives, news reports, and community contributions. All data is organized by route, transport type, and district for easy access.`,
  },
  {
    title: 'How Fare Information is Reviewed',
    content: `Every fare goes through our verification process. First, a data point is collected and categorized as "Unverified." Our team then cross-references it against official sources such as the Rwanda Utilities Board (RURA), transport cooperative records, and published tariffs. Verified fares are marked with their source and last updated date.`,
  },
  {
    title: 'How Tariff Proposals Work',
    content: `Transport fare adjustments in Rwanda follow a formal process. Cooperatives submit proposals to RURA, which reviews them against fuel costs, operational expenses, and public interest. Once approved, new tariffs take effect on a specified date. TransPrice tracks and publishes these changes with clear effective dates.`,
  },
  {
    title: 'How Updates are Published',
    content: `Transport updates are sourced from official announcements, news reports, and verified community contributions. Each update is categorized (Fare, Route, Fuel, Service Update, Announcement) and includes source attribution. Updates are reviewed before publication and clearly show when they were posted.`,
  },
  {
    title: 'How Sources are Displayed',
    content: `Every data point on TransPrice shows its source. We categorize sources as Official (government), Public Institution, Transport Operator, News/Media, or API/Data Feed. Each source is rated for reliability and shows when it was last checked. This allows you to assess the trustworthiness of each piece of information.`,
  },
];

const faqItems = [
  {
    q: 'Is TransPrice an official government platform?',
    a: 'No. TransPrice is an independent platform. We do not claim government ownership or endorsement. We aggregate and organize publicly available transport data to make it easier for passengers to access.',
  },
  {
    q: 'How accurate are the fares shown?',
    a: 'We strive for accuracy by verifying data against multiple sources. Published fares carry a "Published" status indicating they have been verified. Demo or sample data is clearly labeled as such.',
  },
  {
    q: 'Who maintains TransPrice?',
    a: 'TransPrice is maintained by BARAKA, an independent team focused on making Rwanda transport information accessible and transparent.',
  },
  {
    q: 'Can I contribute fare data?',
    a: 'Yes! Community contributions help keep our data current. You can submit fare information through the platform, and it will go through our verification process before publication.',
  },
  {
    q: 'How often is data updated?',
    a: 'We update data as new information becomes available. Fuel prices are updated when the Rwanda Energy Board announces changes. Fare updates are processed as they are verified from official sources.',
  },
  {
    q: 'What does "demo data" mean?',
    a: 'Some data shown on TransPrice may be sample data used for demonstration purposes. This data is clearly marked so you can distinguish it from verified, real-world data.',
  },
];

export default function TransparencyPage() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-navy-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible" className="max-w-3xl">
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Transparency
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-neutral-300 text-lg">
              How we source, verify, and publish transport data
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Data Trust Model */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-navy-900 mb-2">
            Data Trust Model
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-neutral-500 mb-8">
            Every piece of data on TransPrice moves through a verification pipeline
          </motion.p>
          <div className="space-y-3">
            {trustLevels.map((item, i) => (
              <motion.div
                key={item.level}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`flex items-start gap-4 rounded-xl border p-4 ${item.color}`}
              >
                <div className="shrink-0 mt-0.5">
                  <item.icon size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{item.level}</h4>
                  <p className="text-sm opacity-80 mt-0.5">{item.description}</p>
                </div>
                {i < trustLevels.length - 1 && (
                  <div className="ml-auto shrink-0 text-xs opacity-50">Level {i + 1}</div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* How We Work */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-navy-900 mb-8">
            How We Work
          </motion.h2>
          <div className="space-y-6">
            {sections.map((section, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="rounded-xl border border-neutral-200 bg-white p-6"
              >
                <h3 className="text-lg font-semibold text-navy-900 mb-3">{section.title}</h3>
                <p className="text-sm text-neutral-600 leading-relaxed">{section.content}</p>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Disclaimers */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-xl bg-amber-50 border border-amber-200 p-6"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-800 mb-3">Important Disclaimers</h3>
              <ul className="space-y-2 text-sm text-amber-700">
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="shrink-0 mt-0.5" />
                  TransPrice is an independent platform. We do not claim government ownership or endorsement.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="shrink-0 mt-0.5" />
                  All data is clearly sourced and verified. Demo data is clearly marked as sample.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="shrink-0 mt-0.5" />
                  Fares and information may change. Always confirm with official sources before travel.
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle size={14} className="shrink-0 mt-0.5" />
                  TransPrice does not sell tickets or process payments. We provide information only.
                </li>
              </ul>
            </div>
          </div>
        </motion.section>

        {/* FAQ */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-navy-900 mb-2">
            Frequently Asked Questions
          </motion.h2>
          <motion.p variants={fadeUp} custom={1} className="text-neutral-500 mb-8">
            Common questions about TransPrice and our data
          </motion.p>
          <div className="space-y-3">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-neutral-200 bg-white overflow-hidden"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left px-6 py-4 flex items-center justify-between"
                >
                  <span className="text-sm font-semibold text-navy-900 pr-4">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-neutral-400 shrink-0 transition-transform duration-200 ${
                      openFaq === i ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-4 border-t border-neutral-100 pt-3">
                    <p className="text-sm text-neutral-600 leading-relaxed">{item.a}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}
