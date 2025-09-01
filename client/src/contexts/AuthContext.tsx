import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { zcAuth } from "@zcatalyst/auth-client";

interface User {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  first_name?: string;
  last_name?: string;
  email_id?: string;
  phone_number?: string;
  user_id?: string;
  org_id?: string;
  locale?: string;
  time_zone?: string;
  user_type?: string;
  created_time?: string;
  modified_time?: string;
  invited_time?: string;
  is_confirmed?: boolean;
  status?: string;
  source?: string;
  role_details?: any;
  zaid?: string;
  zuid?: string;
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const authResult = await zcAuth.isUserAuthenticated();
      if (authResult) {
        setUser(authResult as User);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = () => {
    zcAuth.hostedSignIn();
  };

  const logout = () => {
    zcAuth.signOut("/app");
    setUser(null);
    setIsAuthenticated(false);
  };

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
