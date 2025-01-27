import FilterComponent from "@/components/normal/myFeed/FilterComponent";
import ContentTypeTab from "@/components/normal/myFeed/ContentTypeTab";
import ContentCard from "@/components/normal/myFeed/ContentCard";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { getAllContent } from "@/services/contentService";

export default function MyFeed() {
  const dispatch = useDispatch();
  const [feedContent, setFeedContent] = useState([]);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "My Feed", url: "/myFeed" },
      ])
    );

    const fetchContent = async () => {
      try {
        const data = await getAllContent();
        setFeedContent(data);
      } catch (err: any) {
        setError(err.message);
        console.error("Error fetching content:", err);
      }
    };

    fetchContent();
  }, []);

  return (
    <div className="container mx-auto px-8 py-8">
      <FilterComponent />
      <ContentTypeTab />

      {error && <p className="text-red-500">Error: {error}</p>}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {feedContent.map((item: any, index) => (
          <ContentCard
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
          />
        ))}
      </div>
    </div>
  );
}
