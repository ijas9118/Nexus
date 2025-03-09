import { FC } from "react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import { jwtDecode, JwtPayload } from "jwt-decode";
import { googleAuth } from "@/services/user/authService";
// import { login } from "@/store/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface CustomJwtPayload extends JwtPayload {
  name?: string;
  email?: string;
  picture?: string;
}

const GoogleButton: FC = () => {
  const navigate = useNavigate();

  const handleSuccess = async (credentialResponse: CredentialResponse) => {
    try {
      const credentialToken = credentialResponse.credential as string;
      const credentials = jwtDecode<CustomJwtPayload>(credentialToken);

      const userDetails = {
        name: credentials.name,
        email: credentials.email,
        picture: credentials.picture,
      };

      const result = await googleAuth(userDetails);

      if (result.user) {
        // dispatch(
        //   login({
        //     _id: result.user._id,
        //     name: result.user.name,
        //     email: result.user.email,
        //   })
        // );
        navigate("/myFeed");
      }
    } catch (error: any) {
      toast.error("Authentication Failed", {
        description:
          error?.message || "Something went wrong. Please try again.",
      });
    }
  };
  const handleError = () => {
    console.error("Google authentication failed");
  };
  return (
    <GoogleLogin onSuccess={handleSuccess} onError={handleError}></GoogleLogin>
  );
};

export default GoogleButton;
