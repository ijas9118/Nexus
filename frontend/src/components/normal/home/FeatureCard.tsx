import { ReactNode } from "react";

interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  iconColor: string;
  backgroundColor: string;
}

const FeatureCard = ({
  icon,
  title,
  description,
  iconColor,
  backgroundColor,
}: FeatureCardProps) => {
  return (
    <div className="space-y-4">
      <div
        className={`w-12 h-12 rounded-lg ${backgroundColor} flex items-center justify-center`}
      >
        {icon && <div className={`${iconColor} w-6 h-6`}>{icon}</div>}
      </div>
      <h3 className="text-xl font-semibold text-blue-600 dark:text-purple-300/90 ">
        {title}
      </h3>
      <p className="text-gray-600 dark:text-neutral-300 leading-relaxed">
        {description}
      </p>
    </div>
  );
};

export default FeatureCard;
