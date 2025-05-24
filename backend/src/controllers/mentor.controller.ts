import { Request, Response } from 'express';
import { IMentorController } from '../core/interfaces/controllers/IMentorController';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { IMentorService } from '../core/interfaces/services/IMentorService';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import {
  ExperienceLevel,
  ExpertiseArea,
  MentorshipType,
  TargetAudience,
  Technology,
} from '@/core/types/entities/mentor';
import { IMentorDashboardService } from '@/core/interfaces/services/IMentorDashboardService';
import { PersonalInfo } from '@/core/types';
import { IMentor } from '@/models/mentor.model';
import CustomError from '@/utils/CustomError';

@injectable()
export class MentorController implements IMentorController {
  constructor(
    @inject(TYPES.MentorService) private mentorService: IMentorService,
    @inject(TYPES.MentorDashboardService) private mentorDashboardService: IMentorDashboardService
  ) {}

  applyAsMentor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const mentorData = {
      personalInfo: req.body.personalInfo as PersonalInfo,
      experience: req.body.experience as IMentor['experience'],
      mentorshipDetails: req.body.mentorshipDetails as IMentor['mentorshipDetails'],
    };

    // Basic validation
    if (!mentorData.personalInfo || !mentorData.experience || !mentorData.mentorshipDetails) {
      throw new CustomError(
        'Missing required fields: personalInfo, experience, or mentorshipDetails.',
        StatusCodes.BAD_REQUEST
      );
    }

    if (
      !mentorData.personalInfo.firstName ||
      !mentorData.personalInfo.lastName ||
      !mentorData.personalInfo.email
    ) {
      throw new CustomError(
        'Missing required personalInfo fields: firstName, lastName, or email.',
        StatusCodes.BAD_REQUEST
      );
    }

    console.log('Received mentor application data:', mentorData);

    const mentor = await this.mentorService.applyAsMentor(userId, mentorData);
    res.status(StatusCodes.CREATED).json({ success: true, data: mentor });
  });

  approveMentor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId, userId } = req.params;
    const mentor = await this.mentorService.approveMentor(mentorId, userId);
    res.status(StatusCodes.OK).json({ success: true, data: mentor });
  });

  rejectMentor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId } = req.params;
    const mentor = await this.mentorService.rejectMentor(mentorId);
    res.status(StatusCodes.OK).json({ success: true, data: mentor });
  });

  getStatus = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const status = await this.mentorService.getStatus(userId);
    res.status(StatusCodes.OK).json(status);
  });

  getAllMentors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentors = await this.mentorService.getAllMentors();
    res.status(StatusCodes.OK).json(mentors);
  });

  getApprovedMentors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentors = await this.mentorService.getApprovedMentors();
    res.status(StatusCodes.OK).json(mentors);
  });

  getMentorDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentorId = req.params.mentorId;
    const mentor = await this.mentorService.getMentorDetails(mentorId);
    res.status(StatusCodes.OK).json(mentor);
  });

  getMentorEnums = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    res.json({
      experienceLevels: Object.values(ExperienceLevel),
      expertiseAreas: Object.values(ExpertiseArea),
      mentorshipTypes: Object.values(MentorshipType),
      targetAudiences: Object.values(TargetAudience),
      technologies: Object.values(Technology),
    });
  });

  getMentorshipTypes = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentorshipTypes = await this.mentorService.getMentorshipTypes(
      req.params.mentorId as string
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

    const updatedMentor = await this.mentorService.updateMentorExperience(userId, experienceData);
    res.status(StatusCodes.OK).json({ success: true, data: updatedMentor });
  });

  updateMentorshipDetails = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const mentorshipDetailsData = {
      mentorshipTypes: req.body.mentorshipTypes,
      targetAudiences: req.body.targetAudiences,
    };

    const updatedMentor = await this.mentorService.updateMentorshipDetails(
      userId,
      mentorshipDetailsData
    );
    res.status(StatusCodes.OK).json({ success: true, data: updatedMentor });
  });
}
