export type UserRole = 'user' | 'premium' | 'mentor' | 'admin';

export interface IUserWhoFollow {
  _id: string;
  name: string;
  profilePic: string;
}

export interface IPendingRequestUser {
  _id: string;
  name: string;
  username: string;
  profilePic: string;
}
