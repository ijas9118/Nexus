import { z } from "zod";

// Define the form schema
export const formSchema = z.object({
  experience: z.object({
    currentRole: z.string().min(1, "Current role is required"),
    company: z.string().min(1, "Company is required"),
    experienceLevel: z.string(),
    expertiseAreas: z
      .array(z.string())
      .min(1, "Select at least one expertise area"),
    technologies: z.array(z.string()).min(1, "Select at least one technology"),
    bio: z.string().min(10, "Bio should be at least 10 characters"),
  }),
  mentorshipDetails: z.object({
    mentorshipTypes: z
      .array(z.string())
      .min(1, "Select at least one mentorship type"),
    targetAudiences: z
      .array(z.string())
      .min(1, "Select at least one target audience"),
    availabilityType: z.string(),
    motivation: z
      .string()
      .min(10, "Motivation should be at least 10 characters"),
  }),
});

// Data for select options
export const experienceLevels = [
  { id: "67fe3965c593f8a21f02a523", value: "5-10", label: "5-10 years" },
  { id: "exp-1", value: "0-2", label: "0-2 years" },
  { id: "exp-2", value: "2-5", label: "2-5 years" },
  { id: "exp-3", value: "10+", label: "10+ years" },
];

export const expertiseAreas = [
  {
    id: "67fe397fc593f8a21f02a529",
    value: "frontend",
    label: "Frontend Development",
  },
  {
    id: "67fe398bc593f8a21f02a52c",
    value: "backend",
    label: "Backend Development",
  },
  { id: "exp-area-1", value: "mobile", label: "Mobile Development" },
  { id: "exp-area-2", value: "devops", label: "DevOps" },
  { id: "exp-area-3", value: "data", label: "Data Science" },
  { id: "exp-area-4", value: "ai", label: "AI/ML" },
  { id: "exp-area-5", value: "cloud", label: "Cloud Computing" },
];

export const technologies = [
  { id: "67fe3a35c593f8a21f02a552", value: "react", label: "React" },
  { id: "tech-1", value: "node", label: "Node.js" },
  { id: "tech-2", value: "python", label: "Python" },
  { id: "tech-3", value: "java", label: "Java" },
  { id: "tech-4", value: "angular", label: "Angular" },
  { id: "tech-5", value: "vue", label: "Vue.js" },
  { id: "tech-6", value: "aws", label: "AWS" },
  { id: "tech-7", value: "docker", label: "Docker" },
  { id: "tech-8", value: "kubernetes", label: "Kubernetes" },
  { id: "tech-9", value: "typescript", label: "TypeScript" },
];

export const mentorshipTypes = [
  {
    id: "67fe3a81c593f8a21f02a57f",
    value: "one-on-one",
    label: "One-on-One Mentoring",
  },
  {
    id: "67fe3ae8c593f8a21f02a589",
    value: "interview-prep",
    label: "Interview Preparation",
  },
  { id: "mentor-1", value: "career-guidance", label: "Career Guidance" },
  { id: "mentor-2", value: "code-review", label: "Code Review" },
  { id: "mentor-3", value: "pair-programming", label: "Pair Programming" },
];

export const targetAudiences = [
  {
    id: "67fe3afcc593f8a21f02a593",
    value: "junior-developers",
    label: "Junior Developers",
  },
  { id: "target-1", value: "mid-level", label: "Mid-level Developers" },
  { id: "target-2", value: "senior", label: "Senior Developers" },
  { id: "target-3", value: "career-switchers", label: "Career Switchers" },
  { id: "target-4", value: "students", label: "Students" },
];

export const availabilityTypes = [
  { value: "weekday", label: "Weekdays" },
  { value: "weekend", label: "Weekends" },
  { value: "both", label: "Both Weekdays and Weekends" },
];
