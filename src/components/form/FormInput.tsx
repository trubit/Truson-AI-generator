import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Input, InputProps } from '../ui/Input';

export interface FormInputProps extends InputProps {
  name: string;
}

export const FormInput: React.FC<FormInputProps> = ({ name, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return <Input {...register(name)} error={error} {...props} />;
};
