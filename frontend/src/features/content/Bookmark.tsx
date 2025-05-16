import FilterComponent from "@/features/content/components/FilterComponent";
import ContentTypeTab from "@/features/content/components/ContentTypeTab";
import { useState } from "react";
import BookmarkService from "@/services/user/bookmarkService";
import ContentCard from "./components/ContentCard";
import { useQuery } from "@tanstack/react-query";

export default function Bookmark() {
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const {
    data = [],
    error,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["bookmarkedContent"],
    queryFn: BookmarkService.getAllBookmarks,
  });

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8">
      <FilterComponent
        selectedTopics={selectedTopics}
        setSelectedTopics={setSelectedTopics}
      />
      <ContentTypeTab
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
      />

      {isLoading && (
        <p className="text-muted-foreground">Loading bookmarks...</p>
      )}

      {isError && (
        <p className="text-red-500">Error: {(error as Error).message}</p>
      )}

      {!isLoading && !isError && data.length === 0 && (
        <div className="text-center text-muted-foreground mt-12">
          <p className="text-lg font-medium">No bookmarks yet</p>
          <p className="text-sm">Start bookmarking content to see it here.</p>
        </div>
      )}

      <div className="flex flex-col space-y-8">
        {data.map((item: any) => (
          <ContentCard
            id={item._id}
            key={item._id}
            avatarFallback={"IA"}
            profilePic={item.profilePic}
            userName={item.name}
            username={item.username}
            contentType={item.contentType}
            heading={item.title}
            date={item.date}
            squad={item.squad}
            isPremium={item.isPremium}
            image={item.thumbnailUrl}
            isBookmarked={item.isBookmarked}
            upvoteCount={item.upvoteCount}
            downvoteCount={item.downvoteCount}
            commentCount={item.commentCount}
            content={item.content}
            isUpvoted={item.isUpvoted}
            isDownvoted={item.isDownvoted}
            viewCount={item.viewCount}
          />
        ))}
      </div>
    </div>
  );
}
