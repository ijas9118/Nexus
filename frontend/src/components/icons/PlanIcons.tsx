import { IoSparklesSharp } from "react-icons/io5";
import { BiSolidFlame } from "react-icons/bi";
import { FaFire } from "react-icons/fa";

export const SparkIcon = ({ className }: { className?: string }) => (
  <IoSparklesSharp
    className={className || "h-10 w-10 fill-indigo-400 dark:fill-indigo-500"}
  />
);

export const FlameIcon = ({ className }: { className?: string }) => (
  <BiSolidFlame
    className={className || "h-10 w-10 fill-amber-300 dark:fill-amber-400"}
  />
);

export const FireIcon = ({ className }: { className?: string }) => (
  <FaFire
    className={className || "h-10 w-10 fill-pink-400 dark:fill-pink-500"}
  />
);
