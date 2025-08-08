import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { getUserProfile } from '../services/profileService';
import { showToast } from '../components/common/ToastContainer';

interface PrivateRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();
  const [profileLoading, setProfileLoading] = useState(false);
  const [hasRequiredRole, setHasRequiredRole] = useState(true); // Default to true if no role is required
  const location = useLocation();

  useEffect(() => {
    const checkUserRole = async () => {
      if (user && requiredRole) {
        try {
          setProfileLoading(true);
          const profile = await getUserProfile();
          
          // Check if the user has the required role
          if (profile && profile.role === requiredRole) {
            setHasRequiredRole(true);
          } else {
            setHasRequiredRole(false);
            showToast(`Access denied: ${location.pathname} requires admin permissions`, 'error');
          }
        } catch (error) {
          console.error('Error fetching user profile:', error);
          setHasRequiredRole(false);
          showToast('Error checking permissions', 'error');
        } finally {
          setProfileLoading(false);
        }
      }
    };

    checkUserRole();
  }, [user, requiredRole, location.pathname]);

  if (loading || (user && requiredRole && profileLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // If user doesn't have the required role, redirect to home
  if (requiredRole && !hasRequiredRole) {
    return <Navigate to="/" replace />;
  }
  
  // User is authenticated and has the required role (or no role required)
  return <>{children}</>;
};

export default PrivateRoute;