import { MentorFormData } from "@/types/mentor";
import React, { createContext, useContext, useState } from "react";

interface MentorFormContextType {
  formData: MentorFormData;
  setFormData: React.Dispatch<React.SetStateAction<MentorFormData>>;
}

const MentorFormContext = createContext<MentorFormContextType | undefined>(
  undefined,
);

export const MentorFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [formData, setFormData] = useState<MentorFormData>({
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
      availableTimeSlots: [],
      motivation: "",
    },
  });

  return (
    <MentorFormContext.Provider value={{ formData, setFormData }}>
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
