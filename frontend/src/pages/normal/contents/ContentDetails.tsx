import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getContent } from "@/services/user/contentService";
import { useQuery } from "@tanstack/react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  BookmarkIcon,
  MessageCircleIcon,
  ShareIcon,
  ThumbsUpIcon,
  SendIcon,
  CalendarIcon,
} from "lucide-react";
import CommentSection from "@/components/normal/content/CommentSection";
import RelatedContent from "@/components/normal/content/RelatedContent";
import { Skeleton } from "@/components/ui/skeleton";
import Premium from "@/components/ui/icons/Premium";

export default function ContentDetails() {
  const { id } = useParams<{ id: string }>();
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [newComment, setNewComment] = useState<string>("");

  const {
    data: content,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["content", id],
    queryFn: () => getContent(id as string),
    enabled: !!id,
  });

  useEffect(() => {
    if (content) {
      // Initialize states based on content data
      setIsLiked(content.likes > 0);
    }
  }, [content]);

  const handleLike = () => {
    setIsLiked((prev) => !prev);
    // API call to update like status would go here
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
    // API call to update bookmark status would go here
  };

  const handleSubmitComment = () => {
    if (newComment.trim()) {
      // API call to submit comment would go here
      setNewComment("");
    }
  };

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Premium Badge Skeleton */}
        <div className="mb-6 flex items-center gap-2">
          <Skeleton className="h-6 w-32 rounded-full" />
        </div>

        {/* Post Heading Skeleton */}
        <Skeleton className="h-10 w-3/4 mb-4" />

        {/* User Details & Metadata Skeleton */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-16 rounded-full" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>

        {/* Interaction Stats Skeleton */}
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-24" />
        </div>

        {/* Thumbnail Skeleton */}
        <Skeleton className="w-full h-96 rounded-lg mb-8" />

        {/* Content Body Skeleton */}
        <div className="space-y-4 mb-10">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-2/3" />
        </div>

        {/* Interaction Buttons Skeleton */}
        <div className="flex items-center justify-between py-4 border-y">
          <div className="flex items-center gap-4">
            <Skeleton className="h-8 w-20 rounded-md" />
            <Skeleton className="h-8 w-28 rounded-md" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-8 w-16 rounded-md" />
            <Skeleton className="h-8 w-16 rounded-md" />
          </div>
        </div>

        {/* Comments Section Skeleton */}
        <div className="mt-8">
          <Skeleton className="h-6 w-32 mb-4" />
          <div className="flex gap-3 mb-6">
            <Skeleton className="h-8 w-8 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-16 w-full rounded-md" />
              <Skeleton className="h-8 w-20 ml-auto rounded-md" />
            </div>
          </div>
          <div className="space-y-6">
            {/* Mock comment skeletons */}
            {[...Array(2)].map((_, index) => (
              <div key={index} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-3/4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16 rounded-md" />
                    <Skeleton className="h-6 w-16 rounded-md" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

  if (error || !content)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-destructive">
          Failed to load content. Please try again later.
        </div>
      </div>
    );

  const formattedDate = new Date(content.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl h-screen">
      {/* Premium Badge (if applicable) */}
      {content.isPremium && (
        <div className="mb-4 flex items-center text-sm gap-2 border w-fit px-2 py-2 rounded-lg">
          <Premium />
          <span>Premium Content</span>
        </div>
      )}

      {/* Post Heading */}
      <h1 className="text-3xl md:text-4xl font-bold tracking mb-4">
        {content.title}
      </h1>

      {/* User Details & Metadata */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14">
            <AvatarImage
              src={
                content.author?.profilePic ||
                "https://avatar.iran.liara.run/public"
              }
              alt={content.userName}
            />
            <AvatarFallback>{content.userName?.[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col gap-1">
            <div className="font-medium flex gap-3 items-center">
              {content.userName}
              <Badge variant="secondary">{content.contentType}</Badge>
            </div>
            <div className="text-sm text-muted-foreground flex items-center gap-2">
              <span>
                Posted in{" "}
                <span className="underline underline-offset-1 hover:underline-offset-4 transform duration-150 cursor-pointer">
                  {content.squad.name}
                </span>
              </span>
              <span>•</span>
              <CalendarIcon className="h-3.5 w-3.5" />
              {formattedDate}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button className="h-8 rounded-full w-24" variant="outline">
            Follow
          </Button>
          <Button className="h-8 rounded-full w-24" variant="default">
            Connect
          </Button>
        </div>
      </div>

      {/* Interaction Buttons */}
      <div className="flex items-center justify-between py-3 border-y mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleLike}
          >
            <ThumbsUpIcon
              className={`h-5 w-5 ${isLiked ? "fill-primary text-primary" : ""}`}
            />
            <span>{content.likeCount || 0}</span>
            <span>{isLiked ? "Liked" : "Like"}</span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <MessageCircleIcon className="h-5 w-5" />
            <span>{content.commentCount || 0} </span>
            <span>Comments</span>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
            onClick={handleBookmark}
          >
            <BookmarkIcon
              className={`h-5 w-5 ${isBookmarked ? "fill-primary text-primary" : ""}`}
            />

            <span className="sr-only md:not-sr-only">
              {isBookmarked ? "Saved" : "Save"}
            </span>
          </Button>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <ShareIcon className="h-5 w-5" />
            <span className="sr-only md:not-sr-only">Share</span>
          </Button>
        </div>
      </div>

      {/* Thumbnail */}
      {content.thumbnailUrl && (
        <div className="mb-8">
          <img
            src={content.thumbnailUrl || "/placeholder.svg"}
            alt={content.title}
            className="rounded-lg w-full h-auto max-h-[500px] object-cover"
          />
        </div>
      )}

      {/* Content Body */}
      <div className="prose prose-lg max-w-none mb-10 text-gray-800 leading-relaxed">
        {content.content}
      </div>

      {/* Comment Section */}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Comments</h3>

        {/* New Comment Input */}
        <div className="flex gap-3 mb-6">
          <Avatar className="h-8 w-8">
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2 resize-none"
            />
            <div className="flex justify-end">
              <Button
                size="sm"
                onClick={handleSubmitComment}
                disabled={!newComment.trim()}
              >
                <SendIcon className="h-4 w-4 mr-2" />
                Post
              </Button>
            </div>
          </div>
        </div>

        <CommentSection contentId={id as string} />
      </div>

      {/* More from Author */}
      <div className="mt-16">
        <Separator className="mb-8" />
        <h3 className="text-2xl font-semibold mb-6">
          More from {content.userName}
        </h3>
        <RelatedContent
          authorId={content.author?._id}
          currentContentId={id as string}
        />
      </div>
    </div>
  );
}
