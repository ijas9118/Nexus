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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import { Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

const UserInfor = ({ selectedChat }: { selectedChat: any }) => {
  const navigate = useNavigate();
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Info />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>User Profile</AlertDialogTitle>
          <AlertDialogDescription>
            View details about this user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col items-center gap-3 ">
          <Avatar className="h-16 w-16">
            <AvatarImage src={selectedChat.avatar} />
            <AvatarFallback>{selectedChat.name[0]}</AvatarFallback>
          </Avatar>
          <h2 className="text-lg font-semibold">{selectedChat.name}</h2>
          <p className="text-sm text-muted-foreground">
            @{selectedChat.username}
          </p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => navigate(`/profile/${selectedChat.username}`)}
          >
            View Profile
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default UserInfor;
