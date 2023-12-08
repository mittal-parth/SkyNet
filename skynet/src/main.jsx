import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { SafeThemeProvider } from '@safe-global/safe-react-components'
import { ThemeProvider, CssBaseline } from '@mui/material'
// import { BrowserRouter } from "react-router-dom";

import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <SafeThemeProvider mode="dark">
    {(safeTheme) => (
      <ThemeProvider theme={safeTheme}>
        <CssBaseline />
        <React.StrictMode>
          <App />
        </React.StrictMode>
      </ThemeProvider>
    )}
  </SafeThemeProvider>
);
