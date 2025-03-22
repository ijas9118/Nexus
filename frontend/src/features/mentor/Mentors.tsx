import { Button } from "@/components/ui/button";
import { setBreadcrumbs } from "@/store/slices/breadcrumbSlice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import MentorFilters from "./components/MentorFilters";
import SearchAndSort from "./components/SearchAndSort";
import MentorCard from "./components/MentorCard";

export interface Mentor {
  id: number;
  name: string;
  title: string;
  rating: number;
  reviews: number;
  skills: string[];
  description: string;
  mentees: number;
  sessions: number;
}

const mentors: Mentor[] = [
  {
    id: 1,
    name: "John Smith",
    title: "Senior Frontend Developer at TechCorp",
    rating: 4,
    reviews: 50,
    skills: ["React", "TypeScript", "Node.js", "Next.js"],
    description:
      "I help developers master React and build performant web applications. Specializing in component architecture and state management.",
    mentees: 15,
    sessions: 8,
  },
  {
    id: 2,
    name: "Emily Johnson",
    title: "Backend Architect at CloudSystems",
    rating: 4.5,
    reviews: 60,
    skills: ["Python", "Django", "AWS", "Database Design"],
    description:
      "Backend specialist with 8+ years experience building scalable systems. I can help with architecture, performance, and best practices.",
    mentees: 30,
    sessions: 16,
  },
  {
    id: 3,
    name: "Michael Chen",
    title: "Full Stack Engineer at StartupX",
    rating: 4,
    reviews: 70,
    skills: ["JavaScript", "React", "Node.js", "GraphQL", "MongoDB"],
    description:
      "Full stack developer passionate about helping others grow. I provide practical guidance on building end-to-end applications.",
    mentees: 45,
    sessions: 24,
  },
  {
    id: 4,
    name: "Sarah Rodriguez",
    title: "Mobile Developer & UX Specialist",
    rating: 4.5,
    reviews: 80,
    skills: ["React Native", "iOS", "Android", "UI/UX", "Figma"],
    description:
      "Mobile developer with expertise in cross-platform solutions. I can help you build beautiful and functional mobile apps.",
    mentees: 60,
    sessions: 32,
  },
  {
    id: 5,
    name: "David Kim",
    title: "Engineering Manager at BigTech",
    rating: 4,
    reviews: 90,
    skills: ["System Design", "Team Leadership", "Agile", "Scaling"],
    description:
      "Tech leader focused on helping developers advance their careers and improve their technical decision-making.",
    mentees: 75,
    sessions: 40,
  },
  {
    id: 6,
    name: "Lisa Patel",
    title: "DevOps Engineer at InfraTeam",
    rating: 4.5,
    reviews: 100,
    skills: ["Kubernetes", "Docker", "CI/CD", "Cloud Architecture"],
    description:
      "DevOps expert specializing in containerization and automation. I can help streamline your development workflow.",
    mentees: 90,
    sessions: 48,
  },
];

const Mentors = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(
      setBreadcrumbs([
        { title: "Home", url: "/" },
        { title: "Mentors", url: "" },
      ]),
    );
  }, [dispatch]);

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
        <MentorFilters />

        <div className="space-y-6">
          <SearchAndSort />

          <div className="space-y-4">
            {mentors.map((mentor) => (
              <MentorCard key={mentor.id} mentor={mentor} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mentors;
