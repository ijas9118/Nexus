import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { ITimeSlotController } from "@/core/interfaces/controllers/i-time-slot-controller";
import type { ITimeSlotService } from "@/core/interfaces/services/i-time-slot-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { MENTOR_MESSAGES } = MESSAGES;

@injectable()
export class TimeSlotController implements ITimeSlotController {
  constructor(@inject(TYPES.TimeSlotService) private _timeSlotService: ITimeSlotService) {}

  addTimeSlot = asyncHandler(async (req: Request, res: Response) => {
    const { date, startTime } = req.body;
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError(MENTOR_MESSAGES.MENTOR_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    if (!date || !startTime) {
      throw new CustomError(MENTOR_MESSAGES.DATE_START_TIME_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const timeSlot = await this._timeSlotService.addTimeSlot(mentorId, new Date(date), startTime);
    res.status(StatusCodes.CREATED).json(timeSlot);
  });

  deleteTimeSlot = asyncHandler(async (req: Request, res: Response) => {
    const { slotId } = req.params;
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError(MENTOR_MESSAGES.MENTOR_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const timeSlot = await this._timeSlotService.deleteTimeSlot(mentorId, slotId as string);
    res.status(StatusCodes.OK).json(timeSlot);
  });

  getTimeSlotsByDate = asyncHandler(async (req: Request, res: Response) => {
    const { date } = req.query;
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError(MENTOR_MESSAGES.MENTOR_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    if (!date) {
      throw new CustomError(MENTOR_MESSAGES.DATE_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const timeSlots = await this._timeSlotService.getTimeSlotsByMentorAndDate(
      mentorId,
      new Date(date as string),
    );
    res.status(StatusCodes.OK).json(timeSlots);
  });

  getAllTimeSlots = asyncHandler(async (req: Request, res: Response) => {
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError(MENTOR_MESSAGES.MENTOR_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const timeSlots = await this._timeSlotService.getAllTimeSlots(mentorId);
    res.status(StatusCodes.OK).json(timeSlots);
  });

  getBookedTimeSlots = asyncHandler(async (req: Request, res: Response) => {
    const mentorId = req.user?.mentorId;

    if (!mentorId) {
      throw new CustomError(MENTOR_MESSAGES.MENTOR_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const timeSlots = await this._timeSlotService.getBookedTimeSlots(mentorId);
    res.status(StatusCodes.OK).json(timeSlots);
  });

  getMentorTimeSlots = asyncHandler(async (req: Request, res: Response) => {
    const mentorId = req.params.mentorId as string;

    if (!mentorId) {
      throw new CustomError(MENTOR_MESSAGES.MENTOR_ID_REQUIRED, StatusCodes.BAD_REQUEST);
    }

    const timeSlots = await this._timeSlotService.getMentorTimeSlots(mentorId);
    res.status(StatusCodes.OK).json(timeSlots);
  });
}
