"use client";

import { Badge } from "@/components/atoms/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { LockIcon } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface ContentPreviewProps {
  contentType: string;
  title: string;
  content: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  isPremium: boolean;
}

export function ContentPreview({
  contentType,
  title,
  content,
  thumbnailUrl,
  videoUrl,
  isPremium,
}: ContentPreviewProps) {
  const user = useSelector((state: RootState) => state.auth.user);
  return (
    <div className="space-y-6">
      {isPremium && (
        <Badge
          variant="outline"
          className="bg-yellow-50 text-yellow-700 hover:bg-yellow-50 border-yellow-200"
        >
          <LockIcon className="h-3 w-3 mr-1" /> Premium Content
        </Badge>
      )}

      <h1 className="text-2xl font-bold">{title || "Untitled Content"}</h1>

      <div className="flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={user?.profilePic} alt="Author" />
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
        <div>
          <p className="text-sm font-medium">{user?.name}</p>
          <p className="text-xs text-muted-foreground">Published just now</p>
        </div>
      </div>

      {contentType === "blog" ? (
        <>
          {thumbnailUrl && (
            <div className="aspect-video rounded-lg overflow-hidden border mb-6">
              <img
                src={thumbnailUrl || "/placeholder.svg"}
                alt="Thumbnail"
                className="object-cover w-full h-full"
              />
            </div>
          )}
          <div
            className="prose prose-sm max-w-none text-primary"
            dangerouslySetInnerHTML={{
              __html: content || "<p>No content available</p>",
            }}
          />
        </>
      ) : (
        <>
          {videoUrl ? (
            <div className="aspect-video rounded-lg overflow-hidden border mb-6">
              <video src={videoUrl} controls className="w-full h-full" />
            </div>
          ) : (
            thumbnailUrl && (
              <div className="aspect-video rounded-lg overflow-hidden border mb-6">
                <img
                  src={thumbnailUrl || "/placeholder.svg"}
                  alt="Thumbnail"
                  className="object-cover w-full h-full"
                />
              </div>
            )
          )}
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{
              __html: content || "<p>No description available</p>",
            }}
          />
        </>
      )}
    </div>
  );
}
