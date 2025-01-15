import React from "react";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { Button } from "../ui/button";

interface SocialButtonProps {
  variant: "google" | "github";
}

const SocialButton: React.FC<SocialButtonProps> = ({ variant }) => {
  const icons = {
    google: <FcGoogle />,
    github: <FaGithub />,
  };
  return (
    <Button variant="outline" className="w-full">
      {icons[variant]}
      {variant.charAt(0).toUpperCase() + variant.slice(1)}
    </Button>
  );
};

export default SocialButton;
