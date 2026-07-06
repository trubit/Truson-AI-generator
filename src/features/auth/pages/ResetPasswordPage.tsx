import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { resetPasswordSchema, ResetPasswordInput } from '../schemas/auth.schema';
import { authApi } from '../api/auth.api';
import { Button, PasswordInput } from '../../../components/ui';
import toast from 'react-hot-toast';

export const ResetPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordInput) => {
    if (!token) {
      toast.error('Invalid or missing password reset token.');
      return;
    }
    setIsLoading(true);
    try {
      const res = await authApi.resetPassword({ token, password: data.password });
      toast.success(res.message);
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Password reset failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 rounded-4 shadow-lg border border-purple-subtle">
      <div className="text-center mb-3">
        <h5 className="fw-bold mb-0 text-light" style={{ fontFamily: 'Outfit' }}>
          Reset Password
        </h5>
        <span className="text-secondary opacity-75" style={{ fontSize: '0.78rem' }}>
          Set a strong new password for your account
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <PasswordInput
            label="New Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className="mb-3">
          <PasswordInput
            label="Confirm New Password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />
        </div>

        <Button
          variant="glow"
          size="md"
          className="w-100 mb-3 rounded-3 py-2 fw-bold"
          type="submit"
          isLoading={isLoading}
          leftIcon={<CheckCircle size={16} />}
        >
          Reset Password
        </Button>
      </form>
    </div>
  );
};
