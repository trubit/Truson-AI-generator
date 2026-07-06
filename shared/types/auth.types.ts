export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';

export interface IUser {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  avatar?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  lastLogin?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: IUser;
  accessToken?: string;
}

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  loginIdentifier: string; // email or username
  password: string;
}

export interface ForgotPasswordDTO {
  email: string;
}

export interface ResetPasswordDTO {
  token: string;
  password: string;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface VerifyEmailDTO {
  token: string;
}
