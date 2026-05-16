import { useState } from 'react';
import {
  Mail, Star, Clock, Send, FileEdit, Search, Sparkles,
  CheckCircle2, Github, Linkedin, ArrowRight, Play,
  Inbox, MessageSquare, Filter,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navbar } from '../Components/Navbar';
import { AnimatedSection } from '../Components/AnimatedSection';
import { ProductPreview } from '../Components/ProductPreview';
import { scrollToSection } from '../lib/scrollTo';

const features = [
  { icon: Sparkles, title: 'AI Summarization', description: 'Instant summaries powered by NVIDIA NIM' },
  { icon: Send, title: 'Smart Responses', description: 'One-click drafts tailored to each message' },
  { icon: Search, title: 'Intelligent Search', description: 'Find emails by sender, subject, or body' },
  { icon: Star, title: 'Priority Inbox', description: 'Urgent, positive, and neutral sorting' },
  { icon: Clock, title: 'Smart Scheduling', description: 'Send later and get timely reminders' },
  { icon: FileEdit, title: 'Draft Assistant', description: 'Writing suggestions as you compose' },
];

const steps = [
  { icon: Inbox, title: 'Connect your inbox', desc: 'Sync emails and let MailX organize them automatically.' },
  { icon: Filter, title: 'AI categorizes mail', desc: 'Urgent, positive, neutral, and calendar tags applied instantly.' },
  { icon: MessageSquare, title: 'Reply in one click', desc: 'Summarize, generate a response, and open Gmail compose.' },
];

const plans = [
  { name: 'Basic', price: 'Free', description: 'Perfect for personal use', features: ['500 emails/month', 'Basic AI summaries', 'Email templates', '24/7 support'] },
  { name: 'Pro', price: 'Contact Us', description: 'For professionals', features: ['Unlimited emails', 'Advanced AI features', 'Custom workflows', 'Priority support'], highlighted: true },
  { name: 'Enterprise', price: 'Custom', description: 'For large teams', features: ['Custom solutions', 'Dedicated support', 'SLA guarantee', 'Custom integrations'] },
];

