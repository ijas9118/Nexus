import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IMentorController } from "@/core/interfaces/controllers/i-mentor-controller";
import type { IMentorService } from "@/core/interfaces/services/i-mentor-service";
import type { PersonalInfo } from "@/core/types";
import type { IMentor } from "@/models/mentor/mentor.model";

import logger from "@/config/logger";
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

const { MENTOR_MESSAGES } = MESSAGES;

@injectable()
export class MentorController implements IMentorController {
  constructor(@inject(TYPES.MentorService) private _mentorService: IMentorService) {}

  applyAsMentor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const mentorData = {
      personalInfo: req.body.personalInfo as PersonalInfo,
      experience: req.body.experience as IMentor["experience"],
      mentorshipDetails: req.body.mentorshipDetails as IMentor["mentorshipDetails"],
    };

    // Basic validation
    if (!mentorData.personalInfo || !mentorData.experience || !mentorData.mentorshipDetails) {
      throw new CustomError(MENTOR_MESSAGES.MISSING_FIELDS, StatusCodes.BAD_REQUEST);
    }

    if (
      !mentorData.personalInfo.firstName
      || !mentorData.personalInfo.lastName
      || !mentorData.personalInfo.email
    ) {
      throw new CustomError(MENTOR_MESSAGES.MISSING_PERSONAL_INFO, StatusCodes.BAD_REQUEST);
    }

    logger.debug("Received mentor application data", { userId, mentorData });

    const mentor = await this._mentorService.applyAsMentor(userId, mentorData);
    res.status(StatusCodes.CREATED).json({ success: true, data: mentor });
  });

  approveMentor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId, userId } = req.params;
    const mentor = await this._mentorService.approveMentor(mentorId as string, userId as string);
    res.status(StatusCodes.OK).json({ success: true, data: mentor });
  });

  rejectMentor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;
    const mentor = await this._mentorService.rejectMentor(mentorId as string);
    res.status(StatusCodes.OK).json({ success: true, data: mentor });
  });

  getStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const status = await this._mentorService.getStatus(userId);
    res.status(StatusCodes.OK).json(status);
  });

  getAllMentors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentors = await this._mentorService.getAllMentors();
    res.status(StatusCodes.OK).json(mentors);
  });

  getApprovedMentors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentors = await this._mentorService.getApprovedMentors();
    res.status(StatusCodes.OK).json(mentors);
  });

  getMentorDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentorId = req.params.mentorId;
    const mentor = await this._mentorService.getMentorDetails(mentorId as string);
    res.status(StatusCodes.OK).json(mentor);
  });

  getMentorEnums = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    res.status(StatusCodes.OK).json({
      experienceLevels: Object.values(ExperienceLevel),
      expertiseAreas: Object.values(ExpertiseArea),
      mentorshipTypes: Object.values(MentorshipType),
      targetAudiences: Object.values(TargetAudience),
      technologies: Object.values(Technology),
    });
  });

  getMentorshipTypes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentorshipTypes = await this._mentorService.getMentorshipTypes(
      req.params.mentorId as string,
    );
    res.status(StatusCodes.OK).json(mentorshipTypes);
  });

  updateMentorExperience = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const experienceData = {
      currentRole: req.body.currentRole,
      company: req.body.company,
      experienceLevel: req.body.experienceLevel,
      expertiseAreas: req.body.expertiseAreas,
      technologies: req.body.technologies,
      bio: req.body.bio,
      resume: req.body.resume,
    };

    const updatedMentor = await this._mentorService.updateMentorExperience(userId, experienceData);
    res.status(StatusCodes.OK).json({ success: true, data: updatedMentor });
  });

  updateMentorshipDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const mentorshipDetailsData = {
      mentorshipTypes: req.body.mentorshipTypes,
      targetAudiences: req.body.targetAudiences,
    };

    const updatedMentor = await this._mentorService.updateMentorshipDetails(
      userId,
      mentorshipDetailsData,
    );
    res.status(StatusCodes.OK).json({ success: true, data: updatedMentor });
  });
}
