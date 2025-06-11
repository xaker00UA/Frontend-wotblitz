import { Box } from "@mui/material";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { NotificationSnackbar } from "./ErrorSnackbar";
import { ConfirmationProvider } from "../hooks/ConfirmationContext";

export default function Layout() {
  return (
    <>
      <ConfirmationProvider>
        <Header />
        <Outlet />
      </ConfirmationProvider>
      <NotificationSnackbar />
    </>
  );
}
