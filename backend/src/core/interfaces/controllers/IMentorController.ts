import { RequestHandler } from 'express';

export interface IMentorController {
  applyAsMentor: RequestHandler;
  approveMentor: RequestHandler;
  rejectMentor: RequestHandler;
  getStatus: RequestHandler;
  getAllMentors: RequestHandler;
  getApprovedMentors: RequestHandler;
  getMentorDetails: RequestHandler;
  getMentorEnums: RequestHandler;
  getMentorshipTypes: RequestHandler;
  updateMentorExperience: RequestHandler;
  updateMentorshipDetails: RequestHandler;
}
