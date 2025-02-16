import ProfileActivity from "@/components/normal/profile/ProfileActivity";
import ProfileHeader from "@/components/normal/profile/ProfileHeader";
import SquadsList from "@/components/normal/profile/SquadsList";

export default function ProfilePage() {
  return (
    <div className="container mx-auto max-w-4xl px-6 h-full border-x-[1px] py-8 space-y-8">
      <div className="grid gap-6 lg:grid-cols-[1fr,0.6fr]">
        <div className="space-y-6">
          <ProfileActivity />
        </div>
        <div className="space-y-6">
          <ProfileHeader />
          <SquadsList />
        </div>
      </div>
    </div>
  );
}
