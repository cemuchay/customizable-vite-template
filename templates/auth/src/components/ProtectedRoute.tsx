import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import useAuthStore from '../store/useAuthStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: Array<'admin' | 'user'>;
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
  redirectTo = '/login',
}) => {
  const { isAuthenticated, user } = useAuthStore();
  let location: any = null;

  try {
    // Attempt to read router location for preserving state across redirects
    location = useLocation();
  } catch {
    // Fallback if not inside a React Router provider
    location = typeof window !== 'undefined' ? { pathname: window.location.pathname } : { pathname: '/' };
  }

  // 1. Unauthenticated -> Redirect to Login with original path in state
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // 2. Role-based Access Restriction (403 Forbidden Fallback)
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center p-4">
        <div className="max-w-md w-full text-center bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-amber-100 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 mb-5">
            <ShieldAlert className="w-8 h-8" />
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 mb-2">
            Access Restricted
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm mb-6">
            Your current role (<span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">{user.role}</span>) does not have sufficient permissions to view this resource.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                if (typeof window !== 'undefined') window.location.href = '/';
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
            >
              <Home className="w-4 h-4" />
              Return Home
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') window.history.back();
              }}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-medium text-sm bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 3. Authorized -> Render Protected View
  return <>{children}</>;
};

export default ProtectedRoute;
