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
import MultipleSelector from "@/components/organisms/multiple-select";
import { ChannelService } from "@/services/user/channelService";
import { getAllConnections } from "@/services/user/followService";
import { addChannel } from "@/store/slices/chatSlice";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "sonner";

const CreateChannel = () => {
  const dispatch = useDispatch();
  const [openNewChannelModel, setOpenNewChannelModel] = useState(false);
  const [allConnections, setAllConnections] = useState<any[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<any[]>([]);
  const [channelName, setChannelName] = useState("");

  useEffect(() => {
    const getData = async () => {
      const response = await getAllConnections();
      setAllConnections(response.data);
    };

    getData();
  }, []);

  const createChannel = async () => {
    try {
      if (channelName.length > 0 && selectedConnection.length > 0) {
        const response = await ChannelService.createChannel({
          name: channelName,
          members: selectedConnection.map((connection) => connection.value),
        });

        if (response) {
          setChannelName("");
          setSelectedConnection([]);
          setOpenNewChannelModel(false);
          dispatch(addChannel(response));
        }
      } else {
        toast.error("Please fill all the fields");
      }
    } catch (error) {
      console.log(error);
    }
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
              onClick={() => setOpenNewChannelModel(true)}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </TooltipTrigger>
          <TooltipContent className="bg-secondary text-muted-foreground">
            <p>Create New Channel</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={openNewChannelModel} onOpenChange={setOpenNewChannelModel}>
        <DialogContent className="w-full max-w-[90vw] sm:max-w-md md:max-w-lg p-4 sm:p-6">
          <DialogHeader className="mb-2 sm:mb-4">
            <DialogTitle className="text-lg sm:text-xl font-semibold ">
              Create New Channel
            </DialogTitle>
            <DialogDescription>
              Please fill up the details for new channel.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Channel Name"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
              onChange={(e) => setChannelName(e.target.value)}
              value={channelName}
            />
            <div className="py-2">
              <MultipleSelector
                defaultOptions={allConnections}
                placeholder="Search Connections..."
                value={selectedConnection}
                onChange={setSelectedConnection}
                emptyIndicator={<p>No results found.</p>}
              />
            </div>
            <div>
              <Button className="w-full" onClick={createChannel}>
                Create Channel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateChannel;
