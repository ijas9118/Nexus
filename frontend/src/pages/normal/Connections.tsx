import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Briefcase,
  Building2,
  GraduationCap,
  Grid2X2,
  List,
  MapPin,
  MessageCircle,
  Search,
  UserMinus,
  Users,
} from "lucide-react";
import { FC, useState } from "react";

const connections = [
  {
    id: "1",
    name: "Sarah Wilson",
    role: "Senior Software Engineer",
    company: "Google",
    location: "San Francisco, CA",
    industry: "Technology",
    education: "Stanford University",
    mutualConnections: 12,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    background: "https://source.unsplash.com/400x100/?technology",
  },
  {
    id: "2",
    name: "Michael Chen",
    role: "Product Manager",
    company: "Microsoft",
    location: "Seattle, WA",
    industry: "Technology",
    education: "University of Washington",
    mutualConnections: 8,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    background: "https://source.unsplash.com/400x100/?office",
  },
  {
    id: "3",
    name: "Emily Brown",
    role: "UX Designer",
    company: "Apple",
    location: "Cupertino, CA",
    industry: "Design",
    education: "Rhode Island School of Design",
    mutualConnections: 15,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    background: "https://source.unsplash.com/400x100/?design",
  },
  {
    id: "4",
    name: "David Kim",
    role: "Data Scientist",
    company: "Netflix",
    location: "Los Angeles, CA",
    industry: "Entertainment",
    education: "UC Berkeley",
    mutualConnections: 6,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
    background: "https://source.unsplash.com/400x100/?data",
  },
  {
    id: "5",
    name: "Lisa Johnson",
    role: "Marketing Director",
    company: "Adobe",
    location: "New York, NY",
    industry: "Marketing",
    education: "NYU",
    mutualConnections: 20,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    background: "https://source.unsplash.com/400x100/?marketing",
  },
  {
    id: "6",
    name: "James Wilson",
    role: "Frontend Developer",
    company: "Amazon",
    location: "Seattle, WA",
    industry: "Technology",
    education: "MIT",
    mutualConnections: 10,
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    background: "https://source.unsplash.com/400x100/?coding",
  },
];

const industries = [
  "All Industries",
  "Technology",
  "Design",
  "Marketing",
  "Entertainment",
];
const locations = [
  "All Locations",
  "San Francisco, CA",
  "Seattle, WA",
  "New York, NY",
  "Los Angeles, CA",
];

const Connections: FC = () => {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIndustry, setSelectedIndustry] = useState("All Industries");
  const [selectedLocation, setSelectedLocation] = useState("All Locations");

  // Filter connections based on search query and filters
  const filteredConnections = connections.filter((connection) => {
    const matchesSearch =
      connection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      connection.company.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesIndustry =
      selectedIndustry === "All Industries" || connection.industry === selectedIndustry;
    const matchesLocation =
      selectedLocation === "All Locations" || connection.location === selectedLocation;

    return matchesSearch && matchesIndustry && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Connections</h1>
            <p className="text-gray-500">{connections.length} connections</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant={view === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("grid")}
            >
              <Grid2X2 className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "default" : "outline"}
              size="icon"
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search connections..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Industry" />
            </SelectTrigger>
            <SelectContent>
              {industries.map((industry) => (
                <SelectItem key={industry} value={industry}>
                  {industry}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedLocation} onValueChange={setSelectedLocation}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent>
              {locations.map((location) => (
                <SelectItem key={location} value={location}>
                  {location}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Connections Grid/List */}
        <div
          className={`grid gap-6 ${
            view === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
          }`}
        >
          {filteredConnections.map((connection) => (
            <Card key={connection.id} className="overflow-hidden">
              <div
                className="h-24 bg-cover bg-center"
                style={{ backgroundImage: `url(${connection.background})` }}
              />
              <CardContent className="pt-0">
                <div className="flex flex-col items-center -mt-12 text-center">
                  <Avatar className="h-24 w-24 border-4 border-white">
                    <AvatarImage src={connection.avatar} />
                    <AvatarFallback>
                      {connection.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <h3 className="mt-2 font-semibold text-lg">{connection.name}</h3>
                  <p className="text-sm text-gray-500">{connection.role}</p>

                  <div className="mt-4 space-y-2 w-full">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Building2 className="h-4 w-4" />
                      {connection.company}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <MapPin className="h-4 w-4" />
                      {connection.location}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Briefcase className="h-4 w-4" />
                      {connection.industry}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <GraduationCap className="h-4 w-4" />
                      {connection.education}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Users className="h-4 w-4" />
                      {connection.mutualConnections} mutual connections
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Message
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <UserMinus className="h-4 w-4 mr-2" />
                          Remove
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Remove Connection</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to remove {connection.name} from your
                            connections? This action cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end gap-2 mt-4">
                          <Button variant="outline">Cancel</Button>
                          <Button variant="destructive">Remove</Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredConnections.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No connections found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Connections;
