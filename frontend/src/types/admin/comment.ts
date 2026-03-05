export interface AdminComment {
  _id: string;
  contentId: {
    _id: string;
    title: string;
  };
  userId: {
    _id: string;
    name: string;
    profilePic?: string;
  };
  parentCommentId?: string;
  text: string;
  status: "active" | "reported" | "deleted";
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
}
