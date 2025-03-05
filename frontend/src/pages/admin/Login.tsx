import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { SubmitHandler, useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { loginAdmin } from "@/services/admin/adminService";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "@/store/slices/authSlice";
import { RootState } from "@/store/store";

type FormFields = {
  email: string;
  password: string;
};

export default function AdminLogin() {
  const dispatch = useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormFields>();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/admin/dashboard");
    }
  }, [isAuthenticated, navigate]);

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      setErrorMessage(null);
      const result = await loginAdmin(data.email, data.password);
      if (result.user) {
        const { user, accessToken } = result;
        dispatch(setCredentials({ user, accessToken }));
      }
      if (result) navigate("/admin/dashboard");
    } catch (error: any) {
      setErrorMessage(
        error.message || "An error occurred. Please try again later.",
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md py-12 px-8 rounded-xl shadow-md border-[0.5px]">
        <h1 className="text-2xl font-bold text-center mb-4">Admin Login</h1>
        <p className="text-sm text-center mb-6">
          Enter your credentials to access the admin panel
        </p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <Label htmlFor="email">Email</Label>
            <Input
              type="email"
              id="email"
              placeholder="admin@example.com"
              className="mt-1"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                  message: "Enter a valid email address",
                },
              })}
            />
            {errors.email && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.email.message}
              </p>
            )}
          </div>
          <Label htmlFor="password">Password</Label>
          <div className="relative mb-4">
            <Input
              type={showPassword ? "text" : "password"}
              id="password"
              placeholder="Enter your password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must have at least 8 characters",
                },
              })}
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
            {errors.password && (
              <p className="text-sm text-rose-500 mt-1">
                {errors.password.message}
              </p>
            )}
          </div>
          {errorMessage && (
            <p className="text-sm text-rose-500 mt-2">{errorMessage}</p>
          )}
          <Button type="submit" className="w-full mt-6">
            Sign in
          </Button>
        </form>
        <div className="mt-4 text-center">
          <a href="#" className="text-sm text-gray-500 hover:underline">
            Forgot your password?
          </a>
        </div>
      </div>
    </div>
  );
}
