import type { Request, Response } from "express";

import asyncHandler from "express-async-handler";
import { StatusCodes } from "http-status-codes";
import { inject, injectable } from "inversify";

import type { IBookingPaymentController } from "@/core/interfaces/controllers/i-booking-payment-controller";
import type { IBookingPaymentService } from "@/core/interfaces/services/i-booking-payment-service";
import type { IMentorService } from "@/core/interfaces/services/i-mentor-service";

import { TYPES } from "@/di/types";
import { MESSAGES } from "@/utils/constants/message";
import CustomError from "@/utils/custom-error";

const { COMMON_MESSAGES } = MESSAGES;

@injectable()
export class BookingPaymentController implements IBookingPaymentController {
  constructor(
    @inject(TYPES.BookingPaymentService) private _bookingPaymentService: IBookingPaymentService,
    @inject(TYPES.MentorService) private _mentorService: IMentorService,
  ) {}

  checkoutSession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId, mentorshipType, date, timeSlot, reason, email } = req.body;
    const customerId = req.user?._id as string;
    const mentorUserId = await this._mentorService.getUserIdByMentorId(mentorId);
    const sessionUrl = await this._bookingPaymentService.checkoutSession(
      mentorId,
      mentorshipType,
      mentorUserId,
      date,
      timeSlot,
      reason,
      customerId,
      email,
    );
    res.status(StatusCodes.OK).json(sessionUrl);
  });

  verifySession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params;

    if (!sessionId || typeof sessionId !== "string") {
      throw new CustomError(COMMON_MESSAGES.MISSING_SESSION_ID, StatusCodes.BAD_REQUEST);
    }

    const isValid = await this._bookingPaymentService.verifyCheckoutSession(sessionId);
    res.status(StatusCodes.OK).json({ success: isValid });
  });
}
