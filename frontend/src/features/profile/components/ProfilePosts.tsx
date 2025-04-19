import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Badge } from "@/components/atoms/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/molecules/alert-dialog";
import { Card, CardContent } from "@/components/molecules/card";
import ProfileService from "@/services/user/profileService";
import { useQuery } from "@tanstack/react-query";
import { MdDelete } from "react-icons/md";
import { useParams } from "react-router-dom";

export default function ProfilePosts() {
  const { username } = useParams();
  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-contents", username],
    queryFn: () => ProfileService.getUserContents(username as string),
    enabled: !!username, // Prevents the query from running on undefined
    staleTime: 1000 * 60 * 5, // Optional: cache it for 5 mins
  });

  console.log(data);

  if (isLoading) return <p>Loading posts...</p>;
  if (isError) return <p>Something went wrong.</p>;

  return (
    <div className="space-y-6 py-4">
      <h3 className="font-semibold">Your Posts</h3>
      {data.length > 0 ? (
        data.map((content: any) => (
          <Card key={content._id} className="w-full">
            <CardContent className="p-2">
              <div className="relative flex gap-4 h-32 items-center">
                <div className="flex-shrink-0 w-44 h-full rounded-lg overflow-hidden">
                  <img
                    src={content.thumbnailUrl || "https://placehold.co/600x400"}
                    alt="thumbnail"
                    className="w-full h-full object-cover rounded-lg"
                  />
                </div>

                <div className="flex gap-1 flex-col w-full h-full justify-start">
                  <div className="flex items-center justify-between">
                    <div className="flex gap-3 items-center">
                      <Avatar>
                        <AvatarImage
                          src={
                            content.author?.profilePic ||
                            "https://avatar.iran.liara.run/public"
                          }
                        />
                        <AvatarFallback>
                          {content.author?.name?.slice(0, 2).toUpperCase() ||
                            "AD"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <p className="text-sm">
                          {content.author?.name || "Unknown"}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          @{content.author.username}
                        </p>
                      </div>
                    </div>
                    <Badge variant="squad" className="w-fit">
                      {content.contentType}
                    </Badge>
                  </div>

                  <div className="flex-1">
                    <h3 className="">{content.title}</h3>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {/* {content.content || "No content available"} */}
                    </p>
                  </div>

                  <div className="flex text-xs text-muted-foreground gap-1">
                    <p>@{content.squad?.name || "unknown-squad"}</p>
                    <span>•</span>
                    <p>{content.date}</p>
                  </div>
                </div>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button className="absolute right-0 bottom-0">
                      <MdDelete
                        size={24}
                        className="cursor-pointer fill-muted-foreground hover:fill-primary transition-all duration-300"
                      />
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Remove from Your Posts?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This will delete the post permanently.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </CardContent>
          </Card>
        ))
      ) : (
        <p className="text-muted-foreground">
          You haven't posted anything yet.
        </p>
      )}
    </div>
  );
}
