import { injectable } from "inversify";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IMentorRepository } from "../core/interfaces/repositories/IMentorRepository";
import { IMentor, MentorModel } from "../models/mentor.model";

@injectable()
export class MentorRepository
  extends BaseRepository<IMentor>
  implements IMentorRepository
{
  constructor() {
    super(MentorModel);
  }

  getAllMentors = async (): Promise<IMentor[]> => {
    return MentorModel.aggregate([
      {
        $lookup: {
          from: "users", // The collection to join with (User collection)
          localField: "userId", // Field from the Mentor collection
          foreignField: "_id", // Field from the User collection
          as: "user", // Output array field
        },
      },
      {
        $unwind: "$user", // Convert the "user" array to an object
      },
      {
        $project: {
          _id: 1,
          specialization: 1,
          availability: 1,
          verified: 1,
          squadsCreated: 1,
          rating: 1,
          name: "$user.name", // Include the name field from the User collection
          email: "$user.email", // Include the email field from the User collection
          profilePic: "$user.profilePic", // Include the profilePic field from the User collection
        },
      },
    ]).exec();
  };
}
