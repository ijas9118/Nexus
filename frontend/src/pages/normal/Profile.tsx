import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { PlusIcon } from "lucide-react";

const UserProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  // Dummy data - replace with actual user data
  const user = {
    name: "Jane Doe",
    email: "jane.doe@example.com",
    profilePic: "/placeholder.svg?height=100&width=100",
    gender: "Female",
    place: "New York, USA",
    followers: 1234,
    following: 567,
    connections: 890,
    postsCount: 50,
    totalViews: 10000,
    totalLikes: 5000,
    bio: "Passionate developer | Open source enthusiast | Coffee lover",
    joinedSquads: [
      { name: "React Devs", members: 1500, image: "/placeholder.svg?height=50&width=50" },
      {
        name: "UI/UX Design",
        members: 2000,
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        name: "Web3 Explorers",
        members: 800,
        image: "/placeholder.svg?height=50&width=50",
      },
    ],
    streak: {
      current: 15,
      longest: 30,
      total: 100,
    },
    skills: ["React", "JavaScript", "TypeScript", "Node.js", "GraphQL"],
    socials: {
      github: "janedoe",
      linkedin: "jane-doe",
    },
  };

  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="container mx-auto p-4 space-y-6 w-2/3">
      {/* Main Profile Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-4">
              <Avatar className="w-24 h-24">
                <AvatarImage src={user.profilePic} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold">{user.name}</h1>
                <p className="text-gray-500">{user.email}</p>
                <p className="text-gray-500">
                  {user.gender} | {user.place}
                </p>
              </div>
            </div>
            <Button onClick={toggleEdit}>{isEditing ? "Save" : "Edit Profile"}</Button>
          </div>

          {isEditing && (
            <div className="mt-4 space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={user.email} />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Input id="gender" defaultValue={user.gender} />
              </div>
              <div>
                <Label htmlFor="place">Place</Label>
                <Input id="place" defaultValue={user.place} />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.followers}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Following</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.following}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Connections</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{user.connections}</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Stats */}
      <Card>
        <CardHeader>
          <CardTitle>Content Statistics</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-lg font-semibold">Posts</p>
            <p className="text-3xl font-bold">{user.postsCount}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Views</p>
            <p className="text-3xl font-bold">{user.totalViews}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Likes</p>
            <p className="text-3xl font-bold">{user.totalLikes}</p>
          </div>
        </CardContent>
      </Card>

      {/* Bio Section */}
      <Card>
        <CardHeader>
          <CardTitle>Bio</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? <Textarea defaultValue={user.bio} /> : <p>{user.bio}</p>}
        </CardContent>
      </Card>

      {/* Joined Squads */}
      <Card>
        <CardHeader>
          <CardTitle>Joined Squads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {user.joinedSquads.map((squad, index) => (
              <Card key={index}>
                <CardContent className="p-4 flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={squad.image} alt={squad.name} />
                    <AvatarFallback>{squad.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{squad.name}</p>
                    <p className="text-sm text-gray-500">{squad.members} members</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Streak Section */}
      <Card>
        <CardHeader>
          <CardTitle>Streak</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-4">
          <div>
            <p className="text-lg font-semibold">Current</p>
            <p className="text-3xl font-bold">{user.streak.current} days</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Longest</p>
            <p className="text-3xl font-bold">{user.streak.longest} days</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Total</p>
            <p className="text-3xl font-bold">{user.streak.total} days</p>
          </div>
        </CardContent>
      </Card>

      {/* Skills Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            Skills
            {isEditing && (
              <Button size="sm" variant="outline">
                <PlusIcon className="w-4 h-4 mr-2" />
                Add Skill
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <Badge key={index} variant="secondary">
                {skill}
                {isEditing && (
                  <button className="ml-2 text-gray-500 hover:text-gray-700">x</button>
                )}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Socials Section */}
      <Card>
        <CardHeader>
          <CardTitle>Social Profiles</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Label htmlFor="github">GitHub:</Label>
              {isEditing ? (
                <Input id="github" defaultValue={user.socials.github} />
              ) : (
                <a
                  href={`https://github.com/${user.socials.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {user.socials.github}
                </a>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Label htmlFor="linkedin">LinkedIn:</Label>
              {isEditing ? (
                <Input id="linkedin" defaultValue={user.socials.linkedin} />
              ) : (
                <a
                  href={`https://linkedin.com/in/${user.socials.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  {user.socials.linkedin}
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Change Password */}
      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div>
              <Label htmlFor="current-password">Current Password</Label>
              <Input id="current-password" type="password" />
            </div>
            <div>
              <Label htmlFor="new-password">New Password</Label>
              <Input id="new-password" type="password" />
            </div>
            <div>
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input id="confirm-password" type="password" />
            </div>
            <Button type="submit">Change Password</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserProfile;
