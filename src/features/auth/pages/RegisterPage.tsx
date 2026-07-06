import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Mail, User } from 'lucide-react';
import { registerSchema, RegisterInput } from '../schemas/auth.schema';
import { authApi } from '../api/auth.api';
import { Button, Input, PasswordInput } from '../../../components/ui';
import toast from 'react-hot-toast';

export const RegisterPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true);
    try {
      const res = await authApi.register({
        firstName: data.firstName,
        lastName: data.lastName,
        username: data.username,
        email: data.email,
        password: data.password,
      });
      toast.success(res.message || 'Registration successful! Please check your email to verify.');
      navigate('/login');
    } catch (err: any) {
      toast.error(err.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="glass-card p-4 rounded-4 shadow-lg border border-purple-subtle">
      <div className="text-center mb-3">
        <h5 className="fw-bold mb-0 text-light" style={{ fontFamily: 'Outfit' }}>
          Create Account
        </h5>
        <span className="text-secondary opacity-75" style={{ fontSize: '0.78rem' }}>
          Get started with Truson-AI
        </span>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row g-2 mb-1">
          <div className="col-6">
            <Input
              label="First Name"
              placeholder="John"
              error={errors.firstName?.message}
              {...register('firstName')}
            />
          </div>
          <div className="col-6">
            <Input
              label="Last Name"
              placeholder="Doe"
              error={errors.lastName?.message}
              {...register('lastName')}
            />
          </div>
        </div>

        <div className="row g-2 mb-1">
          <div className="col-6">
            <Input
              label="Username"
              placeholder="johndoe"
              leftIcon={<User size={14} />}
              error={errors.username?.message}
              {...register('username')}
            />
          </div>
          <div className="col-6">
            <Input
              label="Email"
              type="email"
              placeholder="john@ai.com"
              leftIcon={<Mail size={14} />}
              error={errors.email?.message}
              {...register('email')}
            />
          </div>
        </div>

        <div className="mb-1">
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            error={errors.password?.message}
            {...register('password')}
          />
        </div>

        <div className="mb-2">
          <PasswordInput
            label="Confirm Password"
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
          leftIcon={<UserPlus size={16} />}
        >
          Register Account
        </Button>
      </form>

      <div className="text-center text-secondary border-top border-secondary pt-3" style={{ fontSize: '0.8rem' }}>
        Already have an account?{' '}
        <Link to="/login" className="text-cyan text-decoration-none fw-bold ms-1">
          Sign In
        </Link>
      </div>
    </div>
  );
};
