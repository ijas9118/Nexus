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
import { Plus } from "lucide-react";
import { useState } from "react";
import Lottie from "react-lottie";

const NewDM = () => {
  const [openNewContactModel, setOpenNewContactModel] = useState(false);
  const [searchedUsers, setSearchedUsers] = useState([]);

  const searchConnections = async (search: string) => {
    try {
      const result = await searchConnectedUsers(search);
      console.log(result);
      setSearchedUsers(result);
    } catch (error) {
      setSearchedUsers([]);
      console.log(error);
    }
  };

  const selectNewChat = (user: any) => {
    setOpenNewContactModel(false);
    setSearchedUsers([]);
  };

  return (
    <>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              className="cursor-pointer"
              onClick={() => setOpenNewContactModel(true)}
            >
              <Plus />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-secondary text-muted-foreground">
            <p>Start New Chat</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewContactModel} onOpenChange={setOpenNewContactModel}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="mb-5">
              Please Select a Connected User
            </DialogTitle>
            <DialogDescription></DialogDescription>
            <div>
              <Input
                placeholder="Search Connections..."
                className="rounded-lg border-none "
                onChange={(e) => searchConnections(e.target.value)}
              />
            </div>

            {searchedUsers.length > 0 ? (
              <ScrollArea className="h-[250px]">
                <div className="flex flex-col gap-5">
                  {searchedUsers.map((user: any) => (
                    <div
                      key={user._id}
                      className="p-2 hover:bg-neutral-50 dark:hover:bg-neutral-900 cursor-pointer"
                      onClick={() => selectNewChat(user)}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={user.profilePic}
                          alt={user.name}
                          className="h-8 w-8 rounded-full"
                        />
                        <div>
                          <p className="font-medium">{user.name}</p>
                          <p className="text-sm text-muted-foreground">
                            @{user.username}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="py-10">
                <Lottie
                  isClickToPauseDisabled={true}
                  height={100}
                  width={100}
                  options={animationDefaultOptions}
                />
                <div className="text-opacity-80 text-muted-foreground items-center lg:text-xl text-sm transition-all duration-300 text-center">
                  <h3>Choose a chat</h3>
                </div>
              </div>
            )}
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default NewDM;
