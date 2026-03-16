import { useQuery } from "@tanstack/react-query";
import { AlertCircle, ArrowLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

import SubscriptionService from "@/services/subscriptionService";
import type { ApiError } from "@/types/error";

import MembershipBenefits from "./components/MembershipBenefits";
import MembershipCard from "./components/MembershipCard";
import ProfileHeader from "./components/ProfileHeader";
import StatsCard from "./components/StatsCard";

export default function PremiumDashboard() {
  const navigator = useNavigate();
  const {
    data: subscription,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["subscription"],
    queryFn: SubscriptionService.getCurrentSubscription,
  });

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        <p className="text-lg font-medium text-orange-700">
          Fetching your premium vibe...
        </p>
        <p className="text-muted-foreground text-sm">
          Hang tight, we're bringing the perks.
        </p>
      </div>
    );
  }

  if (error) {
    const errorData = error as ApiError;
    const isNoSubscription =
      errorData?.statusCode === 404 ||
      errorData?.message === "No active subscription found.";

    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
        <AlertCircle className="h-10 w-10 text-red-500" />
        <p className="text-lg font-medium text-red-600">
          {isNoSubscription
            ? "No Active Subscription"
            : "Something went sideways."}
        </p>
        <p className="text-muted-foreground text-sm max-w-md">
          {isNoSubscription
            ? "Your premium status has expired or was not found. Please resubscribe to continue enjoying premium perks."
            : "Couldn't fetch subscription details. Please try again later."}
        </p>
        {isNoSubscription && (
          <button
            onClick={() => navigator("/getPremium")}
            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
          >
            Go to Subscription Plans
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-6">
      <button
        onClick={() => navigator(-1)}
        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </button>
      <ProfileHeader
        tier={subscription?.tier as string}
        logo={subscription?.planId.logo as string}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {subscription && <MembershipCard subscription={subscription} />}
        <StatsCard />
      </div>
      <MembershipBenefits
        tier={subscription?.tier as string}
        benefits={subscription?.planId.highlights || []}
      />
    </div>
  );
}
