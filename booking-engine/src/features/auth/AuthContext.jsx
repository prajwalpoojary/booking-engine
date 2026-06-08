import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const AuthContext = createContext();

// Helper function to decode JWT token (simplified for learning)
const decodeToken = (token) => {
  if (!token) return null;
  try {
    // In real app, you'd use a library like jwt-decode
    // This is a simplified simulation
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    return null;
  }
};

// Helper function to check if token is expired
const isTokenExpired = (token) => {
  if (!token) return true;
  const decoded = decodeToken(token);
  if (!decoded) return true;

  // Check if token has expired (exp is in seconds)
  const expirationTime = decoded.exp * 1000; // Convert to milliseconds
  const now = Date.now();
  return now >= expirationTime;
};

// Helper function to get time until expiration (in seconds)
const getTimeUntilExpiration = (token) => {
  if (!token) return 0;
  const decoded = decodeToken(token);
  if (!decoded) return 0;

  const expirationTime = decoded.exp * 1000;
  const now = Date.now();
  return Math.max(0, Math.floor((expirationTime - now) / 1000));
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('accessToken') || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || null);
  const [user, setUser] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Define logout first with useCallback to avoid dependency issues
  const logout = useCallback(() => {
    setToken(null);
    setRefreshToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }, []);

  // Memoize the refresh function to prevent stale closure issues
  // We'll handle the isRefreshing dependency by including it in the array
  const handleTokenRefresh = useCallback(async () => {
    if (isRefreshing || !refreshToken) {
      logout();
      return;
    }

    setIsRefreshing(true);

    try {
      // Simulate API call to refresh token
      // In real app, this would be an actual API request
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

      // Check if refresh token is expired
      if (isTokenExpired(refreshToken)) {
        throw new Error('Refresh token expired');
      }

      // Note: In a real app, you would get the expiration time from your auth server
      // For this learning example, we're simulating it
      const accessTokenExpiresIn = 15 * 60; // 15 minutes
      const accessTokenPayload = {
        exp: Math.floor(Date.now() / 1000) + accessTokenExpiresIn,
        email: user?.email || '',
        name: 'Demo User'
      };
      const newAccessToken = `fake-access-token.${btoa(JSON.stringify(accessTokenPayload))}.signature`;

      setToken(newAccessToken);
      localStorage.setItem('accessToken', newAccessToken);
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    } finally {
      setIsRefreshing(false);
    }
  }, [isRefreshing, refreshToken, logout, user]);

  const login = (email, password) => {
    // Fake login logic - simulate getting access and refresh tokens
    if (email && password) {
      // Simulate access token that expires in 15 minutes
      const accessTokenExpiresIn = 15 * 60; // 15 minutes in seconds
      const accessTokenPayload = {
        exp: Math.floor(Date.now() / 1000) + accessTokenExpiresIn,
        email,
        name: 'Demo User'
      };
      const accessToken = `fake-access-token.${btoa(JSON.stringify(accessTokenPayload))}.signature`;

      // Simulate refresh token that expires in 7 days
      const refreshTokenExpiresIn = 7 * 24 * 60 * 60; // 7 days in seconds
      const refreshTokenPayload = {
        exp: Math.floor(Date.now() / 1000) + refreshTokenExpiresIn,
        tokenType: 'refresh'
      };
      const refreshTokenValue = `fake-refresh-token.${btoa(JSON.stringify(refreshTokenPayload))}.signature`;

      setToken(accessToken);
      setRefreshToken(refreshTokenValue);
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshTokenValue);
      setUser({ email, name: 'Demo User' });
      return true;
    }
    return false;
  };

  // Check token expiration on mount and periodically
  useEffect(() => {
    const checkExpiration = () => {
      if (token && isTokenExpired(token)) {
        // Token is expired, try to refresh
        handleTokenRefresh();
      }
    };

    // Check on mount
    checkExpiration();

    // Set up interval to check every minute
    const intervalId = setInterval(checkExpiration, 60 * 1000);

    return () => clearInterval(intervalId);
  }, [token, handleTokenRefresh]);

  return (
    <AuthContext.Provider
      value={{
        token,
        refreshToken,
        user,
        isAuthenticated: !!token && !isTokenExpired(token),
        isRefreshing,
        login,
        logout,
        timeUntilExpiration: getTimeUntilExpiration(token),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};