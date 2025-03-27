import { Button } from "@/components/atoms/button";
import { Input } from "@/components/atoms/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/molecules/tooltip";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/organisms/dialog";
import { ScrollArea } from "@/components/organisms/scroll-area";
import { animationDefaultOptions } from "@/lib/utils";
import { searchConnectedUsers } from "@/services/user/followService";
import {
  setSelectedChatData,
  setSelectedChatType,
} from "@/store/slices/chatSlice";
import { Plus } from "lucide-react";
import { useState } from "react";
import Lottie from "react-lottie";
import { useDispatch } from "react-redux";

const NewDM = () => {
  const dispatch = useDispatch();
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);

  const searchConnections = async (search: string) => {
    try {
      const result = await searchConnectedUsers(search);
      setSearchedUsers(result);
    } catch (error) {
      setSearchedUsers([]);
      console.log(error);
    }
  };

  const selectNewChat = (user: any) => {
    setOpenNewContactModel(false);
    dispatch(setSelectedChatData(user));
    dispatch(setSelectedChatType("connection"));
    setSearchedUsers([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-muted"
              onClick={() => setOpenNewContactModel(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-secondary text-muted-foreground">
            <p>Start New Chat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="w-full max-w-[90vw] sm:max-w-md md:max-w-lg lg:max-w-xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-semibold mb-2 sm:mb-4">
              Select a Connection
            </DialogTitle>
            <DialogDescription className="hidden">
              Search and select a user to start a new direct message.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Search Connections..."
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
              onChange={(e) => searchConnections(e.target.value)}
            />

            {searchedUsers.length > 0 ? (
              <ScrollArea className="h-[200px] sm:h-[250px] md:h-[300px] w-full rounded-md border">
                <div className="p-2 sm:p-4 space-y-2">
                  {searchedUsers.map((user) => (
                    <div
                      key={user._id}
                      className="flex items-center gap-3 p-2 sm:p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors duration-200"
                      onClick={() => selectNewChat(user)}
                    >
                      <img
                        src={user.profilePic}
                        alt={user.name}
                        className="h-10 w-10 sm:h-12 sm:w-12 rounded-full object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm sm:text-base font-medium truncate">
                          {user.name}
                        </p>
                        <p className="text-xs sm:text-sm text-muted-foreground truncate">
                          @{user.username}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 sm:py-10">
                <Lottie
                  isClickToPauseDisabled={true}
                  height={80}
                  width={80}
                  options={animationDefaultOptions}
                />
                <p className="mt-2 text-sm sm:text-base text-muted-foreground text-center">
                  Search for a connection to start a chat
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
