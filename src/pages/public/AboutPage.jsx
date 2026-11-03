import { motion } from 'framer-motion';
import {
  Eye,
  Target,
  Heart,
  Users,
  Phone,
  Mail,
  Globe,
  Shield,
  ArrowRight,
  Award,
  Lightbulb,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const values = [
  {
    icon: Award,
    title: 'Accuracy',
    description: 'We verify every piece of data before it reaches you.',
  },
  {
    icon: Heart,
    title: 'Accessibility',
    description: 'Transport information should be easy to find and understand.',
  },
  {
    icon: Eye,
    title: 'Transparency',
    description: 'Every data point shows its source and verification status.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We constantly improve how transport data is collected and shared.',
  },
];

const features = [
  {
    title: 'Verified Fares',
    description: 'Every fare is cross-referenced against official sources before publication.',
  },
  {
    title: 'Route Information',
    description: 'Comprehensive route data with distances, times, and transport options.',
  },
  {
    title: 'Real-time Updates',
    description: 'Stay informed about fare changes and transport service announcements.',
  },
  {
    title: 'Fuel Price Tracking',
    description: 'Follow fuel price trends that directly affect your travel costs.',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <section className="bg-navy-900 py-16 lg:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" animate="visible">
            <motion.div variants={fadeUp} className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500 text-white text-2xl font-bold mb-4">
                T
              </div>
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl font-bold text-white mb-4">
              About TransPrice
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-lg text-neutral-300 leading-relaxed max-w-2xl mx-auto">
              Making transport pricing transparent and accessible for every traveler in Rwanda.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="rounded-xl border border-neutral-200 p-8 text-center hover:shadow-lg transition-shadow"
            >
              <motion.div variants={fadeUp}>
                <Target size={32} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-navy-900 mb-3">Our Mission</h2>
                <p className="text-neutral-500 leading-relaxed">
                  Fair journeys. Clear prices.
                </p>
                <p className="text-neutral-400 text-sm mt-2">
                  We exist to provide every Rwandan traveler with accurate, verified transport information so they can plan journeys with confidence.
                </p>
              </motion.div>
            </motion.div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              custom={1}
              className="rounded-xl border border-neutral-200 p-8 text-center hover:shadow-lg transition-shadow"
            >
              <motion.div variants={fadeUp}>
                <Eye size={32} className="text-navy-900 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-navy-900 mb-3">Our Vision</h2>
                <p className="text-neutral-500 leading-relaxed">
                  Rwanda's trusted transport information platform.
                </p>
                <p className="text-neutral-400 text-sm mt-2">
                  A future where no traveler is uncertain about transport costs, and pricing information is accessible to everyone.
                </p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-navy-900 mb-3">
              Our Values
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-neutral-500 max-w-2xl mx-auto">
              What guides our work every day
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v, i) => (
              <motion.div
                key={v.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="rounded-xl border border-neutral-200 bg-white p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="inline-flex rounded-lg bg-green-50 p-3 text-green-600 mb-4">
                  <v.icon size={24} />
                </div>
                <h3 className="text-lg font-semibold text-navy-900 mb-2">{v.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-navy-900 mb-3">
              How TransPrice Works
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-neutral-500 max-w-2xl mx-auto">
              Everything we do is built around verified, transparent data
            </motion.p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                custom={i}
                className="rounded-xl border border-neutral-200 p-6"
              >
                <h3 className="font-semibold text-navy-900 mb-2">{f.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-12">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-navy-900 mb-3">
              Our Team
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-neutral-500">
              Built with passion by the BARAKA team
            </motion.p>
          </motion.div>
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="max-w-md mx-auto rounded-2xl bg-navy-900 p-8 text-center shadow-xl"
          >
            <motion.div variants={fadeUp}>
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-500 text-white text-3xl font-bold mb-4">
                B
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">BARAKA</h3>
              <p className="text-neutral-300 text-sm mb-6">TransPrice Founder & Development Team</p>
              <div className="flex justify-center gap-2">
                <Users size={14} className="text-green-400" />
                <span className="text-xs text-neutral-300">Independently built for Rwanda travelers</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-16 bg-navy-900">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} className="max-w-2xl mx-auto">
            <motion.h2 variants={fadeUp} className="text-3xl font-bold text-white mb-3">
              Get in Touch
            </motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-neutral-300 text-lg mb-10">
              Have questions, feedback, or partnership ideas?
            </motion.p>
            <motion.div variants={fadeUp} custom={2} className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
              <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                <Phone size={20} className="text-green-400 mb-2" />
                <p className="text-xs text-neutral-400 mb-1">Phone</p>
                <a href="tel:0794607004" className="text-sm text-white hover:text-green-400 transition-colors">
                  0794607004
                </a>
              </div>
              <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                <Mail size={20} className="text-green-400 mb-2" />
                <p className="text-xs text-neutral-400 mb-1">Email</p>
                <a href="mailto:barakagermain320@gmail.com" className="text-sm text-white hover:text-green-400 transition-colors break-all">
                  barakagermain320@gmail.com
                </a>
              </div>
              <div className="rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                <Globe size={20} className="text-green-400 mb-2" />
                <p className="text-xs text-neutral-400 mb-1">Website</p>
                <a
                  href="https://baraka-transprice.lovable.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white hover:text-green-400 transition-colors break-all"
                >
                  baraka-transprice.lovable.app
                </a>
              </div>
            </motion.div>
            <motion.div variants={fadeUp} custom={3} className="mt-10">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-8 py-3 text-sm font-semibold text-white hover:bg-green-600 transition-colors"
              >
                Contact Us <ArrowRight size={16} />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Disclaimer */}
      <section className="py-8 bg-neutral-50">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-neutral-100 p-4 flex items-start gap-3">
            <Shield size={18} className="text-neutral-400 shrink-0 mt-0.5" />
            <p className="text-sm text-neutral-500 leading-relaxed">
              <span className="font-medium text-neutral-700">Disclaimer:</span> TransPrice is an independent platform and is not affiliated with, endorsed by, or representative of any government entity. All data is clearly sourced and verified. Demo data is clearly labeled.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}