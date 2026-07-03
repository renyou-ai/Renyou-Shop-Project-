import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Shield, FileText, Lock, Eye, RefreshCw, AlertCircle,
  ChevronDown, ChevronUp, Mail, Phone, MapPin, CheckCircle2
} from "lucide-react";
import Footer from "../components/Footer";

const SECTIONS = [
  {
    id: "terms",
    icon: FileText,
    color: "#7C3AED",
    bg: "bg-violet-50",
    title: "Terms & Conditions",
    lastUpdated: "June 15, 2026",
    content: [
      {
        heading: "1. Acceptance of Terms",
        text: "By accessing and using the Renyou Shop platform, you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to abide by the above, please do not use this service.",
      },
      {
        heading: "2. Use of the Platform",
        text: "Renyou Shop is an online pharmacy and beauty marketplace. You agree to use the platform only for lawful purposes and in a way that does not infringe the rights of others. You must be at least 18 years old to purchase prescription products.",
      },
      {
        heading: "3. Account Responsibility",
        text: "You are responsible for maintaining the confidentiality of your account credentials. You agree to accept responsibility for all activities that occur under your account. Notify us immediately of any unauthorized use.",
      },
      {
        heading: "4. Orders & Payments",
        text: "All orders are subject to product availability. We reserve the right to refuse or cancel any order. Prices are displayed in USD and are subject to change without notice. Payment must be received before shipment.",
      },
      {
        heading: "5. Prescription Products",
        text: "Certain products require a valid prescription. By purchasing prescription items, you confirm you hold a valid prescription issued by a licensed healthcare professional. Renyou reserves the right to verify prescriptions.",
      },
      {
        heading: "6. Intellectual Property",
        text: "All content on this platform, including logos, images, text and software, is the property of Renyou Shop or its content suppliers and is protected by applicable intellectual property laws.",
      },
      {
        heading: "7. Limitation of Liability",
        text: "Renyou Shop shall not be liable for any indirect, incidental, special or consequential damages resulting from your use of, or inability to use, the platform or its content.",
      },
      {
        heading: "8. Governing Law",
        text: "These terms are governed by the laws of Tunisia. Any disputes arising under these terms shall be subject to the exclusive jurisdiction of the courts of Nabeul, Tunisia.",
      },
    ],
  },
  {
    id: "privacy",
    icon: Eye,
    color: "#059669",
    bg: "bg-emerald-50",
    title: "Privacy Policy",
    lastUpdated: "June 15, 2026",
    content: [
      {
        heading: "1. Information We Collect",
        text: "We collect information you provide directly (name, email, address, payment details), information collected automatically (IP address, browser type, pages visited), and health-related data necessary for prescription processing.",
      },
      {
        heading: "2. How We Use Your Information",
        text: "We use your data to process orders and payments, deliver products, send order updates, improve our services, personalize your experience, and comply with legal obligations including pharmaceutical regulations.",
      },
      {
        heading: "3. Data Sharing",
        text: "We do not sell your personal data. We share it only with: delivery partners for order fulfillment, payment processors for secure transactions, licensed pharmacists for prescription verification, and regulatory authorities when legally required.",
      },
      {
        heading: "4. Health Data Protection",
        text: "Health information including prescriptions and skin diagnostic results is treated with the highest level of confidentiality. This data is encrypted, stored securely, and accessed only by authorized healthcare professionals.",
      },
      {
        heading: "5. Cookies",
        text: "We use cookies to maintain your session, remember your preferences, analyze site traffic and provide personalized product recommendations. You can control cookie settings through your browser.",
      },
      {
        heading: "6. Your Rights",
        text: "You have the right to access, correct, or delete your personal data. You may also object to processing, request data portability, or withdraw consent at any time by contacting our privacy team.",
      },
      {
        heading: "7. Data Retention",
        text: "We retain your data for as long as your account is active or as needed to provide services. Prescription records are retained for the legally mandated period under Tunisian pharmaceutical regulations.",
      },
      {
        heading: "8. Contact for Privacy",
        text: "For any privacy-related requests, contact our Data Protection Officer at privacy@renyouapp.com or by mail at our registered address below.",
      },
    ],
  },
  {
    id: "returns",
    icon: RefreshCw,
    color: "#f4742a",
    bg: "bg-orange-50",
    title: "Returns & Refunds",
    lastUpdated: "June 10, 2025",
    content: [
      {
        heading: "1. Return Window",
        text: "You may return most non-prescription items within 14 days of delivery, provided they are unopened, in original packaging, and in resalable condition. Returns must be initiated through your account dashboard.",
      },
      {
        heading: "2. Non-Returnable Items",
        text: "The following cannot be returned: prescription medications, opened hygiene products, refrigerated items, personalized or custom-order products, and items marked 'Final Sale' at time of purchase.",
      },
      {
        heading: "3. Defective or Wrong Items",
        text: "If you receive a defective, damaged, or incorrect item, contact us within 48 hours of delivery with photos. We will arrange a free return pickup and send a replacement at no additional cost.",
      },
      {
        heading: "4. Refund Processing",
        text: "Approved refunds are processed within 5–7 business days to the original payment method. For cash on delivery orders, refunds are issued as store credit or via bank transfer within 10 business days.",
      },
      {
        heading: "5. Return Shipping",
        text: "For standard returns, customers bear return shipping costs unless the return is due to our error. We provide a pre-paid label for defective or incorrect item returns.",
      },
      {
        heading: "6. Exchange Policy",
        text: "We offer direct exchanges for size or variant changes on eligible products. Contact our support team within the return window to initiate an exchange.",
      },
    ],
  },
  {
    id: "security",
    icon: Lock,
    color: "#2563EB",
    bg: "bg-blue-50",
    title: "Security & Data Safety",
    lastUpdated: "June 14, 2026",
    content: [
      {
        heading: "1. Data Encryption",
        text: "All data transmitted between your browser and our servers is encrypted using TLS 1.3 protocol. Sensitive data including passwords and payment details are encrypted at rest using AES-256.",
      },
      {
        heading: "2. Payment Security",
        text: "We are PCI DSS compliant. We do not store full credit card numbers on our servers. Payment processing is handled by certified payment gateways with tokenization technology.",
      },
      {
        heading: "3. Account Security",
        text: "We recommend using a strong, unique password and enabling two-factor authentication when available. We will never ask for your password via email or phone.",
      },
      {
        heading: "4. Incident Response",
        text: "In the event of a data breach, we will notify affected users within 72 hours as required by applicable regulations and take immediate steps to mitigate impact.",
      },
      {
        heading: "5. Third-Party Security",
        text: "All third-party vendors handling your data are required to maintain security standards equivalent to or exceeding our own. We conduct regular security assessments of our partners.",
      },
    ],
  },
  {
    id: "disclaimer",
    icon: AlertCircle,
    color: "#db2777",
    bg: "bg-pink-50",
    title: "Medical Disclaimer",
    lastUpdated: "June 12, 2026",
    content: [
      {
        heading: "1. Not Medical Advice",
        text: "The content on Renyou Shop, including AI skin analysis results, product descriptions and health information, is for informational purposes only and does not constitute medical advice, diagnosis, or treatment.",
      },
      {
        heading: "2. Consult a Professional",
        text: "Always consult a qualified healthcare professional before starting any new medication, supplement, or skincare regimen, especially if you have existing medical conditions or are pregnant.",
      },
      {
        heading: "3. AI Diagnostic Limitations",
        text: "Our AI-powered skin analysis is a supplementary tool only. Results are indicative and not a substitute for professional dermatological assessment. Individual results may vary.",
      },
      {
        heading: "4. Product Information",
        text: "While we strive for accuracy, product information including ingredients, usage instructions and contraindications may change. Always read the product label before use.",
      },
      {
        heading: "5. Allergic Reactions",
        text: "If you experience adverse reactions to any product, discontinue use immediately and consult a healthcare professional. Renyou Shop is not liable for allergic reactions to purchased products.",
      },
    ],
  },
];

