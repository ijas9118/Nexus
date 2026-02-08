import type React from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { Input } from "@/components/atoms/input";
import { Button } from "@/components/atoms/button";
import { AuthFormData } from "../hooks/useAuth";
import { motion } from "motion/react";
import { TbHexagonLetterDFilled } from "react-icons/tb";

interface LoginFormProps {
  formData: AuthFormData;
  loading: boolean;
  showPassword: boolean;
  signUp: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent) => void;
  setShowPassword: (show: boolean) => void;
  setSignUp: (signUp: boolean) => void;
  onDemoLogin: () => void;
}

export function LoginForm({
  formData,
  loading,
  showPassword,
  signUp,
  handleChange,
  handleSubmit,
  setShowPassword,
  setSignUp,
  onDemoLogin,
}: LoginFormProps) {
  const navigate = useNavigate();

  const buttonText = loading ? "Please wait..." : signUp ? "Register" : "Login";

  return (
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

      <div className="flex gap-2">
        <Button
          className="flex-1 bg-primary hover:bg-primary/90"
          onClick={handleSubmit}
        >
          {loading && <Loader2 className="animate-spin mr-2" />}
          {buttonText}
        </Button>
        {!signUp && (
          <motion.div
            className="flex justify-center items-center cursor-pointer"
            onClick={onDemoLogin}
            title="Demo Login"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
          >
            <TbHexagonLetterDFilled className="size-8 text-primary fill-[#4361ee] dark:fill-[#7993f8]" />
          </motion.div>
        )}
      </div>

      <p className="text-sm text-muted-foreground">
        {signUp ? "Have an account?" : "Don't have an account?"}{" "}
        <a
          className="text-primary hover:underline cursor-pointer"
          onClick={() => setSignUp(!signUp)}
        >
          {signUp ? "Sign in" : "Register"}
        </a>
      </p>
    </div>
  );
}
