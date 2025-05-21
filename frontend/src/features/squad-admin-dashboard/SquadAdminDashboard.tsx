import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/organisms/tabs";
import { Input } from "@/components/atoms/input";
import { Search } from "lucide-react";
import DashboardHeader from "./components/dashboard-header";
import StatsOverview from "./components/stats-overview";
import AllSquadsTab from "./components/all-squads-tab";
import PendingContentTab from "./components/pending-content-tab";
import ActiveSquadsTab from "./components/active-squads-tab";
import InviteModeratorDialog from "./components/invite-moderator-dialog";

// Mock service functions - replace with actual API calls
export const fetchSquadStats = async (): Promise<SquadStats> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));

  return {
    totalSquads: 12,
    totalMembers: 3450,
    totalContent: 876,
    pendingContent: 24,
    totalModerators: 18,
    activeSquads: [
      {
        id: "1",
        name: "Node.js Developers",
        description:
          "A community for Node.js developers to share knowledge and resources",
        membersCount: 1250,
        contentCount: 320,
        pendingCount: 8,
        moderatorsCount: 3,
        thumbnailUrl: "/placeholder.svg?height=100&width=100",
        createdAt: new Date(Date.now() - 7776000000).toISOString(), // 90 days ago
      },
      {
        id: "2",
        name: "React Enthusiasts",
        description:
          "Everything about React, React Native, and the React ecosystem",
        membersCount: 980,
        contentCount: 245,
        pendingCount: 12,
        moderatorsCount: 4,
        thumbnailUrl: "/placeholder.svg?height=100&width=100",
        createdAt: new Date(Date.now() - 15552000000).toISOString(), // 180 days ago
      },
      {
        id: "3",
        name: "Python Coders",
        description:
          "Python programming, libraries, frameworks, and best practices",
        membersCount: 1120,
        contentCount: 311,
        pendingCount: 4,
        moderatorsCount: 5,
        thumbnailUrl: "/placeholder.svg?height=100&width=100",
        createdAt: new Date(Date.now() - 31104000000).toISOString(), // 360 days ago
      },
    ],
  };
};

export const searchUsers = async (query: string): Promise<User[]> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Return mock data
  return [
    {
      id: "1",
      name: "Jane Smith",
      username: "janesmith",
      email: "jane.smith@example.com",
      profilePic: "/placeholder.svg?height=40&width=40",
      isAdmin: false,
      isModerator: true,
    },
    {
      id: "2",
      name: "John Doe",
      username: "johndoe",
      email: "john.doe@example.com",
      profilePic: "/placeholder.svg?height=40&width=40",
      isAdmin: false,
      isModerator: false,
    },
    {
      id: "3",
      name: "Alex Johnson",
      username: "alexj",
      email: "alex.johnson@example.com",
      profilePic: "/placeholder.svg?height=40&width=40",
      isAdmin: false,
      isModerator: true,
    },
  ].filter(
    (user) =>
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.username.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()),
  );
};

export const inviteUserAsModerator = async (
  userId: string,
  squadId: string,
): Promise<void> => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  return;
};

export interface Squad {
  id: string;
  name: string;
  description: string;
  membersCount: number;
  contentCount: number;
  pendingCount: number;
  moderatorsCount: number;
  thumbnailUrl?: string;
  createdAt: string;
}

export interface SquadStats {
  totalSquads: number;
  totalMembers: number;
  totalContent: number;
  pendingContent: number;
  totalModerators: number;
  activeSquads: Squad[];
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  profilePic?: string;
  isAdmin: boolean;
  isModerator: boolean;
}

export default function SquadAdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSquad, setSelectedSquad] = useState<Squad | null>(null);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Fetch squad stats
  const { data: squadStats, isLoading } = useQuery({
    queryKey: ["squadStats"],
    queryFn: fetchSquadStats,
  });

  const openInviteDialog = (squad: Squad) => {
    setSelectedSquad(squad);
    setIsInviteDialogOpen(true);
  };

  return (
    <div className="container mx-auto py-6 max-w-7xl">
      <DashboardHeader />

      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-lg font-medium mb-2">
              Loading dashboard data...
            </div>
            <div className="text-sm text-muted-foreground">
              Please wait while we fetch your statistics
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Overview Stats */}
          <StatsOverview stats={squadStats} />

          {/* Squads Management */}
          <Tabs defaultValue="all" className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <TabsList>
                <TabsTrigger value="all">All Squads</TabsTrigger>
                <TabsTrigger value="pending">With Pending Content</TabsTrigger>
                <TabsTrigger value="active">Most Active</TabsTrigger>
              </TabsList>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search squads..."
                  className="w-[250px] pl-8"
                />
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              <AllSquadsTab
                squads={squadStats?.activeSquads || []}
                onInviteModerator={openInviteDialog}
              />
            </TabsContent>

            <TabsContent value="pending" className="mt-0">
              <PendingContentTab
                squads={
                  squadStats?.activeSquads.filter(
                    (squad) => squad.pendingCount > 0,
                  ) || []
                }
              />
            </TabsContent>

            <TabsContent value="active" className="mt-0">
              <ActiveSquadsTab
                squads={squadStats?.activeSquads || []}
                onInviteModerator={openInviteDialog}
              />
            </TabsContent>
          </Tabs>
        </>
      )}

      {/* Invite Moderator Dialog */}
      <InviteModeratorDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        selectedSquad={selectedSquad}
        selectedUser={selectedUser}
        setSelectedUser={setSelectedUser}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
    </div>
  );
}
