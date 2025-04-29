import { SparkIcon, FlameIcon, FireIcon } from "@/components/icons/PlanIcons";

export function getPlanLogo(logoKey?: string, className?: string) {
  switch (logoKey) {
    case "spark":
      return <SparkIcon className={className} />;
    case "flame":
      return <FlameIcon className={className} />;
    case "fire":
      return <FireIcon className={className} />;
    default:
      return null; // or return a default icon component with className
  }
}
