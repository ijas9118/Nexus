import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar, Filter, Search, Star, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Mentors = () => {
  return (
    <div className="container mx-auto py-8 px-4 md:px-6 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            Find Your Mentor
          </h1>
          <p className="text-muted-foreground">
            Connect with experienced mentors to accelerate your growth
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/mentors/apply">
            <Button>Become a Mentor</Button>
          </Link>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-[1fr_3fr] mb-8">
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
                {["Beginner Friendly", "Intermediate", "Advanced"].map(
                  (level) => (
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
                  ),
                )}
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

        <div className="space-y-6">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search mentors by name or expertise..."
                className="w-full pl-8"
              />
            </div>
            <Select defaultValue="recommended">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recommended">Recommended</SelectItem>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="sessions">Most Sessions</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/4 bg-muted flex items-center justify-center p-6">
                    <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden bg-background">
                      <img
                        src={`/placeholder.svg?height=128&width=128&text=${String.fromCharCode(65 + i)}`}
                        alt="Mentor"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="md:w-3/4 p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <div>
                        <h3 className="text-xl font-bold">
                          {
                            [
                              "John Smith",
                              "Emily Johnson",
                              "Michael Chen",
                              "Sarah Rodriguez",
                              "David Kim",
                              "Lisa Patel",
                            ][i % 6]
                          }
                        </h3>
                        <p className="text-muted-foreground">
                          {
                            [
                              "Senior Frontend Developer at TechCorp",
                              "Backend Architect at CloudSystems",
                              "Full Stack Engineer at StartupX",
                              "Mobile Developer & UX Specialist",
                              "Engineering Manager at BigTech",
                              "DevOps Engineer at InfraTeam",
                            ][i % 6]
                          }
                        </p>
                      </div>
                      <div className="flex items-center gap-1 text-amber-500">
                        <Star className="h-4 w-4 fill-current" />
                        <span className="font-medium">{4 + (i % 2) * 0.5}</span>
                        <span className="text-muted-foreground">
                          ({50 + i * 10})
                        </span>
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2 mb-3">
                        {[
                          ["React", "TypeScript", "Node.js", "Next.js"],
                          ["Python", "Django", "AWS", "Database Design"],
                          [
                            "JavaScript",
                            "React",
                            "Node.js",
                            "GraphQL",
                            "MongoDB",
                          ],
                          ["React Native", "iOS", "Android", "UI/UX", "Figma"],
                          [
                            "System Design",
                            "Team Leadership",
                            "Agile",
                            "Scaling",
                          ],
                          [
                            "Kubernetes",
                            "Docker",
                            "CI/CD",
                            "Cloud Architecture",
                          ],
                        ][i % 6].map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                      <p className="line-clamp-2 text-sm">
                        {
                          [
                            "I help developers master React and build performant web applications. Specializing in component architecture and state management.",
                            "Backend specialist with 8+ years experience building scalable systems. I can help with architecture, performance, and best practices.",
                            "Full stack developer passionate about helping others grow. I provide practical guidance on building end-to-end applications.",
                            "Mobile developer with expertise in cross-platform solutions. I can help you build beautiful and functional mobile apps.",
                            "Tech leader focused on helping developers advance their careers and improve their technical decision-making.",
                            "DevOps expert specializing in containerization and automation. I can help streamline your development workflow.",
                          ][i % 6]
                        }
                      </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div className="flex gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>{(i + 1) * 15} mentees</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{(i + 1) * 8} sessions</span>
                        </div>
                      </div>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <Link
                          to={`/mentors/${i + 1}`}
                          className="w-full sm:w-auto"
                        >
                          <Button
                            variant="outline"
                            className="w-full sm:w-auto"
                          >
                            View Profile
                          </Button>
                        </Link>
                        <Link
                          to={`/mentors/${i + 1}/book`}
                          className="w-full sm:w-auto"
                        >
                          <Button className="w-full sm:w-auto">
                            Book Session
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
