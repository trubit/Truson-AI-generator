import React from 'react';
import { Route } from 'react-router-dom';
import { WorkspaceLayout } from '../layouts/WorkspaceLayout';
import { AIWorkspacePage } from '../features/ai/pages/AIWorkspacePage';
import { ProtectedGuard } from '../features/auth';

export const WorkspaceRoutes = (
  <Route element={<ProtectedGuard />}>
    <Route element={<WorkspaceLayout />}>
      <Route path="/ai-workspace" element={<AIWorkspacePage />} />
    </Route>
  </Route>
);
