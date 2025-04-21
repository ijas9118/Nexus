import { Button } from "@/components/atoms/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/molecules/card";
import { Checkbox } from "@/components/atoms/checkbox";
import { Label } from "@/components/atoms/label";
import { Textarea } from "@/components/atoms/textarea";
import { Link } from "react-router-dom";
import { useMentorForm } from "@/context/MentorFormContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import MentorService from "@/services/mentorService";
import { toast } from "sonner";
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import { Badge } from "@/components/atoms/badge";
import { formatLabel } from "@/utils";
import React from "react";

export const TIME_SLOTS = [
  "9:00 AM - 10:00 AM",
  "10:00 AM - 11:00 AM",
  "11:00 AM - 12:00 PM",
  "12:00 PM - 1:00 PM",
  "1:00 PM - 2:00 PM",
  "2:00 PM - 3:00 PM",
  "3:00 PM - 4:00 PM",
  "4:00 PM - 5:00 PM",
  "5:00 PM - 6:00 PM",
  "6:00 PM - 7:00 PM",
  "7:00 PM - 8:00 PM",
];

const MentorshipDetailsForm = ({ onBack }: { onBack: () => void }) => {
  const { formData, setFormData } = useMentorForm();

  const { data: enums, isLoading } = useQuery({
    queryKey: ["mentorEnums"],
    queryFn: MentorService.getMentorEnums,
  });

  const handleCheckboxChange = (
    field: "mentorshipTypes" | "targetAudiences",
    value: string,
    checked: boolean,
  ) => {
    setFormData((prev) => {
      const currentValues = prev.mentorshipDetails[field];
      let updatedValues = [...currentValues];

      if (checked) {
        updatedValues.push(value);
      } else {
        updatedValues = updatedValues.filter((item) => item !== value);
      }

      return {
        ...prev,
        mentorshipDetails: {
          ...prev.mentorshipDetails,
          [field]: updatedValues,
        },
      };
    });
  };

  const handleAvailabilityTypeChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      mentorshipDetails: {
        ...prev.mentorshipDetails,
        availabilityType: value,
      },
    }));
  };

  const handleTimeSlotChange = (timeSlot: string) => {
    setFormData((prev) => {
      const currentTimeSlots = prev.mentorshipDetails.availableTimeSlots;
      const updatedTimeSlots = currentTimeSlots.includes(timeSlot)
        ? currentTimeSlots.filter((slot) => slot !== timeSlot) // Deselect if already selected
        : [...currentTimeSlots, timeSlot]; // Select if not already selected

      return {
        ...prev,
        mentorshipDetails: {
          ...prev.mentorshipDetails,
          availableTimeSlots: updatedTimeSlots,
        },
      };
    });
  };

  const mutation = useMutation({
    mutationFn: (data: typeof formData) => MentorService.applyAsMentor(data),
    onSuccess: () => {
      toast("Application submitted", {
        description: "We've received your mentor application.",
      });
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to submit application. Please try again.",
      });
    },
  });

  const handleMotivationChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>,
  ) => {
    const { value } = e.target;
    setFormData((prev) => ({
      ...prev,
      mentorshipDetails: {
        ...prev.mentorshipDetails,
        motivation: value,
      },
    }));
  };

  const handleSubmit = () => {
    console.log(formData);
    mutation.mutate(formData);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mentorship Details</CardTitle>
        <CardDescription>Tell us how you would like to mentor</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-2">
          <Label>
            What type of mentorship are you interested in providing?
          </Label>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid gap-2">
              {enums?.mentorshipTypes.map((type: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`mentorshipType-${type}`}
                    checked={formData.mentorshipDetails.mentorshipTypes.includes(
                      type,
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "mentorshipTypes",
                        type,
                        checked === true,
                      )
                    }
                  />

                  <Label
                    htmlFor={`mentorshipType-${type}`}
                    className="text-sm font-normal"
                  >
                    {formatLabel(type)}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label>What is your target audience?</Label>
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {enums?.targetAudiences?.map((audience: any, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`audience-${audience}`}
                    checked={formData.mentorshipDetails.targetAudiences.includes(
                      audience,
                    )}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "targetAudiences",
                        audience,
                        checked === true,
                      )
                    }
                  />

                  <Label
                    htmlFor={`audience-${audience}`}
                    className="text-sm font-normal"
                  >
                    {formatLabel(audience)}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label>When are you available?</Label>
          <RadioGroup
            value={formData.mentorshipDetails.availabilityType}
            onValueChange={handleAvailabilityTypeChange}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekdays" id="weekdays" />
              <Label htmlFor="weekdays" className="text-sm font-normal">
                Weekdays
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="weekend" id="weekend" />
              <Label htmlFor="weekend" className="text-sm font-normal">
                Weekend
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="both" id="both" />
              <Label htmlFor="both" className="text-sm font-normal">
                Both
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-4">
          <Label>Select your available time slots</Label>
          <div className="flex flex-wrap gap-2">
            {TIME_SLOTS.map((timeSlot) => (
              <Badge
                key={timeSlot}
                variant={
                  formData.mentorshipDetails.availableTimeSlots.includes(
                    timeSlot,
                  )
                    ? "default"
                    : "outline"
                }
                className="cursor-pointer py-2 px-4"
                onClick={() => handleTimeSlotChange(timeSlot)}
              >
                {timeSlot}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="motivation">
            Why do you want to become a mentor?
          </Label>
          <Textarea
            id="motivation"
            placeholder="Tell us why you're interested in mentoring and what you hope to achieve..."
            className="min-h-[100px]"
            value={formData.mentorshipDetails.motivation}
            onChange={handleMotivationChange}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox id="terms" />
          <Label htmlFor="terms" className="text-sm font-normal">
            I agree to the{" "}
            <Link to="#" className="text-primary underline">
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link to="#" className="text-primary underline">
              Privacy Policy
            </Link>
          </Label>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button onClick={handleSubmit} disabled={mutation.isPending}>
          {mutation.isPending ? "Submitting..." : "Submit Application"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorshipDetailsForm;
