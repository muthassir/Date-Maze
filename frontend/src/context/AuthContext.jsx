import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

// const API = "https://date-maze.onrender.com";
const API = "http://localhost:5000"; 


// Custom hook to use AuthContext easily
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // user info
  const [token, setToken] = useState(localStorage.getItem("token") || null); // ✅ token
  const [loading, setLoading] = useState(false); // spinner control
  const [error, setError] = useState(""); // error alert

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("token");
    if (storedUser) setUser(JSON.parse(storedUser));
    if (storedToken) setToken(storedToken);
  }, []);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/api/auth/login`, {
        email,
        password,
      });
      setUser(res.data.user);
      setToken(res.data.token); 
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  // Register function
  const register = async (username, email, password) => {
    setLoading(true);
    setError("");
    try {
      const res = await axios.post(`${API}/api/auth/register`, {
        username,
        email,
        password,
      });
      setUser(res.data.user);
      setToken(res.data.token); 
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      return res.data;
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null); 
    localStorage.removeItem("user");
    localStorage.removeItem("token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        token,
        login,
        register,
        logout,
        loading,
        error,
        setError, // so you can clear alert manually
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
