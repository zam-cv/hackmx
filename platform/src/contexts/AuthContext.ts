import { createContext } from 'react';
import { NavigateFunction } from 'react-router';
import { UserInformation } from '../utils/api';

export type AuthContextType = {
  isLoading: boolean;
  isAuthenticated: boolean;
  signout: () => void;
  signin: (email: string, password: string, navigate: NavigateFunction) => void;
  userInformation: UserInformation;
}

export const AuthContext = createContext<AuthContextType>({
  isLoading: true,
  isAuthenticated: false,
  signout: () => {},
  signin: () => {},
  userInformation: {
    username: '...',
    email: '...',
  },
});