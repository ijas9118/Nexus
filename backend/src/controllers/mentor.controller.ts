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

@injectable()
export class MentorController implements IMentorController {
  constructor(@inject(TYPES.MentorService) private mentorService: IMentorService) {}

  applyAsMentor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?._id as string;
    const mentorData = {
      personalInfo: req.body.personalInfo,
      experience: req.body.experience,
      mentorshipDetails: req.body.mentorshipDetails,
    };

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
    console.log('adsfasdfasdfasdf');
    res.json({
      experienceLevels: Object.values(ExperienceLevel),
      expertiseAreas: Object.values(ExpertiseArea),
      mentorshipTypes: Object.values(MentorshipType),
      targetAudiences: Object.values(TargetAudience),
      technologies: Object.values(Technology),
    });
  });
}
