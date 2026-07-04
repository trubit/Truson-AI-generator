import React from 'react';
import { FormProvider as RHFProvider, UseFormReturn, FieldValues } from 'react-hook-form';

export interface FormProviderProps<TFieldValues extends FieldValues> {
  methods: UseFormReturn<TFieldValues>;
  onSubmit: (data: TFieldValues) => void;
  children: React.ReactNode;
  className?: string;
}

export function FormProvider<TFieldValues extends FieldValues>({
  methods,
  onSubmit,
  children,
  className = '',
}: FormProviderProps<TFieldValues>) {
  return (
    <RHFProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </RHFProvider>
  );
}
