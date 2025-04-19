import { Button } from "@/components/atoms/button";
import { Card } from "@/components/molecules/card";
import dayjs from "dayjs";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

interface ProfileHeaderProps {
  profileUser: {
    _id: string;
    name: string;
    username: string;
    profilePic?: string;
    joinedAt: string;
    bio?: string;
  };
  isFollowing: boolean;
  isConnected: boolean;
  onFollowToggle: () => void;
  onConnectionToggle: () => void;
}

export default function ProfileHeader({
  profileUser,
  isFollowing,
  isConnected,
  onFollowToggle,
  onConnectionToggle,
}: ProfileHeaderProps) {
  const currentUser = useSelector(
    (state: any) => state.auth.user?.username || "",
  );
  const navigate = useNavigate();

  if (!profileUser) return <p>Loading profile...</p>;

  const isCurrentUser = profileUser.username === currentUser;

  const handleEditClick = () => {
    navigate("/profile/edit");
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
      <Card className="p-6">
        <div className="mb-4 flex justify-start bg-blue-400/40 rounded-lg">
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
        <h1 className="text-start text-2xl font-semibold">
          {profileUser.name}
        </h1>
        <p className="text-start text-sm text-muted-foreground">
          @{profileUser.username} · Joined on{" "}
          {dayjs(profileUser.joinedAt).format("MMMM, YYYY")}
        </p>
        <div className="flex text-center justify-start gap-4 text-sm text-muted-foreground py-4">
          <div>
            <span className="font-semibold text-foreground text-lg">10</span>{" "}
            Followers
          </div>
          <div>
            <span className="font-semibold text-foreground text-lg">0</span>{" "}
            Following
          </div>
          <div>
            <span className="font-semibold text-foreground text-lg">12</span>{" "}
            Connections
          </div>
        </div>
        {profileUser.bio && (
          <div className="mb-3 text-sm">
            <p>{profileUser.bio}</p>
          </div>
        )}
        {isCurrentUser && !profileUser.bio && (
          <Button
            className="w-full"
            variant="outline"
            onClick={() => navigate("/profile/edit")}
          >
            Add bio
          </Button>
        )}
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
            >
              {isConnected ? "Withdraw" : "Connect"}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
