import { useState, useEffect } from "react";
import { motion, Variants } from "motion/react";

export default function NotFoundPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const pulseVariants: Variants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.7, 1, 0.7],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const pathVariants: Variants = {
    hidden: {
      pathLength: 0,
      opacity: 0,
    },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 2,
        ease: "easeInOut",
      },
    },
  };

  const floatingVariants: Variants = {
    float: {
      y: [0, -15, 0],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="h-full bg-gradient-to-b from-muted-foreground/5 to-muted-foreground/15 flex items-center justify-center p-4">
      <motion.div
        className="max-w-lg w-full bg-muted rounded-xl shadow-2xl overflow-hidden relative"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Decorative background elements */}
        <motion.div
          className="absolute top-0 right-0 w-48 h-48 bg-blue-500 rounded-full opacity-10 -mr-16 -mt-16"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, 120, 0],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full opacity-10 -ml-16 -mb-16"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, -60, 0],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
        />

        <div className="p-8 relative z-10">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
          >
            {/* Search Icon SVG */}
            <motion.div
              className="mx-auto w-24 h-24 mb-6"
              variants={floatingVariants}
              animate="float"
            >
              <svg viewBox="0 0 24 24" className="w-full h-full text-pink-500">
                <motion.path
                  d="M15.5 14h-.79l-.28-.27a6.5 6.5 0 0 0 1.48-5.34c-.47-2.78-2.79-5-5.59-5.34a6.505 6.505 0 0 0-7.27 7.27c.34 2.8 2.56 5.12 5.34 5.59a6.5 6.5 0 0 0 5.34-1.48l.27.28v.79l4.25 4.25c.41.41 1.08.41 1.49 0 .41-.41.41-1.08 0-1.49L15.5 14z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  variants={pathVariants}
                  initial="hidden"
                  animate="visible"
                />
                <motion.circle
                  cx="9.5"
                  cy="9.5"
                  r="5.5"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  variants={pathVariants}
                  initial="hidden"
                  animate="visible"
                />
                <motion.path
                  d="M9.5 7v5M7 9.5h5"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.5, duration: 0.5 }}
                />
              </svg>
            </motion.div>

            <motion.h1
              className="text-6xl font-bold text-pink-500 mb-2"
              variants={itemVariants}
            >
              404
            </motion.h1>

            <motion.h2
              className="text-2xl font-semibold text-primary mb-6"
              variants={itemVariants}
            >
              Page Not Found
            </motion.h2>

            <motion.p
              className="text-muted-foreground mb-8"
              variants={itemVariants}
            >
              Oops! We couldn't find the page you're looking for. It might have
              been moved, deleted, or never existed.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center gap-4"
            >
              <motion.button
                className="px-6 py-2 bg-primary text-secondary rounded-lg font-medium hover:bg-primary/90 focus:outline-none transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.history.back()}
              >
                Go Back
              </motion.button>

              <motion.button
                className="px-6 py-2 bg-transparent border border-muted-foreground text-muted-foreground rounded-lg font-medium hover:border-muted-foreground/80 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/")}
              >
                Home
              </motion.button>
            </motion.div>

            {/* Animated pulse element */}
            <motion.div
              className="mt-12 h-1 w-32 bg-pink-500 rounded-full mx-auto opacity-70"
              variants={pulseVariants}
              animate="pulse"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
