import SocialButton from "@/components/auth/SocialButton";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginUser, registerUser } from "@/services/authService";
import { EyeIcon, EyeOffIcon, Loader2 } from "lucide-react";
import { useState } from "react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [signUp, setSignUp] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (signUp) {
        // await registerUser(formData.name, formData.email, formData.password);
        alert("Registration successful.");
      } else {
        // await loginUser(formData.email, formData.password);
        alert("User logged in");
      }
    } catch (error) {
      console.log("Error occured", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      <Card className="p-8 md:p-12 flex flex-col justify-center">
        <div className="w-full max-w-sm mx-auto space-y-8">
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
            <div className="grid grid-cols-2 gap-4">
              <SocialButton variant="google" />
              <SocialButton variant="github" />
            </div>

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

            <div className="space-y-4">
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
              <div className="space-y-2">
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
              </div>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleSubmit}
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <Loader2 className="animate-spin" />
                  <span>Please wait...</span>
                </div>
              ) : signUp ? (
                "Register"
              ) : (
                "Login"
              )}
            </Button>

            <p className=" text-sm text-muted-foreground">
              {signUp ? "Have an account?" : "Don't have an account?"}{" "}
              <a
                href="#"
                className="text-primary hover:underline"
                onClick={() => setSignUp((prev) => !prev)}
              >
                {signUp ? "Sign in" : "Register"}
              </a>
            </p>
          </div>
        </div>
      </Card>

      <div className="hidden md:block bg-primary"></div>
    </div>
  );
}
