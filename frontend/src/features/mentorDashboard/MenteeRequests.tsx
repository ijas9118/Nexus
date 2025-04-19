import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/atoms/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import { useState } from "react";
import MenteeRequestList from "./components/mentee-request-list";

const MenteeRequests = () => {
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");

  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Mentee Requests</CardTitle>
          <CardDescription>Manage all your mentorship requests</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" onValueChange={setFilter}>
            <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="pending">Pending</TabsTrigger>
                <TabsTrigger value="approved">Approved</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
                <TabsTrigger value="rejected">Rejected</TabsTrigger>
              </TabsList>

              <div className="flex items-center space-x-2">
                <div className="grid gap-1.5">
                  <Label htmlFor="sort" className="sr-only">
                    Sort by
                  </Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort" className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="oldest">Oldest First</SelectItem>
                      <SelectItem value="nameAsc">Name (A-Z)</SelectItem>
                      <SelectItem value="nameDesc">Name (Z-A)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-1.5">
                  <Label htmlFor="search" className="sr-only">
                    Search
                  </Label>
                  <Input
                    id="search"
                    placeholder="Search mentees..."
                    className="w-[180px]"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="mt-6">
              <TabsContent value="all">
                <MenteeRequestList
                  filter="all"
                  search={search}
                  sortBy={sortBy}
                />
              </TabsContent>
              <TabsContent value="pending">
                <MenteeRequestList
                  filter="pending"
                  search={search}
                  sortBy={sortBy}
                />
              </TabsContent>
              <TabsContent value="approved">
                <MenteeRequestList
                  filter="approved"
                  search={search}
                  sortBy={sortBy}
                />
              </TabsContent>
              <TabsContent value="completed">
                <MenteeRequestList
                  filter="completed"
                  search={search}
                  sortBy={sortBy}
                />
              </TabsContent>
              <TabsContent value="rejected">
                <MenteeRequestList
                  filter="rejected"
                  search={search}
                  sortBy={sortBy}
                />
              </TabsContent>
            </div>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default MenteeRequests;
