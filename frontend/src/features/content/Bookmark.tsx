import FilterComponent from "@/features/content/components/FilterComponent";
import ContentTypeTab from "@/features/content/components/ContentTypeTab";
import { useEffect, useState } from "react";
import { getAllBookmarks } from "@/services/user/bookmarkService";
import ContentCard from "./components/ContentCard";

export default function Bookmark() {
  const [feedContent, setFeedContent] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getAllBookmarks();
        console.log(data);
        setFeedContent(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching content:", err);
      }
    };

    fetchContent();
  }, []);

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

      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {feedContent.map((item: any, index) => (
          <ContentCard
            id={item._id}
            key={index}
            avatarFallback={"IA"}
            userName={item.userName}
            contentType={item.contentType}
            heading={item.title}
            date={item.date}
            isPremium={item.isPremium}
            image={item.thumbnailUrl}
            isBookmarked={item.isBookmarked}
            username={item.userName}
            squad={item.squad}
            profilePic={item.profilePic}
            upvoteCount={0}
            downvoteCount={0}
            commentCount={0}
            content={""}
            isUpvoted={false}
            isDownvoted={false}
            viewCount={0}
          />
        ))}
      </div>
    </div>
  );
}
