import React, { useState, useEffect } from "react";
import {
  CalendarDays,
  CreditCard,
  AlertTriangle,
  Sparkles,
  Flame,
  Zap,
  ChevronRight,
  Check,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Button } from "@/components/atoms/button";
import { Progress } from "@/components/molecules/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/atoms/alert";
import { Badge } from "@/components/atoms/badge";
import { Separator } from "@/components/atoms/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/organisms/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";

// Mock user data - in a real app, this would come from your API
const mockUserData = {
  name: "Alex Johnson",
  email: "alex@example.com",
  avatarUrl: "/api/placeholder/100/100",
  currentPlan: "Spark",
  startDate: "2024-12-15",
  endDate: "2025-05-15",
  paymentMethod: "Visa ending in 4242",
};

// Plans data
const plans = [
  {
    id: "spark",
    name: "Spark",
    icon: Sparkles,
    duration: "Monthly",
    price: "$9.99",
    pricePerMonth: "$9.99",
    features: [
      "Access to premium articles",
      "Comment on posts",
      "Bookmark favorites",
      "Monthly newsletter",
    ],
    popular: false,
    color: "text-blue-500",
  },
  {
    id: "flame",
    name: "Flame",
    icon: Flame,
    duration: "6 Months",
    price: "$49.99",
    pricePerMonth: "$8.33",
    features: [
      "All Spark features",
      "Ad-free reading experience",
      "Access to exclusive webinars",
      "Early access to new features",
    ],
    popular: true,
    color: "text-orange-500",
  },
  {
    id: "fire",
    name: "Fire",
    icon: Zap,
    duration: "12 Months",
    price: "$89.99",
    pricePerMonth: "$7.50",
    features: [
      "All Flame features",
      "Download articles for offline",
      "Priority customer support",
      "Access to archive content",
      "Custom reading lists",
    ],
    popular: false,
    color: "text-red-500",
  },
];

