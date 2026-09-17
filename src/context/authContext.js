import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return (
        JSON.parse(
          localStorage.getItem("user")
        ) || null
      );
    } catch (error) {
      return null;
    }
  });

  // Login
  const login = (user) => {
    setCurrentUser(user);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );
  };

  // Update current user
  const updateUser = (user) => {
    setCurrentUser(user);

    localStorage.setItem(
      "user",
      JSON.stringify(user)
    );
  };

  // Logout
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