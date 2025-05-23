export interface UserManagementData {
  id: string;
  name: string;
  email: string;
  profilePic: string;
  postsCount: number;
  joinedSquadsCount: number;
  isBlocked: boolean;
}

export interface IGetUsersResponse {
  data: UserManagementData[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
