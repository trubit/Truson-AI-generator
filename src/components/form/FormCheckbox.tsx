import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Checkbox, CheckboxProps } from '../ui/Checkbox';

export interface FormCheckboxProps extends CheckboxProps {
  name: string;
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({ name, ...props }) => {
  const { register } = useFormContext();
  return <Checkbox {...register(name)} {...props} />;
};
