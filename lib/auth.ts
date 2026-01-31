
export const AUTH_TOKEN_KEY = 'zenith_admin_session';

export const loginAdmin = (username: string, password: string): boolean => {
  const validUsername = 'admin';
  const validPasswords = ['admin123', 'zenith'];

  if (username.toLowerCase() === validUsername && validPasswords.includes(password)) {
    const sessionData = {
      user: username,
      token: 'active_session_' + Math.random().toString(36).substr(2),
      timestamp: Date.now()
    };
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(sessionData));
    return true;
  }
  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  // Di Next.js, window.location.reload() atau router.push() disukai daripada manipulasi hash
  if (typeof window !== 'undefined') {
    window.location.href = '/';
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const sessionStr = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!sessionStr) return false;
  
  try {
    const session = JSON.parse(sessionStr);
    const isExpired = Date.now() - session.timestamp > 24 * 60 * 60 * 1000;
    if (isExpired) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return false;
    }
    return true;
  } catch (e) {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return false;
  }
};
