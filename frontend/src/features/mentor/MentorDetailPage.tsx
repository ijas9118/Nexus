import { Badge } from "@/components/atoms/badge";
import MentorService from "@/services/mentorService";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, CalendarDays, CheckCircle, Clock } from "lucide-react";
import { useParams } from "react-router-dom";
import { MentorStats } from "./components/mentor-datail/mentor-stats";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Separator } from "@/components/atoms/separator";
import { Button } from "@/components/atoms/button";
import { BookingForm } from "./components/mentor-datail/booking-form";
import { ReviewsSection } from "./components/mentor-datail/reviews-section";

const MentorDetailPage = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const {
    data: mentorData,
    isError,
    isLoading,
  } = useQuery({
    queryKey: ["mentor-detail"],
    queryFn: () => MentorService.getMentorDetails(mentorId as string),
  });

  if (isLoading) return <p>Loading...</p>;
  if (isError || !mentorData) return <p>Error fetching mentor</p>;

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Hero section */}
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
              <img
                src={mentorData.userId.profilePic || "/placeholder.svg"}
                alt={mentorData.userId.name}
                className="object-cover"
              />
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">{mentorData.userId.name}</h1>
              <div className="flex items-center text-muted-foreground">
                <Briefcase className="w-4 h-4 mr-2" />
                <span>
                  {mentorData.experience.currentRole} at{" "}
                  {mentorData.experience.company}
                </span>
              </div>
              <div className="flex flex-wrap gap-2 mt-3">
                {mentorData.experience.expertiseAreas.map((area) => (
                  <Badge key={area} variant="secondary" className="capitalize">
                    {area.replace("-", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          <MentorStats
            stats={{
              totalMentees: 24,
              sessionsTaken: 78,
              rating: 4.8,
              reviewCount: 42,
            }}
          />

          <Tabs defaultValue="about" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="expertise">Expertise</TabsTrigger>
              <TabsTrigger value="mentorship">Mentorship</TabsTrigger>
            </TabsList>

            <TabsContent value="about" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Bio</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{mentorData.experience.bio}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Experience</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Briefcase className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">
                        {mentorData.experience.currentRole}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {mentorData.experience.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <p>
                      {mentorData.experience.experienceLevel} years of
                      experience
                    </p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="expertise" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Areas of Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mentorData.experience.expertiseAreas.map((area) => (
                      <Badge key={area} className="capitalize px-3 py-1">
                        {area.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Technologies</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {mentorData.experience.technologies.map((tech) => (
                      <div key={tech} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="capitalize">{tech}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="mentorship" className="space-y-4 mt-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mentorship Approach</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{mentorData.mentorshipDetails.motivation}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Target Audience</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {mentorData.mentorshipDetails.targetAudiences.map(
                      (audience) => (
                        <Badge
                          key={audience}
                          variant="outline"
                          className="capitalize"
                        >
                          {audience.replace("-", " ")}
                        </Badge>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                  <CardDescription>
                    {mentorData.mentorshipDetails.availabilityType === "weekend"
                      ? "Available on weekends"
                      : "Available on weekdays"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {mentorData.mentorshipDetails.availableTimeSlots.map(
                      (slot) => (
                        <div key={slot} className="flex items-center gap-2">
                          <CalendarDays className="w-4 h-4 text-muted-foreground" />
                          <span>{slot}</span>
                        </div>
                      ),
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <ReviewsSection />
        </div>
        {/* Right column - Booking section */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <Card className="border-2 border-primary/10">
              <CardHeader className="bg-primary/5">
                <CardTitle>Book a Session</CardTitle>
                <CardDescription>
                  Choose a mentorship type and time slot to book a session with{" "}
                  {mentorData.userId.name}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <BookingForm
                  mentorshipTypes={mentorData.mentorshipDetails.mentorshipTypes}
                  availableTimeSlots={
                    mentorData.mentorshipDetails.availableTimeSlots
                  }
                  mentorId={mentorData._id}
                  mentorName={mentorData.userId.name}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Username:</span> @
                  {mentorData.userId.username}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Email:</span>{" "}
                  {mentorData.userId.email}
                </p>
                <Separator className="my-4" />
                <Button variant="outline" className="w-full">
                  Send Message
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDetailPage;
