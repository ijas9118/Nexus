import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Filter } from "lucide-react";

const MentorFilters = () => {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle>Filters</CardTitle>
        <CardDescription>Refine your mentor search</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-2">
          <h4 className="text-sm font-medium">Expertise</h4>
          <div className="space-y-1.5">
            {[
              "Frontend",
              "Backend",
              "Full Stack",
              "DevOps",
              "Mobile",
              "UI/UX",
              "Career Growth",
            ].map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`skill-${skill}`}
                  className="h-4 w-4 rounded border-gray-300 text-primary"
                />
                <label htmlFor={`skill-${skill}`} className="text-sm">
                  {skill}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Experience Level</h4>
          <div className="space-y-1.5">
            {["Beginner Friendly", "Intermediate", "Advanced"].map((level) => (
              <div key={level} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`level-${level}`}
                  className="h-4 w-4 rounded border-gray-300 text-primary"
                />
                <label htmlFor={`level-${level}`} className="text-sm">
                  {level}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Availability</h4>
          <div className="space-y-1.5">
            {["Weekdays", "Weekends", "Evenings"].map((time) => (
              <div key={time} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`time-${time}`}
                  className="h-4 w-4 rounded border-gray-300 text-primary"
                />
                <label htmlFor={`time-${time}`} className="text-sm">
                  {time}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <h4 className="text-sm font-medium">Price Range</h4>
          <Select defaultValue="any">
            <SelectTrigger>
              <SelectValue placeholder="Select price range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="any">Any price</SelectItem>
              <SelectItem value="free">Free sessions</SelectItem>
              <SelectItem value="low">$0 - $50</SelectItem>
              <SelectItem value="medium">$50 - $100</SelectItem>
              <SelectItem value="high">$100+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" className="w-full">
          <Filter className="h-4 w-4 mr-2" />
          Apply Filters
        </Button>
      </CardContent>
    </Card>
  );
};

export default MentorFilters;
