import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { ITimeSlotController } from "@/core/interfaces/controllers/i-time-slot-controller";
import type { ITimeSlotService } from "@/core/interfaces/services/i-time-slot-service";

import { TYPES } from "@/di/types";
import CustomError from "@/utils/custom-error";

@injectable()
export class TimeSlotController implements ITimeSlotController {
  constructor(@inject(TYPES.TimeSlotService) private timeSlotService: ITimeSlotService) {}

  addTimeSlot = asyncHandler(async (req: Request, res: Response) => {
    const { date, startTime } = req.body;
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError("Mentor ID is required.", StatusCodes.BAD_REQUEST);
    }

    if (!date || !startTime) {
      throw new CustomError("Date and start time are required.", StatusCodes.BAD_REQUEST);
    }

    const timeSlot = await this.timeSlotService.addTimeSlot(mentorId, new Date(date), startTime);
    res.status(StatusCodes.CREATED).json(timeSlot);
  });

  deleteTimeSlot = asyncHandler(async (req: Request, res: Response) => {
    const { slotId } = req.params;
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError("Mentor ID is required.", StatusCodes.BAD_REQUEST);
    }

    const timeSlot = await this.timeSlotService.deleteTimeSlot(mentorId, slotId as string);
    res.status(StatusCodes.OK).json(timeSlot);
  });

  getTimeSlotsByDate = asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.query;
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError("Mentor ID is required.", StatusCodes.BAD_REQUEST);
    }

    if (!date) {
      throw new CustomError("Date is required.", StatusCodes.BAD_REQUEST);
    }

    const timeSlots = await this.timeSlotService.getTimeSlotsByMentorAndDate(
      mentorId,
      new Date(date as string),
    );
    res.status(StatusCodes.OK).json(timeSlots);
  });

  getAllTimeSlots = asyncHandler(async (req: Request, res: Response) => {
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError("Mentor ID is required.", StatusCodes.BAD_REQUEST);
    }

    const timeSlots = await this.timeSlotService.getAllTimeSlots(mentorId);
    res.status(StatusCodes.OK).json(timeSlots);
  });

  getBookedTimeSlots = asyncHandler(async (req: Request, res: Response) => {
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError("Mentor ID is required.", StatusCodes.BAD_REQUEST);
    }

    const timeSlots = await this.timeSlotService.getBookedTimeSlots(mentorId);
    res.status(StatusCodes.OK).json(timeSlots);
  });

  getMentorTimeSlots = asyncHandler(async (req: Request, res: Response) => {
    const mentorId = req.params.mentorId as string;

    if (!mentorId) {
      throw new CustomError("Mentor ID is required.", StatusCodes.BAD_REQUEST);
    }

    const timeSlots = await this.timeSlotService.getMentorTimeSlots(mentorId);
    res.status(StatusCodes.OK).json(timeSlots);
  });
}
