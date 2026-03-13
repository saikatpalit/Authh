import axios from "axios";
import { createContext, useEffect, useRef, useState, useMemo } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  // ✅ Access token in memory only — never localStorage
  const accessTokenRef = useRef(null);

  // ─── Create authAxios ONCE with useMemo so interceptors aren't re-registered
  const authAxios = useMemo(() => {
    const instance = axios.create({
      baseURL: backendUrl,
      withCredentials: true,
    });

    // Attach Bearer token on every request
    instance.interceptors.request.use((config) => {
      if (accessTokenRef.current) {
        config.headers.Authorization = `Bearer ${accessTokenRef.current}`;
      }
      return config;
    });

    // On 401 → silently refresh → retry original request once
    instance.interceptors.response.use(
      (res) => res,
      async (error) => {
        const original = error.config;
        if (
          error.response?.status === 401 &&
          !original._retry &&
          original.url !== "/auth/refresh" &&
          original.url !== "/auth/login"
        ) {
          original._retry = true;
          const newToken = await doRefresh();
          if (newToken) {
            original.headers.Authorization = `Bearer ${newToken}`;
            return instance(original);
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, []); // only created once

  // ─── Refresh using httpOnly cookie ────────────────────────────────────────
  const doRefresh = async () => {
    try {
      const { data } = await axios.post(
        `${backendUrl}/auth/refresh`,
        {},
        { withCredentials: true }
      );
      accessTokenRef.current = data.accessToken;
      setUserData(data.user);
      setIsLoggedin(true);
      return data.accessToken;
    } catch {
      accessTokenRef.current = null;
      setIsLoggedin(false);
      setUserData(null);
      return null;
    }
  };

  // ─── Fetch /user/me ───────────────────────────────────────────────────────
  const getUserData = async () => {
    try {
      const { data } = await authAxios.get("/user/me");
      setUserData(data.user);
      setIsLoggedin(true);
    } catch {
      setIsLoggedin(false);
      setUserData(null);
    }
  };

  // ─── Logout ───────────────────────────────────────────────────────────────
  const logout = async () => {
    try { await authAxios.post("/auth/logout"); } catch {}
    accessTokenRef.current = null;
    setIsLoggedin(false);
    setUserData(null);
  };

  // ─── On mount: restore session from httpOnly refresh cookie ──────────────
  useEffect(() => {
    doRefresh();
  }, []);

  const value = {
    backendUrl,
    isLoggedin,
    setIsLoggedin,
    userData,
    setUserData,
    accessTokenRef,
    authAxios,
    getUserData,
    logout,
    doRefresh,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};