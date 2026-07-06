import React, { useState } from 'react';
import { Eye, EyeOff, Lock } from 'lucide-react';
import { Input, InputProps } from './Input';

export const PasswordInput: React.FC<InputProps> = (props) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Input
      type={showPassword ? 'text' : 'password'}
      leftIcon={<Lock size={15} />}
      rightIcon={
        <button
          type="button"
          className="btn btn-sm text-secondary p-0 border-0 bg-transparent hover-text-white d-flex align-items-center justify-content-center"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          style={{ width: '20px', height: '20px' }}
        >
          {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
        </button>
      }
      {...props}
    />
  );
};
