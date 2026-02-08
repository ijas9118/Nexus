import type { Request, Response } from "express";

import { Router } from "express";

import type { IChatService } from "@/core/interfaces/services/i-chat-service";
import type { IGroupService } from "@/core/interfaces/services/i-group-service";
import type { IMessageService } from "@/core/interfaces/services/i-message-service";

import { container } from "@/di/container";
import { TYPES } from "@/di/types";
import { authenticate } from "@/middlewares/auth.middleware";

const router = Router();

const chatService = container.get<IChatService>(TYPES.ChatService);
const groupService = container.get<IGroupService>(TYPES.GroupService);
const messageService = container.get<IMessageService>(TYPES.MessageService);

// Get user's chats
router.get(
  "/chats",
  authenticate(["user", "premium", "mentor"]),
  async (req: Request, res: Response) => {
    try {
      const chats = await chatService.getUserChats(req.user?._id as string);
      res.json(chats);
    }
    catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

// Get user's groups
router.get(
  "/groups",
  authenticate(["user", "premium", "mentor"]),
  async (req: Request, res: Response) => {
    try {
      const groups = await groupService.getUserGroups(req.user?._id as string);
      res.json(groups);
    }
    catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

// Get messages for a chat or group
router.get(
  "/messages",
  authenticate(["user", "premium", "mentor"]),
  async (req: Request, res: Response) => {
    try {
      const { chatId, chatType } = req.query;
      const messages = await messageService.getMessages(
        req.user?._id as string,
        chatId as string,
        chatType as "Chat" | "Group",
      );
      res.json(messages);
    }
    catch (error) {
      res.status(500).json({ error: (error as Error).message });
    }
  },
);

export default router;
