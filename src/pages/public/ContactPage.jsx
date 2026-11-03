import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  Send,
  MessageSquare,
  User,
  Clock,
  CheckCircle,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.4 },
  }),
};

const categories = [
  'General',
  'Fare Inquiry',
  'Route Information',
  'Complaint',
  'Suggestion',
  'Partnership',
];

const faqItems = [
  { q: 'How fast will I get a response?', a: 'We typically respond within 2 business days. Urgent inquiries can be directed to phone 0794607004.' },
  { q: 'Can I report incorrect fare information?', a: 'Yes. Use the "Fare Inquiry" category to report any data you believe is incorrect.' },
  { q: 'Do you accept data contributions?', a: 'Absolutely. We welcome current fare information from travelers and transport operators to keep our data accurate.' },
  { q: 'Is TransPrice government-affiliated?', a: 'No. We are an independent platform. Our contact information is listed on this page.' },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'General',
  });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [openFaq, setOpenFaq] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.email.trim()) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) newErrors.email = 'Enter a valid email';
    if (!form.subject.trim()) newErrors.subject = 'Subject is required';
    if (!form.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <section className="bg-navy-900 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div initial="hidden" animate="visible">
            <motion.h1 variants={fadeUp} className="text-3xl sm:text-4xl font-bold text-white mb-3">
              Contact Us
            </motion.h1>
            <motion.p variants={fadeUp} custom={1} className="text-neutral-300 text-lg">
              We'd love to hear from you
            </motion.p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <motion.div
            initial="hidden"
            animate="visible"
            className="lg:col-span-2 rounded-xl border border-neutral-200 bg-white p-6 sm:p-8"
          >
            <motion.h2 variants={fadeUp} className="text-xl font-semibold text-navy-900 mb-6">
              Send us a message
            </motion.h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Name</label>
                  <div className="relative">
                    <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Your name"
                      className={`w-full rounded-lg border bg-neutral-50 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 ${
                        errors.name
                          ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-neutral-200 focus:border-green-500 focus:ring-green-500/20'
                      }`}
                    />
                  </div>
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Email</label>
                  <div className="relative">
                    <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className={`w-full rounded-lg border bg-neutral-50 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 ${
                        errors.email
                          ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-neutral-200 focus:border-green-500 focus:ring-green-500/20'
                      }`}
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-lg border border-neutral-200 bg-neutral-50 py-2.5 px-4 text-sm focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500/20 appearance-none"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1.5">Subject</label>
                  <div className="relative">
                    <MessageSquare size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                    <input
                      type="text"
                      name="subject"
                      value={form.subject}
                      onChange={handleChange}
                      placeholder="Subject"
                      className={`w-full rounded-lg border bg-neutral-50 py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 ${
                        errors.subject
                          ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                          : 'border-neutral-200 focus:border-green-500 focus:ring-green-500/20'
                      }`}
                    />
                  </div>
                  {errors.subject && <p className="mt-1 text-xs text-red-500">{errors.subject}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-1.5">Message</label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows={6}
                  className={`w-full rounded-lg border bg-neutral-50 py-2.5 px-4 text-sm focus:outline-none focus:ring-2 ${
                    errors.message
                      ? 'border-red-500 focus:ring-red-500/20 focus:border-red-500'
                      : 'border-neutral-200 focus:border-green-500 focus:ring-green-500/20'
                  }`}
                />
                {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
              </div>
              <button
                type="submit"
                className="inline-flex items-center gap-2 rounded-lg bg-green-500 px-8 py-3 text-sm font-semibold text-white hover:bg-green-600 transition-colors shadow-sm"
              >
                <Send size={16} />
                Send Message
              </button>
              {submitted && (
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-green-50 border border-green-200 p-4 text-sm text-green-700">
                  <CheckCircle size={16} />
                  Thank you! Your message has been received. We'll get back to you within 2 business days.
                </div>
              )}
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={fadeUp}
            custom={1}
            className="space-y-6"
          >
            <div className="rounded-xl border border-neutral-200 bg-white p-6">
              <h3 className="text-lg font-semibold text-navy-900 mb-4">Contact Information</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-green-50 p-2.5 text-green-600 shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900 mb-0.5">Phone</p>
                    <a href="tel:0794607004" className="text-sm text-neutral-500 hover:text-green-600 transition-colors">
                      0794607004
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-blue-50 p-2.5 text-blue-600 shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900 mb-0.5">Email</p>
                    <a href="mailto:barakagermain320@gmail.com" className="text-sm text-neutral-500 hover:text-green-600 transition-colors break-all">
                      barakagermain320@gmail.com
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-amber-50 p-2.5 text-amber-600 shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900 mb-0.5">Location</p>
                    <p className="text-sm text-neutral-500">Kigali, Rwanda</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-purple-50 p-2.5 text-purple-600 shrink-0">
                    <Globe size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900 mb-0.5">Website</p>
                    <a
                      href="https://baraka-transprice.lovable.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-neutral-500 hover:text-green-600 transition-colors break-all"
                    >
                      baraka-transprice.lovable.app
                    </a>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="rounded-lg bg-neutral-100 p-2.5 text-neutral-600 shrink-0">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-navy-900 mb-0.5">Response Time</p>
                    <p className="text-sm text-neutral-500">Within 2 business days</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-xl border border-neutral-200 bg-white overflow-hidden">
              <div className="border-b border-neutral-200 px-6 py-4">
                <h3 className="text-sm font-semibold text-navy-900">Our Location</h3>
              </div>
              <div className="relative h-56 bg-neutral-100 flex flex-col items-center justify-center">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(15,38,69,0.4) 1px, transparent 0)', backgroundSize: '30px 30px' }} />
                <MapPin size={40} className="text-green-500 mb-2" />
                <p className="text-sm font-medium text-navy-900">Kigali, Rwanda</p>
                <p className="text-xs text-neutral-400">Interactive map coming soon</p>
                <div className="absolute bottom-2 right-2 text-xs bg-white rounded px-2 py-1 text-neutral-400 border border-neutral-200">
                  -1.9403, 29.8739
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* FAQ */}
        <motion.section initial="hidden" whileInView="visible" viewport={{ once: true }} className="mt-12">
          <motion.h2 variants={fadeUp} className="text-2xl font-bold text-navy-900 mb-6">
            Frequently Asked Questions
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {faqItems.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="rounded-xl border border-neutral-200 bg-white p-5"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left"
                >
                  <div className="flex items-center justify-between pr-4 mb-2">
                    <span className="text-sm font-semibold text-navy-900 pr-4">{item.q}</span>
                    <span className="text-green-500 text-sm shrink-0">{openFaq === i ? '−' : '+'}</span>
                  </div>
                  {openFaq === i && (
                    <p className="text-sm text-neutral-500 leading-relaxed">{item.a}</p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  );
}