const testimonials = [
  { name: 'Vamsi Yadav', role: 'Marketing Manager', content: 'MailX revolutionized my email workflow. Intelligent categorization helps me focus on what truly matters.', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&h=150' },
  { name: 'Keerthan Reddy', role: 'Product Manager', content: 'Smart prioritization is a lifesaver. I never miss important messages anymore.', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&h=150' },
  { name: 'Bhanu Prakash', role: 'Business Owner', content: 'MailX streamlined my communication. AI insights help me respond faster and more effectively.', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&h=150' },
];

function LandingPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setEmail('');
  };

  return (
    <motion.div className="page-bg min-h-screen text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-violet-500/10">
        <motion.div className="pointer-events-none absolute inset-0">
          <motion.div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-violet-600/8 blur-3xl" />
          <motion.div className="absolute -right-32 top-20 h-80 w-80 rounded-full bg-violet-800/8 blur-3xl" />
        </motion.div>

        <motion.div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-8 lg:grid-cols-2 lg:gap-16 lg:py-24">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-600/15 px-4 py-1.5 text-sm text-violet-200">
              <Sparkles className="h-4 w-4 text-violet-400" />
              Powered by NVIDIA NIM
            </span>

            <h1 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
              <span className="text-violet-300">AI-Powered</span>
              <br />
              <span className="text-white">Email Management</span>
            </h1>

            <p className="mt-6 max-w-lg text-lg leading-relaxed text-slate-400">
              Experience the future of email with AI-driven summarization and automated responses.
              Stay organized with an intelligent assistant built for modern teams.
            </p>

            <motion.div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="btn-primary flex items-center justify-center gap-2 px-8 py-3.5 text-base"
              >
                Get Started
                <ArrowRight className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('demo')}
                className="btn-secondary flex items-center justify-center gap-2 px-8 py-3.5 text-base"
              >
                <Play className="h-4 w-4" />
                Watch Demo
              </button>
            </motion.div>

            <motion.div className="mt-10 grid grid-cols-3 gap-4 border-t border-violet-500/15 pt-8">
              {[
                { n: '1M+', l: 'Emails processed' },
                { n: '99.9%', l: 'Accuracy rate' },
                { n: '100+', l: 'Happy users' },
              ].map((s) => (
                <motion.div key={s.l}>
                  <p className="font-display text-2xl font-bold text-white sm:text-3xl">{s.n}</p>
                  <p className="mt-1 text-xs text-slate-500 sm:text-sm">{s.l}</p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          <ProductPreview />
        </motion.div>
      </section>

      <section id="how-it-works" className="scroll-mt-20 border-b border-violet-500/10 bg-mail-surface/40 py-20">
        <motion.div className="mx-auto max-w-7xl px-4 sm:px-8">
          <AnimatedSection className="mb-14 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-violet-400">How it works</p>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Three steps to inbox zero</h2>
          </AnimatedSection>
          <motion.div className="grid gap-8 md:grid-cols-3">
            {steps.map((step, i) => (
              <AnimatedSection key={step.title} delay={i * 0.1}>
                <motion.div className="relative rounded-2xl border border-violet-500/15 bg-mail-card p-8">
                  <span className="absolute -top-3 left-6 rounded-full bg-violet-600 px-3 py-0.5 text-xs font-bold text-white">
                    {i + 1}
                  </span>
                  <motion.div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/20">
                    <step.icon className="h-6 w-6 text-violet-400" />
                  </motion.div>
                  <h3 className="mb-2 text-lg font-semibold text-white">{step.title}</h3>
                  <p className="text-sm leading-relaxed text-slate-400">{step.desc}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section id="features" className="scroll-mt-20 py-20">
        <motion.div className="mx-auto max-w-7xl px-4 sm:px-8">
          <AnimatedSection className="mb-14 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-violet-400">Features</p>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Everything you need</h2>
            <p className="mt-3 text-slate-400">Powerful tools to tame your inbox</p>
          </AnimatedSection>
          <motion.div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
              <AnimatedSection key={f.title} delay={i * 0.05}>
                <motion.div whileHover={{ y: -4 }} className="glass-card h-full p-6 hover:border-violet-400/35">
                  <motion.div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600/20">
                    <f.icon className="h-5 w-5 text-violet-400" />
                  </motion.div>
                  <h3 className="mb-2 font-semibold text-white">{f.title}</h3>
                  <p className="text-sm text-slate-400">{f.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </motion.div>
          <AnimatedSection className="mt-10 text-center">
            <button type="button" onClick={() => navigate('/signup')} className="btn-secondary">
              Explore all features
            </button>
          </AnimatedSection>
        </motion.div>
      </section>

      <section id="pricing" className="scroll-mt-20 border-y border-violet-500/10 bg-mail-surface/30 py-20">
        <motion.div className="mx-auto max-w-7xl px-4 sm:px-8">
          <AnimatedSection className="mb-14 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-violet-400">Pricing</p>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Simple, transparent plans</h2>
          </AnimatedSection>
          <motion.div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
            {plans.map((plan, i) => (
              <AnimatedSection key={plan.name} delay={i * 0.1}>
                <motion.div
                  className={`glass-card flex h-full flex-col p-8 ${
                    plan.highlighted ? 'border-violet-400 ring-1 ring-violet-400/30' : ''
                  }`}
                >
                  {plan.highlighted && (
                    <span className="mb-4 w-fit rounded-full bg-violet-600 px-3 py-1 text-xs font-semibold text-white">
                      Popular
                    </span>
                  )}
                  <h3 className="text-xl font-bold">{plan.name}</h3>
                  <p className="mt-1 font-display text-3xl font-bold text-violet-300">{plan.price}</p>
                  <p className="mt-2 text-sm text-slate-400">{plan.description}</p>
                  <ul className="mt-6 flex-1 space-y-3">
                    {plan.features.map((feat) => (
                      <li key={feat} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-violet-400" />
                        {feat}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className={`mt-8 w-full rounded-full py-3 font-medium ${
                      plan.highlighted ? 'btn-primary' : 'btn-secondary'
                    }`}
                  >
                    Get Started
                  </button>
                </motion.div>
              </AnimatedSection>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section id="testimonials" className="scroll-mt-20 py-20">
        <motion.div className="mx-auto max-w-7xl px-4 sm:px-8">
          <AnimatedSection className="mb-14 text-center">
            <p className="mb-2 text-sm font-medium uppercase tracking-widest text-violet-400">Testimonials</p>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">What our users say</h2>
          </AnimatedSection>
          <motion.div className="grid gap-6 md:grid-cols-3">
            {testimonials.map((t, i) => (
              <AnimatedSection key={t.name} delay={i * 0.1}>
                <motion.div className="glass-card p-6">
                  <motion.div className="mb-4 flex items-center gap-4">
                    <img
                      src={t.image}
                      alt={t.name}
                      className="h-12 w-12 rounded-full object-cover ring-2 ring-violet-500/30"
                    />
                    <motion.div>
                      <p className="font-semibold">{t.name}</p>
                      <p className="text-sm text-slate-500">{t.role}</p>
                    </motion.div>
                  </motion.div>
                  <p className="text-sm leading-relaxed text-slate-300">&ldquo;{t.content}&rdquo;</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </motion.div>
        </motion.div>
      </section>

      <section id="waitlist" className="scroll-mt-20 border-t border-violet-500/10 py-20">
        <motion.div className="mx-auto max-w-2xl px-4 text-center sm:px-8">
          <AnimatedSection>
            <h2 className="font-display text-3xl font-bold text-white sm:text-4xl">Join the waitlist</h2>
            <p className="mt-4 text-slate-400">Be among the first to experience the future of email.</p>
            <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                className="input-field flex-1"
                required
              />
              <button type="submit" className="btn-primary shrink-0 px-8">
                Join Waitlist
              </button>
            </form>
            {submitted && (
              <motion.p
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 flex items-center justify-center gap-2 text-violet-400"
              >
                <CheckCircle2 className="h-5 w-5" />
                Thanks! We&apos;ll be in touch soon.
              </motion.p>
            )}
          </AnimatedSection>
        </motion.div>
      </section>

      <footer className="border-t border-violet-500/15 bg-mail-surface/50">
        <motion.div className="mx-auto max-w-7xl px-4 py-12 sm:px-8">
          <motion.div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <motion.div>
              <h3 className="mb-4 text-sm font-semibold text-white">Product</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><a href="#features" className="transition-colors hover:text-white">Features</a></li>
                <li><a href="#pricing" className="transition-colors hover:text-white">Plans</a></li>
                <li><a href="#testimonials" className="transition-colors hover:text-white">Reviews</a></li>
              </ul>
            </motion.div>
            <motion.div>
              <h3 className="mb-4 text-sm font-semibold text-white">Company</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><span className="cursor-default">About</span></li>
                <li><span className="cursor-default">Blog</span></li>
              </ul>
            </motion.div>
            <motion.div>
              <h3 className="mb-4 text-sm font-semibold text-white">Resources</h3>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><span className="cursor-default">Docs</span></li>
                <li><span className="cursor-default">Privacy</span></li>
              </ul>
            </motion.div>
            <motion.div>
              <h3 className="mb-4 text-sm font-semibold text-white">Connect</h3>
              <motion.div className="flex gap-4">
                <a href="https://github.com/KiranTejz20005" className="text-slate-500 transition-colors hover:text-violet-400" aria-label="GitHub">
                  <Github className="h-5 w-5" />
                </a>
                <a href="https://www.linkedin.com/in/kirantejalanke/" className="text-slate-500 transition-colors hover:text-violet-400" aria-label="LinkedIn">
                  <Linkedin className="h-5 w-5" />
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-violet-500/15 pt-8 md:flex-row">
            <motion.div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-violet-400" />
              <span className="font-display font-bold text-white">MailX</span>
            </motion.div>
            <p className="text-sm text-slate-500">© 2025 MailX. All rights reserved.</p>
          </motion.div>
        </motion.div>
      </footer>
    </motion.div>
  );
}

export default LandingPage;
