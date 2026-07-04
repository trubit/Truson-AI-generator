import React from 'react';
import { Search, X } from 'lucide-react';
import { Input, InputProps } from './Input';

export interface SearchInputProps extends Omit<InputProps, 'leftIcon'> {
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({ value, onChange, onClear, ...props }) => {
  return (
    <div className="position-relative">
      <Input
        leftIcon={<Search size={16} />}
        value={value}
        onChange={onChange}
        placeholder="Search..."
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          className="btn btn-sm text-secondary position-absolute end-0 top-50 translate-middle-y me-2 border-0"
          onClick={onClear}
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
};
