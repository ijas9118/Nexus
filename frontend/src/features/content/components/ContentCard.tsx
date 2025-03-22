import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { bookmarkContent } from "@/services/user/bookmarkService";
import { likeContent } from "@/services/user/likeService";
import { Bookmark, Share2 } from "lucide-react";
import React, { useState } from "react";
import { FaRegThumbsUp, FaThumbsUp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Premium from "@/components/icons/Premium";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/molecules/alert-dialog";
import CommentModal from "./CommentModal";

interface ContentCardProps {
  id: string;
  avatarFallback: string;
  userName: string;
  contentType: string;
  heading: string;
  date: string;
  likes: number;
  comments: number;
  squad: { name: string; _id: string };
  isPremium: boolean;
  image: string;
  isLiked: boolean;
  isBookmarked: boolean;
  username: string;
  profilePic: string;
}

const ContentCard: React.FC<ContentCardProps> = (props) => {
  const [likes, setLikes] = useState<number>(props.likes);
  const [isLiked, setIsLiked] = useState<boolean>(props.isLiked);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(props.isBookmarked);
  const isPremium = useSelector(
    (state: RootState) => state.auth.user?.isPremium,
  );
  const [showAlert, setShowAlert] = useState(false);
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
    if (props.isPremium && !isPremium) {
      setShowAlert(true);
    } else {
      navigate(`/content/${id}`);
    }
  };

  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  return (
    <div className="w-full border-b py-6 hover:scale-[101%] transition-all">
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="flex-1 flex flex-col justify-between cursor-pointer">
          <div onClick={() => handleCardClick(props.id)}>
            <div
              className="flex items-center gap-3 mb-2"
              onClick={(e) => {
                e.stopPropagation();
                handleUserClick(props.username);
              }}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={props.profilePic} />
                <AvatarFallback>{props.avatarFallback}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <span className="text-sm font-medium ">{props.userName}</span>
                <span className="text-xs font-normam">@{props.username}</span>
              </div>

              {props.isPremium && <Premium />}
            </div>

            <h2 className="text-2xl font-bold">{props.heading}</h2>
            <Badge variant="squad" className="cursor-pointer my-4">
              @{props.squad.name}
            </Badge>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span>{props.date}</span>
              <span>•</span>
              <Badge variant="secondary" className="text-muted-foreground">
                {props.contentType}
              </Badge>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-neutral-600 hover:text-slate-600 dark:text-neutral-400 hover:dark:text-slate-400"
              onClick={() => handleLike(props.id)}
            >
              {isLiked ? (
                <FaThumbsUp className="h-5 w-5" />
              ) : (
                <FaRegThumbsUp className="h-5 w-5" />
              )}
              <span>{likes}</span>
            </Button>

            <CommentModal contentId={props.id} />

            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleBookmark(props.id)}
            >
              {isBookmarked ? (
                <Bookmark fill="gray" color="gray" className="h-5 w-5" />
              ) : (
                <Bookmark className="h-5 w-5" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="text-neutral-600 hover:text-blue-600 dark:text-neutral-400 hover:dark:text-blue-400"
            >
              <Share2 className="h-5 w-5" />
            </Button>
          </div>
        </div>
        <div
          className="md:w-64 flex-shrink-0 cursor-pointer"
          onClick={() => handleCardClick(props.id)}
        >
          <img
            src={props.image}
            alt={props.heading}
            className="w-fit h-fit object-cover rounded-lg"
          />
        </div>
      </div>

      <AlertDialog open={showAlert} onOpenChange={setShowAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>🔒 Premium Content</AlertDialogTitle>
            <AlertDialogDescription>
              This content is exclusive to premium members. Upgrade now to get
              full access!
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowAlert(false)}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate("/pricing")}>
              Upgrade Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ContentCard;
