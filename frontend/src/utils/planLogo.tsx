import { SparkIcon, FlameIcon, FireIcon } from "@/components/icons/PlanIcons";

export function getPlanLogo(logoKey?: string) {
  switch (logoKey) {
    case "spark":
      return <SparkIcon />;
    case "flame":
      return <FlameIcon />;
    case "fire":
      return <FireIcon />;
    default:
      return null; // or a nice default icon if you want
  }
}
