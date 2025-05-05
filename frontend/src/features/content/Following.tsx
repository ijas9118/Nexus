import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { getFollowingUsersContents } from "@/services/user/contentService";
import FilterComponent from "./components/FilterComponent";
import ContentTypeTab from "./components/ContentTypeTab";
import ContentCard from "./components/ContentCard";

export default function Following() {
  const dispatch = useDispatch();
  const [feedContent, setFeedContent] = useState([]);
  const [filterContent, setFilterContent] = useState([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState<string>("all");
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "Following", url: "/following" },
      ]),
    );

    const fetchContent = async () => {
      try {
        const data = await getFollowingUsersContents();
        setFeedContent(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching content:", err);
      }
    };

    fetchContent();
  }, [dispatch]);

  useEffect(() => {
    let filteredContent = feedContent;

    if (selectedTab !== "all") {
      filteredContent = filteredContent.filter(
        (item: any) => item.contentType === selectedTab,
      );
    }

    if (selectedTopics.length > 0) {
      console.log(selectedTopics);
      filteredContent = filteredContent.filter((item: any) =>
        selectedTopics.some((topic) =>
          item.squad.toLowerCase().includes(topic.toLowerCase()),
        ),
      );
    }

    setFilterContent(filteredContent);
  }, [selectedTab, feedContent, selectedTopics]);

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
        {filterContent.map((item: any, index) => (
          <ContentCard
            id={item._id}
            key={index}
            avatarFallback={"IA"}
            profilePic={item.profilePic}
            userName={item.userName}
            contentType={item.contentType}
            heading={item.title}
            date={item.date}
            squad={item.squad}
            isPremium={item.isPremium}
            image={item.thumbnailUrl}
            isBookmarked={item.isBookmarked}
            username={item.username}
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
