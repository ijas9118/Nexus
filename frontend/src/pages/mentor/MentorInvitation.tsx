import Navbar from "@/components/normal/home/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import MentorService from "@/services/admin/mentorService";
import { Check, Users, Calendar, Clock } from "lucide-react";
import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import MentorRegister from "./MentorRegister";
import { Toaster } from "@/components/ui/toaster";

export default function MentorInvitation() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token") as string;
  const [email, setEmail] = useState<string>("");

  const handleAcceptInvitation = async (token: string) => {
    try {
      const mentorEmail = await MentorService.acceptInvite(token);
      setEmail(mentorEmail);

      toast({
        variant: "default",
        title: "Invitation Accepted",
        description: `Thank you for accepting our request.`,
      });
    } catch (error) {
      console.error("Error accepting invite", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to accept invitation. Please try again.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Main Content */}
      <main className="container mx-auto px-4 flex items-center justify-center min-h-screen">
        {email ? (
          <>
            <MentorRegister email={email} />
          </>
        ) : (
          <div className="mx-auto max-w-3xl space-y-8">
            {/* Invitation Header */}
            <div className="text-center space-y-4">
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
                You're invited to be a Mentor
              </h1>
              <p className="text-muted-foreground">Hey there,</p>
              <p className="text-muted-foreground text-sm md:text-base">
                We're excited to invite you to join our mentorship platform. Your
                expertise and experience would be invaluable to our community of learners.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center">
              <Button
                size="lg"
                className="px-6 md:px-8 w-full sm:w-auto"
                onClick={() => handleAcceptInvitation(token)}
              >
                Accept Invitation
              </Button>
            </div>

            {/* Steps Grid */}
            <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2">
              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Check className="h-5 w-5 text-primary" />
                    Create your profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Set up your mentor profile with your expertise, experience, and
                    availability.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Users className="h-5 w-5 text-primary" />
                    Create Premium Squads
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Post exclusive content for premium members in your custom Squads.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Calendar className="h-5 w-5 text-primary" />
                    Schedule sessions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Set your availability and start scheduling mentoring sessions.
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="space-y-1">
                  <CardTitle className="flex items-center gap-2 text-base md:text-lg">
                    <Clock className="h-5 w-5 text-primary" />
                    Invitation validity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    Your invitation is valid for 7 days. Accept it within this period.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Support Info */}
            <div className="text-center text-sm text-muted-foreground">
              <p>
                If you have any questions or need help, contact us at{" "}
                <a
                  href="mailto:support@example.com"
                  className="text-primary underline-offset-4 hover:underline"
                >
                  nexus.app.connect@gmail.com
                </a>
              </p>
            </div>

            {/* Footer */}
            <footer className="border-t pt-6 text-center text-sm text-muted-foreground">
              <div className="flex flex-wrap justify-center space-x-4">
                <Link to="/privacy" className="hover:underline underline-offset-4">
                  Privacy Policy
                </Link>
                <Link to="/terms" className="hover:underline underline-offset-4">
                  Terms of Service
                </Link>
              </div>
            </footer>
          </div>
        )}
        <Toaster />
      </main>
    </div>
  );
}