function SectionNav({ sections, active, onSelect }) {
  return (
    <nav className="hidden lg:block w-64 flex-shrink-0 sticky top-24 self-start">
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm p-3">
        <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest px-3 mb-2">Sections</p>
        {sections.map(s => {
          const Icon = s.icon;
          const isActive = active === s.id;
          return (
            <button key={s.id} onClick={() => onSelect(s.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-1 text-left ${
                isActive
? "bg-violet-50 dark:bg-violet-900/20 text-violet-700 dark:text-violet-300 font-semibold"
: "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}>
              <Icon size={15} style={{ color: isActive ? s.color : undefined }} />
              {s.title}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

function AccordionItem({ item, index }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-100 dark:border-gray-700 rounded-2xl overflow-hidden bg-white dark:bg-gray-900">
      <button onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
        <span className="font-semibold text-gray-900 dark:text-white text-sm">{item.heading}</span>
        {open ? <ChevronUp size={16} className="text-gray-400 dark:text-gray-500 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 dark:text-gray-500 flex-shrink-0" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.22 }} className="overflow-hidden">
            <div className="px-6 pb-5 text-sm text-gray-600 dark:text-gray-300 leading-relaxed border-t border-gray-100 dark:border-gray-700 pt-4">
              {item.text}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AgreementsPage() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("terms");

  const section = SECTIONS.find(s => s.id === activeSection) || SECTIONS[0];
  const Icon = section.icon;

  const scrollTo = (id) => {
    setActiveSection(id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">

      {/* Hero */}
      <section className="bg-gradient-to-br from-violet-700 via-violet-600 to-purple-700 text-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/15 border border-white/25 rounded-full px-4 py-2 text-sm font-semibold mb-5">
            <Shield size={14} /> Legal & Compliance Center
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black mb-4">
            Terms, Privacy & Agreements
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-violet-200 text-lg max-w-2xl mx-auto">
            We believe in complete transparency. Read our full legal documents, privacy practices and customer policies below.
          </motion.p>
        </div>
      </section>

      {/* Mobile category pills */}
      <div className="lg:hidden overflow-x-auto no-scrollbar px-4 py-4 flex gap-2">
        {SECTIONS.map(s => {
          const SIcon = s.icon;
          return (
            <button key={s.id} onClick={() => scrollTo(s.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeSection === s.id ? "bg-violet-600 text-white shadow-md" : "bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
              }`}>
              <SIcon size={12} /> {s.title}
            </button>
          );
        })}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex gap-10 items-start">

          <SectionNav sections={SECTIONS} active={activeSection} onSelect={scrollTo} />

          {/* Content */}
          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div key={activeSection} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }}>

                {/* Header card */}
                <div className={`${section.bg} dark:bg-gray-900 rounded-2xl p-7 mb-6 flex items-start gap-5 border border-transparent dark:border-gray-700`}>
                  <div className="w-14 h-14 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-sm flex-shrink-0">
                    <Icon size={24} style={{ color: section.color }} />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{section.title}</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                      <CheckCircle2 size={14} className="text-emerald-500" />
                      Last updated: {section.lastUpdated}
                    </div>
                  </div>
                </div>

                {/* Accordion */}
                <div className="space-y-3 mb-10">
                  {section.content.map((item, i) => (
                    <AccordionItem key={i} item={item} index={i} />
                  ))}
                </div>

                {/* Other sections quick nav */}
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-700 p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 text-sm">Other Legal Documents</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {SECTIONS.filter(s => s.id !== activeSection).map(s => {
                      const SIcon = s.icon;
                      return (
                        <button key={s.id} onClick={() => scrollTo(s.id)}
                          className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 dark:border-gray-700 hover:border-violet-300 dark:hover:border-violet-500 transition-all text-left group">
                          <SIcon size={16} style={{ color: s.color }} />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-violet-700 dark:group-hover:text-violet-300">{s.title}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Contact footer */}
      <section className="bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-700 py-12 px-6 mt-6">
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-3">Have a Legal Question?</h3>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Our compliance team is available to answer any questions about our terms, privacy practices or data handling.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-sm">
            {[
              { icon: Mail,    label: "legal@renyouapp.com",   href: "mailto:legal@renyouapp.com" },
              { icon: Phone,   label: "(+216) 52 00 00 00",   href: "tel:+21652000000" },
              { icon: MapPin,  label: "Nabeul, Tunisia",        href: "#" },
            ].map(c => (
              <a key={c.label} href={c.href}
                className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-violet-600 dark:hover:text-violet-300 transition-colors">
                <c.icon size={15} className="text-violet-500" />
                {c.label}
              </a>
            ))}
          </div>
        </div>
      </section>
        <Footer />
    </div>
  );
}
