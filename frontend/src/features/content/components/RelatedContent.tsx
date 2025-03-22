import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter } from "@/components/molecules/card";
import { Badge } from "@/components/atoms/badge";
import {
  CalendarIcon,
  MessageCircleIcon,
  ThumbsUpIcon,
  BookmarkIcon,
} from "lucide-react";
import { Link } from "react-router-dom";

// Mock function to get related content - replace with your actual API call
const getRelatedContent = async (
  authorId: string,
  currentContentId: string,
) => {
  // This would be your actual API call
  // return await fetchRelatedContent(authorId, currentContentId);

  // Mock data for demonstration
  return [
    {
      _id: "rel1",
      title: "Understanding JavaScript Promises",
      thumbnailUrl:
        "https://res.cloudinary.com/dhvlhpg55/image/upload/v1742460915/rjdgotx4oyaulwnwm9cm.webp",
      date: "2025-03-15T08:55:15.646Z",
      contentType: "Tutorial",
      isPremium: true,
      likeCount: 24,
      commentCount: 8,
      squad: { name: "JavaScript" },
    },
    {
      _id: "rel2",
      title: "Building Responsive UIs with React",
      thumbnailUrl:
        "https://res.cloudinary.com/dhvlhpg55/image/upload/v1742460915/rjdgotx4oyaulwnwm9cm.webp",
      date: "2025-03-10T08:55:15.646Z",
      contentType: "Blog",
      isPremium: false,
      likeCount: 42,
      commentCount: 15,
      squad: { name: "React" },
    },
    {
      _id: "rel3",
      title: "CSS Grid Layout Mastery",
      thumbnailUrl:
        "https://res.cloudinary.com/dhvlhpg55/image/upload/v1742460915/rjdgotx4oyaulwnwm9cm.webp",
      date: "2025-03-05T08:55:15.646Z",
      contentType: "Tutorial",
      isPremium: false,
      likeCount: 18,
      commentCount: 6,
      squad: { name: "CSS" },
    },
  ];
};

interface RelatedContentProps {
  authorId?: string;
  currentContentId: string;
}

export default function RelatedContent({
  authorId,
  currentContentId,
}: RelatedContentProps) {
  const {
    data: relatedContent,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["relatedContent", authorId, currentContentId],
    queryFn: () => getRelatedContent(authorId || "", currentContentId),
    enabled: !!authorId,
  });

  if (isLoading)
    return <div className="text-center py-4">Loading related content...</div>;
  if (error || !relatedContent || relatedContent.length === 0) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {relatedContent.map((content) => (
        <Link to={`/content/${content._id}`} key={content._id}>
          <Card className="h-full hover:shadow-md transition-shadow">
            <div className="relative">
              <img
                src={content.thumbnailUrl || "/placeholder.svg"}
                alt={content.title}
                className="w-full h-40 object-cover rounded-t-lg"
              />
              {content.isPremium && (
                <Badge className="absolute top-2 right-2 bg-gradient-to-r from-amber-500 to-yellow-300 text-black">
                  Premium
                </Badge>
              )}
            </div>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {content.contentType}
                </Badge>
                <Badge variant="secondary" className="text-xs">
                  {content.squad.name}
                </Badge>
              </div>
              <h3 className="font-semibold line-clamp-2 mb-2">
                {content.title}
              </h3>
              <div className="flex items-center text-xs text-muted-foreground">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {new Date(content.date).toLocaleDateString()}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
              <div className="flex items-center gap-3">
                <span className="flex items-center">
                  <ThumbsUpIcon className="h-3 w-3 mr-1" />
                  {content.likeCount}
                </span>
                <span className="flex items-center">
                  <MessageCircleIcon className="h-3 w-3 mr-1" />
                  {content.commentCount}
                </span>
              </div>
              <span className="flex items-center">
                <BookmarkIcon className="h-3 w-3" />
              </span>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  );
}
