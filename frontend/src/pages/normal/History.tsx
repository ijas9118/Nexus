import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { MoreVertical, Search, Share, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const History = () => {
  const dispatch = useDispatch();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "History", url: "" },
      ])
    );
  }, [dispatch]);

  const title = "How does AWS EC2 work?",
    imageUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-12%20at%2012.49.46%E2%80%AFPM-sGxnNRRGi2MQa3okAljndoUYASw5DJ.png";

  return (
    <div className="container mx-auto max-w-3xl px-12 h-screen border-x-[1px] py-8 space-y-8">
      <div className="">
        <h1 className="text-2xl mb-4">Reading History</h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search history..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>
      <Card className="w-full">
        <CardContent className="p-2">
          <div className="flex gap-4">
            <div className="flex-shrink-0 w-44 h-32 rounded-lg overflow-hidde">
              <img
                src={imageUrl || "/placeholder.svg"}
                alt="AWS EC2"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="flex flex-col w-full justify-between gap-2 py-2">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src="https://avatar.iran.liara.run/public" />
                  <AvatarFallback>IA</AvatarFallback>
                </Avatar>
                <div className="w-full flex gap-4 items-center">
                  <h3 className="font-light">Ijas Ahammed</h3>
                  <Badge variant="outline" className="w-fit">
                    Video
                  </Badge>
                </div>
              </div>
              <h3 className="text-lg font-normal">{title}</h3>
              <p className="text-xs">@nodejs</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <MoreVertical className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Trash className="h-4 w-4" />
                  <span>Remove </span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default History;
