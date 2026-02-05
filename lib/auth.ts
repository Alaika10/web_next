export const AUTH_TOKEN_KEY = 'zenith_admin_session';

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

const ADMIN_USERNAME = process.env.NEXT_PUBLIC_ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD;

const safeCompare = (a: string, b: string) => {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
};

export const loginAdmin = (username: string, password: string): boolean => {
  const normalizedUsername = username.trim().toLowerCase();
  const normalizedPassword = password.trim();

  if (!ADMIN_PASSWORD) {
    console.error('Missing NEXT_PUBLIC_ADMIN_PASSWORD configuration.');
    return false;
  }

  const validUser = safeCompare(normalizedUsername, ADMIN_USERNAME.toLowerCase());
  const validPassword = safeCompare(normalizedPassword, ADMIN_PASSWORD);

  if (validUser && validPassword) {
    const sessionData = {
      user: normalizedUsername,
      token: typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `active_session_${Math.random().toString(36).slice(2)}`,
      timestamp: Date.now(),
    };
    localStorage.setItem(AUTH_TOKEN_KEY, JSON.stringify(sessionData));
    return true;
  }

  return false;
};

export const logoutAdmin = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  if (typeof window !== 'undefined') {
    window.location.assign('/');
  }
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const sessionStr = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!sessionStr) return false;

  try {
    const session = JSON.parse(sessionStr) as { timestamp?: number };
    if (!session?.timestamp || Date.now() - session.timestamp > SESSION_DURATION_MS) {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      return false;
    }
    return true;
  } catch {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    return false;
  }
};
