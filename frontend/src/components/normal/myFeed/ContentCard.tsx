import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { bookmarkContent } from "@/services/user/bookmarkService";
import { likeContent } from "@/services/user/likeService";
import { Bookmark, Gem, MessageCircle, Share2 } from "lucide-react";
import React, { useState } from "react";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

interface ContentCardProps {
  id: string;
  avatarFallback: string;
  userName: string;
  contentType: string;
  heading: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
  isPremium: boolean;
  image: string;
  isLiked: boolean;
  isBookmarked: boolean;
}

const ContentCard: React.FC<ContentCardProps> = (props) => {
  const [likes, setLikes] = useState<number>(props.likes);
  const [isLiked, setIsLiked] = useState<boolean>(props.isLiked);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(props.isBookmarked);
  const navigate = useNavigate();

  const handleLike = async (id: string) => {
    try {
      setIsLiked((prev) => !prev);
      setLikes(isLiked ? likes - 1 : likes + 1);
      const updatedContent = await likeContent(id);
      if (!updatedContent || updatedContent.likeCount === undefined) {
        setLikes(isLiked ? likes + 1 : likes - 1);
      }
    } catch (error) {
      setIsLiked((prev) => !prev);
      console.error("Failed to like content", error);
    }
  };

  const handleBookmark = async (id: string) => {
    try {
      const result = await bookmarkContent(id);
      setIsBookmarked(result.status);
    } catch (error) {
      console.error("Failed to like content", error);
    }
  };

  const handleCardClick = (id: string) => {
    navigate(`/content/${id}`);
  };

  return (
    <Card className="flex flex-col" onClick={() => handleCardClick(props.id)}>
      <CardHeader className="flex-row gap-4 space-y-0 items-center">
        <Avatar>
          <AvatarImage src="https://avatar.iran.liara.run/public" />
          <AvatarFallback>{props.avatarFallback}</AvatarFallback>
        </Avatar>
        <div className="w-full flex justify-between items-center">
          <h3 className="font-semibold">{props.userName}</h3>
          <Badge variant="secondary" className="w-fit">
            {props.contentType}
          </Badge>
        </div>
        <div className="ml-auto">{props.isPremium && <Gem />}</div>
      </CardHeader>
      <CardContent className="flex-1">
        <div className="relative mb-5 h-40 overflow-hidden rounded-lg">
          <img
            src={props.image}
            alt="React Projects"
            className=" w-full h-full object-cover"
          />
        </div>
        <h2 className="mb-2 text-xl font-bold">{props.heading}</h2>
        <div className="flex flex-wrap gap-2">
          {props.tags.map((tag, index) => (
            <Badge key={index} variant="outline">
              # {tag}
            </Badge>
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{props.date}</p>
      </CardContent>
      <CardFooter className="border-t py-3">
        <div className="flex w-full items-center justify-around">
          <Button
            variant="ghost"
            size="sm"
            className="gap-2"
            onClick={() => handleLike(props.id)}
          >
            {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
            {likes}
          </Button>
          <Button variant="ghost" size="sm" className="gap-2">
            <MessageCircle className="h-4 w-4" />
            {props.comments}
          </Button>
          <Button variant="ghost" size="sm" onClick={() => handleBookmark(props.id)}>
            {isBookmarked ? <Bookmark fill="#007AFF" color="#007AFF" /> : <Bookmark />}
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
