import type { Variants } from "framer-motion";

// Shared easing — ease-out-expo feel: snappy start, smooth landing
export const ease = [0.22, 1, 0.36, 1] as const;

// Container for staggered children
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.07, delayChildren: 0.05 },
  },
};

// Stagger child item
export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease },
  },
};

// Reduced-motion safe version of staggerItem (opacity only, no transform)
export const reducedStaggerItem: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
};
