import { Checkbox } from "@/components/atoms/checkbox";
import { Label } from "@/components/atoms/label";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/molecules/accordion";
import { Filter } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import MentorService from "@/services/mentorService";

const sectionTitles = {
  expertiseAreas: "Expertise Areas",
  experienceLevels: "Experience Level",
  mentorshipTypes: "Mentorship Types",
  targetAudiences: "Target Audience",
  technologies: "Technologies",
};

const MentorFilters = () => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["filters"],
    queryFn: MentorService.getMentorEnums,
  });

  if (isLoading) {
    return (
      <div className="sticky top-0 h-screen overflow-y-auto w-[260px] space-y-6 pr-4">
        <div className="flex gap-3 items-center">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Filters</h3>
        </div>
        <div className="space-y-4">
          <div className="h-4 w-full animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-1/2 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="sticky top-0 h-screen overflow-y-auto w-[260px] space-y-6 pr-4">
        <div className="flex gap-3 items-center">
          <Filter className="h-4 w-4" />
          <h3 className="font-medium">Filters</h3>
        </div>
        <div className="text-red-500 text-sm">
          Error loading filters: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="sticky top-0 h-screen overflow-y-auto w-[260px] space-y-6 pr-4">
      <div className="flex gap-3 items-center">
        <Filter className="h-4 w-4" />
        <h3 className="font-medium">Filters</h3>
      </div>
      <Accordion type="multiple" defaultValue={[]} className="w-full">
        {data &&
          Object.entries(data).map(([key, values]) => {
            if (!(key in sectionTitles)) return null;

            return (
              <AccordionItem key={key} value={key}>
                <AccordionTrigger className="text-sm font-medium">
                  {sectionTitles[key as keyof typeof sectionTitles]}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 pt-2">
                    {values.map((item) => (
                      <div key={item} className="flex items-center space-x-2">
                        <Checkbox id={`${key}-${item}`} />
                        <Label
                          htmlFor={`${key}-${item}`}
                          className="text-sm capitalize"
                        >
                          {item}
                        </Label>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
      </Accordion>
    </div>
  );
};

export default MentorFilters;
