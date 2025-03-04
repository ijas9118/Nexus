import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertTriangle,
  BarChart,
  CheckCircle,
  Flag,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import { useState } from "react";
import CommentsList from "./CommentsList";

// Mock data for demonstration
const squads = [
  { id: "1", name: "Engineering" },
  { id: "2", name: "Design" },
  { id: "3", name: "Marketing" },
  { id: "4", name: "Product" },
];

const blogs = [
  { id: "1", title: "Getting Started with React", squadId: "1" },
  { id: "2", title: "Advanced TypeScript Patterns", squadId: "1" },
  { id: "3", title: "UI Design Principles", squadId: "2" },
  { id: "4", title: "Color Theory Basics", squadId: "2" },
  { id: "5", title: "Content Marketing Strategies", squadId: "3" },
  { id: "6", title: "SEO Best Practices", squadId: "3" },
  { id: "7", title: "Product Roadmap Planning", squadId: "4" },
  { id: "8", title: "User Research Methods", squadId: "4" },
];

const comments = [
  {
    id: "1",
    blogId: "1",
    author: "Jane Cooper",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "2 hours ago",
    content:
      "This article was incredibly helpful! I've been struggling with React hooks and this cleared things up.",
    status: "active",
  },
  {
    id: "2",
    blogId: "1",
    author: "Alex Morgan",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "5 hours ago",
    content:
      "Could you elaborate more on useEffect cleanup functions? I'm still confused about when to use them.",
    status: "reported",
  },
  {
    id: "3",
    blogId: "2",
    author: "Devon Lane",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "1 day ago",
    content:
      "The type inference examples were spot on! Would love to see more content on conditional types.",
    status: "active",
  },
  {
    id: "4",
    blogId: "3",
    author: "Esther Howard",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "2 days ago",
    content:
      "I disagree with your take on minimalism. It's not just about removing elements but about intentionality.",
    status: "deleted",
  },
  {
    id: "5",
    blogId: "5",
    author: "Cameron Williamson",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "3 days ago",
    content:
      "Your content marketing funnel breakdown was exactly what our team needed. Implementing these strategies ASAP!",
    status: "active",
  },
  {
    id: "6",
    blogId: "7",
    author: "Leslie Alexander",
    avatar: "/placeholder.svg?height=40&width=40",
    date: "4 days ago",
    content:
      "The roadmap template is fantastic. Would you consider doing a follow-up on how to handle stakeholder feedback?",
    status: "reported",
  },
];

const CommentManagement = () => {
  const [selectedSquad, setSelectedSquad] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter blogs based on selected squad
  const filteredBlogs = selectedSquad
    ? blogs.filter((blog) => blog.squadId === selectedSquad)
    : blogs;

  // Filter comments based on selected blog and squad
  const filteredComments = comments.filter((comment) => {
    // Filter by blog if selected
    if (selectedBlog && comment.blogId !== selectedBlog) {
      return false;
    }

    // Filter by squad if selected (and no blog is selected)
    if (!selectedBlog && selectedSquad) {
      const blogBelongsToSquad = blogs.find(
        (blog) => blog.id === comment.blogId && blog.squadId === selectedSquad
      );
      if (!blogBelongsToSquad) return false;
    }

    // Filter by status tab
    if (activeTab === "reported" && comment.status !== "reported") {
      return false;
    }
    if (activeTab === "deleted" && comment.status !== "deleted") {
      return false;
    }
    if (activeTab === "all" && comment.status === "deleted") {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !comment.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Handle squad selection
  const handleSquadChange = (value: string) => {
    setSelectedSquad(value);
    setSelectedBlog(null); // Reset blog selection when squad changes
  };

  // Handle blog selection
  const handleBlogChange = (value: string) => {
    setSelectedBlog(value);
  };

  // Get blog title by ID
  const getBlogTitle = (blogId: string) => {
    const blog = blogs.find((blog) => blog.id === blogId);
    return blog ? blog.title : "Unknown Blog";
  };

  // Get status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge
            variant="outline"
            className="bg-green-50 text-green-700 border-green-200"
          >
            <CheckCircle className="w-3 h-3 mr-1" /> Active
          </Badge>
        );
      case "reported":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-50 text-yellow-700 border-yellow-200"
          >
            <AlertTriangle className="w-3 h-3 mr-1" /> Reported
          </Badge>
        );
      case "deleted":
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <Trash2 className="w-3 h-3 mr-1" /> Deleted
          </Badge>
        );
      default:
        return null;
    }
  };
  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-18 py-8">
      <div className="flex flex-col space-y-2 mb-4">
        <h1 className="text-3xl font-semibold">Comment Management</h1>
        <p className="text-muted-foreground">
          Manage and moderate comments across all blogs and squads.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-5">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Comments</p>
              <h3 className="text-3xl font-bold">102</h3>
            </div>
            <div className="p-3 bg-primary/10 rounded-full">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Reported</p>
              <h3 className="text-3xl font-bold">12</h3>
            </div>
            <div className="p-3 bg-amber-500/10 rounded-full">
              <Flag className="h-6 w-6 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Deleted</p>
              <h3 className="text-3xl font-bold">32</h3>
            </div>
            <div className="p-3 bg-destructive/10 rounded-full">
              <Trash2 className="h-6 w-6 text-destructive" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">New Today</p>
              <h3 className="text-3xl font-bold">12</h3>
            </div>
            <div className="p-3 bg-green-500/10 rounded-full">
              <BarChart className="h-6 w-6 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Squad</label>
          <Select onValueChange={handleSquadChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select a squad" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Squads</SelectLabel>
                {squads.map((squad) => (
                  <SelectItem key={squad.id} value={squad.id}>
                    {squad.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Blog</label>
          <Select onValueChange={handleBlogChange} disabled={!selectedSquad}>
            <SelectTrigger>
              <SelectValue
                placeholder={selectedSquad ? "Select a blog" : "Select a squad first"}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Blogs</SelectLabel>
                {filteredBlogs.map((blog) => (
                  <SelectItem key={blog.id} value={blog.id}>
                    {blog.title}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-medium">Search</label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search comments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </div>
      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Comments</TabsTrigger>
            <TabsTrigger value="reported">Reported</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="all" className="mt-4">
          <CommentsList
            comments={filteredComments}
            getBlogTitle={getBlogTitle}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="reported" className="mt-4">
          <CommentsList
            comments={filteredComments}
            getBlogTitle={getBlogTitle}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="deleted" className="mt-4">
          <CommentsList
            comments={filteredComments}
            getBlogTitle={getBlogTitle}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CommentManagement;
