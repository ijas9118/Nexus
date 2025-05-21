import { ArrowBigUp, CalendarDays, Eye, MessagesSquare } from "lucide-react";
import { Badge } from "@/components/atoms/badge";
import { Card, CardContent } from "@/components/molecules/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";

interface SquadHeaderProps {
  name: string;
  tag: string;
  logo: string;
  createdDate: string;
  category: string;
  postsCount: number;
  viewsCount: number;
  upvotesCount: number;
}

export function SquadHeader({
  name,
  tag,
  logo,
  createdDate,
  category,
  postsCount,
  viewsCount,
  upvotesCount,
}: SquadHeaderProps) {
  // Get initials for avatar fallback
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <Card className="border-none shadow-none bg-muted">
      <CardContent className="p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <Avatar className="h-24 w-24 rounded-lg border shadow-sm">
                <AvatarImage
                  src={logo || "/placeholder.svg"}
                  alt={name}
                  className="object-cover"
                />
                <AvatarFallback className="rounded-lg text-lg font-semibold bg-primary/10">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">{name}</h1>
                  <Badge variant="outline" className="ml-2 font-medium">
                    {category}
                  </Badge>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                  <span className="font-medium text-muted-foreground font-serif">
                    {tag}
                  </span>
                  <div className="flex items-center gap-1">
                    <CalendarDays className="h-3.5 w-3.5" />
                    <span>Created {createdDate}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-8 ml-0 sm:ml-[88px] lg:ml-0">
              <div className="flex flex-col items-center text-center gap-1 w-16">
                <div className="flex items-center justify-center gap-2">
                  <MessagesSquare />
                  <span className="font-semibold text-lg">{postsCount}</span>
                </div>
                <span className="text-xs text-muted-foreground">Posts</span>
              </div>

              <div className="flex flex-col items-center text-center gap-1 w-16">
                <div className="flex items-center justify-center gap-2">
                  <Eye />
                  <span className="font-semibold text-lg">
                    {viewsCount.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Views</span>
              </div>

              <div className="flex flex-col items-center text-center gap-1 w-16">
                <div className="flex items-center justify-center gap-2">
                  <ArrowBigUp />
                  <span className="font-semibold text-lg">
                    {upvotesCount.toLocaleString()}
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">Upvotes</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
