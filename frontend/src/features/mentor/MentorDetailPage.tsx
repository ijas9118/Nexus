import { Badge } from "@/components/atoms/badge";
import MentorService from "@/services/mentorService";
import { useQuery } from "@tanstack/react-query";
import { Briefcase, CalendarClock, CheckCircle, Clock } from "lucide-react";
import { Link, useParams } from "react-router-dom";
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
import { ReviewsSection } from "./components/mentor-datail/reviews-section";
import { Button } from "@/components/atoms/button";
import { ExpertiseArea, TargetAudience, Technology } from "@/types/mentor";

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

  console.log(mentorData);

  if (isLoading) return <p>Loading...</p>;
  if (isError || !mentorData) return <p>Error fetching mentor</p>;

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl space-y-20">
      <div className="lg:col-span-2 space-y-8">
        {/* Hero section */}
        <div className="flex flex-col md:flex-row gap-6 items-start">
          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-secondary shadow-lg">
            <img
              src={mentorData.userId.profilePic || "/placeholder.svg"}
              alt={mentorData.userId.name}
              className="object-cover"
            />
          </div>
          <div className="space-y-2 w-full">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <h1 className="text-3xl font-bold">{mentorData.userId.name}</h1>
              <Button className="w-full md:w-auto" asChild>
                <Link to={`/mentors/${mentorId}/book`}>
                  <CalendarClock className="mr-2 h-5 w-5" />
                  Book a Session
                </Link>
              </Button>
            </div>
            <div className="flex items-center text-muted-foreground">
              <Briefcase className="w-4 h-4 mr-2" />
              <span>
                {mentorData.experience.currentRole} at{" "}
                {mentorData.experience.company}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 mt-3">
              {mentorData.experience.expertiseAreas.map(
                (area: ExpertiseArea) => (
                  <Badge
                    key={area._id}
                    variant="secondary"
                    className="capitalize"
                  >
                    {area.name}
                  </Badge>
                ),
              )}
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
                    {mentorData.experience.experienceLevel.label} years of
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
                  {mentorData.experience.expertiseAreas.map(
                    (area: ExpertiseArea) => (
                      <Badge key={area._id} className="capitalize px-3 py-1">
                        {area.name}
                      </Badge>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Technologies</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {mentorData.experience.technologies.map(
                    (tech: Technology) => (
                      <div key={tech._id} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="capitalize">{tech.name}</span>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="mentorship" className="space-y-4 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Target Audience</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mentorData.mentorshipDetails.targetAudiences.map(
                    (audience: TargetAudience) => (
                      <Badge
                        key={audience._id}
                        variant="outline"
                        className="capitalize"
                      >
                        {audience.name}
                      </Badge>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <ReviewsSection />
      </div>
    </div>
  );
};

export default MentorDetailPage;
