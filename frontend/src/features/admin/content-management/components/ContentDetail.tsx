import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContentService } from "@/services/admin/contentService";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  ArrowLeft,
  Bookmark,
  Calendar,
  CheckCircle,
  Eye,
  Heart,
  MessageSquare,
  XCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";

const ContentDetail = () => {
  const params = useParams();
  const contentId = params.contentId as string;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const {
    data: content,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["content", contentId],
    queryFn: () => ContentService.getContentById(contentId),
  });

  const { mutate: verifyContent, isPending: isVerifying } = useMutation({
    mutationFn: (contentId: string) => ContentService.verifyContent(contentId),
    onSuccess: () => {
      // Invalidate the content query to refetch the updated data
      queryClient.invalidateQueries({ queryKey: ["content", contentId] });
    },
    onError: (error: any) => {
      console.error("Error verifying content:", error);
    },
  });

  if (isLoading)
    return (
      <div className="container mx-auto px-4 py-8">
        Loading content details...
      </div>
    );
  if (error)
    return (
      <div className="container mx-auto px-4 py-8">
        Error loading content: {error.message}
      </div>
    );
  if (!content)
    return <div className="container mx-auto px-4 py-8">Content not found</div>;

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <div className="flex items-center mb-6">
        <Button
          variant="ghost"
          onClick={() => {
            navigate("/admin/contents");
          }}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Content Details</h1>

        {!content.isVerified && (
          <Button
            variant="outline"
            className="ml-auto"
            onClick={() => verifyContent(contentId)}
            disabled={isVerifying}
          >
            {isVerifying ? "Verifying..." : "Verify Content"}
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">{content.title}</CardTitle>
              <div className="flex space-x-2">
                <Badge variant={content.isPremium ? "default" : "outline"}>
                  {content.isPremium ? "Premium" : "Free"}
                </Badge>
                <Badge
                  variant={content.isVerified ? "default" : "outline"}
                  className={
                    content.isVerified
                      ? "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100"
                      : "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100"
                  }
                >
                  {content.isVerified ? "Verified" : "Not Verified"}
                </Badge>
              </div>
            </div>
            <CardDescription className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              {new Date(content.createdAt).toLocaleDateString()}
              {content.createdAt !== content.updatedAt && (
                <span className="ml-2 text-xs text-muted-foreground">
                  (Updated: {new Date(content.updatedAt).toLocaleDateString()})
                </span>
              )}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="aspect-video w-full mb-6 rounded-md overflow-hidden">
              <img
                src={content.thumbnailUrl || "/placeholder.svg"}
                alt={content.title}
                className="w-full h-full object-cover"
              />
            </div>

            {content.contentType === "Video" && content.videoUrl && (
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">Video URL</h3>
                <div className="flex items-center">
                  <a
                    href={content.videoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Video
                  </a>
                </div>
              </div>
            )}

            <div>
              <h3 className="text-lg font-medium mb-2">Content</h3>
              <div className="prose max-w-none dark:prose-invert">
                {content.content ? (
                  <div dangerouslySetInnerHTML={{ __html: content.content }} />
                ) : (
                  <p className="text-muted-foreground">No content available</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Author Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={
                    content.author.profilePic ||
                    "https://avatar.iran.liara.run/public"
                  }
                  alt="Author"
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-medium">{content.author.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {content.author.email || "No email provided"}
                  </p>
                </div>
              </div>
              <Separator className="my-4" />
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Username
                  </span>
                  <span className="text-sm font-medium">
                    {content.userName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Squad</span>
                  <span className="text-sm font-medium">
                    {content.squad?.name || "No squad"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Content Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Premium Content</span>
                  <Badge variant={content.isPremium ? "default" : "outline"}>
                    {content.isPremium ? "Premium" : "Free"}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Verification Status</span>
                  <div className="flex items-center">
                    {content.isVerified ? (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                        <span className="text-sm font-medium">Verified</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-sm font-medium">
                          Not Verified
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Content Type</span>
                  <Badge variant="outline">{content.contentType}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                  <Heart className="h-5 w-5 text-red-500 mb-1" />
                  <span className="text-xl font-bold">{content.likeCount}</span>
                  <span className="text-xs text-muted-foreground">Likes</span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                  <MessageSquare className="h-5 w-5 text-blue-500 mb-1" />
                  <span className="text-xl font-bold">
                    {content.commentCount}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Comments
                  </span>
                </div>
                <div className="flex flex-col items-center p-3 bg-muted rounded-md">
                  <Bookmark className="h-5 w-5 text-purple-500 mb-1" />
                  <span className="text-xl font-bold">
                    {content.bookmarkCount}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Bookmarks
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ContentDetail;
