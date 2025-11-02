import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useAuthStore from '../stores/authStore';
import toast from 'react-hot-toast';
import LoadingSpinner from './common/LoadingSpinner';
import darkLogo from '../assets/logo-dark.svg';

/**
 * AdminLoginPage Component
 * Modern admin login matching NSA portal design structure
 */
export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isLoading, user, isAuthenticated, logout } = useAuthStore();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockTimer, setLockTimer] = useState(0);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/admin';
  const wasRedirected = location.state?.unauthorized === true;

  useEffect(() => {
    if (wasRedirected) {
      toast.error('Admin authentication required to access that page', {
        icon: '🔒',
        duration: 5000,
      });
    }
  }, [wasRedirected]);

  useEffect(() => {
    if (isAuthenticated && user?.role === 'admin') {
      toast.success(`Welcome back, ${user.firstName || 'Admin'}!`, {
        icon: '👋',
      });
      navigate(from, { replace: true });
    } else if (isAuthenticated && user?.role !== 'admin') {
      toast.error('This account does not have admin privileges');
      logout();
    }
  }, [isAuthenticated, user, navigate, from, logout]);

  useEffect(() => {
    if (isLocked && lockTimer > 0) {
      const timer = setTimeout(() => setLockTimer(lockTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else if (isLocked && lockTimer === 0) {
      setIsLocked(false);
      setLoginAttempts(0);
      setError('');
      toast.success('Login attempts reset. You may try again.', { icon: '🔓' });
    }
  }, [isLocked, lockTimer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isLocked) {
      setError(`Account locked. Try again in ${lockTimer} seconds.`);
      toast.error(`Please wait ${lockTimer} seconds before trying again`, { icon: '⏱️' });
      return;
    }

    if (!identifier || !password) {
      setError('Please fill in all fields');
      return;
    }

    const result = await login(identifier, password);

    if (result.success) {
      if (result.user.role === 'admin') {
        toast.success(
          `Welcome, ${result.user.firstName || 'Admin'}! Redirecting...`,
          { icon: '✅', duration: 2000 }
        );
        setLoginAttempts(0);
        setIsLocked(false);
        setTimeout(() => navigate(from), 500);
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        setError(`Access Denied: Admin privileges required (Attempt ${newAttempts}/5)`);

        if (newAttempts >= 5) {
          setIsLocked(true);
          setLockTimer(60);
          setError('Too many failed attempts. Account locked for 60 seconds.');
          toast.error('Account locked for security. Wait 60 seconds.', { icon: '🔒', duration: 6000 });
        } else {
          toast.error(`Not an admin account. ${5 - newAttempts} attempts remaining.`, { icon: '🚫' });
        }

        logout();
        setIdentifier('');
        setPassword('');
      }
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      setError(`Invalid credentials (Attempt ${newAttempts}/5)`);

      if (newAttempts >= 5) {
        setIsLocked(true);
        setLockTimer(60);
        setError('Too many failed attempts. Locked for 60 seconds.');
        toast.error('Too many failed attempts. Account locked.', { icon: '🔒', duration: 6000 });
      } else {
        toast.error(`Invalid credentials. ${5 - newAttempts} attempts remaining.`, { icon: '❌' });
      }
    }
  };

  return (
    <div className="modern-login-container admin-login">
      {/* Left Section - Admin Illustration/Branding */}
      <div className="login-illustration-section admin-illustration">
        <div className="illustration-content">
          <div className="admin-shield-container">
            <div className="shield-circle">
              <span className="material-symbols-outlined">admin_panel_settings</span>
            </div>
          </div>
          <div className="illustration-text">
            <h1>Admin Dashboard</h1>
            <p>Secure Access Portal</p>
            <div className="illustration-subtitle">
              Comprehensive platform management with enterprise-grade security
            </div>
          </div>
          <div className="admin-features-showcase">
            <div className="feature-badge">
              <span className="material-symbols-outlined">verified_user</span>
              <span>Secure</span>
            </div>
            <div className="feature-badge">
              <span className="material-symbols-outlined">encrypted</span>
              <span>Encrypted</span>
            </div>
            <div className="feature-badge">
              <span className="material-symbols-outlined">monitoring</span>
              <span>Monitored</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Section - Admin Login Form */}
      <div className="login-form-section">
        <div className="form-container">
          <div className="login-logo">
            <img src={darkLogo} alt="Solidify Logo" />
          </div>

          <div className="login-header admin-header">
            <h2>Admin Portal Access</h2>
            <p className="security-notice">
              <span className="material-symbols-outlined">security</span>
              All login attempts are monitored and logged
            </p>
          </div>

          <form className="login-form" onSubmit={handleSubmit}>
            {/* Error Message */}
            {error && (
              <div className={`error-banner ${isLocked ? 'error-locked' : ''}`}>
                <span className="material-symbols-outlined">
                  {isLocked ? 'lock_clock' : 'error'}
                </span>
                <span>{error}</span>
              </div>
            )}

            {/* Login Attempts Warning */}
            {loginAttempts > 0 && !isLocked && (
              <div className={`warning-banner ${loginAttempts >= 3 ? 'warning-critical' : ''}`}>
                <span className="material-symbols-outlined">warning</span>
                <div>
                  <strong>Failed Attempts: {loginAttempts}/5</strong>
                  {loginAttempts >= 3 && (
                    <p>Account will be locked after {5 - loginAttempts} more failed attempts</p>
                  )}
                </div>
              </div>
            )}

            {/* Locked Status */}
            {isLocked && (
              <div className="locked-banner">
                <div className="locked-icon">
                  <span className="material-symbols-outlined">lock</span>
                </div>
                <div className="locked-content">
                  <strong>Account Temporarily Locked</strong>
                  <p className="timer-text">
                    <span className="timer-value">{lockTimer}</span> seconds remaining
                  </p>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${(lockTimer / 60) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="identifier">
                Admin Email or Username <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined icon">badge</span>
                <input
                  id="identifier"
                  type="text"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter admin credentials"
                  required
                  disabled={isLoading || isLocked}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="password">
                Admin Password <span className="required">*</span>
              </label>
              <div className="input-with-icon">
                <span className="material-symbols-outlined icon">key</span>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter secure password"
                  required
                  disabled={isLoading || isLocked}
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading || isLocked}
                  tabIndex="-1"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <span className="material-symbols-outlined">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button type="submit" className="btn-login admin-btn" disabled={isLoading || isLocked}>
              {isLoading ? (
                <>
                  <LoadingSpinner size="small" />
                  <span>Verifying...</span>
                </>
              ) : isLocked ? (
                <>
                  <span className="material-symbols-outlined">lock</span>
                  <span>Locked ({lockTimer}s)</span>
                </>
              ) : (
                <>
                  <span>Secure Admin Login</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </>
              )}
            </button>
          </form>

          <div className="login-footer">
            <p className="access-text">
              Not an administrator?
            </p>
            <Link to="/login" className="link-secondary">
              <span className="material-symbols-outlined">arrow_back</span>
              Back to Regular Login
            </Link>
          </div>

          <div className="admin-help-section">
            <p className="help-text">
              <span className="material-symbols-outlined">support_agent</span>
              Need admin access? Contact your system administrator
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
