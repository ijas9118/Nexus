import { Request, Response } from 'express';
import { IMentorController } from '../core/interfaces/controllers/IMentorController';
import { inject, injectable } from 'inversify';
import { TYPES } from '../di/types';
import { IMentorService } from '../core/interfaces/services/IMentorService';
import asyncHandler from 'express-async-handler';
import CustomError from '../utils/CustomError';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class MentorController implements IMentorController {
  constructor(@inject(TYPES.MentorService) private mentorService: IMentorService) {}

  sendInvitation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, specialization, name } = req.body;

    if (!email || !specialization || !name) {
      throw new CustomError(
        'All fields (email, specialization, name) are required',
        StatusCodes.BAD_REQUEST
      );
    }

    const result = await this.mentorService.sendInvitation(email, specialization, name);

    if (!result) {
      throw new CustomError('Failed to send invitation', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).json({ message: 'Invitation sent successfully' });
  });

  acceptInvitation = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    if (!token) {
      throw new CustomError('Token is required', StatusCodes.BAD_REQUEST);
    }

    const email = await this.mentorService.acceptInvitation(token);

    if (!email) {
      throw new CustomError('Invalid or expired invitation token', StatusCodes.UNAUTHORIZED);
    }

    res.status(StatusCodes.OK).json({ message: 'Invitation accepted', email });
  });

  getAllMentors = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const mentors = await this.mentorService.getAllMentors();

    if (!mentors) {
      throw new CustomError('Failed to fetch mentors', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).json(mentors);
  });

  completeProfile = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, name, password } = req.body;

    if (!email || !name || !password) {
      throw new CustomError(
        'All fields (email, name, password) are required',
        StatusCodes.BAD_REQUEST
      );
    }

    const result = await this.mentorService.completeProfile(email, name, password);

    if (!result) {
      throw new CustomError('Failed to update profile', StatusCodes.INTERNAL_SERVER_ERROR);
    }

    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Profile updated successfully!',
    });
  });
}
