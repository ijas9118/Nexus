import { Avatar, AvatarFallback, AvatarImage } from "@/components/atoms/avatar";
import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Separator } from "@/components/atoms/separator";
import {
  acceptConnectionRequest,
  getPendingRequests,
} from "@/services/user/followService";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const Connections = () => {
  const [loading, setLoading] = useState(true);
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchConnections = async () => {
      setLoading(true);
      try {
        // const data = await getAllConnections();
        setConnections([]);

        const pendingRequests = await getPendingRequests();
        setRequests(pendingRequests);
      } catch (error) {
        console.error("Error fetching connections:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchConnections();
  }, []);

  const handleAccept = async (userId: string) => {
    try {
      await acceptConnectionRequest(userId);
      toast("Wohoo!", {
        description: "Your connections updated.",
      });
    } catch (error: any) {
      console.log(error.message);
      toast.error("Oops!", {
        description: error.message,
      });
    }
  };

  return (
    <div className="container mx-auto max-w-4xl px-6 h-full border-x-[1px] py-8 space-y-8">
      <h1 className="text-2xl mb-6">Your Connections</h1>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Connected Users</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="space-y-4">
                {connections.map((user: any) => (
                  <div key={user._id} className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {user.username}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Connection Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {requests.map((request: any) => (
                <div key={request._id}>
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={request.avatar} alt={request.name} />
                      <AvatarFallback>{request.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{request.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {request.username}
                      </p>
                    </div>
                    <div className="space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleAccept(request._id)}
                      >
                        Accept
                      </Button>
                      <Button size="sm" variant="ghost">
                        Reject
                      </Button>
                    </div>
                  </div>
                  <Separator className="my-4" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Connections;
