import { FC } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { googleAuth } from "@/services/authService";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";

interface CustomJwtPayload extends JwtPayload {
  name?: string;
  email?: string;
  picture?: string;
}

const GoogleButton: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      let credentialToken = credentialResponse.credential as string;
      const credentials = jwtDecode<CustomJwtPayload>(credentialToken);

      const userDetails = {
        name: credentials.name,
        email: credentials.email,
        picture: credentials.picture,
      };

      const result = await googleAuth(userDetails);
      if (result.user) {
        dispatch(
          login({
            _id: result.user._id,
            name: result.user.name,
            email: result.user.email,
          })
        );
        navigate("/myFeed");
      }
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error?.message || "Something went wrong. Please try again.",
      });
    }
  };
  const handleError = () => {
    console.error("Google authentication failed");
  };
  return <GoogleLogin onSuccess={handleSuccess} onError={handleError}></GoogleLogin>;
};

export default GoogleButton;
