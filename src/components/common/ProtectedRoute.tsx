import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useAppModeStore } from '@/stores/appModeStore';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
  fallbackPath?: string;
}

export function getRoleDefaultPath(role?: UserRole): string {
  if (role === 'SUPERADMIN' || role === 'ORGANIZER') {
    return '/admin';
  }
  return '/home';
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles, fallbackPath }) => {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Enforce strict role access
  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    const target = fallbackPath || getRoleDefaultPath(user.role);
    return <Navigate to={target} replace />;
  }

  return <>{children}</>;
};
