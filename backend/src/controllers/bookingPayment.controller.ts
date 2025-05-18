import asyncHandler from 'express-async-handler';
import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { inject, injectable } from 'inversify';
import { IBookingPaymentService } from '../core/interfaces/services/IBookingPaymentService';
import { TYPES } from '../di/types';
import { IBookingPaymentController } from '@/core/interfaces/controllers/IBookingPaymentController';
import { IMentorService } from '@/core/interfaces/services/IMentorService';

@injectable()
export class BookingPaymentController implements IBookingPaymentController {
  constructor(
    @inject(TYPES.BookingPaymentService) private bookingPaymentService: IBookingPaymentService,
    @inject(TYPES.MentorService) private mentorService: IMentorService
  ) {}

  checkoutSession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { mentorId, mentorshipType, date, timeSlot, reason, email } = req.body;
    const customerId = req.user?._id as string;
    const mentorUserId = await this.mentorService.getUserIdByMentorId(mentorId);
    const sessionUrl = await this.bookingPaymentService.checkoutSession(
      mentorId,
      mentorshipType,
      mentorUserId,
      date,
      timeSlot,
      reason,
      customerId,
      email
    );
    res.status(StatusCodes.OK).json(sessionUrl);
  });

  verifySession = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { sessionId } = req.params;

    if (!sessionId || typeof sessionId !== 'string') {
      res.status(StatusCodes.BAD_REQUEST).json({ success: false, message: 'Missing sessionId' });
      return;
    }

    const isValid = await this.bookingPaymentService.verifyCheckoutSession(sessionId);
    res.status(StatusCodes.OK).json({ success: isValid });
  });
}
