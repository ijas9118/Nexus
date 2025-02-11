import { IMentor } from "../../../models/mentor.model";

export interface IMentorRepository {
  getAllMentors(): Promise<IMentor[]>;
}
