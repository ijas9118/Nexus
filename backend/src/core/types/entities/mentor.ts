export enum ExperienceLevel {
  BEGINNER = '0-2',
  INTERMEDIATE = '2-5',
  ADVANCED = '5-10',
  EXPERT = '10+',
}

export enum ExpertiseArea {
  FRONTEND = 'frontend',
  BACKEND = 'backend',
  FULLSTACK = 'fullstack',
  MOBILE = 'mobile',
  DEVOPS = 'devops',
  CLOUD = 'cloud',
  MACHINE_LEARNING = 'machine-learning',
  UI = 'UI',
  SECURITY = 'security',
  CAREER = 'career',
  LEADERSHIP = 'leadership',
}

export enum Technology {
  JAVASCRIPT = 'javascript',
  TYPESCRIPT = 'typescript',
  REACT = 'react',
  VUE = 'vue',
  ANGULAR = 'angular',
  NODE = 'node',
  PYTHON = 'python',
  JAVA = 'java',
  CSHARP = 'c#',
  PHP = 'php',
  GO = 'go',
  RUBY = 'ruby',
  AWS = 'aws',
  AZURE = 'azure',
}

export enum MentorshipType {
  ONE_ON_ONE = '1-on-1',
  GROUP = 'group',
  CAREER_GUIDANCE = 'career-guidance',
  MOCK_INTERVIEW = 'mock-interview',
  PORTFOLIO_REVIEW = 'portfolio-review',
  RESUME_REVIEW = 'resume-review',
  CODE_REVIEW = 'code-review',
  TECHNICAL_MENTORING = 'technical-mentoring',
}

export enum TargetAudience {
  STUDENT = 'student',
  JOB_SEEKER = 'job-seeker',
  EARLY_CAREER_PROFESSIONAL = 'early-career',
  MID_CAREER_PROFESSIONAL = 'mid-career',
  CAREER_SWITCHER = 'career-switcher',
  ENTREPRENEUR = 'entrepreneur',
  FREELANCER = 'freelancer',
}

export type MentorStatus = 'pending' | 'approved' | 'rejected';

export type AvailabilityType = 'weekdays' | 'weekend' | 'both';
