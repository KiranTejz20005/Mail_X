import { Link } from 'react-router-dom';
import { Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import { FloatingShape } from './FloatingShape';
import type { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="page-bg relative min-h-screen overflow-hidden"
    >
      <FloatingShape initialX="5%" initialY="8%" delay={0} duration={18} size="420px" color="bg-violet-600" />
      <FloatingShape initialX="70%" initialY="15%" delay={1.2} duration={22} size="360px" color="bg-violet-800" />
      <FloatingShape initialX="40%" initialY="70%" delay={0.6} duration={20} size="280px" color="bg-indigo-700" />

      <nav className="sticky top-0 z-50 border-b border-violet-500/15 bg-mail-bg/70 backdrop-blur-xl">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mx-auto flex h-16 max-w-7xl items-center justify-center px-4 sm:justify-start sm:px-8"
        >
          <Link to="/" className="group flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600 transition-transform duration-300 group-hover:scale-105">
              <Mail className="h-5 w-5 text-white" />
            </div>
            <span className="font-display text-2xl font-bold text-white">MailX</span>
          </Link>
        </motion.div>
      </nav>

      <main className="relative z-10 flex min-h-[calc(100vh-4rem)] items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </motion.div>
  );
}
