import { Box } from "@mui/material";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { NotificationSnackbar } from "./ErrorSnackbar";
import { ConfirmationProvider } from "../hooks/ConfirmationContext";
import Footer from "./Footer";

export default function Layout() {
  return (
    <>
      <ConfirmationProvider>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh", // занимает всю высоту экрана
            width: "100%",
          }}
        >
          <Header />

          <Box sx={{ flexGrow: 1 }}>
            <Outlet />
          </Box>

          <Footer />
        </Box>
      </ConfirmationProvider>
      <NotificationSnackbar />
    </>
  );
}
