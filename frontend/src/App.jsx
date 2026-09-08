import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OAuthPage from './pages/OAuthPage';
import DashboardPage from './pages/DashboardPage';
import PostPropertyModal from './components/PostPropertyModal';
import LeaseGeneratorModal from './components/LeaseGeneratorModal';
import AffordabilityCalculatorModal from './components/AffordabilityCalculatorModal';
import ThemeDevToolbar from './components/ThemeDevToolbar';
import { useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';

export default function App() {
  const { isLoggedIn, user } = useAuth();

  // Shared modals state (can be triggered from dashboard or home)
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isLeaseModalOpen, setIsLeaseModalOpen] = useState(false);
  const [leaseTargetProperty, setLeaseTargetProperty] = useState(null);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          {/* Main Explore Page */}
          <Route
            path="/"
            element={
              <HomePage
                onOpenPostModal={() => setIsPostModalOpen(true)}
                onOpenLease={(prop) => {
                  setLeaseTargetProperty(prop);
                  setIsLeaseModalOpen(true);
                }}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />

          {/* Dedicated Login Page */}
          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />

          {/* Dedicated Register Page */}
          <Route
            path="/register"
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
          />

          {/* Dedicated Social OAuth Flow Page (Google, Facebook, Apple) */}
          <Route
            path="/oauth/:provider"
            element={<OAuthPage />}
          />

          {/* User Dashboard Page */}
          <Route
            path="/dashboard"
            element={
              <DashboardPage
                onOpenPostModal={() => setIsPostModalOpen(true)}
                onOpenLease={(prop) => {
                  setLeaseTargetProperty(prop);
                  setIsLeaseModalOpen(true);
                }}
                onOpenCalculator={() => setIsCalculatorOpen(true)}
              />
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global Modals */}
        <PostPropertyModal
          isOpen={isPostModalOpen}
          onClose={() => setIsPostModalOpen(false)}
          onPropertyCreated={(newProp) => {
            alert('🎉 Your property listing has been published successfully!');
          }}
        />

        <LeaseGeneratorModal
          isOpen={isLeaseModalOpen}
          onClose={() => setIsLeaseModalOpen(false)}
          defaultProperty={leaseTargetProperty}
        />

        <AffordabilityCalculatorModal
          isOpen={isCalculatorOpen}
          onClose={() => setIsCalculatorOpen(false)}
          onApplyBudget={(budget) => {
            // handled in page
          }}
        />

        {/* Development Theme Tab & Color Studio */}
        <ThemeDevToolbar />
      </BrowserRouter>
    </ThemeProvider>
  );
}
