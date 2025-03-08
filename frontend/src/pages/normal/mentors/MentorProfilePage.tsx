import { MENTORS } from "@/components/normal/mentors/constants";
import MentorAbout from "@/components/normal/mentors/mentor-profile/MentorAbout";
import MentorBooking from "@/components/normal/mentors/mentor-profile/MentorBooking";
import MentorContent from "@/components/normal/mentors/mentor-profile/MentorContent";
import MentorHeader from "@/components/normal/mentors/mentor-profile/MentorHeader";
import MentorMessage from "@/components/normal/mentors/mentor-profile/MentorMessage";
import MentorReviews from "@/components/normal/mentors/mentor-profile/MentorReviews";
import MentorSquads from "@/components/normal/mentors/mentor-profile/MentorSquads";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useParams } from "react-router-dom";

const MentorProfilePage = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const id = Number.parseInt(mentorId || "");

  if (isNaN(id)) {
    return <p>Invalid Mentor ID</p>;
  }

  const mentor = MENTORS[id - 1];

  return (
    <div className="container mx-auto py-8 px-4 md:px-8 max-w-7xl">
      <div className="mb-8">
        <Link to="/mentors">
          <Button variant="ghost">← Back to mentors</Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <MentorHeader mentor={mentor} />

          <Tabs defaultValue="about">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="about">About</TabsTrigger>
              <TabsTrigger value="reviews">Reviews</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
            </TabsList>
            <TabsContent value="about" className="space-y-6 mt-6">
              <MentorAbout mentor={mentor} />
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6 mt-6">
              <MentorReviews mentor={mentor} />
            </TabsContent>

            <TabsContent value="content" className="space-y-6 mt-6">
              <MentorContent mentor={mentor} />
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <MentorBooking mentor={mentor} id={id} />

          <MentorMessage mentor={mentor} />

          <MentorSquads mentor={mentor} id={id} />
        </div>
      </div>
    </div>
  );
};

export default MentorProfilePage;
