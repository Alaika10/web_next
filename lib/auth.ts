
export const AUTH_TOKEN_KEY = 'zenith_admin_session';

export const loginAdmin = (username: string, password: string): boolean => {
  // Validasi kredensial (Default: admin / admin123 atau admin / zenith)
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
  // 1. Hapus token dari storage untuk mengakhiri sesi
  localStorage.removeItem(AUTH_TOKEN_KEY);
  
  // 2. Redirect ke Beranda (Home)
  // Menggunakan hash '/' karena aplikasi menggunakan HashRouter
  window.location.hash = '#/';
  
  // 3. Force reload halaman untuk memastikan semua state aplikasi (React) 
  // benar-benar bersih dan pengguna melihat tampilan publik yang segar.
  window.location.reload();
};

export const isAuthenticated = (): boolean => {
  const sessionStr = localStorage.getItem(AUTH_TOKEN_KEY);
  if (!sessionStr) return false;
  
  try {
    const session = JSON.parse(sessionStr);
    // Cek kadaluarsa sesi (24 jam)
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
