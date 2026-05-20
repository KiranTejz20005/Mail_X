import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Mail, Menu, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { navigateToSection } from '../lib/scrollTo';
import { GuestModeButton } from './GuestModeButton';

const NAV_LINKS = [
  { label: 'Features', section: 'features' },
  { label: 'Plans', section: 'pricing' },
  { label: 'Reviews', section: 'testimonials' },
] as const;

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const goToSection = (sectionId: string) => {
    navigateToSection(pathname, navigate, sectionId);
    setMobileOpen(false);
  };

  const goToWaitlist = () => {
    goToSection('waitlist');
  };

  return (
    <header className="sticky top-0 z-50 border-b border-violet-500/15 bg-mail-bg/90 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-8">
        <Link to="/" className="group flex shrink-0 items-center gap-2.5">
          <motion.div
            whileHover={{ scale: 1.05 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-600"
          >
            <Mail className="h-5 w-5 text-white" />
          </motion.div>
          <span className="font-display text-xl font-bold text-white">MailX</span>
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {NAV_LINKS.map((link) => (
            <button
              key={link.section}
              type="button"
              onClick={() => goToSection(link.section)}
              className="text-sm text-slate-400 transition-colors hover:text-white"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <motion.div className="hidden shrink-0 items-center gap-2 rounded-full border border-violet-500/15 bg-mail-card/70 px-2 py-2 shadow-[0_0_0_1px_rgba(139,92,246,0.04)] md:flex">
          <GuestModeButton
            label="Try Guest"
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-violet-500/10 hover:text-white"
          />
          <button
            type="button"
            onClick={() => navigate('/login')}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-violet-500/10 hover:text-white"
          >
            Log in
          </button>
          <button
            type="button"
            onClick={() => navigate('/signup')}
            className="rounded-full px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:bg-violet-500/10 hover:text-white"
          >
            Sign up
          </button>
          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={goToWaitlist}
            className="btn-primary flex items-center gap-1.5 whitespace-nowrap text-sm"
          >
            Join Waitlist
            <ChevronRight className="h-4 w-4" />
          </motion.button>
        </motion.div>

        <button
          type="button"
          className="rounded-lg p-2 text-slate-300 md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-t border-violet-500/15 md:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {NAV_LINKS.map((link) => (
                <button
                  key={link.section}
                  type="button"
                  onClick={() => goToSection(link.section)}
                  className="rounded-lg px-3 py-2.5 text-left text-slate-300 hover:bg-violet-500/10"
                >
                  {link.label}
                </button>
              ))}
              <GuestModeButton
                label="Try Guest Demo"
                className="rounded-lg px-3 py-2.5 text-left text-violet-300 hover:bg-violet-500/10 w-full justify-start"
                onAfterNavigate={() => setMobileOpen(false)}
              />
              <button
                type="button"
                onClick={() => { navigate('/login'); setMobileOpen(false); }}
                className="rounded-lg px-3 py-2.5 text-left text-slate-300 hover:bg-violet-500/10"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => { navigate('/signup'); setMobileOpen(false); }}
                className="rounded-lg px-3 py-2.5 text-left text-slate-300 hover:bg-violet-500/10"
              >
                Sign up
              </button>
              <button type="button" onClick={goToWaitlist} className="btn-primary mt-2 w-full">
                Join Waitlist
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
