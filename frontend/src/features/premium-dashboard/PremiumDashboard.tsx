import { useQuery } from "@tanstack/react-query";
import SubscriptionService from "@/services/subscriptionService";
import ProfileHeader from "./components/ProfileHeader";
import MembershipCard from "./components/MembershipCard";
import StatsCard from "./components/StatsCard";
import UpgradePlans from "./components/UpgradePlans";
import MembershipBenefits from "./components/MembershipBenefits";

export default function PremiumDashboard() {
  const { data: subscription } = useQuery({
    queryKey: ["subscription"],
    queryFn: SubscriptionService.getCurrentSubscription,
  });

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-6">
      <ProfileHeader tier={subscription?.tier as string} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MembershipCard subscription={subscription} />
        <StatsCard />
      </div>
      <UpgradePlans />
      <MembershipBenefits
        tier={subscription?.tier as string}
        benefits={subscription?.planId.highlights || []}
      />
    </div>
  );
}
