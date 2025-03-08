import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getContent } from "@/services/user/contentService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FaThumbsUp, FaRegThumbsUp } from "react-icons/fa";
import { MessageCircle, Bookmark, Share2 } from "lucide-react";

export default function ContentDetails() {
  const { id } = useParams<{ id: string }>();
  const [content, setContent] = useState<any>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likes, setLikes] = useState<number>(0);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getContent(id as string);
        setContent(data);
        setLikes(data.likes || 0);
        setIsLiked(data.isLiked || false);
        setIsBookmarked(data.isBookmarked || false);
      } catch (error) {
        console.error("Error fetching content details:", error);
      }
    };

    fetchContent();
  }, [id]);

  if (!content) return <p className="text-center text-gray-500">Loading...</p>;

  return (
    <div className="container mx-auto px-6 py-8 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Avatar>
          <AvatarImage src="https://avatar.iran.liara.run/public" />
          <AvatarFallback>{content.userName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-2xl font-semibold">{content.title}</h2>
          <p className="text-gray-500 text-sm">
            By <span className="font-medium">{content.userName}</span> •{" "}
            {content.date}
          </p>
        </div>
        <Badge variant="secondary" className="ml-auto">
          {content.contentType}
        </Badge>
      </div>

      {/* Image */}
      {content.thumbnailUrl && (
        <div className="mb-6">
          <img
            src={content.thumbnailUrl}
            alt={content.title}
            className="rounded-lg w-full h-64 object-cover"
          />
        </div>
      )}

      {/* Content Body */}
      <div className="prose max-w-none mb-6 text-gray-800">
        {content.content}
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-4">
        {content.tags?.map((tag: string, index: number) => (
          <Badge key={index} variant="outline">
            # {tag}
          </Badge>
        ))}
      </div>

      {/* Interactions */}
      <div className="flex items-center gap-6 border-t pt-4">
        <Button
          variant="ghost"
          size="sm"
          className="gap-2"
          onClick={() => setIsLiked((prev) => !prev)}
        >
          {isLiked ? <FaThumbsUp /> : <FaRegThumbsUp />}
          {likes}
        </Button>
        <Button variant="ghost" size="sm" className="gap-2">
          <MessageCircle className="h-4 w-4" /> Comments
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsBookmarked((prev) => !prev)}
        >
          {isBookmarked ? (
            <Bookmark fill="#007AFF" color="#007AFF" />
          ) : (
            <Bookmark />
          )}
        </Button>
        <Button variant="ghost" size="sm">
          <Share2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
