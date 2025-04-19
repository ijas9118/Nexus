import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import MenteeRequestList from "./mentee-request-list";
import UpcomingCalls from "./upcoming-calls";

const MenteeRequestsCard = () => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>Recent Mentee Requests</CardTitle>
          <CardDescription>You have 7 pending mentee requests</CardDescription>
        </CardHeader>
        <CardContent>
          <MenteeRequestList limit={5} />
        </CardContent>
      </Card>
      <Card className="col-span-3">
        <CardHeader>
          <CardTitle>Upcoming Calls</CardTitle>
          <CardDescription>Your scheduled mentorship calls</CardDescription>
        </CardHeader>
        <CardContent>
          <UpcomingCalls limit={4} />
        </CardContent>
      </Card>
    </div>
  );
};

export default MenteeRequestsCard;
