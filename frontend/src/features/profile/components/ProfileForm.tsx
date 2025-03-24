import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import { updateProfile } from "@/services/user/profileService";
import { updateUserProfile } from "@/store/slices/authSlice";
import { Edit, Link, Loader2 } from "lucide-react";
import React, { useRef, useState } from "react";
import { useForm, useFormState } from "react-hook-form";
import {
  FaGithub,
  FaInstagramSquare,
  FaLinkedin,
  FaReddit,
  FaStackOverflow,
  FaYoutube,
} from "react-icons/fa";
import { FaSquareThreads, FaSquareXTwitter } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { useUpdateProfilePic } from "../hooks/useUpdateProfilePic";

const socialLinks = [
  { key: "github", icon: FaGithub, label: "Github" },
  { key: "website", icon: Link, label: "Your Website" },
  { key: "linkedin", icon: FaLinkedin, label: "Linkedin" },
  { key: "instagram", icon: FaInstagramSquare, label: "Instagram" },
  { key: "twitter", icon: FaSquareXTwitter, label: "Twitter" },
  { key: "youtube", icon: FaYoutube, label: "Youtube" },
  { key: "reddit", icon: FaReddit, label: "Reddit" },
  { key: "stackoverflow", icon: FaStackOverflow, label: "StackOverflow" },
  { key: "threads", icon: FaSquareThreads, label: "Threads" },
];

const ProfileForm = () => {
  const user = useSelector((state: any) => state.auth.user);
  const { updateProfilePic, isUpdating } = useUpdateProfilePic();
  const [loading, setLoading] = useState(false);
  const [visibleInputs, setVisibleInputs] = useState<Record<string, boolean>>(
    user.socials?.reduce(
      (acc: Record<string, boolean>, { platform }: { platform: string }) => {
        acc[platform] = true;
        return acc;
      },
      {},
    ) || {},
  );
  const dispatch = useDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { register, handleSubmit, control } = useForm({
    defaultValues: {
      username: user.username || "",
      bio: user.bio || "",
      name: user.name || "",
      socials:
        user.socials?.reduce(
          (
            acc: Record<string, string>,
            { platform, url }: { platform: string; url: string },
          ) => {
            acc[platform] = url;
            return acc;
          },
          {},
        ) || {},
    },
  });
  const { isDirty } = useFormState({ control });

  const handleButtonClick = (key: string) => {
    setVisibleInputs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onSubmit = async (data: any) => {
    setLoading(true);
    const formattedSocials = Object.entries(data.socials || {})
      .filter(([_, url]) => url) // Remove empty values
      .map(([platform, url]) => ({ platform, url }));

    const formattedData = {
      ...data,
      socials: formattedSocials,
    };

    try {
      await updateProfile(formattedData);
      dispatch(updateUserProfile(formattedData));
      toast("Wohoo!", {
        description: "Your profile updated.",
      });
    } catch (error: any) {
      console.error("Profile update failed:", error);
      toast.error("Oops!", {
        description: error.message,
      });
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleImageClick = () => {
    if (!isUpdating) {
      fileInputRef.current?.click(); // Trigger file input click
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const responseData = await updateProfilePic(file);
      if (responseData?.profilePic) {
        dispatch(updateUserProfile({ profilePic: responseData.profilePic }));
      }
    }
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0 p-6">
        <div className="flex items-start justify-between space-x-4">
          <div>
            <h2 className="text-2xl font-semibold">Profile</h2>
            <p className="text-sm text-muted-foreground">
              This is how others will see you.
            </p>
          </div>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden" // Hide the file input
            />
            <div
              className="relative w-20 h-20 cursor-pointer group"
              onClick={handleImageClick}
            >
              <img
                src={user.profilePic}
                alt="Profile"
                className="w-full h-full rounded-full border object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="sm" disabled={isUpdating}>
                  {isUpdating ? <Loader2 className="animate-spin" /> : <Edit />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex-1 overflow-y-auto px-6"
      >
        <div className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
              {...register("username")}
            />
          </div>

          <div>
            <Label htmlFor="name">Full Name</Label>
            <Input
              id="name"
              type="text"
              className="w-full border rounded-lg p-2 mt-1"
              {...register("name")}
            />
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              placeholder="Give a brief about you..."
              {...register("bio")}
            />
          </div>

          <div>
            <Label htmlFor="socials">Social Links</Label>

            <div className="flex gap-2 my-5 justify-center flex-wrap">
              {socialLinks.map(({ key, icon: Icon, label }) => (
                <Button
                  key={key}
                  variant={visibleInputs[key] ? "default" : "outline"}
                  className="flex items-center gap-2"
                  onClick={() => handleButtonClick(key)}
                  type="button"
                >
                  <Icon />
                  {label}
                </Button>
              ))}
            </div>

            <div className="my-6 space-y-2">
              {socialLinks.map(({ key, icon: Icon, label }) =>
                visibleInputs[key] ? (
                  <div key={key} className="relative">
                    <Icon className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      {...register(`socials.${key}`)}
                      type="text"
                      placeholder={`Enter ${label} link`}
                      className="pl-10 w-full"
                    />
                  </div>
                ) : null,
              )}
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!isDirty || loading}
          >
            {loading ? <Loader2 className="animate-spin" /> : ""} Update Profile
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
