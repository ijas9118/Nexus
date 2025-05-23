import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

interface SocialLoginProps {
  onSocialAuth: (provider: "google" | "github") => void;
}

export function SocialLogin({ onSocialAuth }: SocialLoginProps) {
  return (
    <>
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            or continue with
          </span>
        </div>
      </div>

      <div className="flex justify-center items-center gap-6">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="border p-2 rounded shadow-md"
          onClick={() => onSocialAuth("google")}
        >
          <FcGoogle size={28} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="border p-2 rounded shadow-md"
          onClick={() => onSocialAuth("github")}
        >
          <FaGithub size={28} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="border p-2 rounded shadow-md"
        >
          <FaLinkedin size={28} />
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="border p-2 rounded shadow-md"
        >
          <FaXTwitter size={28} />
        </motion.button>
      </div>
    </>
  );
}
