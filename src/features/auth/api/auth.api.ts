import apiClient from '../../../api/client';
import {
  RegisterDTO,
  LoginDTO,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  ChangePasswordDTO,
  VerifyEmailDTO,
  AuthResponse,
  IUser,
} from '@shared';

export const authApi = {
  register: async (data: RegisterDTO): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/register', data);
    return res.data;
  },

  login: async (data: LoginDTO): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', data);
    return res.data;
  },

  logout: async (): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post('/auth/logout');
    return res.data;
  },

  logoutAll: async (): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post('/auth/logout-all');
    return res.data;
  },

  refreshToken: async (): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/refresh-token');
    return res.data;
  },

  verifyEmail: async (data: VerifyEmailDTO): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/verify-email', data);
    return res.data;
  },

  forgotPassword: async (data: ForgotPasswordDTO): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post('/auth/forgot-password', data);
    return res.data;
  },

  resetPassword: async (data: ResetPasswordDTO): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post('/auth/reset-password', data);
    return res.data;
  },

  changePassword: async (data: ChangePasswordDTO): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.post('/auth/change-password', data);
    return res.data;
  },

  getProfile: async (): Promise<{ success: boolean; user: IUser }> => {
    const res = await apiClient.get('/auth/me');
    return res.data;
  },
};
