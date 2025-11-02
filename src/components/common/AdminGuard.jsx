import { Navigate } from 'react-router-dom';
import useAuthStore from '../../stores/authStore';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import storage from '../../utils/storage';

/**
 * AdminGuard Component
 * Protects admin-only routes by checking user authentication and admin role
 * Redirects non-admin users or unauthenticated users appropriately
 */
export default function AdminGuard({ children }) {
  const { user, isAuthenticated, refreshUser } = useAuthStore();
  const [hasChecked, setHasChecked] = useState(false);
  const [isVerifying, setIsVerifying] = useState(true);

  useEffect(() => {
    const verifyAdminAccess = async () => {
      setIsVerifying(true);

      // Check if we have a token
      const token = storage.getAccessToken();

      if (!token) {
        toast.error('Please login to access admin dashboard');
        setHasChecked(true);
        setIsVerifying(false);
        return;
      }

      // If we have a token but no user data, try to fetch user
      if (!user && token) {
        try {
          const fetchedUser = await refreshUser();
          if (!fetchedUser) {
            toast.error('Session expired. Please login again.');
            storage.clearAll();
            setHasChecked(true);
            setIsVerifying(false);
            return;
          }
        } catch (error) {
          console.error('Failed to fetch user:', error);
          toast.error('Session expired. Please login again.');
          storage.clearAll();
          setHasChecked(true);
          setIsVerifying(false);
          return;
        }
      }

      // After fetching user, check if they have admin role
      const currentUser = useAuthStore.getState().user;

      if (currentUser) {
        if (currentUser.role !== 'admin') {
          toast.error('Access Denied: Admin privileges required');
        }
      }

      setHasChecked(true);
      setIsVerifying(false);
    };

    verifyAdminAccess();
  }, [user, refreshUser]);

  // Show loading while verifying authentication
  if (isVerifying || !hasChecked) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e5e7eb',
          borderTop: '4px solid #22c55e',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }} />
        <div>Verifying admin access...</div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Check if we have a valid token
  const token = storage.getAccessToken();
  if (!token || !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user exists and has admin role
  if (!user || user.role !== 'admin') {
    return <Navigate to="/home" replace />;
  }

  // Render admin content
  return children;
}
