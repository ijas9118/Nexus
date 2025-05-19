import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import {
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Eye,
  Bookmark,
  Link2,
  Share2,
} from "lucide-react";
import { Button } from "@/components/atoms/button";
import { Separator } from "@/components/atoms/separator";
import { toast } from "sonner";

interface ContentItem {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar: string;
  };
  publishedAt: Date;
  readTime: string;
  type: "blog" | "video";
  thumbnail?: string;
  upvotes: number;
  downvotes: number;
  comments: number;
  views: number;
  isBookmarked: boolean;
  tags: string[];
}

export function ContentList() {
  const [contents, setContents] = useState<ContentItem[]>([
    {
      id: "1",
      title: "Building Scalable APIs with Node.js and Express",
      excerpt:
        "Learn how to build robust and scalable RESTful APIs using Node.js and Express framework with best practices for error handling, authentication, and more.",
      author: {
        name: "Alex Chen",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      publishedAt: new Date("2023-04-15"),
      readTime: "8 min read",
      type: "blog",
      thumbnail: "/placeholder.svg?height=150&width=280",
      upvotes: 342,
      downvotes: 12,
      comments: 56,
      views: 4521,
      isBookmarked: false,
      tags: ["Node.js", "Express", "API"],
    },
    {
      id: "2",
      title: "Mastering Async/Await in Node.js",
      excerpt:
        "Deep dive into asynchronous programming in Node.js using async/await patterns to write cleaner, more maintainable code.",
      author: {
        name: "Maria Rodriguez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      publishedAt: new Date("2023-05-22"),
      readTime: "6 min read",
      type: "blog",
      upvotes: 287,
      downvotes: 5,
      comments: 42,
      views: 3876,
      isBookmarked: true,
      tags: ["Node.js", "JavaScript", "Async"],
    },
    {
      id: "3",
      title: "Node.js Performance Optimization Techniques",
      excerpt:
        "Watch this comprehensive video tutorial on optimizing your Node.js applications for maximum performance and scalability.",
      author: {
        name: "David Kim",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      publishedAt: new Date("2023-06-10"),
      readTime: "15 min video",
      type: "video",
      thumbnail: "/placeholder.svg?height=150&width=280",
      upvotes: 512,
      downvotes: 8,
      comments: 78,
      views: 8932,
      isBookmarked: false,
      tags: ["Node.js", "Performance", "Optimization"],
    },
  ]);

  const toggleBookmark = (id: string) => {
    setContents(
      contents.map((content) =>
        content.id === id
          ? { ...content, isBookmarked: !content.isBookmarked }
          : content,
      ),
    );

    const content = contents.find((c) => c.id === id);
    toast(
      content?.isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      {
        description: content?.isBookmarked
          ? "The content has been removed from your bookmarks."
          : "The content has been added to your bookmarks.",
      },
    );
  };

  const toggleUpvote = (id: string) => {
    setContents(
      contents.map((content) =>
        content.id === id
          ? { ...content, upvotes: content.upvotes + 1 }
          : content,
      ),
    );
  };

  const toggleDownvote = (id: string) => {
    setContents(
      contents.map((content) =>
        content.id === id
          ? { ...content, downvotes: content.downvotes + 1 }
          : content,
      ),
    );
  };

  const copyLink = (id: string) => {
    navigator.clipboard.writeText(`https://squad.io/content/${id}`);
    toast("Link copied", {
      description: "The content link has been copied to your clipboard.",
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold">Latest Content</h2>

      <div className="space-y-6">
        {contents.map((content) => (
          <div key={content.id} className="space-y-4">
            <div className="flex gap-4">
              {content.thumbnail && (
                <div className="relative hidden h-[100px] w-[180px] overflow-hidden rounded-lg sm:block">
                  <img
                    src={content.thumbnail || "/placeholder.svg"}
                    alt={content.title}
                    className="object-cover"
                  />
                  {content.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                      <div className="h-12 w-12 rounded-full bg-white/20 p-3">
                        <div className="h-full w-full rounded-full bg-white"></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-2">
                  <div className="relative h-6 w-6 overflow-hidden rounded-full">
                    <img
                      src={content.author.avatar || "/placeholder.svg"}
                      alt={content.author.name}
                      className="object-cover"
                    />
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {content.author.name}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {formatDistanceToNow(content.publishedAt, {
                      addSuffix: true,
                    })}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">
                    {content.readTime}
                  </span>
                </div>

                <h3 className="font-semibold leading-tight">{content.title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {content.excerpt}
                </p>

                <div className="flex flex-wrap gap-2">
                  {content.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleUpvote(content.id)}
                >
                  <ThumbsUp className="h-4 w-4" />
                  <span className="sr-only">Upvote</span>
                </Button>
                <span className="text-sm">{content.upvotes}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleDownvote(content.id)}
                >
                  <ThumbsDown className="h-4 w-4" />
                  <span className="sr-only">Downvote</span>
                </Button>
              </div>

              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{content.comments}</span>
              </div>

              <div className="flex items-center gap-1">
                <Eye className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">
                  {content.views.toLocaleString()}
                </span>
              </div>

              <div className="ml-auto flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => toggleBookmark(content.id)}
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
                  onClick={() => copyLink(content.id)}
                >
                  <Link2 className="h-4 w-4" />
                  <span className="sr-only">Copy link</span>
                </Button>

                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Share</span>
                </Button>
              </div>
            </div>

            <Separator />
          </div>
        ))}
      </div>
    </div>
  );
}
