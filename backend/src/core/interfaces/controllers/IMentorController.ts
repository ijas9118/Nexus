import { RequestHandler } from 'express';

export interface IMentorController {
  applyAsMentor: RequestHandler;
  approveMentor: RequestHandler;
  rejectMentor: RequestHandler;
  getStatus: RequestHandler;
  getAllMentors: RequestHandler;
  getMentorDetails: RequestHandler;
}
