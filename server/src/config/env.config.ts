import dotenv from 'dotenv';
import path from 'path';
import { z } from 'zod';

// Load environment variables from root .env
dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().transform((val) => parseInt(val, 10)).default('5050'),
  CLIENT_URL: z.string().url().default('http://localhost:5180'),

  MONGODB_URI: z.string().min(1, 'MONGODB_URI is required'),

  JWT_SECRET: z.string().min(8, 'JWT_SECRET must be at least 8 characters'),
  JWT_REFRESH_SECRET: z.string().min(8, 'JWT_REFRESH_SECRET must be at least 8 characters'),
  COOKIE_SECRET: z.string().min(8, 'COOKIE_SECRET must be at least 8 characters'),

  OPENAI_API_KEY: z.string().min(1, 'OPENAI_API_KEY is required'),
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY is required'),
  GEMINI_API_KEY: z.string().min(1, 'GEMINI_API_KEY is required'),

  PAYSTACK_SECRET_KEY: z.string().min(1, 'PAYSTACK_SECRET_KEY is required'),
  PAYSTACK_PUBLIC_KEY: z.string().min(1, 'PAYSTACK_PUBLIC_KEY is required'),

  CLOUDINARY_CLOUD_NAME: z.string().min(1, 'CLOUDINARY_CLOUD_NAME is required'),
  CLOUDINARY_API_KEY: z.string().min(1, 'CLOUDINARY_API_KEY is required'),
  CLOUDINARY_API_SECRET: z.string().min(1, 'CLOUDINARY_API_SECRET is required'),

  RESEND_API_KEY: z.string().min(1, 'RESEND_API_KEY is required'),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error('❌ Environment Variable Validation Errors:');
  console.error(JSON.stringify(_env.error.format(), null, 2));
  throw new Error('Invalid environment variables configured.');
}

export const env = _env.data;
