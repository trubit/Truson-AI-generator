import React from 'react';
import { Route } from 'react-router-dom';
import { WorkspaceLayout } from '../layouts/WorkspaceLayout';
import { AIWorkspacePage } from '../features/ai/pages/AIWorkspacePage';

export const WorkspaceRoutes = (
  <Route element={<WorkspaceLayout />}>
    <Route path="/ai-workspace" element={<AIWorkspacePage />} />
  </Route>
);
