import {
  createContext,
  useEffect,
  useState,
} from "react";

export const DarkModeContext =
  createContext();

export const DarkModeContextProvider = ({
  children,
}) => {
  const [darkMode, setDarkMode] = useState(
    JSON.parse(
      localStorage.getItem("darkMode")
    ) || false
  );

  // Toggle dark mode
  const toggle = () => {
    setDarkMode((prev) => !prev);
  };

  // Save dark mode
  useEffect(() => {
    localStorage.setItem(
      "darkMode",
      JSON.stringify(darkMode)
    );
  }, [darkMode]);

  return (
    <DarkModeContext.Provider
      value={{
        darkMode,
        toggle,
      }}
    >
      {children}
    </DarkModeContext.Provider>
  );
};