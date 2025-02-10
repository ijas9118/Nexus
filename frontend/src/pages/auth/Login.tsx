import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/hooks/use-toast";
import {
  loginUser,
  registerUser,
  resendOtp,
  verifyOtp,
} from "@/services/user/authService";
import { isValidEmail } from "@/utils/validation";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import GoogleButton from "@/components/auth/GoogleButton";
import { FaGithub } from "react-icons/fa";
import useAuth from "@/hooks/useAuth";

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
  const { toast } = useToast();
  const dispatch = useDispatch();
  const { isAuthenticated, authLoading } = useAuth();

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
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: signUp
          ? "Please fill out your name, email, and password to register."
          : "Please provide both email and password to log in.",
      });
      return;
    }

    if (!isValidEmail(formData.email)) {
      toast({
        variant: "destructive",
        title: "Invalid Email",
        description: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);
    try {
      const result = signUp
        ? await registerUser(formData.name, formData.email, formData.password)
        : await loginUser(formData.email, formData.password);

      if (result.user) {
        dispatch(
          login({
            _id: result.user._id,
            name: result.user.name,
            email: result.user.email,
          })
        );
      }
      if (signUp) {
        setShowOTP(true);
      } else navigate("/myFeed");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Authentication Failed",
        description: error?.message || "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const buttonText = useMemo(
    () => (loading ? "Please wait..." : signUp ? "Register" : "Login"),
    [loading, signUp]
  );

  const handleComplete = async (value: string) => {
    try {
      const result = await verifyOtp(formData.email, value);
      if (result) navigate("/myFeed");
    } catch (error: any) {
      console.log("Error occured: ", error.message);
    }
  };

  const onResend = async () => {
    try {
      await resendOtp(formData.email);
      toast({
        variant: "default",
        title: "OTP Resent",
        description: "A new OTP has been sent to your email.",
      });
      startCountdown();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Failed to Resend OTP",
        description: error?.message || "Something went wrong. Please try again.",
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

  if (authLoading) {
    return (
      <div className="container mx-auto px-8 py-8 flex h-screen justify-center items-center">
        Loading...
      </div>
    );
  }

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
                  <Button onClick={onResend} className="w-full" disabled={!canResend}>
                    {canResend ? "Resend OTP" : `Resend in ${timer}s`}
                  </Button>
                </div>
                <Toaster />
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
                      Log in to continue exploring and learning with professionals.
                    </p>
                  </>
                )}
              </div>
              <div className="space-y-4">
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
                <Toaster />

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

                <div className="flex flex-col gap-2">
                  <GoogleButton />
                  <Button variant="outline">
                    <FaGithub /> Sign in with Github
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      <div className="hidden md:block bg-primary"></div>
    </div>
  );
}
