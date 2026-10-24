import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import type { ReactNode } from 'react';
import type { Transition } from 'framer-motion';

/** Subtle editorial reveal — disabled for visitors who ask for less motion. */
interface RevealProps {
  children?: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}

export default function Reveal({ children, delay = 0, y = 22, className = '' }: RevealProps) {
  const reduceMotion = useReducedMotion();

  const props = useMemo(
    () =>
      reduceMotion
        ? { initial: false }
        : ({
            initial: { opacity: 0, y },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.15 },
            transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
          } as Transition),
    [delay, reduceMotion, y]
  );

  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  );
}