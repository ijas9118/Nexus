export interface IMentorService {
  completeProfile(email: any, name: any, password: any): unknown;
  getAllMentors(): unknown;
  acceptInvitation(token: any): unknown;
  sendInvitation(email: any, specialization: any, name: any): unknown;

}
