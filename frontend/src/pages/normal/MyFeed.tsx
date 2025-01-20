import { useState } from "react";
import {
  ChevronDown,
  Filter,
  MessageCircle,
  Share2,
  ThumbsUp,
  Bookmark,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const topics = ["frontend", "javascript", "react", "webdev", "career", "startup"];

export default function MyFeed() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([
    "frontend",
    "javascript",
  ]);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters Section */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-wrap gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                Choose Topics
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {topics.map((topic) => (
                <DropdownMenuItem
                  key={topic}
                  onClick={() => {
                    if (selectedTopics.includes(topic)) {
                      setSelectedTopics(selectedTopics.filter((t) => t !== topic));
                    } else {
                      setSelectedTopics([...selectedTopics, topic]);
                    }
                  }}
                >
                  {topic}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {selectedTopics.map((topic) => (
            <Badge
              key={topic}
              variant="secondary"
              className="gap-1 px-3 py-1"
              onClick={() => setSelectedTopics(selectedTopics.filter((t) => t !== topic))}
            >
              {topic}
              <span className="cursor-pointer">&times;</span>
            </Badge>
          ))}
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="blogs">Blogs</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Cards Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card 1 */}
        <Card className="flex flex-col">
          <CardHeader className="flex-row gap-4 space-y-0">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>UA</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="font-semibold">Usman ali</h3>
              <Badge variant="secondary" className="w-fit">
                Blog
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-19%20at%205.07.11%E2%80%AFPM-LK7F51Vkvib6VXikddfby0oXfyySnV.png"
                alt="React Projects"
                className="object-cover"
              />
            </div>
            <h2 className="mb-2 text-xl font-bold">
              12 React Projects to Practice Core Features
            </h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">#webdev</Badge>
              <Badge variant="outline">#react</Badge>
              <Badge variant="outline">+2</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Dec 10, 2024</p>
          </CardContent>
          <CardFooter className="border-t">
            <div className="flex w-full items-center justify-between">
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                129
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                25
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Card 2 */}
        <Card className="flex flex-col">
          <CardHeader className="flex-row gap-4 space-y-0">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>AM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="font-semibold">Afsal M</h3>
              <div className="flex gap-2">
                <Badge variant="secondary" className="w-fit">
                  Premium
                </Badge>
                <Badge variant="secondary" className="w-fit">
                  Blog
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-19%20at%205.07.11%E2%80%AFPM-LK7F51Vkvib6VXikddfby0oXfyySnV.png"
                alt="JWT Storage"
                className="object-cover"
              />
            </div>
            <h2 className="mb-2 text-xl font-bold">Secure JWT Storage: Best Practices</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">#webdev</Badge>
              <Badge variant="outline">#jwt</Badge>
              <Badge variant="outline">+1</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Nov 23, 2024</p>
          </CardContent>
          <CardFooter className="border-t">
            <div className="flex w-full items-center justify-between">
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                154
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                15
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>

        {/* Card 3 */}
        <Card className="flex flex-col">
          <CardHeader className="flex-row gap-4 space-y-0">
            <Avatar>
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>C</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <h3 className="font-semibold">Catherine</h3>
              <Badge variant="secondary" className="w-fit">
                Video
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <div className="relative mb-4 h-48 overflow-hidden rounded-lg">
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-01-19%20at%205.07.11%E2%80%AFPM-LK7F51Vkvib6VXikddfby0oXfyySnV.png"
                alt="Senior Shortcut"
                className="object-cover"
              />
            </div>
            <h2 className="mb-2 text-xl font-bold">The Senior Shortcut</h2>
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline">#startup</Badge>
              <Badge variant="outline">#career</Badge>
              <Badge variant="outline">+3</Badge>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">Oct 12, 2024</p>
          </CardContent>
          <CardFooter className="border-t">
            <div className="flex w-full items-center justify-between">
              <Button variant="ghost" size="sm" className="gap-2">
                <ThumbsUp className="h-4 w-4" />
                234
              </Button>
              <Button variant="ghost" size="sm" className="gap-2">
                <MessageCircle className="h-4 w-4" />
                32
              </Button>
              <Button variant="ghost" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
