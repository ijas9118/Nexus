import { BaseService } from "../core/abstracts/base.service";
import { IMentorService } from "../core/interfaces/services/IMentorService";
import { IMentor } from "../models/mentor.model";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN, CLIENT_URL, USER_EMAIL } from "../utils/constants";
import redisClient from "../config/redisClient.config";
import { transporter } from "../utils/nodemailerTransporter";
import { UserRepository } from "../repositories/user.repository";
import { MentorRepository } from "../repositories/mentor.repository";
import { inject, injectable } from "inversify";
import { TYPES } from "../di/types";
import { hash } from "bcrypt";

const ACCESS_TOKEN_SECRET = ACCESS_TOKEN || "access_secret";

@injectable()
export class MentorService extends BaseService<IMentor> implements IMentorService {
  constructor(
    @inject(TYPES.MentorRepository) private mentorRepository: MentorRepository,
    @inject(TYPES.UserRepository) private userRepository: UserRepository
  ) {
    super(mentorRepository);
  }

  sendInvitation = async (
    email: string,
    specialization: string,
    name: string
  ): Promise<void> => {
    const token = jwt.sign({ email, specialization, name }, ACCESS_TOKEN_SECRET, {
      expiresIn: "1d",
    });

    await redisClient.setex(`mentorInvite:${email}`, 86400, token);

    const mailOptions = {
      from: USER_EMAIL,
      to: email,
      subject: "Invitation to Join as Mentor - Nexus",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px; background-color: #f9f9f9;">
          <div style="background-color: #007bff; color: #ffffff; text-align: center; padding: 20px; border-radius: 8px 8px 0 0;">
            <h1 style="margin: 0; font-size: 24px;">Nexus</h1>
            <p style="margin: 5px 0 0; font-size: 16px;">Empowering Collaboration and Growth</p>
          </div>
    
          <div style="padding: 20px; color: #333333;">
            <h2 style="font-size: 20px; margin-bottom: 20px;">You're Invited to Join as a Mentor!</h2>
            <p style="font-size: 16px; line-height: 1.5;">Hello,</p>
            <p style="font-size: 16px; line-height: 1.5;">
              We are excited to invite you to join <strong>Nexus</strong> as a mentor. Your expertise and guidance will help shape the future of our community.
            </p>
            <p style="font-size: 16px; line-height: 1.5;">
              To accept this invitation and create your mentor account, please click the button below:
            </p>
            <div style="text-align: center; margin: 20px 0;">
              <a href="${CLIENT_URL}/mentor/accept-invitation?token=${token}" style="background-color: #007bff; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-size: 16px; display: inline-block;">
                Accept Invitation
              </a>
            </div>
            <p style="font-size: 16px; line-height: 1.5;">
              If the button above doesn't work, copy and paste the following link into your browser:
            </p>
            <p style="font-size: 16px; line-height: 1.5; word-break: break-all;">
              <a href="${CLIENT_URL}/mentor/accept-invitation?token=${token}" style="color: #007bff; text-decoration: none;">
                ${CLIENT_URL}/accept-invitation?token=${token}
              </a>
            </p>
            <p style="font-size: 16px; line-height: 1.5;">
              This invitation link is valid for <strong>24 hours</strong>. If you have any questions or need assistance, feel free to contact us.
            </p>
          </div>
    
          <div style="text-align: center; padding: 20px; font-size: 14px; color: #777777; background-color: #f4f4f4; border-radius: 0 0 8px 8px;">
            <p style="margin: 0;">Best regards,<br>The Nexus Team</p>
            <p style="margin: 10px 0 0;">
              <a href="${CLIENT_URL}" style="color: #007bff; text-decoration: none;">Visit our website</a>
            </p>
            <p style="margin: 10px 0 0; font-size: 12px;">&copy; ${new Date().getFullYear()} Nexus. All rights reserved.</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    const user = await this.userRepository.create({
      name,
      email,
      password: "$2b$10$gRSI2udnXon1m6BxycA/OOdbOMWjxDtKfPMM4md9I53HoBoyTnSxu",
      role: "mentor",
    });

    await this.mentorRepository.create({ userId: user._id, specialization });
  };

  acceptInvitation = async (token: string) => {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET) as {
      email: string;
      specialization: string;
      name: string;
    };

    const storedToken = await redisClient.get(`mentorInvite:${decoded.email}`);
    if (!storedToken || storedToken !== token) {
      throw new Error("Invalid or expired token");
    }

    return decoded.email;
  };

  getAllMentors = async (): Promise<IMentor[]> => {
    return this.mentorRepository.getAllMentors();
  };

  completeProfile = async (email: string, name: string, password: string) => {
    const hashedPassword = await hash(password, 10);

    return this.userRepository.updateOne(
      { email },
      { $set: { name, password: hashedPassword } }
    );
  };
}
