import mongoose from "mongoose";
import { BaseRepository } from "../core/abstracts/base.repository";
import { IChatRepository } from "../core/interfaces/repositories/IChatRepository";
import ChatModel, { IChat } from "../models/chat.model";
import { injectable } from "inversify";

@injectable()
export class ChatRepository extends BaseRepository<IChat> implements IChatRepository {
  constructor() {
    super(ChatModel);
  }

  private formatTime(timestamp: string): string {
    const date = new Date(timestamp);
    const hours = date.getHours() % 12 || 12; // Convert to 12-hour format
    const minutes = date.getMinutes().toString().padStart(2, "0"); // Ensure 2 digits
    const ampm = date.getHours() >= 12 ? "PM" : "AM"; // Determine AM/PM
    return `${hours}:${minutes} ${ampm}`;
  }

  createNewChat(members: string[]): Promise<IChat> {
    const objectIdMembers = members.map((member) => new mongoose.Types.ObjectId(member));
    return this.create({ members: objectIdMembers });
  }

  async getAllChats(userId: string): Promise<any[]> {
    const objectIdUserId = new mongoose.Types.ObjectId(userId);

    const chats = await ChatModel.aggregate([
      {
        $match: {
          members: { $in: [objectIdUserId] },
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "members",
          foreignField: "_id",
          as: "members",
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "lastMessage",
          foreignField: "_id",
          as: "lastMessageDetails",
        },
      },
      {
        $unwind: {
          path: "$lastMessageDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $addFields: {
          member: {
            $arrayElemAt: [
              {
                $filter: {
                  input: "$members",
                  as: "member",
                  cond: { $ne: ["$$member._id", objectIdUserId] },
                },
              },
              0,
            ],
          },
        },
      },
      {
        $project: {
          _id: 1,
          name: "$member.name",
          username: "$member.username",
          avatar: "$member.profilePic",
          lastMessage: "$lastMessageDetails.text",
          lastMessageTime: "$lastMessageDetails.updatedAt",
          unreadMessages: 1,
        },
      },
    ]);

    const formattedChats = chats.map((chat) => {
      if (chat.lastMessageTime) {
        chat.lastMessageTime = this.formatTime(chat.lastMessageTime);
      }
      return chat;
    });

    return formattedChats;
  }
}
