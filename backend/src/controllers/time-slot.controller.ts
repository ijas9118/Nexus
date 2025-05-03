import { ITimeSlotController } from '@/core/interfaces/controllers/ITimeSlotController';
import { ITimeSlotService } from '@/core/interfaces/services/ITimeSlotService';
import { TYPES } from '@/di/types';
import CustomError from '@/utils/CustomError';
import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';

@injectable()
export class TimeSlotController implements ITimeSlotController {
  constructor(@inject(TYPES.TimeSlotService) private timeSlotService: ITimeSlotService) {}

  addTimeSlot = asyncHandler(async (req: Request, res: Response) => {
    const { date, startTime } = req.body;
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError('Mentor ID is required.', StatusCodes.BAD_REQUEST);
    }

    if (!date || !startTime) {
      throw new CustomError('Date and start time are required.', StatusCodes.BAD_REQUEST);
    }

    const timeSlot = await this.timeSlotService.addTimeSlot(mentorId, new Date(date), startTime);
    res.status(StatusCodes.CREATED).json(timeSlot);
  });

  deleteTimeSlot = asyncHandler(async (req: Request, res: Response) => {
    const { slotId } = req.params;
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError('Mentor ID is required.', StatusCodes.BAD_REQUEST);
    }

    const timeSlot = await this.timeSlotService.deleteTimeSlot(mentorId, slotId);
    res.status(StatusCodes.OK).json(timeSlot);
  });

  getTimeSlotsByDate = asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.query;
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError('Mentor ID is required.', StatusCodes.BAD_REQUEST);
    }

    if (!date) {
      throw new CustomError('Date is required.', StatusCodes.BAD_REQUEST);
    }

    const timeSlots = await this.timeSlotService.getTimeSlotsByMentorAndDate(
      mentorId,
      new Date(date as string)
    );
    res.status(StatusCodes.OK).json(timeSlots);
  });

  getAllTimeSlots = asyncHandler(async (req: Request, res: Response) => {
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError('Mentor ID is required.', StatusCodes.BAD_REQUEST);
    }

    const timeSlots = await this.timeSlotService.getAllTimeSlots(mentorId);
    res.status(StatusCodes.OK).json(timeSlots);
  });

  getBookedTimeSlots = asyncHandler(async (req: Request, res: Response) => {
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError('Mentor ID is required.', StatusCodes.BAD_REQUEST);
    }

    const timeSlots = await this.timeSlotService.getBookedTimeSlots(mentorId);
    res.status(StatusCodes.OK).json(timeSlots);
  });
}
