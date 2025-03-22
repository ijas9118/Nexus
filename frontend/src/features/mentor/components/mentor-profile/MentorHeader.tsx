import { Badge } from "@/components/atoms/badge";
import { Button } from "@/components/atoms/button";
import { Card, CardContent } from "@/components/molecules/card";
import { Calendar, Globe, Mail, MapPin, Star, Users } from "lucide-react";
import { FaLinkedin, FaXTwitter } from "react-icons/fa6";

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

            <div className="flex flex-wrap gap-2 my-6">
              {mentor.expertise.map((skill) => (
                <Badge key={skill} variant="default">
                  {skill}
                </Badge>
              ))}
            </div>

            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="text-teal-600 bg-transparent border border-teal-300 hover:bg-teal-50 hover:text-teal-700 dark:text-teal-400 dark:border-teal-600 dark:hover:bg-teal-800 dark:hover:text-teal-200 transition-colors duration-200"
              >
                <Mail />
                Contact
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-blue-600 bg-transparent border border-blue-300 hover:bg-blue-50 hover:text-blue-700 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-800 dark:hover:text-blue-200 transition-colors duration-200"
              >
                <FaLinkedin />
                LinkedIn
              </Button>

              <Button
                variant="outline"
                size="sm"
                className="text-black bg-transparent border border-gray-300 hover:bg-gray-100 hover:text-gray-900 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-100 transition-colors duration-200"
              >
                <FaXTwitter />X
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MentorHeader;
