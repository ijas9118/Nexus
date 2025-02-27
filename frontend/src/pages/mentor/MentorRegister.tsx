import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MentorService from "@/services/admin/mentorService";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface MentorRegisterProps {
  email: string;
}

const MentorRegister: FC<MentorRegisterProps> = ({ email }) => {
  const [name, setName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      if (!name || !password) {
        toast.error("Error", {
          description: "Please fill in all fields.",
        });
        return;
      }

      await MentorService.completeProfile({ email, name, password });

      toast("Profile Updated", {
        description: "You are now ready to explore.",
      });

      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error) {
      console.error("Error completing profile", error);
      toast.error("Error", {
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  return (
    <Card className="w-full max-w-md shadow-lg rounded-lg">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold">Complete Your Profile</CardTitle>
        <CardDescription>
          Fill in your details to create your mentor account and start making an impact.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" value={email} type="email" disabled />
        </div>
        <div className="grid gap-2">
          <Label>Name</Label>
          <Input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="grid gap-2">
          <Label>Password</Label>
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={handleRegister}>
          Create account
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorRegister;
