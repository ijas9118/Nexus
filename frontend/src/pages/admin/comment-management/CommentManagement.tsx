import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, Trash2 } from "lucide-react";
import { useState } from "react";
import CommentsList from "./CommentsList";
import CommentStats from "./CommentStats";
import CommentFilters from "./CommentFilters";
import { useQuery } from "@tanstack/react-query";
import { CommentService } from "@/services/admin/commentService";

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

const CommentManagement = () => {
  const [selectedSquad, setSelectedSquad] = useState<string | null>(null);
  const [selectedBlog, setSelectedBlog] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const {
    data: comments = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["comments"],
    queryFn: CommentService.getAllComment,
  });

  const filteredComments = comments.filter((comment: any) => {
    if (selectedBlog && comment.blogId !== selectedBlog) {
      return false;
    }

    if (!selectedBlog && selectedSquad) {
      const blogBelongsToSquad = blogs.find(
        (blog) => blog.id === comment.blogId && blog.squadId === selectedSquad
      );
      if (!blogBelongsToSquad) return false;
    }

    if (activeTab === "reported" && comment.status !== "reported") {
      return false;
    }
    if (activeTab === "deleted" && comment.status !== "deleted") {
      return false;
    }
    if (activeTab === "all" && comment.status === "deleted") {
      return false;
    }

    if (
      searchQuery &&
      !comment.content.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  const handleSquadChange = (value: string) => {
    setSelectedSquad(value);
    setSelectedBlog(null);
  };

  const handleBlogChange = (value: string) => {
    setSelectedBlog(value);
  };


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

      <CommentStats />
      <CommentFilters
        squads={squads}
        blogs={blogs}
        selectedSquad={selectedSquad}
        setSelectedSquad={handleSquadChange}
        selectedBlog={selectedBlog}
        setSelectedBlog={handleBlogChange}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <Tabs defaultValue="all" className="w-full" onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="all">All Comments</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="reported">Reported</TabsTrigger>
            <TabsTrigger value="deleted">Deleted</TabsTrigger>
          </TabsList>
        </div>

        {isLoading ? (
          <p>Loading comments...</p>
        ) : isError ? (
          <p>Error loading comments.</p>
        ) : (
          <>
            <TabsContent value="all" className="mt-4">
              <CommentsList
                comments={filteredComments}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            <TabsContent value="active" className="mt-4">
              <CommentsList
                comments={filteredComments.filter(
                  (comment: any) => comment.status === "active"
                )}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            <TabsContent value="reported" className="mt-4">
              <CommentsList
                comments={filteredComments.filter(
                  (comment: any) => comment.status === "reported"
                )}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
            <TabsContent value="deleted" className="mt-4">
              <CommentsList
                comments={filteredComments.filter(
                  (comment: any) => comment.status === "deleted"
                )}
                getStatusBadge={getStatusBadge}
              />
            </TabsContent>
          </>
        )}

        {/* <TabsContent value="all" className="mt-4">
          <CommentsList
            comments={filteredComments}
            getBlogTitle={getBlogTitle}
            getStatusBadge={getStatusBadge}
          />
        </TabsContent>
        <TabsContent value="active" className="mt-4">
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
        </TabsContent> */}
      </Tabs>
    </div>
  );
};

export default CommentManagement;
