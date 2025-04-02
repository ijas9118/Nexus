import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Badge } from "@/components/atoms/badge";
import Premium from "@/components/icons/Premium";
import { CalendarIcon } from "lucide-react";
import dayjs from "dayjs";

interface ContentHeaderProps {
  content: any;
}

export const ContentHeader = ({ content }: ContentHeaderProps) => (
  <>
    {content.isPremium && (
      <div className="mb-4 flex items-center text-sm gap-2 border w-fit px-2 py-2 rounded-lg">
        <Premium />
        <span>Premium Content</span>
      </div>
    )}
    <h1 className="text-3xl md:text-4xl font-bold tracking mb-4">
      {content.title}
    </h1>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <Avatar className="h-14 w-14">
          <AvatarImage
            src={
              content.author?.profilePic ||
              "https://avatar.iran.liara.run/public"
            }
            alt={content.userName}
          />
          <AvatarFallback>{content.userName?.[0]}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-1">
          <div className="font-medium flex gap-3 items-center">
            {content.userName}
            <Badge variant="secondary">{content.contentType}</Badge>
          </div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>
              Posted in{" "}
              <span className="underline underline-offset-1 hover:underline-offset-4 transform duration-150 cursor-pointer">
                {content.squad.name}
              </span>
            </span>
            <span>•</span>
            <CalendarIcon className="h-3.5 w-3.5" />
            {dayjs(content.date).format("MMMM D, YYYY")}
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button className="h-8 rounded-full w-24" variant="outline">
          Follow
        </Button>
        <Button className="h-8 rounded-full w-24" variant="default">
          Connect
        </Button>
      </div>
    </div>
  </>
);
