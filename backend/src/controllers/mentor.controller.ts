import { Request, Response } from "express";
import { IMentorController } from "../core/interfaces/controllers/IMentorController";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { IMentorService } from "../core/interfaces/services/IMentorService";

@injectable()
export class MentorController implements IMentorController {
  constructor(@inject(TYPES.MentorService) private mentorService: IMentorService) {}

  sendInvitation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, specialization, name } = req.body;
      await this.mentorService.sendInvitation(email, specialization, name);
      res.status(200).json({ message: "Invitation sent successfully" });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  acceptInvitation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { token } = req.body;
      const email = await this.mentorService.acceptInvitation(token);
      res.status(200).json(email);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  getAllMentors = async (req: Request, res: Response): Promise<void> => {
    try {
      const mentors = await this.mentorService.getAllMentors();
      res.status(200).json(mentors);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    }
  };

  completeProfile = async (req: Request, res: Response): Promise<void> => {
    const { email, name, password } = req.body;
    try {
      await this.mentorService.completeProfile(email, name, password);
      res.status(200).json({
        success: true,
        message: "Profile updated successfully!",
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);

      res.status(500).json({
        success: false,
        message: "Failed to update profile. Please try again later.",
      });
    }
  };
}
