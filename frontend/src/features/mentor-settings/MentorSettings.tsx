import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/organisms/tabs";
import MentorService from "@/services/mentorService";
import { RootState } from "@/store/store";
import { useQuery } from "@tanstack/react-query";
import { Settings } from "lucide-react";
import { useSelector } from "react-redux";
import ExperienceForm from "./components/ExperienceForm";

const MentorSettings = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  const { data } = useQuery({
    queryKey: ["mentorDetails"],
    queryFn: () => MentorService.getMentorDetails(user?.mentorId as string),
  });

  console.log(data);
  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 space-y-6">
      <div className="flex gap-2 items-center">
        <span>
          <Settings />
        </span>
        <h1 className="text-2xl font-bold text-foreground">Settings</h1>
      </div>
      <Tabs defaultValue="experience" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="mentorship">Mentorship Details</TabsTrigger>
        </TabsList>

        {/* Experience Tab */}
        <TabsContent value="experience">
          <ExperienceForm />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MentorSettings;
