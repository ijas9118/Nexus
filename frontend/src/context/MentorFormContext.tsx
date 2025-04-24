import { MentorFormData } from "@/types/mentor";
import React, { createContext, useContext } from "react";
import { useForm, UseFormReturn } from "react-hook-form";

interface MentorFormContextType {
  form: UseFormReturn<MentorFormData>;
}

const MentorFormContext = createContext<MentorFormContextType | undefined>(
  undefined,
);

export const MentorFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const form = useForm<MentorFormData>({
    defaultValues: {
      personalInfo: {
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        location: "",
        linkedin: "",
        github: "",
        profilePhoto: null,
      },
      experience: {
        currentRole: "",
        company: "",
        experienceLevel: "",
        expertiseAreas: [],
        technologies: [],
        bio: "",
        resume: null,
      },
      mentorshipDetails: {
        mentorshipTypes: [],
        targetAudiences: [],
        availabilityType: "",
        motivation: "",
      },
    },
    mode: "onChange", // Validate on change for real-time feedback
  });

  return (
    <MentorFormContext.Provider value={{ form }}>
      {children}
    </MentorFormContext.Provider>
  );
};

export const useMentorForm = () => {
  const context = useContext(MentorFormContext);
  if (!context) {
    throw new Error("useMentorForm must be used within a MentorFormProvider");
  }
  return context;
};
