import React from 'react';
import { ChatSidebar } from '../../chat/components/ChatSidebar';
import { ChatMiddleArea } from '../../chat/components/ChatMiddleArea';
import { ChatRightSidebar } from '../../chat/components/ChatRightSidebar';

export const AIWorkspacePage: React.FC = () => {
  return (
    <div className="d-flex h-100 flex-grow-1 overflow-hidden rounded-4 glass-card border border-secondary" style={{ minHeight: 'calc(100vh - 120px)' }}>
      <ChatSidebar />
      <ChatMiddleArea />
      <ChatRightSidebar />
    </div>
  );
};
