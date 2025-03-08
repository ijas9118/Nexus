import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Link } from "react-router-dom";
import {
  AVAILABILITY_OPTIONS,
  MENTORSHIP_TYPES,
  TARGET_AUDIENCES,
} from "../constants";
import CheckboxGroup from "./CheckboxGroup";

interface MentorshipDetailsFormProps {
  onBack: () => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const MentorshipDetailsForm: React.FC<MentorshipDetailsFormProps> = ({
  onBack,
  onSubmit,
  isSubmitting,
}) => {
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
          <CheckboxGroup items={MENTORSHIP_TYPES} idPrefix="type" columns={1} />
        </div>

        <div className="grid gap-2">
          <Label>What is your target audience?</Label>
          <CheckboxGroup
            items={TARGET_AUDIENCES}
            idPrefix="audience"
            columns={2}
          />
        </div>

        <div className="grid gap-2">
          <Label htmlFor="availability">Weekly Availability</Label>
          <Input id="availability" placeholder="e.g. 5-10 hours per week" />
        </div>

        <div className="grid gap-2">
          <Label>Preferred Availability</Label>
          <CheckboxGroup
            items={AVAILABILITY_OPTIONS}
            idPrefix="time"
            columns={1}
          />
        </div>

        <div className="grid gap-2">
          <Label>Preferred Session Duration</Label>
          <RadioGroup defaultValue="45min">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="30min" id="duration-30" />
              <Label htmlFor="duration-30" className="text-sm font-normal">
                30 minutes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="45min" id="duration-45" />
              <Label htmlFor="duration-45" className="text-sm font-normal">
                45 minutes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="60min" id="duration-60" />
              <Label htmlFor="duration-60" className="text-sm font-normal">
                60 minutes
              </Label>
            </div>
          </RadioGroup>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="pricing">Preferred Hourly Rate (USD)</Label>
          <Input id="pricing" placeholder="e.g. $100" />
          <p className="text-sm text-muted-foreground">
            You can adjust your pricing later.
          </p>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="motivation">
            Why do you want to become a mentor?
          </Label>
          <Textarea
            id="motivation"
            placeholder="Tell us why you're interested in mentoring and what you hope to achieve..."
            className="min-h-[100px]"
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
        <Button onClick={() => onSubmit()} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MentorshipDetailsForm;
