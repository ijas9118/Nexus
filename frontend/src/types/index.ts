export interface User {
  _id: string;
  username: string;
  email: string;
  profilePic?: string;
}

export interface Chat {
  _id: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Group {
  _id: string;
  name: string;
  members: string[];
  createdBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  _id: string;
  chatId: string;
  chatType: "Chat" | "Group";
  sender: string;
  content?: string;
  fileUrl?: string;
  fileType?: "image" | "video" | "pdf";
  reactions: { userId: string; reaction: string }[];
  replyTo?: string;
  isDeleted: boolean;
  readBy: string[];
  createdAt: string;
  updatedAt: string;
}
