import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateProfile } from "@/services/user/profileService";
import { Link } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  FaGithub,
  FaInstagramSquare,
  FaLinkedin,
  FaReddit,
  FaStackOverflow,
  FaYoutube,
} from "react-icons/fa";
import { FaSquareThreads, FaSquareXTwitter } from "react-icons/fa6";
import { useSelector } from "react-redux";

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
  const [visibleInputs, setVisibleInputs] = useState<Record<string, boolean>>(
    user.socials?.reduce(
      (acc: Record<string, boolean>, { platform }: { platform: string }) => {
        acc[platform] = true;
        return acc;
      },
      {}
    ) || {}
  );

  const { register, control, handleSubmit } = useForm({
    defaultValues: {
      username: user.username || "",
      bio: user.bio || "",
      socials:
        user.socials?.reduce(
          (
            acc: Record<string, string>,
            { platform, url }: { platform: string; url: string }
          ) => {
            acc[platform] = url;
            return acc;
          },
          {}
        ) || {},
    },
  });

  const handleButtonClick = (key: string) => {
    setVisibleInputs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const onSubmit = (data: any) => {
    const formattedSocials = Object.entries(data.socials || {})
      .filter(([_, url]) => url) // Remove empty values
      .map(([platform, url]) => ({ platform, url }));

    const formattedData = {
      ...data,
      socials: formattedSocials,
    };

    updateProfile(formattedData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex-1 p-6">
      <div className="flex items-center justify-between space-x-4">
        <div>
          <h2 className="text-2xl font-semibold">Profile</h2>
          <p className="text-sm text-muted-foreground">
            This is how others will see you.
          </p>
        </div>
        <img src={user.profilePic} alt="Profile" className="w-20 rounded-full border" />
      </div>
      <div className="mt-4">
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          type="text"
          className="w-full border rounded-lg p-2 mt-1"
          {...register("username")}
        />
      </div>
      <div className="mt-4">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" defaultValue={user.email} disabled />
      </div>
      <div className="mt-4">
        <Label htmlFor="bio">Bio</Label>
        <Textarea id="bio" placeholder="Give a breif about you..." {...register("bio")} />
      </div>
      <div className="mt-4">
        <Label htmlFor="socials">Social Links</Label>

        <div className="mt-4 space-y-2">
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
            ) : null
          )}
        </div>

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
      </div>
      <Button type="submit" className="w-full">
        Update Profile
      </Button>
    </form>
  );
};

export default ProfileForm;
