import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, Mail, ArrowRight } from 'lucide-react';
import { loginSchema, LoginInput } from '../schemas/auth.schema';
import { authApi } from '../api/auth.api';
import { useAuthStore } from '../../../store/auth.store';
import { Button, Input, PasswordInput } from '../../../components/ui';
import toast from 'react-hot-toast';

export const LoginPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((s) => s.setUser);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setIsLoading(true);
    try {
      const res = await authApi.login(data);
      if (res.user && res.accessToken) {
        setUser(res.user, res.accessToken);
        toast.success(`Welcome back, ${res.user.firstName}!`);
        navigate('/');
      }
    } catch (err: any) {
      toast.error(err.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 rounded-4 shadow-lg border border-purple-subtle">
      <div className="text-center mb-3">
        <h5 className="fw-bold mb-0 text-light" style={{ fontFamily: 'Outfit' }}>
          Welcome Back
        </h5>
        <span className="text-secondary opacity-75" style={{ fontSize: '0.78rem' }}>
          Sign in to your AI workspace
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-2">
          <Input
            label="Email or Username"
            placeholder="architect@neurova.ai"
            leftIcon={<Mail size={15} />}
            error={errors.loginIdentifier?.message}
            {...register('loginIdentifier')}
          />
        </div>

        <div className="mb-1">
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className="d-flex justify-content-end mb-3">
          <Link
            to="/forgot-password"
            className="text-purple small text-decoration-none hover-underline"
            style={{ fontSize: '0.75rem' }}
          >
            Forgot password?
          </Link>
        </div>

        <Button
          variant="glow"
          size="md"
          className="w-100 mb-3 rounded-3 py-2 fw-bold"
          type="submit"
          isLoading={isLoading}
          rightIcon={<ArrowRight size={16} />}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center text-secondary border-top border-secondary pt-3" style={{ fontSize: '0.8rem' }}>
        Don't have an account?{' '}
        <Link to="/register" className="text-cyan text-decoration-none fw-bold ms-1">
          Create Account
        </Link>
      </div>
    </div>
  );
};
