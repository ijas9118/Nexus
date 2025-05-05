import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/organisms/form";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/molecules/card";
import { Input } from "@/components/atoms/input";
import { Textarea } from "@/components/atoms/textarea";
import { Badge } from "@/components/atoms/badge";
import { ScrollArea } from "@/components/organisms/scroll-area";
import { Check, X } from "lucide-react";

// Define props for MentorshipDetailsForm
interface MentorshipDetailsFormProps {
  form: any; // You might want to type this more specifically based on your form library
  mentorshipTypesList: { id: string; name: string; description: string }[];
  targetAudiences: string[];
  selectedMentorshipTypes: string[];
  setSelectedMentorshipTypes: (items: string[]) => void;
  selectedTargetAudiences: string[];
  setSelectedTargetAudiences: (items: string[]) => void;
  updateFormValues: () => void;
}

export default function MentorshipDetailsForm({
  form,
  mentorshipTypesList,
  targetAudiences,
  selectedMentorshipTypes,
  setSelectedMentorshipTypes,
  selectedTargetAudiences,
  setSelectedTargetAudiences,
  updateFormValues,
}: MentorshipDetailsFormProps) {
  // Toggle selection for multi-select fields
  const toggleSelection = (
    item: string,
    currentSelection: string[],
    setSelection: (items: string[]) => void,
  ) => {
    if (currentSelection.includes(item)) {
      setSelection(currentSelection.filter((i) => i !== item));
    } else {
      setSelection([...currentSelection, item]);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader className="text-card-foreground">
        <CardTitle className="text-2xl">Mentorship Details</CardTitle>
        <CardDescription>
          Configure your mentorship preferences and offerings
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <FormField
          control={form.control}
          name="mentorshipDetails.mentorshipTypes"
          render={() => (
            <FormItem>
              <FormLabel>Mentorship Types</FormLabel>
              <FormControl>
                <div className="border rounded-md p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedMentorshipTypes.map((type) => (
                      <Badge
                        key={type}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1.5"
                      >
                        {type}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => {
                            toggleSelection(
                              type,
                              selectedMentorshipTypes,
                              setSelectedMentorshipTypes,
                            );
                            updateFormValues();
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                  <ScrollArea className="h-60 rounded-md border">
                    <div className="p-4 space-y-3">
                      {mentorshipTypesList.map((type) => (
                        <div
                          key={type.id}
                          className={`flex items-start p-3 rounded-md cursor-pointer transition-colors ${
                            selectedMentorshipTypes.includes(type.name)
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => {
                            toggleSelection(
                              type.name,
                              selectedMentorshipTypes,
                              setSelectedMentorshipTypes,
                            );
                            updateFormValues();
                          }}
                        >
                          <div className="flex items-center gap-2">
                            {selectedMentorshipTypes.includes(type.name) ? (
                              <Check className="h-4 w-4 text-primary mt-0.5" />
                            ) : (
                              <div className="w-4" />
                            )}
                            <div>
                              <div className="font-medium">{type.name}</div>
                              <div className="text-sm text-muted-foreground">
                                {type.description}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </FormControl>
              <FormDescription>
                Select the types of mentorship you offer
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mentorshipDetails.targetAudiences"
          render={() => (
            <FormItem>
              <FormLabel>Target Audiences</FormLabel>
              <FormControl>
                <div className="border rounded-md p-4">
                  <div className="flex flex-wrap gap-2 mb-3">
                    {selectedTargetAudiences.map((audience) => (
                      <Badge
                        key={audience}
                        variant="secondary"
                        className="flex items-center gap-1 px-3 py-1.5"
                      >
                        {audience}
                        <X
                          className="h-3 w-3 cursor-pointer"
                          onClick={() => {
                            toggleSelection(
                              audience,
                              selectedTargetAudiences,
                              setSelectedTargetAudiences,
                            );
                            updateFormValues();
                          }}
                        />
                      </Badge>
                    ))}
                  </div>
                  <ScrollArea className="h-40 rounded-md border">
                    <div className="p-4 grid grid-cols-2 gap-2">
                      {targetAudiences.map((audience) => (
                        <div
                          key={audience}
                          className={`flex items-center gap-2 p-2 rounded-md cursor-pointer transition-colors ${
                            selectedTargetAudiences.includes(audience)
                              ? "bg-primary/10 text-primary"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => {
                            toggleSelection(
                              audience,
                              selectedTargetAudiences,
                              setSelectedTargetAudiences,
                            );
                            updateFormValues();
                          }}
                        >
                          {selectedTargetAudiences.includes(audience) && (
                            <Check className="h-4 w-4 text-primary" />
                          )}
                          <span
                            className={
                              selectedTargetAudiences.includes(audience)
                                ? "ml-0"
                                : "ml-6"
                            }
                          >
                            {audience.replace("-", " ")}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>
              </FormControl>
              <FormDescription>
                Select the audiences you want to mentor
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mentorshipDetails.availabilityType"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Availability Type</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g. weekdays"
                  {...field}
                  disabled
                  className="bg-muted/50"
                />
              </FormControl>
              <FormDescription>
                This field cannot be edited directly
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="mentorshipDetails.motivation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Motivation</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Share why you want to be a mentor..."
                  className="min-h-32 resize-none"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                Explain your motivation for mentoring others
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
}
