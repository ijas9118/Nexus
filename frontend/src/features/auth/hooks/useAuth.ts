import type React from "react";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { setCredentials } from "@/store/slices/authSlice";
import {
  loginUser,
  registerUser,
  githubAuth,
  googleAuth,
} from "@/services/user/authService";
import { isValidEmail } from "@/utils/validation";

export interface AuthFormData {
  name: string;
  email: string;
  password: string;
}

export function useAuth() {
  const [formData, setFormData] = useState<AuthFormData>({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const setDemoAccount = (type: "normal" | "premium" | "mentor") => {
    const demoAccounts = {
      normal: { email: "user@example.com", password: "password123" },
      premium: { email: "premium@example.com", password: "premium123" },
      mentor: { email: "mentor@example.com", password: "mentor123" },
    };

    setFormData({
      ...formData,
      email: demoAccounts[type].email,
      password: demoAccounts[type].password,
    });
  };

  const isFormIncomplete = () => {
    return signUp
      ? !formData.name || !formData.email || !formData.password
      : !formData.email || !formData.password;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isFormIncomplete()) {
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

  const handleSocialAuth = async (provider: "google" | "github") => {
    try {
      if (provider === "google") {
        await googleAuth();
      } else if (provider === "github") {
        await githubAuth();
      }
    } catch (error: any) {
      toast.error(`${provider} Authentication Failed`, {
        description:
          error?.message || "Something went wrong. Please try again.",
      });
    }
  };

  return {
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
  };
}
