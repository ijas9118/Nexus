import { Button } from "@/components/atoms/button";
import Mentor from "@/components/icons/Mentor";
import Premium from "@/components/icons/Premium";
import { Card } from "@/components/molecules/card";
import getSocialIcon from "@/utils/getSocialIcons";
import dayjs from "dayjs";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StatDialog from "./StatDialog";

interface ProfileHeaderProps {
  profileUser: {
    _id: string;
    name: string;
    username: string;
    profilePic?: string;
    joinedAt: string;
    role: string;
    bio?: string;
    socials: [{ platform: string; url: string }];
    location: string;
    postsCount: number;
    totalLikes: number;
    totalViews: number;
    skills: string[];
  };
  isFollowing: boolean;
  isConnected: boolean;
  hasSentRequest: boolean;
  onFollowToggle: () => void;
  onConnectionToggle: () => void;
  followStats: {
    connectionsCount: number;
    followersCount: number;
    followingCount: number;
  };
}

export default function ProfileHeader({
  profileUser,
  isFollowing,
  isConnected,
  hasSentRequest,
  onFollowToggle,
  onConnectionToggle,
  followStats,
}: ProfileHeaderProps) {
  const currentUser = useSelector(
    (state: any) => state.auth.user?.username || "",
  );
  const navigate = useNavigate();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedStat, setSelectedStat] = useState<
    "followers" | "following" | "connections"
  >("followers");

  if (!profileUser) return <p>Loading profile...</p>;

  const isCurrentUser = profileUser.username === currentUser;

  const handleEditClick = () => {
    navigate("/profile/edit");
  };

  const handleStatClick = (
    statType: "followers" | "following" | "connections",
  ) => {
    setSelectedStat(statType);
    setDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-medium">Profile</h2>
        {isCurrentUser && (
          <Button
            className="text-sm font-medium"
            onClick={() => handleEditClick()}
          >
            Edit profile
          </Button>
        )}
      </div>
      <Card className="p-6 space-y-4">
        <div className="flex justify-start bg-blue-400/40 rounded-lg">
          <img
            alt="Profile picture"
            src={
              profileUser.profilePic ||
              "https://randomuser.me/api/portraits/men/4.jpg"
            }
            className="rounded-lg border outline outline-4 outline-white bg-white dark:outline-black"
            width="80"
          />
        </div>
        <div className="flex flex-col">
          <div className="flex items-start gap-2">
            <h1 className="text-start text-lg font-semibold">
              {profileUser.name}
            </h1>
            {profileUser.role === "premium" && (
              <span className="flex font-semibold items-center gap-1 text-blue-500 dark:text-blue-300 text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-md">
                <Premium size={16} />
                Premium
              </span>
            )}
            {profileUser.role === "mentor" && (
              <span className="flex font-semibold items-center gap-1 text-blue-500 dark:text-blue-300 text-xs bg-blue-100 dark:bg-blue-900 px-2 py-1 rounded-md">
                <Mentor size={16} />
                Mentor
              </span>
            )}
          </div>

          <p className="text-start text-sm text-muted-foreground">
            @{profileUser.username} · Joined on{" "}
            {dayjs(profileUser.joinedAt).format("MMMM, YYYY")}
          </p>
        </div>

        <div className="">
          {profileUser.bio ? (
            <>
              <h3 className="text-xs font-bold text-muted-foreground">Bio</h3>
              <p className="text-sm">{profileUser.bio}</p>
            </>
          ) : (
            isCurrentUser && (
              <Button
                size="sm"
                variant="outline"
                className="w-full"
                onClick={() => navigate("/profile/edit")}
              >
                Add Bio
              </Button>
            )
          )}
        </div>

        {profileUser.skills && profileUser.skills.length > 0 && (
          <div>
            <h3 className="text-xs font-bold text-muted-foreground">Skills</h3>
            <div className="flex flex-wrap gap-2 mt-2">
              {profileUser.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="bg-primary/10 text-primary text-xs font-medium px-3 py-1 rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {profileUser.socials && profileUser.socials.length > 0 && (
          <div className="">
            <h3 className="text-xs font-bold text-muted-foreground">
              Social Links
            </h3>
            <div className="flex gap-4 items-center my-2">
              {profileUser.socials.map((social, idx) => (
                <a
                  key={idx}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:text-blue-500 dark:hover:text-blue-300 transition"
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        )}

        {profileUser.location && (
          <div>
            <h3 className="text-xs font-bold text-muted-foreground">
              Location
            </h3>
            <p className="flex gap-2 items-center text-sm my-2">
              <MapPin size={20} className="text-gray-500 dark:text-gray-400" />
              {profileUser.location}
            </p>
          </div>
        )}

        <div className="space-y-2">
          <h3 className="text-xs font-bold text-muted-foreground">Stats</h3>
          <div className="flex gap-6 text-sm text-muted-foreground">
            <div>
              <strong className="text-primary">{profileUser.postsCount}</strong>{" "}
              Posts
            </div>
            <div>
              <strong className="text-primary">{profileUser.totalLikes}</strong>{" "}
              Likes
            </div>
            <div>
              <strong className="text-primary">{profileUser.totalViews}</strong>{" "}
              Views
            </div>
          </div>
        </div>

        <div className="flex text-center justify-between text-sm text-muted-foreground bg-muted p-3 rounded-md">
          <div
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => handleStatClick("followers")}
          >
            <span className="font-semibold text-foreground text-lg">
              {followStats.followersCount}
            </span>
            <span>Followers</span>
          </div>
          <div
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => handleStatClick("following")}
          >
            <span className="font-semibold text-foreground text-lg">
              {followStats.followingCount}
            </span>
            <span>Following</span>
          </div>
          <div
            className="flex flex-col items-center justify-center cursor-pointer"
            onClick={() => handleStatClick("connections")}
          >
            <span className="font-semibold text-foreground text-lg">
              {followStats.connectionsCount}
            </span>
            <span>Connections</span>
          </div>
        </div>

        {!isCurrentUser && (
          <div className="mt-4 flex gap-2">
            <Button
              className="w-1/2"
              variant="outline"
              onClick={onFollowToggle}
            >
              {isFollowing ? "Unfollow" : "Follow"}
            </Button>
            <Button
              className="w-1/2"
              variant="outline"
              onClick={onConnectionToggle}
              disabled={isConnected}
            >
              {isConnected
                ? "Connected"
                : hasSentRequest
                  ? "Withdraw"
                  : "Connect"}
            </Button>
          </div>
        )}
      </Card>

      <StatDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        statType={selectedStat}
        userId={profileUser._id}
      />
    </div>
  );
}
