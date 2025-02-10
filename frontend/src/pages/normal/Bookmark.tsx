import FilterComponent from "@/components/normal/myFeed/FilterComponent";
import ContentTypeTab from "@/components/normal/myFeed/ContentTypeTab";
import ContentCard from "@/components/normal/myFeed/ContentCard";
import { useEffect, useState } from "react";
import { getAllBookmarks } from "@/services/user/bookmarkService";

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
      <ContentTypeTab selectedTab={selectedTab} setSelectedTab={setSelectedTab} />

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
            likes={item.likes}
            comments={item.comments}
            tags={[item.squad]}
            isPremium={item.isPremium}
            image={item.thumbnailUrl}
            isLiked={item.isLiked}
            isBookmarked={item.isBookmarked}
          />
        ))}
      </div>
    </div>
  );
}
