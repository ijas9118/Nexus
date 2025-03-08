import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

const MentorAbout = ({ mentor }: any) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Biography</CardTitle>
        </CardHeader>
        <CardContent>
          <p>{mentor.bio}</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Expertise</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mentor.expertise.map((skill: string) => (
              <div
                key={skill}
                className="p-4 border rounded-lg shadow-sm hover:shadow-md dark:hover:shadow-neutral-800 transition-shadow"
              >
                <span className="text-sm font-medium">{skill}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <span>{mentor.availability}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Timezone: Pacific Standard Time (PST)
          </p>
        </CardContent>
      </Card>
    </>
  );
};

export default MentorAbout;
