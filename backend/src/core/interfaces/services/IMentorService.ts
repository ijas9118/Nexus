export interface IMentorService {
  completeProfile(email: string, name: string, password: string): unknown;
  getAllMentors(): unknown;
  acceptInvitation(token: string): unknown;
  sendInvitation(email: string, specialization: string, name: string): unknown;
}
