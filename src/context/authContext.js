import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(
        localStorage.getItem("user")
      ) || null;
    } catch (error) {
      return null;
    }
  });

  // ==========================================
  // LOGIN
  // ==========================================

  const login = (user) => {
    setCurrentUser(user);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );
  };

  // ==========================================
  // UPDATE CURRENT USER
  // ==========================================

  const updateUser = (user) => {
    setCurrentUser(user);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const logout = () => {
    setCurrentUser(null);

    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        updateUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};