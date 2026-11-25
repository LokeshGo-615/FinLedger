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

  // Number of open accounts (ACTIVE + FROZEN)
  activeAccountCount: number;

  createdAt: Date;
  updatedAt: Date;
}