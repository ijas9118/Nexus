import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Calendar, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Mentor } from "../Mentors";

const MentorCard = ({ mentor }: { mentor: Mentor }) => {
  return (
    <Card className="overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/4 bg-muted flex items-center justify-center p-6">
          <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-background">
            <img
              src={`https://avatar.iran.liara.run/username?username=${mentor.name
                .split(" ")
                .map((word) => word[0])
                .join("+")}`}
              alt="Mentor"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
        <div className="md:w-3/4 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
            <div>
              <h3 className="text-xl font-bold">{mentor.name}</h3>
              <p className="text-muted-foreground">{mentor.title}</p>
            </div>
            <div className="flex items-center gap-1 text-amber-500">
              <Star className="h-4 w-4 fill-current" />
              <span className="font-medium">{mentor.rating}</span>
              <span className="text-muted-foreground">({mentor.reviews})</span>
            </div>
          </div>

          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-3">
              {mentor.skills.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
            <p className="line-clamp-2 text-sm">{mentor.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{mentor.mentees} mentees</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{mentor.sessions} sessions</span>
              </div>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Link to={`/mentors/${mentor.id}`} className="w-full sm:w-auto">
                <Button variant="outline" className="w-full sm:w-auto">
                  View Profile
                </Button>
              </Link>
              <Link
                to={`/mentors/${mentor.id}/book`}
                className="w-full sm:w-auto"
              >
                <Button className="w-full sm:w-auto">Book Session</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default MentorCard;
