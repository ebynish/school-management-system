import React, { useState, createContext, useContext } from 'react';
import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// Create a context to hold the theme
const ThemeContext = createContext();

// Create a provider component
export const ThemeProvider = ({ children }) => {
  const theme = extendTheme({
    config: {
      initialColorMode: "light", // Default to light mode
      useSystemColorMode: false,
    },
    colors: {
      primary: "#1DA1F2",
      secondary: {
        light: "#0F1419",
        dark: "#14171A",
      },
      light: {
        light: "#AAB8C2",
        dark: "#657786",
      },
      grey: {
        light: "#E1E8ED",
        dark: "#192734",
      },
    },
    fonts: {
      body: `"Source Sans Pro", Arial, sans-serif`,
      heading: `"Roboto Slab", serif`,
    },
  });

  return (
    <ThemeContext.Provider value={{}}>
      <ChakraProvider theme={theme}>{children}</ChakraProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = () => useContext(ThemeContext);
