import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, Variants } from "motion/react"

export default function ForbiddenPage() {
  const [mounted, setMounted] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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

  const handleGoBack = () => {
    const previousPath = location.state?.from || "/";
    navigate(previousPath);
  };

  console.log("=========");

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
            scale: [1, 1.2, 1],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full opacity-10 -ml-16 -mb-16"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        <div className="p-8 relative z-10">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate={mounted ? "visible" : "hidden"}
          >
            {/* Lock Icon SVG */}
            <motion.div
              className="mx-auto w-24 h-24 mb-6"
              initial="hidden"
              animate="visible"
            >
              <svg viewBox="0 0 24 24" className="w-full h-full text-pink-500">
                <motion.path
                  d="M19 10h-2V7c0-2.8-2.2-5-5-5S7 4.2 7 7v3H5c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-8c0-1.1-.9-2-2-2z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  variants={pathVariants}
                />
                <motion.path
                  d="M12 16c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z"
                  fill="currentColor"
                  variants={itemVariants}
                />
                <motion.path
                  d="M9 7c0-1.7 1.3-3 3-3s3 1.3 3 3v3H9V7z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  variants={pathVariants}
                />
              </svg>
            </motion.div>

            <motion.h1
              className="text-6xl font-bold text-pink-500 mb-2"
              variants={itemVariants}
            >
              403
            </motion.h1>

            <motion.h2
              className="text-2xl font-semibold text-primary mb-6"
              variants={itemVariants}
            >
              Access Forbidden
            </motion.h2>

            <motion.p
              className="text-muted-foreground mb-8"
              variants={itemVariants}
            >
              Sorry, you don't have permission to access this page. Please
              contact your administrator if you believe this is a mistake.
            </motion.p>

            <motion.div variants={itemVariants}>
              <motion.button
                className="px-6 py-2 bg-primary text-secondary rounded-lg font-medium hover:bg-primary/90 focus:outline-none transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoBack}
              >
                Go Back
              </motion.button>

              <motion.button
                className="ml-4 px-6 py-2 bg-transparent border border-muted-foreground text-muted-foreground rounded-lg font-medium hover:border-muted-foreground/80 transition-colors"
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
