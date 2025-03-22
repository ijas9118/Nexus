import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link, useParams } from "react-router-dom";
import { MENTORS } from "./components/constants";
import MentorHeader from "./components/mentor-profile/MentorHeader";
import MentorAbout from "./components/mentor-profile/MentorAbout";
import MentorReviews from "./components/mentor-profile/MentorReviews";
import MentorContent from "./components/mentor-profile/MentorContent";
import MentorBooking from "./components/mentor-profile/MentorBooking";
import MentorMessage from "./components/mentor-profile/MentorMessage";
import MentorSquads from "./components/mentor-profile/MentorSquads";

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
