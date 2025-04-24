import { ITimeSlotController } from '@/core/interfaces/controllers/ITimeSlotController';
import { TimeSlotService } from '@/services/time-slot.service';
import CustomError from '@/utils/CustomError';
import { NextFunction, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';

export class TimeSlotController implements ITimeSlotController {
  private timeSlotService: TimeSlotService;

  constructor() {
    this.timeSlotService = new TimeSlotService();
  }

  addTimeSlot = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date, startTime } = req.body;
      console.log(req.body);
      const mentorId = req.user?._id;

      if (!mentorId) {
        throw new CustomError('Mentor ID is required.');
      }

      if (!date || !startTime) {
        throw new CustomError('Date and start time are required.');
      }

      const timeSlot = await this.timeSlotService.addTimeSlot(mentorId, new Date(date), startTime);
      res.status(201).json(timeSlot);
    } catch (error) {
      next(error);
    }
  });

  deleteTimeSlot = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { slotId } = req.params;
      const mentorId = req.user?._id;

      if (!mentorId) {
        throw new CustomError('Mentor ID is required.');
      }

      const timeSlot = await this.timeSlotService.deleteTimeSlot(mentorId, slotId);
      res.status(200).json(timeSlot);
    } catch (error) {
      next(error);
    }
  });

  getTimeSlotsByDate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { date } = req.query;
      const mentorId = req.user?._id;

      if (!mentorId) {
        throw new CustomError('Mentor ID is required.');
      }

      if (!date) {
        throw new CustomError('Date is required.');
      }

      const timeSlots = await this.timeSlotService.getTimeSlotsByMentorAndDate(
        mentorId,
        new Date(date as string)
      );
      res.status(200).json(timeSlots);
    } catch (error) {
      next(error);
    }
  });

  getAllTimeSlots = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
      const mentorId = req.user?._id;

      if (!mentorId) {
        throw new CustomError('Mentor ID is required.');
      }

      const timeSlots = await this.timeSlotService.getAllTimeSlots(mentorId);
      res.status(200).json(timeSlots);
    } catch (error) {
      next(error);
    }
  });
}
