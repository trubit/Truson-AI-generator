import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { Mail, Send } from 'lucide-react';
import { forgotPasswordSchema, ForgotPasswordInput } from '../schemas/auth.schema';
import { authApi } from '../api/auth.api';
import { Button, Input } from '../../../components/ui';
import toast from 'react-hot-toast';

export const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordInput) => {
    setIsLoading(true);
    try {
      const res = await authApi.forgotPassword(data);
      toast.success(res.message);
    } catch (err: any) {
      toast.error(err.message || 'Failed to request reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 rounded-4 shadow-lg border border-purple-subtle">
      <div className="text-center mb-3">
        <h5 className="fw-bold mb-0 text-light" style={{ fontFamily: 'Outfit' }}>
          Forgot Password
        </h5>
        <span className="text-secondary opacity-75" style={{ fontSize: '0.78rem' }}>
          Enter email to receive reset instructions
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <Input
            label="Email Address"
            type="email"
            placeholder="architect@neurova.ai"
            leftIcon={<Mail size={15} />}
            error={errors.email?.message}
            {...register('email')}
          />
        </div>

        <Button
          variant="glow"
          size="md"
          className="w-100 mb-3 rounded-3 py-2 fw-bold"
          type="submit"
          isLoading={isLoading}
          rightIcon={<Send size={15} />}
        >
          Send Reset Email
        </Button>
      </form>

      <div className="text-center text-secondary border-top border-secondary pt-3" style={{ fontSize: '0.8rem' }}>
        Remembered your password?{' '}
        <Link to="/login" className="text-cyan text-decoration-none fw-bold ms-1">
          Sign In
        </Link>
      </div>
    </div>
  );
};
