import { RequestHandler } from 'express';

export interface IMentorController {
  applyAsMentor: RequestHandler;
  approveMentor: RequestHandler;
  rejectMentor: RequestHandler;
}
