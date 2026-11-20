export type UserRole = "USER" | "ADMIN" | "AUDITOR";

export type UserStatus = "ACTIVE" | "SUSPENDED";

export interface User {
  id: string;
  fullName: string;
  email: string;
  role: UserRole;
  status?: UserStatus;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  user: User;
}

export interface RefreshResponse {
  accessToken: string;
}