import { RequestHandler } from 'express';

export interface ITimeSlotController {
  addTimeSlot: RequestHandler;
  getAllTimeSlots: RequestHandler;
  getTimeSlotsByDate: RequestHandler;
  deleteTimeSlot: RequestHandler;
}
