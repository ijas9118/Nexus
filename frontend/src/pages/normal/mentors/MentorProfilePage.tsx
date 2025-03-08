import { MENTORS } from "@/components/normal/mentors/constants";
import MentorHeader from "@/components/normal/mentors/mentor-profile/MentorHeader";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Clock, MessageSquare, Star, Users } from "lucide-react";
import { Link, useParams } from "react-router-dom";

const MentorProfilePage = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const id = Number.parseInt(mentorId || "");

  if (isNaN(id)) {
    return <p>Invalid Mentor ID</p>;
  }

  const mentor = MENTORS[id - 1];

  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
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
              <Card>
                <CardHeader>
                  <CardTitle>Biography</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{mentor.bio}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {mentor.expertise.map((skill) => (
                      <div key={skill} className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary"></div>
                        <span>{skill}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Availability</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                    <span>{mentor.availability}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Timezone: Pacific Standard Time (PST)
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="reviews" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Testimonials</CardTitle>
                  <CardDescription>What mentees are saying</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {mentor.testimonials.map((testimonial, index) => (
                    <div
                      key={index}
                      className="border-b pb-6 last:border-0 last:pb-0"
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <Avatar>
                          <AvatarImage
                            src={`/placeholder.svg?text=${testimonial.name.charAt(0)}`}
                          />
                          <AvatarFallback>
                            {testimonial.name.charAt(0)}
                          </AvatarFallback>
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
            </TabsContent>

            <TabsContent value="content" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Blog Posts</CardTitle>
                  <CardDescription>
                    Content created by {mentor.name}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {mentor.blogs.map((blog, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium">{blog.title}</h3>
                          {blog.isPremium && (
                            <Badge className="bg-amber-500 hover:bg-amber-600">
                              Premium
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {blog.description}
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <BookOpen className="h-4 w-4 mr-2" />
                        Read
                      </Button>
                    </div>
                  ))}
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Content
                  </Button>
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book a Session</CardTitle>
              <CardDescription>
                Schedule time with {mentor.name}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mentor.pricing.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">{option.type}</p>
                    <p className="text-sm text-muted-foreground">
                      ${option.price} per session
                    </p>
                  </div>
                  <Link
                    to={`/mentors/${id}/book?type=${encodeURIComponent(option.type)}`}
                  >
                    <Button size="sm">Book</Button>
                  </Link>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Send Message</CardTitle>
              <CardDescription>Have a question before booking?</CardDescription>
            </CardHeader>
            <CardContent>
              <textarea
                className="w-full min-h-[120px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={`Ask ${mentor.name} a question...`}
              ></textarea>
            </CardContent>
            <CardFooter>
              <Button className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
            </CardFooter>
          </Card>

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
                        [
                          "React Masters",
                          "Backend Experts",
                          "Full Stack Developers",
                        ][id % 3]
                      }
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {(id + 1) * 5} members • {(id + 1) * 3} content items
                    </p>
                  </div>
                  <Badge className="bg-amber-500 hover:bg-amber-600">
                    Premium
                  </Badge>
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
        </div>
      </div>
    </div>
  );
};

export default MentorProfilePage;
