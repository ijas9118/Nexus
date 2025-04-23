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
import { RadioGroup, RadioGroupItem } from "@/components/atoms/radio-group";
import { formatLabel } from "@/utils";
import { MentorFormData } from "@/types/mentor";

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

  const { data: enums, isLoading } = useQuery({
    queryKey: ["mentorEnums"],
    queryFn: MentorService.getMentorEnums,
  });

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
    mutation.mutate(data);
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
                    checked={mentorshipTypes.includes(type)}
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
          {errors.mentorshipDetails?.mentorshipTypes && (
            <p className="text-sm text-red-500">
              {errors.mentorshipDetails.mentorshipTypes.message}
            </p>
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
                    checked={targetAudiences.includes(audience)}
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
          {errors.mentorshipDetails?.targetAudiences && (
            <p className="text-sm text-red-500">
              {errors.mentorshipDetails.targetAudiences.message}
            </p>
          )}
        </div>

        <div className="grid gap-2">
          <Label>When are you available?</Label>
          <RadioGroup
            value={watch("mentorshipDetails.availabilityType")}
            onValueChange={(value) =>
              setValue("mentorshipDetails.availabilityType", value, {
                shouldValidate: true,
              })
            }
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
          {errors.mentorshipDetails?.availabilityType && (
            <p className="text-sm text-red-500">
              {errors.mentorshipDetails.availabilityType.message}
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
