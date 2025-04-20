import { Sparkles } from "lucide-react";

interface PremiumProps {
  className?: string;
  size?: number;
}

const Premium = ({ className = "", size = 24 }: PremiumProps) => {
  return (
    <div>
      <Sparkles
        size={size}
        className={`fill-amber-400 stroke-amber-400 dark:fill-amber-300 dark:stroke-amber-300 ${className}`}
      />
    </div>
  );
};

export default Premium;
