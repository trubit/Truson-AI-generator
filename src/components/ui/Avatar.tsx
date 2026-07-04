import React from 'react';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Avatar: React.FC<AvatarProps> = ({ src, name = 'User', size = 'md' }) => {
  const sizePx = size === 'sm' ? 32 : size === 'lg' ? 48 : 40;
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="rounded-circle border border-secondary object-fit-cover"
        style={{ width: sizePx, height: sizePx }}
      />
    );
  }

  return (
    <div
      className="rounded-circle bg-purple text-white fw-bold d-flex align-items-center justify-content-center border border-purple-subtle"
      style={{ width: sizePx, height: sizePx, fontSize: sizePx * 0.4 }}
    >
      {initials}
    </div>
  );
};
