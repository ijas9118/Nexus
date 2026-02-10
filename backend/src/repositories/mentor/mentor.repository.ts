import { StatusCodes } from "http-status-codes";
import { injectable } from "inversify";

import type { IMentorRepository } from "@/core/interfaces/repositories/i-mentor-repository";
import type { IMentor } from "@/models/mentor.model";

import { BaseRepository } from "@/core/abstracts/base.repository";
import { MentorModel } from "@/models/mentor.model";
import CustomError from "@/utils/custom-error";

@injectable()
export class MentorRepository extends BaseRepository<IMentor> implements IMentorRepository {
  constructor() {
    super(MentorModel);
  }

  createMentorApplication = async (
    userId: string,
    mentorData: Partial<IMentor>,
  ): Promise<IMentor> => {
    if (!mentorData.experience || !mentorData.mentorshipDetails) {
      throw new CustomError(
        "Missing required fields: experience or mentorshipDetails.",
        StatusCodes.BAD_REQUEST,
      );
    }

    return this.create({
      userId,
      experience: mentorData.experience,
      mentorshipDetails: mentorData.mentorshipDetails,
      status: "pending",
    } as unknown as Partial<IMentor>);
  };

  findMentorByUserId = async (userId: string): Promise<IMentor | null> => {
    return await this.model
      .findOne({ userId })
      .populate("experience.experienceLevel")
      .populate("experience.expertiseAreas")
      .populate("experience.technologies")
      .populate("mentorshipDetails.mentorshipTypes")
      .populate("mentorshipDetails.targetAudiences");
  };

  async updateMentorStatus(
    mentorId: string,
    status: "pending" | "approved" | "rejected",
  ): Promise<IMentor | null> {
    return await this.model.findByIdAndUpdate(mentorId, { status }, { new: true });
  }

  getAllMentors = async (): Promise<IMentor[]> => {
    return await this.model
      .find(
        {},
        {
          "_id": 1,
          "userId": 1,
          "status": 1,
          "experience.currentRole": 1,
          "experience.expertiseAreas": 1,
          "experience.bio": 1,
        },
      )
      .populate("userId", "name profilePic email")
      .lean();
  };

  getApprovedMentors = async (): Promise<IMentor[]> => {
    return await this.model
      .find(
        { status: "approved" },
        {
          "_id": 1,
          "userId": 1,
          "experience.currentRole": 1,
          "experience.expertiseAreas": 1,
          "experience.bio": 1,
        },
      )
      .populate("userId", "name profilePic email")
      .populate("experience.expertiseAreas")
      .lean();
  };

  getMentorDetails = async (mentorId: string): Promise<IMentor | null> => {
    return await this.model
      .findById(mentorId)
      .populate("userId", "name email profilePic username location") // 👈 pick what you need
      .populate("experience.experienceLevel")
      .populate("experience.expertiseAreas")
      .populate("experience.technologies")
      .populate("mentorshipDetails.mentorshipTypes")
      .populate("mentorshipDetails.targetAudiences")
      .lean();
  };

  updateMentorExperience = async (
    userId: string,
    experienceData: {
      currentRole: string;
      company: string;
      experienceLevel: string;
      expertiseAreas: string[];
      technologies: string[];
      bio: string;
      resume?: string | null;
    },
  ): Promise<IMentor | null> => {
    return await this.model
      .findOneAndUpdate(
        { userId },
        {
          $set: {
            "experience.currentRole": experienceData.currentRole,
            "experience.company": experienceData.company,
            "experience.experienceLevel": experienceData.experienceLevel,
            "experience.expertiseAreas": experienceData.expertiseAreas,
            "experience.technologies": experienceData.technologies,
            "experience.bio": experienceData.bio,
            "experience.resume": experienceData.resume,
          },
        },
        { new: true },
      )
      .populate("experience.experienceLevel")
      .populate("experience.expertiseAreas")
      .populate("experience.technologies")
      .populate("mentorshipDetails.mentorshipTypes")
      .populate("mentorshipDetails.targetAudiences");
  };

  updateMentorshipDetails = async (
    userId: string,
    mentorshipDetailsData: {
      mentorshipTypes: string[];
      targetAudiences: string[];
    },
  ): Promise<IMentor | null> => {
    return await this.model
      .findOneAndUpdate(
        { userId },
        {
          $set: {
            "mentorshipDetails.mentorshipTypes": mentorshipDetailsData.mentorshipTypes,
            "mentorshipDetails.targetAudiences": mentorshipDetailsData.targetAudiences,
          },
        },
        { new: true },
      )
      .populate("experience.experienceLevel")
      .populate("experience.expertiseAreas")
      .populate("experience.technologies")
      .populate("mentorshipDetails.mentorshipTypes")
      .populate("mentorshipDetails.targetAudiences");
  };

  async countMentorsByStatus(): Promise<{
    totalApplications: number;
    statusCounts: Array<{
      status: string;
      count: number;
    }>;
  }> {
    // Get total count of all mentor applications
    const totalApplications = await this.model.countDocuments({});

    // Aggregate mentor applications by status
    const statusCounts = await this.model.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          status: "$_id",
          count: 1,
        },
      },
      {
        $sort: { status: 1 },
      },
    ]);

    // Ensure all statuses are represented (even if count is 0)
    const allStatuses = ["pending", "approved", "rejected"];
    const statusMap = new Map(statusCounts.map(item => [item.status, item.count]));

    const completeStatusCounts = allStatuses.map(status => ({
      status,
      count: statusMap.get(status) || 0,
    }));

    return {
      totalApplications,
      statusCounts: completeStatusCounts,
    };
  }

  async countMentorApplicationsBefore(date: Date): Promise<number> {
    return this.model.countDocuments({
      createdAt: { $lt: date },
    });
  }
}
