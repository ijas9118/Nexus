import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Users } from "lucide-react";

const MentorSquads = ({ mentor, id }: any) => {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Join Squad</CardTitle>
        <CardDescription>
          Learn with {mentor.name} and other mentees
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">
                {
                  ["React Masters", "Backend Experts", "Full Stack Developers"][
                    id % 3
                  ]
                }
              </p>
              <p className="text-sm text-muted-foreground">
                {(id + 1) * 5} members • {(id + 1) * 3} content items
              </p>
            </div>
            <Badge className="bg-amber-500 hover:bg-amber-600">Premium</Badge>
          </div>
          <p className="text-sm">
            {
              [
                "Join this squad to get access to exclusive React content, weekly challenges, and group discussions.",
                "Backend development squad with code reviews, architecture discussions, and performance optimization tips.",
                "Learn full stack development through real-world projects, code reviews, and mentorship.",
              ][id % 3]
            }
          </p>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Users className="h-4 w-4 mr-2" />
          Join Squad
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorSquads;
