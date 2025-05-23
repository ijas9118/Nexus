import { formatDistanceToNow } from "date-fns";
import { Clock, CheckCircle, XCircle, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/organisms/tabs";
import { Badge } from "@/components/atoms/badge";
import { ContentItem } from "../VerifyContentPage";

interface ContentListProps {
  filteredContent: ContentItem[];
  isLoading: boolean;
  selectedContent: ContentItem | null;
  setSelectedContent: (content: ContentItem) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ContentList({
  filteredContent,
  isLoading,
  selectedContent,
  setSelectedContent,
  activeTab,
  setActiveTab,
}: ContentListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Content Queue</CardTitle>
        <CardDescription>
          Review and verify content submitted by squad members
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs
          defaultValue="pending"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approved">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
          <div className="mt-4">
            {isLoading ? (
              <div className="text-center py-8">Loading content...</div>
            ) : filteredContent && filteredContent.length > 0 ? (
              <div className="space-y-4">
                {filteredContent.map((item) => (
                  <ContentListItem
                    key={item.id}
                    item={item}
                    isSelected={selectedContent?.id === item.id}
                    onClick={() => setSelectedContent(item)}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No {activeTab} content found
              </div>
            )}
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}

interface ContentListItemProps {
  item: ContentItem;
  isSelected: boolean;
  onClick: () => void;
}

function ContentListItem({ item, isSelected, onClick }: ContentListItemProps) {
  return (
    <div
      className={`p-3 rounded-lg cursor-pointer transition-colors ${isSelected ? "bg-muted" : "hover:bg-muted/50"}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center">
          <Badge
            variant={
              item.status === "pending"
                ? "outline"
                : item.status === "approved"
                  ? "default"
                  : "destructive"
            }
          >
            {item.status === "pending" && <Clock className="mr-1 h-3 w-3" />}
            {item.status === "approved" && (
              <CheckCircle className="mr-1 h-3 w-3" />
            )}
            {item.status === "rejected" && <XCircle className="mr-1 h-3 w-3" />}
            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
          </Badge>
          {item.isPremium && (
            <Badge variant="secondary" className="ml-2">
              Premium
            </Badge>
          )}
        </div>
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(item.createdAt), {
            addSuffix: true,
          })}
        </span>
      </div>
      <h3 className="font-medium line-clamp-2">{item.title}</h3>
      <div className="flex items-center mt-2 text-sm text-muted-foreground">
        <User className="h-3 w-3 mr-1" />
        <span>{item.authorName}</span>
      </div>
    </div>
  );
}
