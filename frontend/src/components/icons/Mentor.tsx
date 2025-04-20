import { FaBolt } from "react-icons/fa";

interface MentorProps {
  className?: string;
  size?: number;
}

const Mentor = ({ className = "", size = 24 }: MentorProps) => {
  return (
    <div>
      <FaBolt
        size={size}
        className={`fill-amber-400 stroke-amber-400 dark:fill-amber-300 dark:stroke-amber-300 ${className}`}
      />
    </div>
  );
};

export default Mentor;
