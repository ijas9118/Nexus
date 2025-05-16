import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import ContentService from "@/services/user/contentService";
import FilterComponent from "./components/FilterComponent";
import ContentTypeTab from "./components/ContentTypeTab";
import ContentCard from "./components/ContentCard";
import { useQuery } from "@tanstack/react-query";

export default function Following() {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "Following", url: "/following" },
      ]),
    );
  }, [dispatch]);

  const {
    data = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["followingContent"],
    queryFn: ContentService.getFollowingUsersContents,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 2,
  });

  console.log(data);

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
        <div className="text-center py-4">
          <p>Loading content...</p>
        </div>
      )}

      {error && (
        <p className="text-red-500 text-center py-4">
          Error: {(error as Error).message}
        </p>
      )}

      {!isLoading && !error && data.length === 0 && (
        <p className="text-center py-4">No content available</p>
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
