import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Bookmark, Gem, MessageCircle, Share2, ThumbsUp } from "lucide-react";
import React from "react";

interface ContentCardProps {
  avatarFallback: string;
  userName: string;
  contentType: "Blog" | "Video";
  heading: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  isPremium: boolean;
  image: string;
}

const ContentCard: React.FC<ContentCardProps> = (props) => {
  return (
    <Card className="flex flex-col">
      <CardHeader className="flex-row gap-4 space-y-0">
        <Avatar>
          <AvatarImage src="https://avatar.iran.liara.run/public" />
          <AvatarFallback>{props.avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <h3 className="font-semibold">{props.userName}</h3>
          <Badge variant="secondary" className="w-fit">
            {props.contentType}
          </Badge>
        </div>
        <div className="ml-auto">{props.isPremium && <Gem color="darkblue" />}</div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="relative mb-5 h-48 overflow-hidden rounded-lg ">
          <img
            src={props.image}
            alt="React Projects"
            className=" w-full h-full object-cover"
          />
        </div>
        <h2 className="mb-2 text-xl font-bold">{props.heading}</h2>
        <div className="flex flex-wrap gap-2">
          {props.tags.map((tag) => (
            <Badge variant="outline">#{tag}</Badge>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{props.date}</p>
      </CardContent>
      <CardFooter className="border-t py-3">
        <div className="flex w-full items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2">
            <ThumbsUp className="h-4 w-4" />
            {props.likes}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            {props.comments}
          </Button>
          <Button variant="ghost" size="sm">
            <Bookmark className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
};

export default ContentCard;
