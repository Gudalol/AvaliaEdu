import { createTheme } from "@mui/material/styles";
import { ptBR } from "@mui/material/locale";

const TemaPadrao = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#09b800", 
    },
    secondary: {
      main: "#09b800", 
    },
    text: {
      hint: "#09b800", 
      primary: "#09b800", 
      secondary: "#09b800", 
      disabled: "#09b800", 
    },
  },
  typography: {
    fontFamily: [
      "Inter", 
      "Lato", 
      "sans-serif",
    ].join(","),
    allVariants: {
      color: "#09b800", 
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        contained: {
          backgroundColor: "#09b800", 
          color: "#fff",
        },
        outlined: {
          color: "#09b800", 
        },
        root: {
          borderRadius: "20px",
        },
      },
    },
    MuiStack: {
      defaultProps: {
        useFlexGap: true,
      },
    },
  },
  ptBR,
});

export default TemaPadrao;
