import { Resend } from 'resend';
import { env } from '../../../config/env.config';
import { logger } from '../../../config/logger.config';

class EmailService {
  private resend: Resend | null = null;

  constructor() {
    if (env.RESEND_API_KEY && !env.RESEND_API_KEY.includes('placeholder')) {
      this.resend = new Resend(env.RESEND_API_KEY);
    }
  }

  public async sendVerificationEmail(toEmail: string, name: string, token: string): Promise<boolean> {
    const verifyUrl = `${env.CLIENT_URL}/verify-email?token=${token}`;
    const subject = 'Verify your Truson-AI Account';
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #090d16; color: #f9fafb; padding: 40px; border-radius: 12px;">
        <h2 style="color: #a78bfa; margin-bottom: 20px;">Welcome to Truson-AI-Generator</h2>
        <p>Hi ${name},</p>
        <p>Thank you for registering. Please verify your email address to activate your account:</p>
        <div style="margin: 30px 0;">
          <a href="${verifyUrl}" style="background: linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Verify Email Address</a>
        </div>
        <p style="font-size: 12px; color: #9ca3af;">Or copy and paste this link in your browser: <br/> ${verifyUrl}</p>
      </div>
    `;

    return this.sendEmail(toEmail, subject, html);
  }

  public async sendPasswordResetEmail(toEmail: string, name: string, token: string): Promise<boolean> {
    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${token}`;
    const subject = 'Reset your Truson-AI Password';
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #090d16; color: #f9fafb; padding: 40px; border-radius: 12px;">
        <h2 style="color: #22d3ee; margin-bottom: 20px;">Password Reset Request</h2>
        <p>Hi ${name},</p>
        <p>We received a request to reset your password. Click the link below to set a new password:</p>
        <div style="margin: 30px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #06b6d4 0%, #6366f1 100%); color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold; display: inline-block;">Reset Password</a>
        </div>
        <p style="font-size: 12px; color: #9ca3af;">This token expires in 1 hour.</p>
      </div>
    `;

    return this.sendEmail(toEmail, subject, html);
  }

  private async sendEmail(to: string, subject: string, html: string): Promise<boolean> {
    try {
      if (!this.resend) {
        logger.info(`[Email Service Simulation] To: ${to} | Subject: ${subject}`);
        return true;
      }
      await this.resend.emails.send({
        from: 'Truson-AI <noreply@truson.ai>',
        to,
        subject,
        html,
      });
      logger.info(`✅ Email sent successfully to ${to}`);
      return true;
    } catch (error) {
      logger.error(`❌ Failed to send email to ${to}: ${error}`);
      return false;
    }
  }
}

export const emailService = new EmailService();
