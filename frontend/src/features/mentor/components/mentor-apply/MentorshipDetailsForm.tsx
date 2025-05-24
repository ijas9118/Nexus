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
import { Link, useNavigate } from "react-router-dom";
import { useMentorForm } from "@/context/MentorFormContext";
import { useMutation, useQuery } from "@tanstack/react-query";
import MentorService from "@/services/mentorService";
import { toast } from "sonner";
import { MentorFormData } from "@/types/mentor";
import MentorshipTypeService from "@/services/mentorshipTypeService";
import TargetAudienceService from "@/services/targetAudienceService";

const MentorshipDetailsForm = ({ onBack }: { onBack: () => void }) => {
  const navigator = useNavigate();

  const { form } = useMentorForm();
  const {
    register,
    formState: { errors, isValid },
    setValue,
    watch,
    handleSubmit,
  } = form;

  const {
    data: mentorshipTypesOptions,
    isLoading: isMentorshipTypesLoading,
    isError: isMentorshipTypesError,
  } = useQuery({
    queryKey: ["mentorshipTypes"],
    queryFn: () => MentorshipTypeService.getAllTypes(),
  });

  const {
    data: targetAudienceOptions,
    isLoading: isTargetAudiencesLoading,
    isError: isTargetAudiencesError,
  } = useQuery({
    queryKey: ["targetAudiences"],
    queryFn: () => TargetAudienceService.getAll(),
  });

  console.log(targetAudienceOptions);

  const mentorshipTypes = watch("mentorshipDetails.mentorshipTypes", []);
  const targetAudiences = watch("mentorshipDetails.targetAudiences", []);

  const handleCheckboxChange = (
    field: "mentorshipTypes" | "targetAudiences",
    value: string,
    checked: boolean,
  ) => {
    const currentValues =
      field === "mentorshipTypes" ? mentorshipTypes : targetAudiences;
    let updatedValues = [...currentValues];

    if (checked) {
      updatedValues.push(value);
    } else {
      updatedValues = updatedValues.filter((item) => item !== value);
    }

    setValue(`mentorshipDetails.${field}`, updatedValues, {
      shouldValidate: true,
    });
  };

  const mutation = useMutation({
    mutationFn: (data: MentorFormData) => MentorService.applyAsMentor(data),
    onSuccess: () => {
      toast("Application submitted", {
        description: "We've received your mentor application.",
      });
      navigator("/mentors");
    },
    onError: () => {
      toast.error("Error", {
        description: "Failed to submit application. Please try again.",
      });
    },
  });

  const onSubmit = (data: MentorFormData) => {
    console.log(data);
    // mutation.mutate(data);
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
          {isMentorshipTypesLoading ? (
            <div>Loading mentorship types...</div>
          ) : isMentorshipTypesError ? (
            <div className="text-sm text-red-500">
              Failed to load mentorship types.
            </div>
          ) : (
            <div className="grid gap-2">
              {(mentorshipTypesOptions ?? []).map((type: any) => (
                <div key={type._id} className="flex items-start space-x-2">
                  <Checkbox
                    id={`mentorshipType-${type._id}`}
                    checked={mentorshipTypes.includes(type._id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "mentorshipTypes",
                        type._id,
                        checked === true,
                      )
                    }
                  />
                  <div>
                    <Label
                      htmlFor={`mentorshipType-${type._id}`}
                      className="text-sm font-medium"
                    >
                      {type.name}
                    </Label>
                    <p className="text-xs text-muted-foreground">
                      {type.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {errors.mentorshipDetails?.mentorshipTypes && (
            <p className="text-sm text-red-500">
              {errors.mentorshipDetails.mentorshipTypes.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>What is your target audience?</Label>
          {isTargetAudiencesLoading ? (
            <div>Loading target audiences...</div>
          ) : isTargetAudiencesError ? (
            <div className="text-sm text-red-500">
              Failed to load target audiences.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              {targetAudienceOptions?.map((audience: any) => (
                <div key={audience._id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`audience-${audience._id}`}
                    checked={targetAudiences.includes(audience._id)}
                    onCheckedChange={(checked) =>
                      handleCheckboxChange(
                        "targetAudiences",
                        audience._id,
                        checked === true,
                      )
                    }
                  />
                  <Label
                    htmlFor={`audience-${audience._id}`}
                    className="text-sm font-normal"
                  >
                    {audience.name}
                  </Label>
                </div>
              ))}
            </div>
          )}
          {errors.mentorshipDetails?.targetAudiences && (
            <p className="text-sm text-red-500">
              {errors.mentorshipDetails.targetAudiences.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="motivation">
            Why do you want to become a mentor?
          </Label>
          <Textarea
            id="motivation"
            placeholder="Tell us why you're interested in mentoring and what you hope to achieve..."
            className="min-h-[100px]"
            {...register("mentorshipDetails.motivation", {
              required: "Motivation is required",
            })}
          />
          {errors.mentorshipDetails?.motivation && (
            <p className="text-sm text-red-500">
              {errors.mentorshipDetails.motivation.message}
            </p>
          )}
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
        <Button
          onClick={handleSubmit(onSubmit)}
          disabled={!isValid || mutation.isPending}
        >
          {mutation.isPending ? "Submitting..." : "Submit Application"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorshipDetailsForm;