// Helper functions
const formatDate = (dateString) => {
  const options = { year: "numeric", month: "long", day: "numeric" };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

const calculateDaysRemaining = (endDate) => {
  const end = new Date(endDate);
  const today = new Date();
  const diffTime = end - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const PlanCard = ({ plan, isCurrentPlan, onSelect, isSelected }) => {
  const IconComponent = plan.icon;

  return (
    <Card
      className={`border-2 relative ${isSelected ? "border-primary" : "border-border"} ${isCurrentPlan ? "bg-muted/50" : ""}`}
    >
      {plan.popular && (
        <Badge className="absolute top-0 right-0 translate-x-1/3 -translate-y-1/3 bg-primary">
          Popular
        </Badge>
      )}

      <CardHeader>
        <div className="flex items-center mb-2">
          <IconComponent className={`mr-2 h-5 w-5 ${plan.color}`} />
          <CardTitle>{plan.name}</CardTitle>
        </div>
        <CardDescription>{plan.duration}</CardDescription>
        <div className="mt-2">
          <span className="text-3xl font-bold">{plan.price}</span>
          <span className="text-muted-foreground ml-1 text-sm">
            ({plan.pricePerMonth}/mo)
          </span>
        </div>
      </CardHeader>

      <CardContent>
        <ul className="space-y-2">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start">
              <Check className="h-5 w-5 text-primary mr-2 flex-shrink-0 mt-0.5" />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter>
        <Button
          className="w-full"
          variant={isCurrentPlan ? "outline" : "default"}
          disabled={isCurrentPlan}
          onClick={() => onSelect(plan)}
        >
          {isCurrentPlan ? "Current Plan" : "Select Plan"}
        </Button>
      </CardFooter>
    </Card>
  );
};

const PremiumDashboard = () => {
  const [user, setUser] = useState(mockUserData);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState(0);
  const [subscriptionProgress, setSubscriptionProgress] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      const days = calculateDaysRemaining(user.endDate);
      setDaysRemaining(days);

      // Calculate progress based on total subscription length (assuming 6 months for Spark)
      const startDate = new Date(user.startDate);
      const endDate = new Date(user.endDate);
      const today = new Date();

      const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);
      const daysElapsed = (today - startDate) / (1000 * 60 * 60 * 24);
      const progress = Math.min(
        100,
        Math.max(0, (daysElapsed / totalDays) * 100),
      );

      setSubscriptionProgress(progress);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, [user]);

  const currentPlanDetails = plans.find(
    (p) => p.id.toLowerCase() === user.currentPlan.toLowerCase(),
  );

  const handleUpgrade = (plan) => {
    setSelectedPlan(plan);
    setUpgradeDialogOpen(true);
  };

  const confirmUpgrade = () => {
    // In a real app, you would call your API to process the upgrade
    setUser({
      ...user,
      currentPlan: selectedPlan.name,
      // Update end date based on new plan duration
      endDate:
        selectedPlan.id === "spark"
          ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
              .toISOString()
              .split("T")[0]
          : selectedPlan.id === "flame"
            ? new Date(Date.now() + 180 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0]
            : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
                .toISOString()
                .split("T")[0],
    });

    setUpgradeDialogOpen(false);
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Premium Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your premium blog subscription
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex items-center">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="h-10 w-10 rounded-full mr-3"
          />
          <div>
            <p className="font-medium">{user.name}</p>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Current Subscription Card */}
        <Card className="col-span-full md:col-span-1">
          <CardHeader>
            <CardTitle>Current Subscription</CardTitle>
            <CardDescription>Details about your subscription</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {daysRemaining <= 34 && (
              <Alert variant="destructive" className="mb-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Expiring Soon!</AlertTitle>
                <AlertDescription>
                  Your subscription expires in {daysRemaining} days. Renew now
                  to avoid interruption.
                </AlertDescription>
              </Alert>
            )}

            <div className="flex items-center">
              {currentPlanDetails && (
                <currentPlanDetails.icon
                  className={`mr-2 h-6 w-6 ${currentPlanDetails.color}`}
                />
              )}
              <span className="text-xl font-medium">
                {user.currentPlan} Plan
              </span>
              <Badge className="ml-auto">{currentPlanDetails?.duration}</Badge>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Subscription Progress</span>
                <span>{Math.round(subscriptionProgress)}%</span>
              </div>
              <Progress value={subscriptionProgress} />
            </div>

            <div className="space-y-2 pt-2">
              <div className="flex items-center">
                <CalendarDays className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  Renewal Date:{" "}
                  <span className="font-medium">
                    {formatDate(user.endDate)}
                  </span>
                </span>
              </div>
              <div className="flex items-center">
                <CreditCard className="h-4 w-4 mr-2 text-muted-foreground" />
                <span className="text-sm">
                  Payment Method:{" "}
                  <span className="font-medium">{user.paymentMethod}</span>
                </span>
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setUpgradeDialogOpen(true)}
            >
              Upgrade Subscription
            </Button>
          </CardFooter>
        </Card>

        {/* Benefits Card */}
        <Card className="col-span-full md:col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle>Your Premium Benefits</CardTitle>
            <CardDescription>
              What's included in your {user.currentPlan} plan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              {currentPlanDetails?.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="mr-3 mt-0.5">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">{feature}</p>
                  </div>
                </div>
              ))}
            </div>

            {currentPlanDetails?.id !== "fire" && (
              <div className="mt-6 bg-muted/50 rounded-lg p-4">
                <div className="flex items-center mb-2">
                  <Sparkles className="h-5 w-5 mr-2 text-primary" />
                  <h4 className="font-medium">Upgrade for more benefits</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  Upgrade to a higher tier plan to unlock additional premium
                  features and save money.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setUpgradeDialogOpen(true)}
                >
                  View Upgrade Options <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Usage Stats - You could add usage statistics here */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Subscription Usage</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Articles Read
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">127 / 300</div>
              <Progress value={42} className="mt-2" />
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Comments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">34</div>
              <div className="text-xs text-muted-foreground mt-2">
                +12% from last month
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Downloads
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">18</div>
              <div className="text-xs text-muted-foreground mt-2">
                Unlimited with current plan
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Days Remaining
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{daysRemaining}</div>
              <div className="text-xs text-muted-foreground mt-2">
                Until {formatDate(user.endDate)}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Upgrade Plan Dialog */}
      <Dialog open={upgradeDialogOpen} onOpenChange={setUpgradeDialogOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>Upgrade Your Subscription</DialogTitle>
            <DialogDescription>
              Choose the plan that works best for you. All plans include full
              access to premium content.
            </DialogDescription>
          </DialogHeader>

          <Tabs defaultValue="plans" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="plans">Plans Comparison</TabsTrigger>
              <TabsTrigger value="features">Feature Details</TabsTrigger>
            </TabsList>

            <TabsContent value="plans">
              <div className="grid md:grid-cols-3 gap-4 mt-4">
                {plans.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    isCurrentPlan={plan.name === user.currentPlan}
                    isSelected={selectedPlan && selectedPlan.id === plan.id}
                    onSelect={setSelectedPlan}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="features">
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">Feature</th>
                      {plans.map((plan) => (
                        <th key={plan.id} className="text-center p-4">
                          <div className="flex flex-col items-center">
                            <plan.icon className={`h-5 w-5 ${plan.color}`} />
                            <span className="mt-1">{plan.name}</span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="p-4">Premium Articles</td>
                      <td className="text-center p-4">
                        <Check className="h-4 w-4 mx-auto text-primary" />
                      </td>
                      <td className="text-center p-4">
                        <Check className="h-4 w-4 mx-auto text-primary" />
                      </td>
                      <td className="text-center p-4">
                        <Check className="h-4 w-4 mx-auto text-primary" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Comment on Posts</td>
                      <td className="text-center p-4">
                        <Check className="h-4 w-4 mx-auto text-primary" />
                      </td>
                      <td className="text-center p-4">
                        <Check className="h-4 w-4 mx-auto text-primary" />
                      </td>
                      <td className="text-center p-4">
                        <Check className="h-4 w-4 mx-auto text-primary" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Ad-free Experience</td>
                      <td className="text-center p-4">-</td>
                      <td className="text-center p-4">
                        <Check className="h-4 w-4 mx-auto text-primary" />
                      </td>
                      <td className="text-center p-4">
                        <Check className="h-4 w-4 mx-auto text-primary" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Exclusive Webinars</td>
                      <td className="text-center p-4">-</td>
                      <td className="text-center p-4">
                        <Check className="h-4 w-4 mx-auto text-primary" />
                      </td>
                      <td className="text-center p-4">
                        <Check className="h-4 w-4 mx-auto text-primary" />
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4">Offline Downloads</td>
                      <td className="text-center p-4">-</td>
                      <td className="text-center p-4">-</td>
                      <td className="text-center p-4">
                        <Check className="h-4 w-4 mx-auto text-primary" />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-4">Archive Access</td>
                      <td className="text-center p-4">-</td>
                      <td className="text-center p-4">-</td>
                      <td className="text-center p-4">
                        <Check className="h-4 w-4 mx-auto text-primary" />
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>

          <Separator className="my-4" />

          <DialogFooter className="flex items-center justify-between flex-row">
            <div>
              {selectedPlan && (
                <div className="text-sm">
                  Selected plan:{" "}
                  <span className="font-semibold">{selectedPlan.name}</span> (
                  {selectedPlan.price})
                </div>
              )}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setUpgradeDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                disabled={
                  !selectedPlan || selectedPlan.name === user.currentPlan
                }
                onClick={confirmUpgrade}
              >
                Confirm Upgrade
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PremiumDashboard;
