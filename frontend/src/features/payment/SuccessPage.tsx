import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { clearUser } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { logout } from "@/services/user/authService";

const SuccessPage = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  

  // Custom hook for logout functionality
  const logoutUser = async () => {
    try {
      const result = await logout();
      if (result.success) {
        dispatch(clearUser());
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      logoutUser();
    }

    return () => {
      window.removeEventListener("popstate", () => {
        window.history.pushState(null, "", window.location.pathname);
      });
    };
  }, [countdown]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.3,
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  const checkmarkVariants = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: "easeInOut",
      },
    },
  };

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      opacity: [0.8, 1, 0.8],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const circleVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-muted-foreground/5 to-muted-foreground/15 flex items-center justify-center p-4">
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
            rotate: [0, 45, 0],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        />

        <motion.div
          className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full opacity-10 -ml-16 -mb-16"
          animate={{
            scale: [1, 1.3, 1],
            rotate: [0, -30, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        />

        <div className="p-8 relative z-10">
          <motion.div
            className="text-center"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Success Icon/Animation */}
            <motion.div className="mx-auto w-32 h-32 mb-8 relative">
              <motion.div
                className="absolute inset-0 bg-green-100 rounded-full"
                variants={circleVariants}
                initial="hidden"
                animate="visible"
              />
              <motion.svg
                viewBox="0 0 50 50"
                className="w-full h-full text-green-500"
              >
                <motion.circle
                  cx="25"
                  cy="25"
                  r="22"
                  stroke="currentColor"
                  strokeWidth="2"
                  fill="none"
                  variants={checkmarkVariants}
                  initial="hidden"
                  animate="visible"
                />
                <motion.path
                  d="M16 25L22 31L34 19"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  variants={checkmarkVariants}
                  initial="hidden"
                  animate="visible"
                />
              </motion.svg>
            </motion.div>

            <motion.h1
              className="text-3xl font-bold text-primary mb-2"
              variants={itemVariants}
            >
              Payment Successful!
            </motion.h1>

            <motion.div
              className="text-lg text-pink-500 font-medium mb-6"
              variants={itemVariants}
            >
              Thank you for upgrading to Premium
            </motion.div>

            <motion.p
              className="text-muted-foreground mb-8"
              variants={itemVariants}
            >
              To activate your premium features, you need to log out and log
              back in.
              <br />
              You will be automatically logged out in{" "}
              <span className="text-pink-500 font-bold">{countdown}</span>{" "}
              seconds.
            </motion.p>

            <motion.div variants={itemVariants}>
              <motion.button
                className="px-6 py-3 bg-primary text-secondary rounded-lg font-medium hover:bg-primary/90 focus:outline-none transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={logoutUser}
              >
                Log Out Now
              </motion.button>
            </motion.div>

            <motion.div
              className="mt-10 text-sm text-muted-foreground"
              variants={itemVariants}
            >
              Your account will be ready with premium features after you log
              back in
            </motion.div>

            {/* Animated pulse element */}
            <motion.div
              className="mt-8 h-1 w-32 bg-pink-500 rounded-full mx-auto opacity-70"
              variants={pulseVariants}
              animate="pulse"
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default SuccessPage;
