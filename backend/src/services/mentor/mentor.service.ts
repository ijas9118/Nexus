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

import {
  ExperienceLevel,
  ExpertiseArea,
  MentorshipType,
  TargetAudience,
  Technology,
} from "@/core/types/entities/mentor";
import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { MENTOR_MESSAGES, AUTH_MESSAGES } = MESSAGES;

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
    const { personalInfo, experience, mentorshipDetails } = data;

    // Basic validation
    if (!personalInfo || !experience || !mentorshipDetails) {
      throw new CustomError(MENTOR_MESSAGES.MISSING_FIELDS, StatusCodes.BAD_REQUEST);
    }

    if (
      !personalInfo.firstName
      || !personalInfo.lastName
      || !personalInfo.email
    ) {
      throw new CustomError(MENTOR_MESSAGES.MISSING_PERSONAL_INFO, StatusCodes.BAD_REQUEST);
    }

    const existingMentor = await this.mentorRepository.findMentorByUserId(userId);
    if (existingMentor) {
      throw new CustomError(MENTOR_MESSAGES.ALREADY_APPLIED, StatusCodes.CONFLICT);
    }

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
      throw new CustomError(AUTH_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
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
      throw new CustomError(MENTOR_MESSAGES.APPLICATION_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    // Update user role to 'mentor'
    const updatedUser = await this.userRepository.updateUser(userId, { role: "mentor" });
    if (!updatedUser) {
      throw new CustomError(AUTH_MESSAGES.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    return mentor;
  };

  rejectMentor = async (mentorId: string): Promise<IMentor> => {
    const mentor = await this.mentorRepository.updateMentorStatus(mentorId, "rejected");
    if (!mentor) {
      throw new CustomError(MENTOR_MESSAGES.APPLICATION_NOT_FOUND, StatusCodes.NOT_FOUND);
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
      throw new CustomError(AUTH_MESSAGES.MENTOR_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    if (typeof mentor.userId === "object" && "_id" in mentor.userId) {
      return (mentor.userId as any)._id.toString();
    }
    throw new CustomError(MENTOR_MESSAGES.INVALID_USER_ID, StatusCodes.BAD_REQUEST);
  };

  getMentorshipTypes = async (mentorId: string): Promise<IMentorshipType[]> => {
    const mentor = await this.mentorRepository.getMentorDetails(mentorId);

    if (!mentor) {
      throw new CustomError(AUTH_MESSAGES.MENTOR_NOT_FOUND, StatusCodes.NOT_FOUND);
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
      throw new CustomError(AUTH_MESSAGES.MENTOR_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const updatedMentor = await this.mentorRepository.updateMentorExperience(
      userId,
      experienceData,
    );
    if (!updatedMentor) {
      throw new CustomError(MENTOR_MESSAGES.EXPERIENCE_UPDATE_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
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
      throw new CustomError(AUTH_MESSAGES.MENTOR_NOT_FOUND, StatusCodes.NOT_FOUND);
    }

    const updatedMentor = await this.mentorRepository.updateMentorshipDetails(
      userId,
      mentorshipDetailsData,
    );
    if (!updatedMentor) {
      throw new CustomError(MENTOR_MESSAGES.DETAILS_UPDATE_FAILED, StatusCodes.INTERNAL_SERVER_ERROR);
    }

    return updatedMentor;
  };

  getMentorEnums = () => {
    return {
      experienceLevels: Object.values(ExperienceLevel),
      expertiseAreas: Object.values(ExpertiseArea),
      mentorshipTypes: Object.values(MentorshipType),
      targetAudiences: Object.values(TargetAudience),
      technologies: Object.values(Technology),
    };
  };
}
