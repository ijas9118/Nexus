import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useInfiniteQuery } from "@tanstack/react-query";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import ContentService from "@/services/user/contentService";
import ContentCard from "./components/ContentCard";
import FilterComponent from "./components/FilterComponent";
import ContentTypeTab from "./components/ContentTypeTab";

export default function MyFeed() {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "My Feed", url: "/myFeed" },
      ]),
    );
  }, [dispatch]);

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["feedContent"],
      queryFn: ContentService.getAllContent,
      getNextPageParam: (lastPage, allPages) => {
        return lastPage.nextPage ? allPages.length + 1 : undefined;
      },
      initialPageParam: 1,
    });

  const feedContent = data?.pages.flatMap((page) => page.contents) || [];

  const filteredContent = feedContent
    .filter((item: any) =>
      selectedTab === "all" ? true : item.contentType === selectedTab,
    )
    .filter((item: any) =>
      selectedTopics.length === 0
        ? true
        : selectedTopics.some((topic) =>
            item.squad.toLowerCase().includes(topic.toLowerCase()),
          ),
    );

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 200 &&
        hasNextPage &&
        !isFetchingNextPage
      ) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

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

      {status === "error" && (
        <p className="text-center text-red-500 font-medium mt-4">
          Oops! Something went wrong,
        </p>
      )}

      <div className="flex flex-col space-y-8">
        {filteredContent.map((item: any, index) => (
          <ContentCard
            id={item._id}
            key={index}
            avatarFallback={"IA"}
            userName={item.userName}
            contentType={item.contentType}
            heading={item.title}
            date={item.date}
            content={item.content}
            upvoteCount={item.upvoteCount}
            downvoteCount={item.downvoteCount}
            commentCount={item.commentCount}
            squad={item.squad}
            isPremium={item.isPremium}
            image={item.thumbnailUrl}
            isUpvoted={item.isUpvoted}
            isDownvoted={item.isDownvoted}
            isBookmarked={item.isBookmarked}
            username={item.username}
            profilePic={item.profilePic}
            viewCount={item.viewCount}
          />
        ))}
      </div>

      {/* Loader & No More Content Message */}
      <div className="flex justify-center items-center my-6">
        {isFetchingNextPage && (
          <p className="text-muted-foreground font-medium">Loading more...</p>
        )}
        {!hasNextPage && feedContent.length > 0 && (
          <p className="text-muted-foreground font-medium">
            🎉 You're all caught up! Check back later for more awesome content.
          </p>
        )}
      </div>
    </div>
  );
}
