import { Navigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function AuthLoader() {
  return (
    <div className="page-bg flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-violet-400" />
    </div>
  );
}

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading, isGuest } = useAuth();
  if (loading) return <AuthLoader />;
  if (!session && !isGuest) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function GuestRoute({ children }: { children: React.ReactNode }) {
  const { session, loading, isGuest } = useAuth();
  if (loading) return <AuthLoader />;
  if (session || isGuest) return <Navigate to="/content" replace />;
  return <>{children}</>;
}
