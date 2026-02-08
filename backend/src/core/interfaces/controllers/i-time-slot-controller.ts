import type { RequestHandler } from 'express';

export interface ITimeSlotController {
  addTimeSlot: RequestHandler;
  getAllTimeSlots: RequestHandler;
  getTimeSlotsByDate: RequestHandler;
  deleteTimeSlot: RequestHandler;
  getBookedTimeSlots: RequestHandler;
  getMentorTimeSlots: RequestHandler;
}
