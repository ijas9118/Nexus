import { useState } from "react";
import { useSelector } from "react-redux";
import { useQuery } from "@tanstack/react-query";
import { User, Briefcase, ChevronRight } from "lucide-react";
import type { RootState } from "@/store/store";
import MentorService from "@/services/mentorService";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import ExperienceForm from "./components/ExperienceForm";
import MentorshipDetailsForm from "./components/MentorshipDetailsForm";

export default function MentorSettings() {
  const { user } = useSelector((state: RootState) => state.auth);
  const [activeTab, setActiveTab] = useState("experience");

  const { data: mentorData } = useQuery({
    queryKey: ["mentorDetails"],
    queryFn: () => MentorService.getMentorDetails(user?.mentorId as string),
    enabled: !!user?.mentorId,
  });

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Mentor Settings</h1>
          <p className="text-muted-foreground">
            Manage your mentor profile, experience, and mentorship preferences.
          </p>
        </div>

        {/* Settings Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Sidebar */}
            <div className="md:w-64 flex-shrink-0">
              <div className="sticky top-20">
                <Card>
                  <CardContent className="p-4">
                    <TabsList className="flex flex-col h-auto w-full bg-transparent space-y-1">
                      <TabsTrigger
                        value="experience"
                        className="w-full justify-start px-3 py-2 h-10 font-medium data-[state=active]:bg-muted data-[state=active]:shadow-none"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <Briefcase className="h-4 w-4 mr-2" />
                            Experience
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TabsTrigger>
                      <TabsTrigger
                        value="mentorship"
                        className="w-full justify-start px-3 py-2 h-10 font-medium data-[state=active]:bg-muted data-[state=active]:shadow-none"
                      >
                        <div className="flex items-center justify-between w-full">
                          <div className="flex items-center">
                            <User className="h-4 w-4 mr-2" />
                            Mentorship Details
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </div>
                      </TabsTrigger>
                    </TabsList>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Content */}
            <div className="flex-1">
              <Card className="border-muted">
                <TabsContent value="experience" className="m-0">
                  <CardHeader className="border-b border-muted">
                    <CardTitle>Professional Experience</CardTitle>
                    <CardDescription>
                      Share your professional background and expertise to help
                      mentees understand your qualifications.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <ExperienceForm experience={mentorData?.experience} />
                  </CardContent>
                </TabsContent>

                <TabsContent value="mentorship" className="m-0">
                  <CardHeader className="border-b border-muted">
                    <CardTitle>Mentorship Preferences</CardTitle>
                    <CardDescription>
                      Configure how you want to provide mentorship and who you
                      want to help.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <MentorshipDetailsForm mentorData={mentorData} />
                  </CardContent>
                </TabsContent>
              </Card>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
