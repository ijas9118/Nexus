import ProfileActivity from "@/components/normal/profile/ProfileActivity";
import ProfileHeader from "@/components/normal/profile/ProfileHeader";
import SquadsList from "@/components/normal/profile/SquadsList";
import { getUserProfile } from "@/services/user/profileService";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ProfilePage() {
  const { username } = useParams();
  const [profileUser, setProfileUser] = useState<any>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!username) return;

    const fetchUser = async () => {
      try {
        const data = await getUserProfile(username);
        setProfileUser(data);
      } catch (err: any) {
        console.error("Error fetching content:", err);
      }
    };

    fetchUser();
  }, [username]);

  return (
    <div className="container mx-auto max-w-4xl px-6 h-full border-x-[1px] py-8 space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr,0.6fr]">
        <div className="space-y-6">
          <ProfileActivity />
        </div>
        <div className="space-y-6">
          <ProfileHeader profileUser={profileUser} />
          <SquadsList />
        </div>
      </div>
    </div>
  );
}
