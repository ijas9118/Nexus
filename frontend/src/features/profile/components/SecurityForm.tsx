import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updatePassword } from "@/services/user/profileService";
import { Lock, Trash2, Unlink } from "lucide-react";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import PasswordInput from "./PasswordInput";
import { toast } from "sonner";
import { FaGithub } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const handleDisconnect = (provider: "google" | "github") => {
    setLoading(true);
    toast.info(`Disconnecting ${provider} account is not yet implemented.`);
    setLoading(false);
    // Example: await disconnectAccount(provider); then update Redux state
  };

  const onSubmit = async (data: any) => {
    setLoading(true);

    try {
      console.log("Updating Password...", data);
      await updatePassword(data);
      toast.success("Your password is updated.");
    } catch (error: any) {
      console.error("Failed to update password", error);
      toast.error("Failed", {
        description: error.message,
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

      <ScrollArea>
        <div className="px-6 space-y-8">
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
            <h3 className="text-lg font-semibold">Connected Accounts</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Manage your connected social accounts
            </p>
            <div className="space-y-4">
              {/* Google Account */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FcGoogle size={32} />
                  <div>
                    <p className="font-medium">Google</p>
                    <p className="text-sm text-muted-foreground">
                      {user.googleId ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                {user.googleId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect("google")}
                    disabled={loading}
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                )}
              </div>

              {/* GitHub Account */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FaGithub size={32} />
                  <div>
                    <p className="font-medium">GitHub</p>
                    <p className="text-sm text-muted-foreground">
                      {user.githubId ? "Connected" : "Not connected"}
                    </p>
                  </div>
                </div>
                {user.githubId && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect("github")}
                    disabled={loading}
                    type="button"
                  >
                    <Unlink className="h-4 w-4 mr-2" />
                    Disconnect
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 overflow-y-auto px-6 py-8"
        >
          <div className="space-y-10">
            <div>
              <h3 className="text-lg font-semibold">Change Password</h3>

              <div className="space-y-4 mt-4">
                <PasswordInput
                  label="Current Password"
                  id="currentPassword"
                  registerOptions={register("currentPassword", {
                    required: "Current password is required",
                  })}
                  watchValue={errors.currentPassword?.message}
                />

                <PasswordInput
                  label="New Password"
                  id="newPassword"
                  registerOptions={register("newPassword", {
                    required: "New password is required",
                    minLength: {
                      value: 6,
                      message: "Password must be at least 6 characters",
                    },
                  })}
                  watchValue={errors.newPassword?.message}
                />

                <PasswordInput
                  label="Confirm Password"
                  id="confirmPassword"
                  registerOptions={register("confirmPassword", {
                    validate: (value) =>
                      value === watch("newPassword") ||
                      "Passwords do not match",
                  })}
                  watchValue={errors.confirmPassword?.message}
                />
              </div>

              <Button
                type="submit"
                className="w-full mt-6"
                disabled={loading || !isDirty}
              >
                {loading ? "Updating..." : "Update Password"}
              </Button>
            </div>

            <div className="border border-red-500 bg-red-600/10 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-red-600">
                Danger Zone
              </h3>
              <div className="text-sm text-muted-foreground mb-4">
                Deleting your account will:
                <div className="ml-5 my-3">
                  <p>
                    1. Permanently delete your profile, along with your
                    authentication associations.
                  </p>
                  <p>
                    2. Permanently delete all your content, including your
                    posts, bookmarks, comments, upvotes, etc.
                  </p>
                  <p>3. Allow your username to become available to anyone.</p>
                </div>
                Important: Deleting your account is unrecoverable and cannot be
                undone. Feel free to contact nexus.app.connect@gmail.com with
                any questions.
              </div>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={() => setLoading(true)}
                type="submit"
              >
                <Trash2 className="h-5 w-5" />
                Delete Account
              </Button>
            </div>
          </div>
        </form>
      </ScrollArea>
    </div>
  );
};

export default SecurityForm;
