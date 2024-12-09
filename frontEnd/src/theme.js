// src/theme.js
import { extendTheme } from "@chakra-ui/react";

// Define the theme with both light and dark mode configurations
const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  colors: {
    // Light mode colors
    light: {
      primary: "#1DA1F2",
      secondary: "#0F1419",
      light: "#AAB8C2",
      grey: "#E1E8ED",
    },
    // Dark mode colors
    dark: {
      primary: "#1DA1F2",
      secondary: "#14171A",
      light: "#657786",
      grey: "#192734",
    },
  },
  styles: {
    global: (props) => ({
      body: {
        bg: props.colorMode === "dark" ? "dark.grey" : "light.grey",
        color: props.colorMode === "dark" ? "light.primary" : "dark.primary",
        fontSize: "11px"
      },
    }),
  },
});

export default theme;
