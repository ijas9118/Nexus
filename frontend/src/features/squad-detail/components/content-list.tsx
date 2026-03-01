import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Eye, Bookmark, Link2, Play } from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { toast } from "sonner";
import type { SquadContent } from "@/types/squad";
import SquadService from "@/services/user/squadService";
import { extractTextFromHtml } from "@/utils/htmlToText";
import Premium from "@/components/icons/Premium";
import { Badge } from "@/components/atoms/badge";
import {
  BiDownvote,
  BiSolidDownvote,
  BiSolidUpvote,
  BiUpvote,
} from "react-icons/bi";
import { useSelector } from "react-redux";
import type { RootState } from "@/store/store";
import PremiumAccessAlert from "@/components/organisms/PremiumAccessAlert";
import { useState } from "react";
import BookmarkService from "@/services/user/bookmarkService";
import { useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { ShareMenu } from "@/components/organisms/share-menu";

export function ContentList({ squadId }: { squadId: string }) {
  const isPremium = useSelector(
    (state: RootState) => state.auth.user?.isPremium,
  );
  const [showAlert, setShowAlert] = useState(false);
  const navigate = useNavigate();

  const {
    data: contents,
    isLoading,
    isError,
    error,
  } = useQuery<SquadContent[], Error>({
    queryKey: ["squadContents", squadId],
    queryFn: () => SquadService.getSquadContents(squadId),
  });

  const queryClient = useQueryClient();

  const bookmarkMutation = useMutation({
    mutationFn: (contentId: string) =>
      BookmarkService.bookmarkContent(contentId),
    onMutate: async (contentId: string) => {
      await queryClient.cancelQueries({ queryKey: ["squadContents", squadId] });

      const previousContents = queryClient.getQueryData<SquadContent[]>([
        "squadContents",
        squadId,
      ]);

      queryClient.setQueryData<SquadContent[]>(
        ["squadContents", squadId],
        (old) =>
          old?.map((content) =>
            content._id === contentId
              ? { ...content, isBookmarked: !content.isBookmarked }
              : content,
          ) || [],
      );

      return { previousContents };
    },
    onError: (_err, _contentId, context) => {
      if (context?.previousContents) {
        queryClient.setQueryData(
          ["squadContents", squadId],
          context.previousContents,
        );
      }
      toast.error("Failed to bookmark. Please try again.");
    },
    onSuccess: (_, contentId, context) => {
      const wasBookmarked = context?.previousContents?.find(
        (c) => c._id === contentId,
      )?.isBookmarked;
      if (wasBookmarked) {
        toast.success("Removed from bookmarks");
      } else {
        toast.success("Added to bookmarks");
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["squadContents", squadId] });
    },
  });

  const handleBookmark = async (id: string) => {
    bookmarkMutation.mutate(id);
  };

  const handleCardClick = (id: string, premium: boolean) => {
    if (premium && !isPremium) {
      setShowAlert(true);
    } else {
      navigate(`/content/${id}`);
    }
  };

  const handleUserClick = (username: string) => {
    navigate(`/profile/${username}`);
  };

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`${window.location.origin}/content/${id}`);
    toast.info("Link copied", {
      description: "The content link has been copied to your clipboard.",
    });
  };

  if (isLoading) {
    return <div className="text-center">Loading content...</div>;
  }

  if (isError) {
    return (
      <div className="text-center text-red-500">
        Error loading content: {error?.message || "Something went wrong"}
      </div>
    );
  }

  if (!contents || contents.length === 0) {
    return <div className="text-center">No content available</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Latest Content</h2>

      <div className="space-y-6">
        {contents.map((content) => (
          <div
            key={content._id}
            className="space-y-4 cursor-pointer"
            onClick={() => handleCardClick(content._id, content.isPremium)}
          >
            <div className="flex gap-4">
              {content.thumbnailUrl && (
                <div className="relative hidden h-[100px] w-[180px] overflow-hidden rounded-lg sm:block">
                  <img
                    src={content.thumbnailUrl || "/placeholder.svg"}
                    alt={content.title}
                    className="object-cover"
                  />
                  {content.contentType === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="h-12 w-12 rounded-full bg-muted/50 p-3">
                        <div className="h-full w-full rounded-full">
                          <Play className="fill-primary stroke-none" />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div
                    className="flex items-center gap-3 w-fit p-2 rounded-lg hover:bg-muted duration-300 transition-all"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserClick(content.authorUsername);
                    }}
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={content.authorProfilePic || "/placeholder.svg"}
                      />
                      <AvatarFallback>
                        {content.authorName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium ">
                        {content.authorName}
                      </span>
                      <span className="text-xs font-serif text-muted-foreground">
                        @{content.authorUsername}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">•</span>
                  <Badge
                    variant="secondary"
                    className="text-muted-foreground capitalize"
                  >
                    {content.contentType}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(content.createdAt), {
                      addSuffix: true,
                    })}
                  </span>
                  {content.isPremium && <Premium />}
                </div>

                <h3 className="font-semibold leading-tight">{content.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {extractTextFromHtml(content.content)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-6">
              <div className="border border-muted flex items-center rounded-lg overflow-hidden gap-2">
                <button className="py-2 px-3">
                  {content.isUpvoted ? (
                    <BiSolidUpvote className="text-emerald-400 dark:text-emerald-500" />
                  ) : (
                    <BiUpvote className="text-muted-foreground" />
                  )}
                </button>
                <div className="text-sm text-muted-foreground">
                  {content.upvoteCount - content.downvoteCount}
                </div>
                <button className="py-2 px-3">
                  {content.isDownvoted ? (
                    <BiSolidDownvote className="text-pink-400 dark:text-pink-500" />
                  ) : (
                    <BiDownvote className="text-muted-foreground" />
                  )}
                </button>
              </div>

              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{content.commentCount}</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {content.viewCount.toLocaleString()}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleBookmark(content._id);
                  }}
                >
                  <Bookmark
                    className={`h-4 w-4 ${content.isBookmarked ? "fill-current" : ""}`}
                  />
                  <span className="sr-only">
                    {content.isBookmarked ? "Remove bookmark" : "Bookmark"}
                  </span>
                </Button>

                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.stopPropagation();
                    copyLink(content._id);
                  }}
                >
                  <Link2 className="h-4 w-4" />
                  <span className="sr-only">Copy link</span>
                </Button>

                <div onClick={(e) => e.stopPropagation()}>
                  <ShareMenu contentId={content._id} title={content.title} />
                </div>
              </div>
            </div>

            <Separator />
          </div>
        ))}
      </div>

      <PremiumAccessAlert open={showAlert} onOpenChange={setShowAlert} />
    </div>
  );
}
