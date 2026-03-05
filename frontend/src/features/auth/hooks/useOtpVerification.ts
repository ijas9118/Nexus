import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { resendOtp, verifyOtp } from "@/services/user/authService";
import { setCredentials } from "@/store/slices/authSlice";

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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Invalid OTP. Please try again.";
      toast.error("Verification Failed", {
        description: errorMessage,
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
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === "string"
            ? error
            : (error as { message?: string })?.message ||
              "Something went wrong. Please try again.";
      toast.error("Failed to Resend OTP", {
        description: errorMessage,
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
