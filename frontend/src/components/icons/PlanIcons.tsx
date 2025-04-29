import { IoSparklesSharp } from "react-icons/io5";
import { BiSolidFlame } from "react-icons/bi";
import { FaFire } from "react-icons/fa";
import clsx from "clsx";

export const SparkIcon = ({ className }: { className?: string }) => (
  <IoSparklesSharp
    className={clsx(
      "fill-indigo-400 dark:fill-indigo-500 h-10 w-10",
      className,
    )}
  />
);

export const FlameIcon = ({ className }: { className?: string }) => (
  <BiSolidFlame
    className={clsx("fill-amber-300 dark:fill-amber-400 h-10 w-10", className)}
  />
);

export const FireIcon = ({ className }: { className?: string }) => (
  <FaFire
    className={clsx("fill-pink-400 dark:fill-pink-500 h-10 w-10", className)}
  />
);
