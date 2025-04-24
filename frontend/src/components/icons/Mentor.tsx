import { HiBadgeCheck } from "react-icons/hi";

interface MentorProps {
  className?: string;
  size?: number;
}

const Mentor = ({ className = "", size = 24 }: MentorProps) => {
  return (
    <div>
      <HiBadgeCheck
        size={size}
        className={`fill-blue-500 stroke-blue-500 dark:fill-blue-400 dark:stroke-blue-400 ${className}`}
      />
    </div>
  );
};

export default Mentor;
