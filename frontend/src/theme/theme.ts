import { createTheme } from "@mui/material/styles";
import { currentBrandConfig } from "../config/brandConfig";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f34f21",
    },
    success: {
      main: "#04b46eff",
    },
    warning: {
      main: "#ff9800",
    },
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          textTransform: "none",
          fontWeight: 600,
          padding: "8px 20px",
        },
      },
      variants: [
        {
          props: { variant: "contained", color: "primary" },
          style: {
            backgroundColor: currentBrandConfig.primaryColor,
            "&:hover": {
              backgroundColor: currentBrandConfig.primaryHoverColor,
            },
          },
        },
        {
          props: { variant: "contained", color: "secondary" },
          style: {
            backgroundColor: "#f34f21",
            "&:hover": {
              backgroundColor: "#c53d1a",
            },
          },
        },
      ],
    },
  },
});

export default theme;
