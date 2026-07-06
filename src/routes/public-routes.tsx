import React from 'react';
import { Route } from 'react-router-dom';
import { LandingLayout } from '../layouts/LandingLayout';
import { LandingPage } from '../pages/LandingPage';
import { AuthLayout } from '../layouts/AuthLayout';
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
  GuestGuard,
} from '../features/auth';

export const PublicRoutes = (
  <>
    <Route element={<LandingLayout />}>
      <Route path="/landing" element={<LandingPage />} />
    </Route>
    <Route element={<GuestGuard />}>
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
      </Route>
    </Route>
  </>
);
