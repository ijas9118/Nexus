import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Star } from "lucide-react";

const MentorReviews = ({ mentor }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Testimonials</CardTitle>
        <CardDescription>What mentees are saying</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {mentor.testimonials.map((testimonial: any, index: number) => (
          <div key={index} className="border-b pb-6 last:border-0 last:pb-0">
            <div className="flex items-center gap-3 mb-3">
              <Avatar>
                <AvatarImage
                  src={`https://avatar.iran.liara.run/username?username=${testimonial.name
                    .split(" ")
                    .map((word: any) => word[0])
                    .join("+")}&background=f4d9b2&color=FF9800`}
                />
                <AvatarFallback>{testimonial.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">
                  {testimonial.role}
                </p>
              </div>
              <div className="flex items-center gap-1 text-amber-500 ml-auto">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
            </div>
            <p className="text-sm">{testimonial.comment}</p>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View All Reviews
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorReviews;
