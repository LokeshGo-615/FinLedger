export enum UserRole {
  USER = "USER",
  ADMIN = "ADMIN",
  AUDITOR = "AUDITOR"
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED"
}

export interface IUser {
  fullName: string;
  email: string;
  password: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}
