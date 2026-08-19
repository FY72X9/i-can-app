import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { TopNavbar } from '@/components/common/TopNavbar';
import { BottomNav } from '@/components/common/BottomNav';
import { HomePage } from '@/pages/HomePage';
import { FeedPage } from '@/pages/FeedPage';
import { UploadPage } from '@/pages/UploadPage';
import { WalletPage } from '@/pages/WalletPage';
import { VerificationPage } from '@/pages/VerificationPage';
import { ProfilePage } from '@/pages/ProfilePage';
import { LoginPage } from '@/pages/LoginPage';

const AppLayout: React.FC<{ children: React.ReactNode; title?: string }> = ({ children, title }) => {
  return (
    <div className="min-h-screen bg-surface-bg text-text-primary flex flex-col justify-between">
      <TopNavbar title={title} />
      <main className="flex-1 max-w-md w-full mx-auto p-4">
        {children}
      </main>
      <BottomNav />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected App Routes */}
        <Route
          path="/"
          element={
            <AppLayout>
              <HomePage />
            </AppLayout>
          }
        />
        <Route
          path="/feed"
          element={
            <AppLayout title="Community Feed">
              <FeedPage />
            </AppLayout>
          }
        />
        <Route
          path="/upload"
          element={
            <AppLayout title="Unggah Aksi">
              <UploadPage />
            </AppLayout>
          }
        />
        <Route
          path="/wallet"
          element={
            <AppLayout title="Dompet Hijau">
              <WalletPage />
            </AppLayout>
          }
        />
        <Route
          path="/verify"
          element={
            <AppLayout title="Verifikasi Aksi">
              <VerificationPage />
            </AppLayout>
          }
        />
        <Route
          path="/profile"
          element={
            <AppLayout title="Profil Saya">
              <ProfilePage />
            </AppLayout>
          }
        />

        {/* Catch-all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};
