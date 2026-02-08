import { useState, useEffect } from "react";
import { motion, Variants } from "motion/react";
import { useNavigate } from "react-router-dom";

const CancelPage = () => {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.15,
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

  const pathVariants: Variants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  };

  const circleVariants: Variants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        duration: 0.4,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted-foreground/5 to-muted-foreground/15 flex flex-col items-center justify-center p-6">
      {/* Background elements */}
      <motion.div
        className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full opacity-30 blur-3xl"
        animate={{
          scale: [1, 1.2, 1],
          x: [0, 20, 0],
          y: [0, -20, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        className="absolute bottom-1/4 left-1/4 w-48 h-48 bg-purple-500 rounded-full opacity-30 blur-3xl"
        animate={{
          scale: [1, 1.3, 1],
          x: [0, -20, 0],
          y: [0, 20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={mounted ? "visible" : "hidden"}
        className="relative z-10 max-w-xl w-full text-center"
      >
        {/* Cancel Icon */}
        <motion.div className="mx-auto w-24 h-24 mb-8 relative">
          <motion.div
            className="absolute inset-0  rounded-full"
            variants={circleVariants}
          />
          <motion.svg
            viewBox="0 0 24 24"
            className="w-full h-full"
            initial="hidden"
            animate="visible"
          >
            <motion.circle
              cx="12"
              cy="12"
              r="10"
              stroke="#EC4899"
              strokeWidth="1.5"
              fill="none"
              variants={pathVariants}
            />
            <motion.path
              d="M15 9L9 15"
              stroke="#EC4899"
              strokeWidth="1.5"
              strokeLinecap="round"
              variants={pathVariants}
            />
            <motion.path
              d="M9 9L15 15"
              stroke="#EC4899"
              strokeWidth="1.5"
              strokeLinecap="round"
              variants={pathVariants}
            />
          </motion.svg>
        </motion.div>

        {/* Content */}
        <motion.h1
          className="text-4xl font-bold text-primary mb-3"
          variants={itemVariants}
        >
          Payment Canceled
        </motion.h1>

        <motion.div
          className="text-xl text-pink-500 font-medium mb-6"
          variants={itemVariants}
        >
          Your transaction was not completed
        </motion.div>

        <motion.p
          className="text-muted-foreground mb-10 max-w-md mx-auto"
          variants={itemVariants}
        >
          No charges have been made to your account. You can try again whenever
          you're ready or contact our support team if you need assistance.
        </motion.p>

        {/* Action buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          variants={itemVariants}
        >
          <motion.button
            className="px-8 py-3 bg-primary text-secondary rounded-lg font-medium shadow-lg hover:bg-primary/90 focus:outline-none transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/getPremium")}
          >
            Try Again
          </motion.button>

          <motion.button
            className="px-8 py-3 bg-transparent border border-muted-foreground text-muted-foreground rounded-lg font-medium hover:border-muted-foreground/80 transition-colors"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate("/")}
          >
            Return to Home
          </motion.button>
        </motion.div>

        {/* Support information */}
        <motion.div
          className="flex items-center justify-center gap-2 text-muted-foreground"
          variants={itemVariants}
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
          <span>
            Need help? Contact our{" "}
            <span className="text-pink-500 hover:underline cursor-pointer">
              support team
            </span>
          </span>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default CancelPage;
