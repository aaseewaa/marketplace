
import { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { 
  login as mockLogin, 
  register as mockRegister, 
  logout as mockLogout,
  getCurrentSession,
  updateUser as mockUpdateUser
} from '../services/mockAuth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = getCurrentSession();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email, password) => {
    const result = mockLogin(email, password);
    if (result?.error) return result;
    setUser(result.user);
    return { success: true, user: result.user };
  }, []);

  const register = useCallback(async (email, password, name) => {
    const result = mockRegister(email, password, name);
    if (result?.error) return result;
    return { success: true, user: result.user };
  }, []);

  const logout = useCallback(() => {
    mockLogout();
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedData) => {
    if (!user?.id) return;
    
    const dataWithActivity = {
      ...updatedData,
      lastActive: new Date().toISOString()
    };
    
    const allowedFields = ['name', 'description', 'avatar', 'city', 'rating', 'reviews', 'notifications', 'privacy', 'lastActive'];
    const sanitized = {};
    
    for (const key of allowedFields) {
      if (key in dataWithActivity) sanitized[key] = dataWithActivity[key];
    }
    
    const result = mockUpdateUser(user.id, sanitized);
    if (result?.user) {
      setUser(result.user);
      return { success: true };
    }
    return result;
  }, [user?.id]);

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === null) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}