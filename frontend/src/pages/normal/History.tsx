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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { TabsContent } from "@radix-ui/react-tabs";
import { Bookmark, Flag, MoreVertical, Search, Share } from "lucide-react";
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
    readTime = "1m read time",
    imageUrl =
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-02-12%20at%2012.49.46%E2%80%AFPM-sGxnNRRGi2MQa3okAljndoUYASw5DJ.png";

  return (
    <div className="container mx-auto max-w-3xl px-12 h-screen border-x-[1px] py-8 space-y-8">
      <Tabs defaultValue="reading" className="w-full">
        <TabsList>
          <TabsTrigger value="reading">Reading history</TabsTrigger>
          <TabsTrigger value="search">Search history</TabsTrigger>
        </TabsList>
        <div className="mt-4">
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
        <TabsContent value="reading" className="mt-4 space-y-6">
          Reading History
        </TabsContent>
        <TabsContent value="search" className="mt-4 space-y-6">
          Search History
        </TabsContent>
      </Tabs>
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
            <div className="flex flex-col w-full justify-between ">
              <div className="flex gap-3">
                <Avatar>
                  <AvatarImage src="https://avatar.iran.liara.run/public" />
                  <AvatarFallback>IA</AvatarFallback>
                </Avatar>
                <div className="w-full flex justify-between items-center">
                  <h3 className="font-semibold">Ijas Ahammed</h3>
                  <Badge variant="secondary" className="w-fit">
                    Video
                  </Badge>
                </div>
              </div>
              <h3 className="text-lg font-semibold">{title}</h3>
              <p className="text-sm">{readTime}</p>
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none">
                <MoreVertical className="h-5 w-5" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  <span>Remove from bookmarks</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2">
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="flex items-center gap-2 text-red-500">
                  <Flag className="h-4 w-4" />
                  <span>Report</span>
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
