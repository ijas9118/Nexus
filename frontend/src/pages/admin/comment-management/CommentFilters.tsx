import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface CommentFiltersProps {
  squads: { id: string; name: string }[];
  blogs: { id: string; title: string; squadId: string }[];
  selectedSquad: string | null;
  setSelectedSquad: (value: string) => void;
  selectedBlog: string | null;
  setSelectedBlog: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

const CommentFilters = ({
  squads,
  blogs,
  selectedSquad,
  setSelectedSquad,
  selectedBlog,
  setSelectedBlog,
  searchQuery,
  setSearchQuery,
}: CommentFiltersProps) => {
  const filteredBlogs = selectedSquad
    ? blogs.filter((blog) => blog.squadId === selectedSquad)
    : blogs;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Squad</label>
        <Select onValueChange={setSelectedSquad}>
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
        <Select onValueChange={setSelectedBlog} disabled={!selectedSquad}>
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
  );
};

export default CommentFilters;
