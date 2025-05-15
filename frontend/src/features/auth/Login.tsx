import { Button } from "@/components/atoms/button";
import { Card } from "@/components/molecules/card";
import { Input } from "@/components/atoms/input";
import {
  githubAuth,
  googleAuth,
  loginUser,
  registerUser,
  resendOtp,
  verifyOtp,
} from "@/services/user/authService";
import { isValidEmail } from "@/utils/validation";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/organisms/input-otp";
import { setCredentials } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";
import { toast } from "sonner";
import { FaGithub, FaLinkedin } from "react-icons/fa";
import { motion } from "motion/react";
import { FaXTwitter } from "react-icons/fa6";
import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const isFormIncomplete = useMemo(() => {
    return signUp
      ? !formData.name || !formData.email || !formData.password
      : !formData.email || !formData.password;
  }, [signUp, formData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormIncomplete) {
      toast.warning("Missing Information", {
        description: signUp
          ? "Please fill out your name, email, and password to register."
          : "Please provide both email and password to log in.",
      });
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast.warning("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const result = signUp
        ? await registerUser(formData.name, formData.email, formData.password)
        : await loginUser(formData.email, formData.password);

      if (result.user) {
        const { user, accessToken } = result;
        dispatch(setCredentials({ user, accessToken }));
      }
      if (signUp) {
        setShowOTP(true);
      } else navigate("/myFeed");
    } catch (error: any) {
      toast.error("Authentication Failed", {
        description:
          error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const buttonText = useMemo(
    () => (loading ? "Please wait..." : signUp ? "Register" : "Login"),
    [loading, signUp],
  );

  const handleComplete = async (value: string) => {
    try {
      const result = await verifyOtp(formData.email, value);
      const { user, accessToken } = result;
      dispatch(setCredentials({ user, accessToken }));
      navigate("/myFeed");
    } catch (error: any) {
      console.log("Error occured: ", error.message);
    }
  };

  const onResend = async () => {
    try {
      await resendOtp(formData.email);
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
    if (showOTP) startCountdown();
  }, [showOTP]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/myFeed");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <Card className="p-8 md:p-12 flex flex-col justify-center">
        <div className="w-full max-w-sm mx-auto space-y-8">
          {showOTP ? (
            <>
              <div className="space-y-4">
                <h1 className="text-3xl font-semibold tracking-tight">
                  Verify Your Email
                </h1>
                <p className="text-muted-foreground">
                  Enter the OTP sent to your email to complete registration
                </p>
                <div className="space-y-8 flex flex-col items-center">
                  <InputOTP maxLength={6} onComplete={handleComplete}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                  <Button
                    onClick={onResend}
                    className="w-full"
                    disabled={!canResend}
                  >
                    {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-2">
                {signUp ? (
                  <>
                    <h1 className="text-3xl font-semibold tracking-tight">
                      Get Started Now
                    </h1>
                    <p className="text-muted-foreground">
                      Enter your details to create your account
                    </p>
                  </>
                ) : (
                  <>
                    <h1 className="text-3xl font-semibold tracking-tight">
                      Welcome Back to Nexus
                    </h1>
                    <p className="text-muted-foreground">
                      Log in to continue exploring and learning with
                      professionals.
                    </p>
                  </>
                )}
              </div>
              <div className="space-y-8">
                <div className="space-y-6">
                  {signUp && (
                    <div className="space-y-2">
                      <Input
                        type="text"
                        name="name"
                        placeholder="Enter your full name"
                        value={formData.name}
                        onChange={handleChange}
                        required={signUp}
                      />
                    </div>
                  )}
                  <div className="space-y-2">
                    <Input
                      type="email"
                      name="email"
                      placeholder="name@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute right-0 top-1/2 -translate-y-1/2"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOffIcon className="h-4 w-4" />
                        ) : (
                          <EyeIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    {!signUp && (
                      <div
                        className="text-right"
                        onClick={() => navigate("/login/forgot-password")}
                      >
                        <a className="text-primary text-sm hover:underline cursor-pointer">
                          Forgot password?
                        </a>
                      </div>
                    )}
                  </div>
                </div>

                <Button
                  className="w-full bg-primary hover:bg-primary/90"
                  onClick={handleSubmit}
                >
                  {loading && <Loader2 className="animate-spin mr-2" />}
                  {buttonText}
                </Button>

                <p className=" text-sm text-muted-foreground">
                  {signUp ? "Have an account?" : "Don't have an account?"}{" "}
                  <a
                    className="text-primary hover:underline"
                    onClick={() => setSignUp((prev) => !prev)}
                  >
                    {signUp ? "Sign in" : "Register"}
                  </a>
                </p>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t dark:border-gray-700" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      or continue with
                    </span>
                  </div>
                </div>

                <div className="flex justify-center items-center gap-6">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="border p-2 rounded shadow-md"
                    onClick={() => googleAuth()}
                  >
                    <FcGoogle size={28} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="border p-2 rounded shadow-md"
                    onClick={() => githubAuth()}
                  >
                    <FaGithub size={28} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="border p-2 rounded shadow-md"
                  >
                    <FaLinkedin size={28} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    className="border p-2 rounded shadow-md"
                  >
                    <FaXTwitter size={28} />
                  </motion.button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>
      <div
        className="bg-gradient-to-br from-zinc-900 via-gray-800 to-black bg-[length:200%_200%] animate-[gradientX_8s_ease_infinite]"
        style={{
          backgroundPosition: "0% 50%",
        }}
      />
    </div>
  );
}
