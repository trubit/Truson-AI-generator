import React from 'react';
import { Route } from 'react-router-dom';
import { LandingLayout } from '../layouts/LandingLayout';
import { LandingPage } from '../pages/LandingPage';
import { AuthLayout } from '../layouts/AuthLayout';
import { Card, Button, Input } from '../components/ui';

export const PublicRoutes = (
  <>
    <Route element={<LandingLayout />}>
      <Route path="/landing" element={<LandingPage />} />
    </Route>
    <Route element={<AuthLayout />}>
      <Route
        path="/auth"
        element={
          <Card className="p-4">
            <h4 className="fw-bold mb-3 text-center">Sign In to Truson-AI</h4>
            <Input label="Email Address" type="email" placeholder="architect@truson.ai" />
            <Input label="Password" type="password" placeholder="••••••••" />
            <Button variant="glow" className="w-100 mt-2">
              Sign In
            </Button>
          </Card>
        }
      />
    </Route>
  </>
);
