import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Select, SelectProps } from '../ui/Select';

export interface FormSelectProps extends SelectProps {
  name: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({ name, ...props }) => {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  const error = errors[name]?.message as string | undefined;

  return <Select {...register(name)} error={error} {...props} />;
};
