import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Clock } from "lucide-react";
import React from "react";

const mentors = [
  {
    name: "VASKEN MOURADIAN",
    role: "Sr. UX Designer",
    experience: "8 years",
    image: "https://avatar.iran.liara.run/public",
    skills: ["UI/UX", "Figma", "User Research", "Prototyping", "Design Systems"],
  },
  {
    name: "ATLAS KINGSLEY",
    role: "Lead Software Engineer",
    experience: "12 years",
    image: "https://avatar.iran.liara.run/public",
    skills: ["JavaScript", "React", "Node.js", "GraphQL", "Microservices"],
  },
  {
    name: "ISLA VALKYRIE",
    role: "AI & ML Researcher",
    experience: "7 years",
    image: "https://avatar.iran.liara.run/public",
    skills: ["Machine Learning", "Deep Learning", "TensorFlow", "NLP", "AI Ethics"],
  },
  {
    name: "ZEUS CALLISTO",
    role: "Blockchain Architect",
    experience: "9 years",
    image: "https://avatar.iran.liara.run/public",
    skills: ["Blockchain", "Ethereum", "Smart Contracts", "DeFi", "Web3"],
  },
  {
    name: "SELENE NOVA",
    role: "Cloud Solutions Architect",
    experience: "11 years",
    image: "https://avatar.iran.liara.run/public",
    skills: ["AWS", "Google Cloud", "DevOps", "Kubernetes", "CI/CD"],
  },
  {
    name: "DANTE VERMILLION",
    role: "Full-Stack Developer",
    experience: "6 years",
    image: "https://avatar.iran.liara.run/public",
    skills: ["React", "Next.js", "Express.js", "MongoDB", "TypeScript"],
  },
];

const Experts: React.FC = () => {
  return (
    <div className="container mx-auto px-4 sm:px-8 md:px-10 xl:px-24 py-8 flex flex-col items-center sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
      {mentors.map((mentor, index) => (
        <Card key={index} className="w-full max-w-[350px]">
          <CardHeader className="space-y-4 w-full items-center">
            <div className="relative w-32 h-32">
              <Avatar className="w-full h-full">
                <AvatarImage
                  src={mentor.image}
                  alt={mentor.name}
                  className="object-cover"
                />
                <AvatarFallback>{mentor.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="space-y-1 text-center">
              <CardTitle className="text-xl font-bold">{mentor.name}</CardTitle>
              <CardDescription>{mentor.role}</CardDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {mentor.experience} experience
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2 justify-center">
              {mentor.skills.map((skill, idx) => (
                <Badge
                  key={idx}
                  variant="outline"
                  className="hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="w-full">Connect</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Premium Membership Required</DialogTitle>
                  <DialogDescription>
                    Only premium users can access mentorship sessions. Upgrade to premium
                    now to unlock this feature.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="flex justify-center">
                  <Button className="w-full">Get Premium Now</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default Experts;
