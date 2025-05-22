import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/molecules/card";
import type { RootState } from "@/store/store";
import { useAuth } from "./hooks/useAuth";
import { useOtpVerification } from "./hooks/useOtpVerification";
import { LoginForm } from "./components/LoginForm";
import { OtpVerification } from "./components/OtpVerification";
import { SocialLogin } from "./components/SocialLogin";
import { DemoLoginModal } from "./components/DemoLoginModal";

export default function LoginPage() {
  const [showDemoModal, setShowDemoModal] = useState(false);

  const {
    formData,
    loading,
    signUp,
    showOTP,
    showPassword,
    handleChange,
    handleSubmit,
    setSignUp,
    setShowPassword,
    handleSocialAuth,
    setDemoAccount,
  } = useAuth();

  const otpVerification = useOtpVerification(formData.email);

  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/myFeed");
    }
  }, [isAuthenticated, navigate]);

  const handleDemoLogin = () => {
    setShowDemoModal(true);
  };

  const handleSelectDemoAccount = (type: "normal" | "premium" | "mentor") => {
    setDemoAccount(type);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <Card className="p-8 md:p-12 flex flex-col justify-center">
        <div className="w-full max-w-sm mx-auto space-y-8">
          {showOTP ? (
            <OtpVerification
              handleComplete={otpVerification.handleComplete}
              onResend={otpVerification.onResend}
              canResend={otpVerification.canResend}
              timer={otpVerification.timer}
            />
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

              <LoginForm
                formData={formData}
                loading={loading}
                showPassword={showPassword}
                signUp={signUp}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                setShowPassword={setShowPassword}
                setSignUp={setSignUp}
                onDemoLogin={handleDemoLogin}
              />

              <SocialLogin onSocialAuth={handleSocialAuth} />
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

      <DemoLoginModal
        isOpen={showDemoModal}
        onClose={() => setShowDemoModal(false)}
        onSelectAccount={handleSelectDemoAccount}
      />
    </div>
  );
}
