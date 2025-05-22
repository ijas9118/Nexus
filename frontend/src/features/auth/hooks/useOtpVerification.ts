import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setCredentials } from "@/store/slices/authSlice";
import { verifyOtp, resendOtp } from "@/services/user/authService";

export function useOtpVerification(email: string) {
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleComplete = async (value: string) => {
    try {
      const result = await verifyOtp(email, value);
      const { user, accessToken } = result;
      dispatch(setCredentials({ user, accessToken }));
      navigate("/myFeed");
    } catch (error: any) {
      console.log("Error occurred: ", error.message);
      toast.error("Verification Failed", {
        description: error?.message || "Invalid OTP. Please try again.",
      });
    }
  };

  const onResend = async () => {
    try {
      await resendOtp(email);
      toast("OTP Resent", {
        description: "A new OTP has been sent to your email.",
      });
      startCountdown();
    } catch (error: any) {
      toast.error("Failed to Resend OTP", {
        description:
          error?.message || "Something went wrong. Please try again.",
      });
    }
  };

  const startCountdown = () => {
    setTimer(60); // Reset to 60 seconds
    setCanResend(false);

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setCanResend(true);
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startCountdown();
    return () => {
      // Cleanup timer on unmount
      setTimer(0);
      setCanResend(true);
    };
  }, []);

  return {
    timer,
    canResend,
    handleComplete,
    onResend,
  };
}
