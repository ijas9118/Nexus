import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { toast } from "sonner";
import ProfileActivity from "./components/ProfileActivity";
import ProfileHeader from "./components/ProfileHeader";
import SquadsList from "./components/SquadsList";
import ProfileService from "@/services/user/profileService";
import FollowService from "@/services/followService";

export default function ProfilePage() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector((state: any) => state.auth.user?._id);
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [hasSentRequest, setHasSentRequest] = useState(false);
  const [stats, setStats] = useState<{
    connectionsCount: number;
    followersCount: number;
    followingCount: number;
  }>({ connectionsCount: 0, followersCount: 0, followingCount: 0 });

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const data = await ProfileService.getUserProfile(username);
        setProfileUser(data);

        const stats = await FollowService.getFollowStats(data._id);
        setStats(stats);

        if (currentUser !== data?._id) {
          // Check if following
          const followingStatus = await FollowService.checkIsFollowing(
            currentUser,
            data._id,
          );
          setIsFollowing(followingStatus);

          // Check if actually connected (mutual connection)
          const connected = await FollowService.checkConnected(data._id);
          setIsConnected(connected.result);

          // Check if we have sent a pending connection request
          if (!connected.result) {
            const sentRequest = await FollowService.hasSentConnectionRequest(
              data._id,
            );
            setHasSentRequest(sentRequest.result);
          }
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
        await FollowService.unfollowUser(profileUser._id);
        setStats((prev) => ({
          ...prev,
          followersCount: prev.followersCount - 1,
        }));
        toast.success("Action Successful", {
          description: `You have unfollowed ${profileUser.name}. Hope to see you reconnect soon!`,
        });
      } else {
        await FollowService.followUser(profileUser._id);
        setStats((prev) => ({
          ...prev,
          followersCount: prev.followersCount + 1,
        }));
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
        // Remove the existing connection
        await FollowService.removeConnection(profileUser._id);
        setIsConnected(false);
        setStats((prev) => ({
          ...prev,
          connectionsCount: prev.connectionsCount - 1,
        }));
        toast.success("Connection Removed", {
          description: `You have removed your connection with ${profileUser.name}.`,
        });
      } else if (hasSentRequest) {
        // Withdraw the pending request
        await FollowService.withdrawConnectionRequest(profileUser._id);
        setHasSentRequest(false);
        toast.success("Request Withdrawn", {
          description: `You have withdrawn your connection request to ${profileUser.name}.`,
        });
      } else {
        // Send new connection request
        await FollowService.sendConnectionRequest(profileUser._id);
        setHasSentRequest(true);
        toast.success("Request Sent!", {
          description: `Connection request sent to ${profileUser.name}. Wait for them to accept.`,
        });
      }

      // Refresh user data
      const updatedUser = await ProfileService.getUserProfile(
        username as string,
      );
      setProfileUser(updatedUser);

      // Recheck connection status if not already removed
      if (!isConnected) {
        const connected = await FollowService.checkConnected(profileUser._id);
        setIsConnected(connected.result);
        if (connected.result) {
          setStats((prev) => ({
            ...prev,
            connectionsCount: prev.connectionsCount + 1,
          }));
        }
      }
    } catch (err: any) {
      console.error("Error updating connection status:", err);
      toast.error("Error", {
        description: err.message || "Failed to update connection request",
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
            hasSentRequest={hasSentRequest}
            onFollowToggle={handleFollowToggle}
            onConnectionToggle={handleConnectionRequest}
            followStats={stats}
          />
          <SquadsList profileUserId={profileUser?._id} />
        </div>
      </div>
    </div>
  );
}
