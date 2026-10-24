import { useMemo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/** Subtle editorial reveal — disabled for visitors who ask for less motion. */
export default function Reveal({ children, delay = 0, y = 22, className = '' }) {
  const reduceMotion = useReducedMotion();

  const props = useMemo(
    () =>
      reduceMotion
        ? { initial: false }
        : {
            initial: { opacity: 0, y },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.15 },
            transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }
          },
    [delay, reduceMotion, y]
  );

  return (
    <motion.div className={className} {...props}>
      {children}
    </motion.div>
  );
}