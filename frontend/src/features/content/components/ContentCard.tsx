import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Bookmark, EyeIcon, MessageCircle } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Premium from "@/components/icons/Premium";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";
import { extractTextFromHtml } from "@/utils/htmlToText";
import {
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi";
import BookmarkService from "@/services/user/bookmarkService";
import PremiumAccessAlert from "@/components/organisms/PremiumAccessAlert";
import { ShareMenu } from "@/components/organisms/share-menu";

interface ContentCardProps {
  id: string;
  avatarFallback: string;
  userName: string;
  contentType: string;
  heading: string;
  date: string;
  upvoteCount: number;
  downvoteCount: number;
  commentCount: number;
  content: string;
  squad: { name: string; _id: string };
  isPremium: boolean;
  image: string;
  isUpvoted: boolean;
  isDownvoted: boolean;
  isBookmarked: boolean;
  username: string;
  profilePic: string;
  viewCount: number;
}

const ContentCard: React.FC<ContentCardProps> = (props) => {
  const [isBookmarked, setIsBookmarked] = useState<boolean>(props.isBookmarked);
  const isPremium = useSelector(
    (state: RootState) => state.auth.user?.isPremium,
  );
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const handleBookmark = async (id: string) => {
    const prevIsBookmarked = isBookmarked;
    const optimisticStatus = !isBookmarked;

    // Optimistically update UI
    setIsBookmarked(optimisticStatus);

    try {
      await BookmarkService.bookmarkContent(id);
    } catch (error) {
      console.error("Failed to bookmark content:", error);
      // Revert UI if request fails
      setIsBookmarked(prevIsBookmarked);
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

  const netScore = props.upvoteCount - props.downvoteCount;

  return (
    <div className="w-full border-b py-6 hover:scale-[101%] transition-all">
      <div className="flex flex-col md:flex-row-reverse gap-6 items-start md:items-center">
        {/* Thumbnail image */}
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

        {/* Content details */}
        <div className="flex-1 flex flex-col w-full justify-between cursor-pointer">
          <div onClick={() => handleCardClick(props.id)}>
            <div
              className="flex items-center gap-3 mb-2 w-fit p-2 rounded-lg hover:bg-muted duration-300 transition-all"
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

            {props.contentType === "blog" && (
              <p className="text-muted-foreground text-sm mb-6">
                {extractTextFromHtml(props.content)}
              </p>
            )}

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <span>{props.date}</span>
              <span>•</span>
              <Badge
                variant="secondary"
                className="text-muted-foreground capitalize"
              >
                {props.contentType}
              </Badge>
            </div>
          </div>

          <div className="flex items-center justify-around md:justify-start gap-4">
            <div
              className="border border-muted flex items-center rounded-lg overflow-hidden gap-2"
              onClick={() => handleCardClick(props.id)}
            >
              <button className="py-2 px-3">
                {props.isUpvoted ? (
                  <BiSolidUpvote className="text-emerald-400 dark:text-emerald-500" />
                ) : (
                  <BiUpvote className="text-muted-foreground" />
                )}
              </button>
              <div className="text-sm text-muted-foreground">{netScore}</div>
              <button className="py-2 px-3">
                {props.isDownvoted ? (
                  <BiSolidDownvote className="text-pink-400 dark:text-pink-500" />
                ) : (
                  <BiDownvote className="text-muted-foreground" />
                )}
              </button>
            </div>
            <div
              className="flex gap-2 items-center px-2"
              onClick={() => handleCardClick(props.id)}
            >
              <MessageCircle className="h-4 w-4" />
              {props.commentCount}
            </div>

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

            <div onClick={(e) => e.stopPropagation()}>
              <ShareMenu contentId={props.id} title={props.heading} />
            </div>
            <div className="flex gap-2 items-center px-2 text-muted-foreground text-sm">
              <EyeIcon className="h-4 w-4" />
              <span>
                {!props.viewCount
                  ? "No views yet"
                  : `${props.viewCount} ${props.viewCount === 1 ? "view" : "views"}`}
              </span>
            </div>
          </div>
        </div>
      </div>

      <PremiumAccessAlert open={showAlert} onOpenChange={setShowAlert} />
    </div>
  );
};

export default ContentCard;
