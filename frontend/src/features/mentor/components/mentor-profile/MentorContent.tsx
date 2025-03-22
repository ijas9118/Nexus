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
import { BookOpen } from "lucide-react";

const MentorContent = ({ mentor }: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Blog Posts</CardTitle>
        <CardDescription>Content created by {mentor.name}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {mentor.blogs.map((blog: any, index: number) => (
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
  );
};

export default MentorContent;
