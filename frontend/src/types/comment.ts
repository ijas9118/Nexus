export interface Comment {
  _id: string;
  contentId: string;
  userId: {
    _id: string;
    name: string;
    profilePic?: string;
    username: string;
  };
  parentCommentId?: string;
  text: string;
  likes: string[];
  replies: Comment[];
  createdAt: string;
  isDeleted: boolean;
  status: "active" | "reported" | "deleted";
}
