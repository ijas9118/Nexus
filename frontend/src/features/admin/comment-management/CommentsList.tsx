import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/molecules/card";
import {
  CheckCircle,
  Flag,
  MoreHorizontal,
  RefreshCcw,
  Search,
  Trash2,
} from "lucide-react";
import React from "react";

interface CommentsListProps {
  comments: any;
  getStatusBadge: (status: string) => React.ReactNode;
}

const CommentsList = ({ comments, getStatusBadge }: CommentsListProps) => {
  if (comments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-muted p-3 mb-4">
          <Search className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold">No comments found</h3>
        <p className="text-muted-foreground mt-1">
          Try adjusting your filters or search query.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {comments.map((comment: any) => (
        <Card key={comment._id}>
          <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src={comment.userId.profilePic} />
                <AvatarFallback>{comment.userId.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <div className="font-semibold">{comment.userId.name}</div>
                <div className="text-xs text-muted-foreground">
                  {comment.updatedAt}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(comment.status)}
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground mb-2">
              On:{" "}
              <span className="font-medium text-foreground">
                {comment.contentId.title}
              </span>
            </div>
            <p className="text-sm">{comment.text}</p>
          </CardContent>
          <CardFooter className="flex justify-end gap-2 pt-0">
            {comment.status === "reported" && (
              <>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-green-600 hover:text-green-700 hover:bg-green-50"
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </>
            )}
            {comment.status === "active" && (
              <Button
                variant="outline"
                size="sm"
                className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
              >
                <Flag className="mr-1 h-4 w-4" />
                Report
              </Button>
            )}
            {comment.status === "deleted" && (
              <Button
                variant="outline"
                size="sm"
                className="text-green-600 hover:text-green-700 hover:bg-green-50"
              >
                <RefreshCcw className="mr-1 h-4 w-4" />
                Restore
              </Button>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default CommentsList;
