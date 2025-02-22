import ProfileActivity from "@/components/normal/profile/ProfileActivity";
import ProfileHeader from "@/components/normal/profile/ProfileHeader";
import SquadsList from "@/components/normal/profile/SquadsList";
import { Toaster } from "@/components/ui/toaster";
import { getUserProfile } from "@/services/user/profileService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  checkIsFollowing,
  followUser,
  unfollowUser,
} from "@/services/user/followService";

export default function ProfilePage() {
  const { username } = useParams();
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

        // Check if the current user follows the profile user
        if (currentUser && data?._id) {
          const followingStatus = await checkIsFollowing(currentUser, data._id);
          setIsFollowing(followingStatus);
        }
      } catch (err: any) {
        console.error("Error fetching profile:", err);
      }
    };

    fetchUser();
  }, [username, currentUser]);

  // Handle follow/unfollow
  const handleFollowToggle = async () => {
    if (!profileUser) return;

    try {
      if (isFollowing) {
        await unfollowUser(profileUser._id);
      } else {
        await followUser(profileUser._id);
      }

      // Toggle the state and refetch user details
      setIsFollowing(!isFollowing);
      const updatedUser = await getUserProfile(username as string);
      setProfileUser(updatedUser);
    } catch (err) {
      console.error("Error updating follow status:", err);
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
            onFollowToggle={handleFollowToggle}
          />
          <SquadsList />
        </div>
      </div>
      <Toaster />
    </div>
  );
}
