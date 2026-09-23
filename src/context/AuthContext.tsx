import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "@/api/axios";

interface User {
  id?: string;
  fullName?: string;
  username?: string;
  email?: string;
  phone?: string;
  birthdate?: string;
  gender?: string;
  bio?: string;
  avatar?: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
  socialLinks?: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (credentials: { email?: string; username?: string; password: string }) => Promise<void>;
  register: (data: Record<string, string>) => Promise<void>;
  logout: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  const refreshProfile = useCallback(async () => {
    try {
      const {data} = await api.get("/auth/profile");
      const u = data.data.user;

      setUser({
        id: u._id,
        fullName: u.fullname,
        username: u.username,
        email: u.email,
        phone: u.phone,
        birthdate: u.birthdate,
        gender: u.gender,
        bio: u.bio,
        skillsOffered: u.offering?.map((s: any) => s.name) || [],
        skillsWanted: u.interested?.map((s: any) => s.name) || [],
        socialLinks: u.socialLinks
      });
    }catch{
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
    }
  }, []);

  useEffect(() => {
    if (token) {
      refreshProfile().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token, refreshProfile]);

  const login = async (credentials: { email?: string; username?: string; password: string }) => {
    const { data } = await api.post("/auth/login", credentials);

    const user = data?.data?.user;
    const t = data?.data?.accessToken;

    if (!user || !t) {
      throw new Error("Invalid login response");
    }

    // ✅ STORE EVERYTHING IMPORTANT
    localStorage.setItem("token", t);
    localStorage.setItem("userId", user._id);   // 🔥 CRITICAL FIX
    localStorage.setItem("userName", user.fullname);

    console.log("LOGIN USER ID:", user._id);

    setToken(t);

    // ✅ SET USER DIRECTLY (no delay)
    setUser({
      id: user._id,
      fullName: user.fullname,
      username: user.username,
      email: user.email,
    });
  };

  const register = async (formData: Record<string, string>) => {
    await api.post("/auth/register", formData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  );
};
