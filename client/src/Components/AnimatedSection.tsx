import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { fadeUp } from '../lib/motionPresets';

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function AnimatedSection({ children, className = '', delay = 0 }: AnimatedSectionProps) {
  return (
    <motion.div
      className={className}
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-48px' }}
    >
      {children}
    </motion.div>
  );
}
