import { motion } from "motion/react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

interface SocialLoginProps {
  onSocialAuth: (provider: "google" | "github") => void;
}

export function SocialLogin({ onSocialAuth }: SocialLoginProps) {
  const socialButtonClassName =
    "w-full rounded-lg border border-zinc-200/80 bg-zinc-50/70 px-4 py-3 text-sm font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-100/80 hover:text-zinc-900 dark:border-zinc-700/70 dark:bg-zinc-900/40 dark:text-zinc-200 dark:hover:bg-zinc-800/50 dark:hover:text-zinc-100";

  return (
    <div className="space-y-4">
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

      <div className="flex flex-col gap-3">
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.95 }}
          className={socialButtonClassName}
          onClick={() => onSocialAuth("google")}
        >
          <span className="flex items-center justify-center gap-3">
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </span>
        </motion.button>
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.95 }}
          className={socialButtonClassName}
          onClick={() => onSocialAuth("github")}
        >
          <span className="flex items-center justify-center gap-3">
            <FaGithub size={20} />
            <span>Continue with GitHub</span>
          </span>
        </motion.button>
      </div>
    </div>
  );
}
