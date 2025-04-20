import { Globe, Link } from "lucide-react";
import {
  FaGithub,
  FaInstagramSquare,
  FaLinkedin,
  FaReddit,
  FaStackOverflow,
  FaYoutube,
} from "react-icons/fa";
import { FaSquareThreads, FaSquareXTwitter } from "react-icons/fa6";

type IconProps = {
  size?: number;
  className?: string;
};

const getSocialIcon = (
  platform: string,
  { size = 24, className = "" }: IconProps = {},
) => {
  switch (platform.toLowerCase()) {
    case "github":
      return <FaGithub size={size} className={className} />;
    case "linkedin":
      return <FaLinkedin size={size} className={className} />;
    case "twitter":
      return <FaSquareXTwitter size={size} className={className} />;
    case "instagram":
      return <FaInstagramSquare size={size} className={className} />;
    case "youtube":
      return <FaYoutube size={size} className={className} />;
    case "reddit":
      return <FaReddit size={size} className={className} />;
    case "stackoverflow":
      return <FaStackOverflow size={size} className={className} />;
    case "threads":
      return <FaSquareThreads size={size} className={className} />;
    case "website":
      return <Link size={size} className={className} />;
    default:
      return <Globe size={size} className={className} />;
  }
};

export default getSocialIcon;
