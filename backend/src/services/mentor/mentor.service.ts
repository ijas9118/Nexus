import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IMentorRepository } from "@/core/interfaces/repositories/i-mentor-repository";
import type { IUserRepository } from "@/core/interfaces/repositories/i-user-repository";
import type { IMentorService } from "@/core/interfaces/services/i-mentor-service";
import type { PersonalInfo } from "@/core/types";
import type { MentorStatus } from "@/core/types/entities/mentor";
import type { IMentor } from "@/models/mentor/mentor.model";
import type { IMentorshipType } from "@/models/mentor/mentorship-type.model";
import type { IUser } from "@/models/user/user.model";

import { TYPES } from "@/di/types";
import CustomError from "@/utils/custom-error";

@injectable()
export class MentorService implements IMentorService {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepository: IMentorRepository,
    @inject(TYPES.UserRepository) private userRepository: IUserRepository,
  ) {}

  applyAsMentor = async (
    userId: string,
    data: {
      personalInfo: PersonalInfo;
      experience: IMentor["experience"];
      mentorshipDetails: IMentor["mentorshipDetails"];
    },
  ): Promise<IMentor> => {
    const existingMentor = await this.mentorRepository.findMentorByUserId(userId);
    if (existingMentor) {
      throw new CustomError("You have already applied to be a mentor.", StatusCodes.CONFLICT);
    }

    const { personalInfo, experience, mentorshipDetails } = data;

    // Map personalInfo to IUser fields
    const userUpdate: Partial<IUser> = {
      name: `${personalInfo.firstName} ${personalInfo.lastName}`,
      email: personalInfo.email,
      phone: personalInfo.phone || undefined,
      location: personalInfo.location || undefined,
      profilePic: personalInfo.profilePhoto || undefined,
      socials: [],
    };

    // Map linkedin and github to socials array
    if (personalInfo.linkedin) {
      userUpdate.socials!.push({ platform: "linkedin", url: personalInfo.linkedin });
    }
    if (personalInfo.github) {
      userUpdate.socials!.push({ platform: "github", url: personalInfo.github });
    }

    // Update user with personalInfo
    const updatedUser = await this.userRepository.updateUser(userId, userUpdate);
    if (!updatedUser) {
      throw new CustomError("User not found.", StatusCodes.NOT_FOUND);
    }

    // Create mentor application
    const mentor = await this.mentorRepository.createMentorApplication(userId, {
      experience,
      mentorshipDetails,
      status: "pending",
    });

    return mentor;
  };

  approveMentor = async (mentorId: string, userId: string): Promise<IMentor> => {
    const mentor = await this.mentorRepository.updateMentorStatus(mentorId, "approved");
    if (!mentor) {
      throw new CustomError("Mentor application not found.");
    }

    // Update user role to 'mentor'
    const updatedUser = await this.userRepository.updateUser(userId, { role: "mentor" });
    if (!updatedUser) {
      throw new CustomError("User not found.");
    }

    return mentor;
  };

  rejectMentor = async (mentorId: string): Promise<IMentor> => {
    const mentor = await this.mentorRepository.updateMentorStatus(mentorId, "rejected");
    if (!mentor) {
      throw new CustomError("Mentor application not found.");
    }
    return mentor;
  };

  getStatus = async (userId: string): Promise<MentorStatus | null> => {
    const mentor = await this.mentorRepository.findOne({ userId });

    if (!mentor) {
      return null; // User hasn't applied yet
    }

    return mentor.status;
  };

  getAllMentors = async (): Promise<IMentor[] | null> => {
    return await this.mentorRepository.getAllMentors();
  };

  getApprovedMentors = async (): Promise<IMentor[] | null> => {
    return await this.mentorRepository.getApprovedMentors();
  };

  getMentorDetails = async (mentorId: string): Promise<IMentor | null> => {
    return await this.mentorRepository.getMentorDetails(mentorId);
  };

  getMentorByUserId = async (userId: string): Promise<IMentor | null> => {
    return await this.mentorRepository.findOne({ userId });
  };

  getUserIdByMentorId = async (mentorId: string): Promise<string> => {
    const mentor = await this.mentorRepository.getMentorDetails(mentorId);

    if (!mentor) {
      throw new CustomError("Mentor not found.");
    }

    if (typeof mentor.userId === "object" && "_id" in mentor.userId) {
      return mentor.userId._id.toString();
    }
    throw new CustomError("Invalid userId format.");
  };

  getMentorshipTypes = async (mentorId: string): Promise<IMentorshipType[]> => {
    const mentor = await this.mentorRepository.getMentorDetails(mentorId);

    if (!mentor) {
      throw new CustomError("Mentor not found.");
    }

    const mentorshipTypes = mentor.mentorshipDetails?.mentorshipTypes;

    if (!mentorshipTypes || mentorshipTypes.length === 0) {
      return [];
    }

    return mentorshipTypes as unknown as IMentorshipType[];
  };

  updateMentorExperience = async (
    userId: string,
    experienceData: {
      currentRole: string;
      company: string;
      experienceLevel: string;
      expertiseAreas: string[];
      technologies: string[];
      bio: string;
      resume?: string | null;
    },
  ): Promise<IMentor> => {
    const mentor = await this.mentorRepository.findMentorByUserId(userId);
    if (!mentor) {
      throw new CustomError("Mentor not found.");
    }

    const updatedMentor = await this.mentorRepository.updateMentorExperience(
      userId,
      experienceData,
    );
    if (!updatedMentor) {
      throw new CustomError("Failed to update mentor experience.");
    }

    return updatedMentor;
  };

  updateMentorshipDetails = async (
    userId: string,
    mentorshipDetailsData: {
      mentorshipTypes: string[];
      targetAudiences: string[];
    },
  ): Promise<IMentor> => {
    const mentor = await this.mentorRepository.findMentorByUserId(userId);
    if (!mentor) {
      throw new CustomError("Mentor not found.");
    }

    const updatedMentor = await this.mentorRepository.updateMentorshipDetails(
      userId,
      mentorshipDetailsData,
    );
    if (!updatedMentor) {
      throw new CustomError("Failed to update mentorship details.");
    }

    return updatedMentor;
  };
}
