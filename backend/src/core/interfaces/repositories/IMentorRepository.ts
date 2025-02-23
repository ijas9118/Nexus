import { IMentor } from "../../../models/mentor.model";
import { BaseRepository } from "../../abstracts/base.repository";

export interface IMentorRepository extends BaseRepository<IMentor> {
  getAllMentors(): Promise<IMentor[]>;
}
