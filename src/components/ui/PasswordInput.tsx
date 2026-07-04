import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input, InputProps } from './Input';

export const PasswordInput: React.FC<InputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="position-relative">
      <Input
        type={showPassword ? 'text' : 'password'}
        leftIcon={<Lock size={16} />}
        {...props}
      />
      <button
        type="button"
        className="btn btn-sm text-secondary position-absolute end-0 top-50 translate-middle-y me-2 border-0"
        onClick={() => setShowPassword(!showPassword)}
        tabIndex={-1}
      >
        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};
