import { Input } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/molecules/card";

// Define props for ExperienceForm
// interface ExperienceFormProps {

// }

export default function ExperienceForm() {
  return (
    <Card className="shadow-md">
      <CardHeader className="text-card-foreground">
        <CardTitle className="text-2xl">Professional Experience</CardTitle>
        <CardDescription>
          Update your professional details and expertise
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="">
            <Label htmlFor="role">Current Role</Label>
            <Input id="role" type="text" placeholder="e.g. Senior Developer" />
          </div>
          <div className="">
            <Label htmlFor="company">Company</Label>
            <Input id="company" type="text" placeholder="e.g. Acme Inc" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
