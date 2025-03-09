import { FC } from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";

const GoogleButton: FC = () => {
  const navigate = useNavigate();

  const handleError = () => {
    console.error("Google authentication failed");
  };
  return <Button>Google</Button>;
};

export default GoogleButton;
