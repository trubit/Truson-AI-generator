import React from 'react';
import { OverlayTrigger, Tooltip as BootstrapTooltip } from 'react-bootstrap';

export interface TooltipProps {
  title: string;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  children: React.ReactElement;
}

export const Tooltip: React.FC<TooltipProps> = ({ title, placement = 'top', children }) => {
  return (
    <OverlayTrigger
      placement={placement}
      overlay={<BootstrapTooltip id={`tooltip-${title.replace(/\s+/g, '-')}`}>{title}</BootstrapTooltip>}
    >
      {children}
    </OverlayTrigger>
  );
};
