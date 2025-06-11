import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router";
import { router } from "./routes.tsx";
import { ThemeProvider } from "./hooks/ThemeContext";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { NotificationProvider } from "./hooks/ErrorContext.tsx";

const root = document.getElementById("root");

ReactDOM.createRoot(root as HTMLElement).render(
  <ThemeProvider>
    <CssBaseline />
    <GlobalStyles
      styles={(theme) => ({
        body: {
          backgroundColor: theme.palette.background.default,
          color: theme.palette.text.primary,
        },
        "#root": {
          backgroundColor: theme.palette.background.default,
          height: "100%",
        },
      })}
    />
    <NotificationProvider>
      <RouterProvider router={router} />
    </NotificationProvider>
  </ThemeProvider>
);
