import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { forgotPassword } from "@/services/user/authService";
import { Toaster } from "@/components/ui/toaster";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await forgotPassword(email);

    toast({
      title: "Check your email",
      description:
        "If an account exists with this email, you will receive a password reset link.",
    });

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Card className="w-full max-w-[450px]">
        <CardHeader className="space-y-6">
          <CardTitle className="text-2xl font-bold tracking-tight">
            Forgot Password
          </CardTitle>
          <CardDescription className="text-base">
            Enter your email address and we'll send you a link to reset your password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : <></>}
              {isLoading ? "Sending link..." : "Reset Password"}
            </Button>
            <div className="text-center text-sm">
              Remember your password?{" "}
              <Link to="/login" className="hover:underline font-medium">
                Login
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </div>
  );
}
