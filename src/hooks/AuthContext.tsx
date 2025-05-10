// AuthContext.tsx
import { createContext, useContext, useEffect, useState } from "react";
import { AuthApiFp, PlayerApiFp } from "../api/generated/api";
import { APIRegion, APIRestUserDB } from "../api/generated";
import { useAsyncError, useNavigate } from "react-router";
type AuthContextType = {
  isAuthenticated: boolean;
  user: APIRestUserDB | null;
  profile: () => Promise<any>;
  login: (region: APIRegion) => Promise<any>;
  logout: () => Promise<any>;
  reset: () => Promise<any>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  profile: async () => {},
  login: async () => {},
  logout: async () => {},
  reset: async () => {},
  isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<APIRestUserDB | null>(null);
  const [isAuthenticated, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const login = async (region: APIRegion) => {
    const redirectUrl = `${window.location.origin}/auth`;
    const request = await AuthApiFp().loginLoginRegionGet(region, redirectUrl);
    return (await request()).data;
  };

  const logout = async () => {
    const _ = await AuthApiFp().logoutLogoutGet();
    setUser(null);
    setIsAuth(false);
  };

  const checkAuth = async (): Promise<boolean> => {
    const request = await AuthApiFp().authVerifyTokenAuthVerifyGet();
    try {
      return (await request()).data.isAuthenticated;
    } catch (e) {
      return false;
    }
  };

  const profile = async () => {
    const request = await PlayerApiFp().playerPlayerGet();
    try {
      let response = await request();
      return response.data;
    } catch (e) {
      return null;
    }
  };

  const reset = async () => {
    const request = await PlayerApiFp().resetResetGet();
    try {
      return (await request()).data;
    } catch (e) {
      return false;
    } finally {
      navigate("/profile");
    }
  };

  const fetchUser = async (retryCount = 1, delay = 3000) => {
    try {
      let response = await checkAuth();
      let user = await profile();

      if (user === null) {
        user = null;
        response = false;
      }

      if (response === false && retryCount > 0) {
        setTimeout(() => fetchUser(retryCount - 1, delay), delay);
        return;
      }

      setUser(user);
      setIsAuth(response);
    } catch (error) {
      console.error("Auth error:", error);
      setUser(null);
      setIsAuth(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        profile,
        reset,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
