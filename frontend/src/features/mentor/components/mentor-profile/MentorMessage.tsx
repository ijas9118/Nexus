import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Textarea } from "@/components/atoms/textarea";
import { MessageSquare } from "lucide-react";

const MentorMessage = ({ mentor }: any) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Send Message</CardTitle>
        <CardDescription>Have a question before booking?</CardDescription>
      </CardHeader>
      <CardContent>
        <Textarea
          className="w-full min-h-[120px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder={`Ask ${mentor.name} a question...`}
        />
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <MessageSquare className="h-4 w-4 mr-2" />
          Send Message
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorMessage;
