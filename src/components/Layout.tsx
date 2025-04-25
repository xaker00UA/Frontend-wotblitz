import { Box } from "@mui/material";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ErrorSnackbar } from "./ErrorSnackbar";

export default function Layout() {
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box flexShrink={0}>
        <Header />
      </Box>
      <Box flexGrow={1}>
        <Outlet />
      </Box>
      <ErrorSnackbar />
    </Box>
  );
}
