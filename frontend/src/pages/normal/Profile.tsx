import ProfileActivity from "@/components/normal/profile/ProfileActivity";
import ProfileHeader from "@/components/normal/profile/ProfileHeader";
import SquadsList from "@/components/normal/profile/SquadsList";
import { getUserProfile } from "@/services/user/profileService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  checkIsFollowing,
  followUser,
  hasSentConnectionRequest,
  sendConnectionRequest,
  unfollowUser,
  withdrawConnectionRequest,
} from "@/services/user/followService";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { toast } from "sonner";

export default function ProfilePage() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.auth.user?._id);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const data = await getUserProfile(username);
        setProfileUser(data);

        if (currentUser && data?._id) {
          const followingStatus = await checkIsFollowing(currentUser, data._id);
          setIsFollowing(followingStatus);
        }

        if (data?._id) {
          const connectionStatus = await hasSentConnectionRequest(data._id);
          setIsConnected(connectionStatus);
        }
      } catch (err: any) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUser();

    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "Profile", url: "/profile" },
      ])
    );
  }, [username, currentUser, dispatch]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!profileUser) return;

    try {
      if (isFollowing) {
        await unfollowUser(profileUser._id);
        toast.success("Action Successful", {
          description: `You have unfollowed ${profileUser.name}. Hope to see you reconnect soon!`,
        });
      } else {
        await followUser(profileUser._id);
        toast.success("Following!", {
          description: `You're now following ${profileUser.name}. Stay engaged and explore their content!`,
        });
      }

      // Toggle the state and refetch user details
      setIsFollowing(!isFollowing);
      const updatedUser = await getUserProfile(username as string);
      setProfileUser(updatedUser);
    } catch (err: any) {
      console.error("Error updating follow status:", err);
      toast.error("Error", {
        description: err.message,
      });
    }
  };

  const handleConnectionRequest = async () => {
    if (!profileUser) return;

    try {
      if (isConnected) {
        await withdrawConnectionRequest(profileUser._id);
        toast.success("Action Successful", {
          description: `You have unfollowed ${profileUser.name}. Hope to see you reconnect soon!`,
        });
      } else {
        await sendConnectionRequest(profileUser._id);
        toast.success("Request Sent!", {
          description: `You're now following ${profileUser.name}. Stay engaged and explore their content!`,
        });
      }

      // Toggle the state and refetch user details
      setIsConnected(!isConnected);
      const updatedUser = await getUserProfile(username as string);
      setProfileUser(updatedUser);
    } catch (err: any) {
      console.error("Error updating follow status:", err);
      toast.error("Error", {
        description: err.message,
      });
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-6 h-full border-x-[1px] py-8 space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr,0.6fr]">
        <div className="space-y-6">
          <ProfileActivity />
        </div>
        <div className="space-y-6">
          <ProfileHeader
            profileUser={profileUser}
            isFollowing={isFollowing}
            isConnected={isConnected}
            onFollowToggle={handleFollowToggle}
            onConnectionToggle={handleConnectionRequest}
          />
          <SquadsList />
        </div>
      </div>
    </div>
  );
}
