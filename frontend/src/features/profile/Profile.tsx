import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  checkConnected,
  checkIsFollowing,
  followUser,
  hasSentConnectionRequest,
  sendConnectionRequest,
  unfollowUser,
  withdrawConnectionRequest,
} from "@/services/user/followService";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { toast } from "sonner";
import ProfileActivity from "./components/ProfileActivity";
import ProfileHeader from "./components/ProfileHeader";
import SquadsList from "./components/SquadsList";
import ProfileService from "@/services/user/profileService";

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
        const data = await ProfileService.getUserProfile(username);
        setProfileUser(data);
        console.log(data);

        if (currentUser !== data?._id) {
          const followingStatus = await checkIsFollowing(currentUser, data._id);
          setIsFollowing(followingStatus);
          const connectionStatus = await hasSentConnectionRequest(data._id);
          setIsConnected(connectionStatus.result);

          const connected = await checkConnected(data._id);
          setIsConnected(connected.result);
        }
      } catch (err: unknown) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUser();

    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "Profile", url: "/profile" },
      ]),
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
      const updatedUser = await ProfileService.getUserProfile(
        username as string,
      );
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
      const updatedUser = await ProfileService.getUserProfile(
        username as string,
      );
      setProfileUser(updatedUser);
    } catch (err: any) {
      console.error("Error updating follow status:", err);
      toast.error("Error", {
        description: err.message,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 h-full space-y-6">
      <div className="grid gap-4 lg:grid-cols-[1fr,0.6fr] h-full">
        <div className="space-y-6 py-8">
          <ProfileActivity />
        </div>
        <div className="space-y-6 px-4 h-full py-8">
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
