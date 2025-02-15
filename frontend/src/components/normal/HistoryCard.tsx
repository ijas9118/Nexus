import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { TrashIcon } from "lucide-react";
import { IHistoryItem } from "@/types/content";
import { removeFromHistory } from "@/services/user/contentService";
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
} from "../ui/alert-dialog";

interface IHistoryCardProps {
  item: IHistoryItem;
  setHistory: React.Dispatch<React.SetStateAction<IHistoryItem[]>>;
}

const HistoryCard: React.FC<IHistoryCardProps> = ({ item, setHistory }) => {
  const handleRemoveHistory = async (contentId: string) => {
    try {
      await removeFromHistory(contentId);

      setHistory((prev) =>
        prev.filter((historyItem) => historyItem.contentId !== contentId)
      );
    } catch (error) {
      console.error("Error removing history:", error);
    }
  };

  return (
    <Card key={item.contentId} className="w-full">
      <CardContent className="p-2">
        <div className="flex gap-4 h-32 items-center">
          <div className="flex-shrink-0 w-44 h-full rounded-lg overflow-hidden">
            <img
              src={item.thumbnailUrl || "/placeholder.svg"}
              alt={item.title}
              className="w-full h-full object-cover rounded-lg"
            />
          </div>

          <div className="flex flex-col w-full h-full justify-start">
            <div className="flex gap-3">
              <Avatar>
                <AvatarImage src="https://avatar.iran.liara.run/public" />
                <AvatarFallback>{item.userName.slice(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="w-full flex gap-4 items-center">
                <h3 className="font-light">{item.userName}</h3>
                <Badge variant="outline" className="w-fit">
                  {item.contentType}
                </Badge>
              </div>
            </div>
            <h3 className="text-lg font-normal pt-2">{item.title}</h3>
            <div className="flex-grow"></div>
            <div className="flex py-2 text-xs gap-4">
              <p>@{item.squad.toLowerCase()}</p>

              <p className=" text-muted-foreground">05:56 PM</p>
            </div>
          </div>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <TrashIcon className="cursor-pointer w-7" />
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Remove from Reading History?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will remove <strong>{item.title}</strong> from your reading
                  history. You can’t undo this action.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleRemoveHistory(item.contentId)}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryCard;
