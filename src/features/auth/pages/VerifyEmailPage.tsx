import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, XCircle } from 'lucide-react';
import { authApi } from '../api/auth.api';
import { Card, Button, Spinner } from '../../../components/ui';

export const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('Verifying email token...');
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token link.');
      return;
    }

    authApi
      .verifyEmail({ token })
      .then((res) => {
        setStatus('success');
        setMessage(res.message || 'Email verified successfully!');
      })
      .catch((err) => {
        setStatus('error');
        setMessage(err.message || 'Verification failed. Token may be expired.');
      });
  }, [token]);

  return (
    <Card className="p-5 shadow-lg border-purple text-center">
      {status === 'loading' && (
        <div>
          <Spinner size="lg" variant="purple" />
          <h5 className="fw-bold mt-3">Verifying Email...</h5>
        </div>
      )}

      {status === 'success' && (
        <div>
          <CheckCircle2 size={48} className="text-success mb-3" />
          <h4 className="fw-bold mb-2">Email Verified!</h4>
          <p className="text-secondary small mb-4">{message}</p>
          <Link to="/login">
            <Button variant="glow" className="w-100">
              Proceed to Sign In
            </Button>
          </Link>
        </div>
      )}

      {status === 'error' && (
        <div>
          <XCircle size={48} className="text-danger mb-3" />
          <h4 className="fw-bold mb-2">Verification Failed</h4>
          <p className="text-secondary small mb-4">{message}</p>
          <Link to="/login">
            <Button variant="outline" className="w-100">
              Return to Sign In
            </Button>
          </Link>
        </div>
      )}
    </Card>
  );
};
