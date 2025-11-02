import { useNavigate, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

function NotFound() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // If user is on a protected route and not authenticated, redirect to login
    const protectedRoutes = ['/home', '/news', '/sustainability-choices', '/chat', '/find-SME', '/settings'];
    const isProtectedRoute = protectedRoutes.some(route => 
      location.pathname.startsWith(route)
    );

    if (isProtectedRoute) {
      // Check if user is authenticated
      const token = localStorage.getItem('solidify_access_token');
      if (!token) {
        navigate('/login');
        return;
      }
    }
  }, [location, navigate]);

  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <button 
        onClick={() => navigate('/')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '5px',
          cursor: 'pointer',
          marginTop: '20px'
        }}
      >
        Go Home
      </button>
    </div>
  );
}

export default NotFound;