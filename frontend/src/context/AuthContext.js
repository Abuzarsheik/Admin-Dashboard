import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI, apiHelpers } from '../utils/api';
import { toast } from 'react-toastify';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
};

// Action types
const AUTH_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  LOGIN_SUCCESS: 'LOGIN_SUCCESS',
  LOGOUT: 'LOGOUT',
  SET_ERROR: 'SET_ERROR',
  UPDATE_USER: 'UPDATE_USER',
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };

    case AUTH_ACTIONS.UPDATE_USER:
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext(null);

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      const response = await authAPI.getProfile();
      const userData = apiHelpers.formatResponse(response);
      
      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_SUCCESS, 
        payload: userData.user 
      });
    } catch (error) {
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authAPI.login(credentials);
      const data = apiHelpers.formatResponse(response);

      // Store token in localStorage if provided
      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      dispatch({ 
        type: AUTH_ACTIONS.LOGIN_SUCCESS, 
        payload: data.user 
      });

      apiHelpers.showSuccess(data.message || 'Login successful');
      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = apiHelpers.handleError(error, 'Login failed');
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await authAPI.logout();
      // Clear token from localStorage
      localStorage.removeItem('authToken');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      apiHelpers.showSuccess('Logged out successfully');
    } catch (error) {
      // Even if logout fails on server, clear local state
      localStorage.removeItem('authToken');
      dispatch({ type: AUTH_ACTIONS.LOGOUT });
      apiHelpers.handleError(error, 'Logout failed');
    }
  };

  // Register function (admin only)
  const register = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authAPI.register(userData);
      const data = apiHelpers.formatResponse(response);

      apiHelpers.showSuccess(data.message || 'User registered successfully');
      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = apiHelpers.handleError(error, 'Registration failed');
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Update profile function
  const updateProfile = async (userData) => {
    try {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });

      const response = await authAPI.updateProfile(userData);
      const data = apiHelpers.formatResponse(response);

      dispatch({ 
        type: AUTH_ACTIONS.UPDATE_USER, 
        payload: data.user 
      });

      apiHelpers.showSuccess(data.message || 'Profile updated successfully');
      return { success: true, user: data.user };
    } catch (error) {
      const errorMessage = apiHelpers.handleError(error, 'Profile update failed');
      dispatch({ 
        type: AUTH_ACTIONS.SET_ERROR, 
        payload: errorMessage 
      });
      return { success: false, error: errorMessage };
    } finally {
      dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check if user is admin
  const isAdmin = () => {
    return state.user?.role === 'admin';
  };

  // Check if user has permission
  const hasPermission = (requiredRole = 'user') => {
    if (!state.isAuthenticated) return false;
    if (requiredRole === 'user') return true;
    if (requiredRole === 'admin') return isAdmin();
    return false;
  };

  // Context value
  const value = {
    // State
    user: state.user,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    error: state.error,

    // Actions
    login,
    logout,
    register,
    updateProfile,
    clearError,
    checkAuthStatus,

    // Utilities
    isAdmin,
    hasPermission,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};

export default AuthContext; 