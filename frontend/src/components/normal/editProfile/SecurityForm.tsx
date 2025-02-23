import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/hooks/use-toast";
import { updatePassword } from "@/services/user/profileService";
import { Lock, Trash2 } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";

const SecurityForm: FC = () => {
  const user = useSelector((state: any) => state.auth.user);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm({
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });
  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      console.log("Updating Password...", data);
      await updatePassword(data);
      toast({
        variant: "default",
        title: "Success",
        description: "Your password is updated.",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("Failed to update password", error);
      toast({
        variant: "destructive",
        title: "Failed",
        description: error.message,
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-6">
        <h2 className="text-2xl font-semibold">Security</h2>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex-1 overflow-y-auto p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="email">Account email</Label>
            <p className="text-sm text-muted-foreground mb-2">
              The email address associated with your nexus account
            </p>
            <div className="relative">
              <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-10 mt-1"
                id="email"
                type="email"
                defaultValue={user.email}
                disabled
              />
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Change Password</h3>

            <div className="space-y-4 mt-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  placeholder="Enter current password"
                  className="rounded-lg mt-1"
                  {...register("currentPassword", {
                    required: "Current password is required",
                  })}
                />
                {errors.currentPassword && (
                  <p className="text-sm text-pink-600">
                    {errors.currentPassword.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter new password"
                  className="rounded-lg mt-1"
                  {...register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                />
                {errors.newPassword && (
                  <p className="text-sm text-pink-600">{errors.newPassword.message}</p>
                )}
              </div>

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm new password"
                  className="rounded-lg mt-1"
                  {...register("confirmPassword", {
                    validate: (value) =>
                      value === watch("newPassword") || "Passwords do not match",
                  })}
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-pink-600">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>
            </div>

            <Button type="submit" className="w-full mt-6" disabled={loading || !isDirty}>
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>

          <div className="border border-red-500 bg-red-600/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-600">Danger Zone</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Deleting your account will:
              <div className="ml-5 my-3">
                <p>
                  1. Permanently delete your profile, along with your authentication
                  associations.
                </p>
                <p>
                  2. Permanently delete all your content, including your posts, bookmarks,
                  comments, upvotes, etc.
                </p>
                <p>3. Allow your username to become available to anyone.</p>
              </div>
              Important: Deleting your account is unrecoverable and cannot be undone. Feel
              free to contact nexus.app.connect@gmail.com with any questions.
            </p>
            <Button
              variant="destructive"
              className="flex items-center gap-2"
              onClick={() => setLoading(true)}
            >
              <Trash2 className="h-5 w-5" />
              Delete Account
            </Button>
          </div>
        </div>
      </form>
      <Toaster />
    </div>
  );
};

export default SecurityForm;
