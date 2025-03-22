import { Card, CardContent } from "@/components/ui/card";
import React from "react";

interface ContentSummaryProps {
  contentType: string;
  title: string;
  thumbnailPreview: string | null;
  isPremium: boolean;
  content: string;
}
const ContentSummary: React.FC<ContentSummaryProps> = ({
  contentType,
  title,
  thumbnailPreview,
  isPremium,
  content,
}) => {
  const getTextContentLength = (html: string): number => {
    if (!html) return 0;
    // Remove HTML tags, leaving only the text content
    const textContent = html.replace(/<[^>]+>/g, "");
    // Remove extra whitespace and count characters
    return textContent.replace(/\s+/g, " ").trim().length;
  };

  const contentLength = getTextContentLength(content);
  return (
    <Card className="sticky top-6 border-none shadow-md">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold mb-4">Content Summary</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Content Type
            </p>
            <p className="capitalize">{contentType || "Not selected"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">Title</p>
            <p>{title || "Not provided"}</p>
          </div>
          {thumbnailPreview && (
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Thumbnail
              </p>
              <div className="aspect-video rounded-md overflow-hidden border">
                <img
                  src={thumbnailPreview || "/placeholder.svg"}
                  alt="Thumbnail"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Premium Content
            </p>
            <p>{isPremium ? "Yes" : "No"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Content Length
            </p>
            <p>{content ? `${contentLength} characters` : "No content yet"}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentSummary;
