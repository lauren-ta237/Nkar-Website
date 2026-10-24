import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, staggerItem } from "@/lib/motion";

type Props = {
  children: ReactNode;
  className?: string;
};

/**
 * Entrance stagger for a group of tiles. Renders a plain div when the user
 * prefers reduced motion, so nothing animates and nothing shifts.
 * See DESIGN.md section 10.
 */
export function Stagger({
  children,
  className,
  delay = 0,
}: Props & { delay?: number }) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      custom={delay}
      variants={staggerContainer}>
      {children}
    </motion.div>
  );
}

/** A single tile inside a `Stagger`. */
export function StaggerItem({ children, className }: Props) {
  const reduceMotion = useReducedMotion();

  if (reduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div className={className} variants={staggerItem}>
      {children}
    </motion.div>
  );
}
