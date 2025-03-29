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

export interface SearchConnections {
  _id: string;
  name: string;
  username: string;
  profilePic: string;
  email: string;
}
