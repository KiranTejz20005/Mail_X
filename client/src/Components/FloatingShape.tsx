import { motion } from 'framer-motion';

interface FloatingShapeProps {
  initialX: string | number;
  initialY: string | number;
  delay: number;
  duration: number;
  size: string | number;
  color: string;
}

export function FloatingShape({
  initialX,
  initialY,
  delay,
  duration,
  size,
  color,
}: FloatingShapeProps) {
  return (
    <motion.div
      className={`pointer-events-none absolute -z-10 rounded-full opacity-[0.12] blur-3xl ${color}`}
      style={{ width: size, height: size, left: initialX, top: initialY }}
      animate={{
        x: [0, 30, -20, 0],
        y: [0, -40, 25, 0],
        scale: [1, 1.1, 0.95, 1],
      }}
      transition={{
        duration,
        ease: 'easeInOut',
        repeat: Infinity,
        delay,
      }}
    />
  );
}
