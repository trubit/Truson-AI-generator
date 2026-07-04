import React from 'react';
import { Route } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { Dashboard } from '../pages/Dashboard';
import { PromptWorkspacePage } from '../features/prompts/pages/PromptWorkspacePage';
import { ContentGenPage } from '../pages/ContentGenPage';
import { AIEnginePage } from '../pages/AIEnginePage';
import { SettingsPage } from '../pages/SettingsPage';
import { NotFound } from '../pages/NotFound';

export const ProtectedRoutes = (
  <Route element={<MainLayout />}>
    <Route index element={<Dashboard />} />
    <Route path="/prompts" element={<PromptWorkspacePage />} />
    <Route path="/content" element={<ContentGenPage />} />
    <Route path="/ai-engine" element={<AIEnginePage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route path="*" element={<NotFound />} />
  </Route>
);
