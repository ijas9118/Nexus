import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, Globe, LinkedinIcon, Mail, MapPin, Star, Twitter, Users } from "lucide-react";

interface Mentor {
  name: string;
  role: string;
  rating: number;
  reviews: number;
  mentees: number;
  sessions: number;
  location: string;
  languages: string;
  expertise: string[];
}

const MentorHeader = ({ mentor }: { mentor: Mentor }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="md:flex gap-6">
          <div className="flex justify-center mb-4 md:mb-0">
            <div className="h-32 w-32 rounded-full overflow-hidden bg-muted">
              <img
                src={`https://avatar.iran.liara.run/username?username=${mentor.name
                  .split(" ")
                  .map((word) => word[0])
                  .join("+")}`}
                alt={mentor.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-4">
              <div>
                <h1 className="text-3xl font-bold">{mentor.name}</h1>
                <p className="text-muted-foreground">{mentor.role}</p>
              </div>
              <div className="flex items-center gap-1 text-amber-500">
                <Star className="h-5 w-5 fill-current" />
                <span className="text-lg font-medium">{mentor.rating}</span>
                <span className="text-muted-foreground">
                  ({mentor.reviews} reviews)
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{mentor.mentees} mentees</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>{mentor.sessions} sessions completed</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{mentor.location}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <span>{mentor.languages}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {mentor.expertise.map((skill) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm">
                <Mail className="h-4 w-4 mr-2" />
                Contact
              </Button>
              <Button variant="outline" size="sm">
                <LinkedinIcon className="h-4 w-4 mr-2" />
                LinkedIn
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="h-4 w-4 mr-2" />
                Twitter
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorHeader;
