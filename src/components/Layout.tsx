import { Box } from "@mui/material";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ErrorSnackbar } from "./ErrorSnackbar";

export default function Layout() {
  return (
    <>
      <Header /> {/* sticky должен работать тут, без обёртки с overflow */}
      {/* <Box
        sx={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}
      > */}
      <Box sx={{ width: "100%" }}>
        <Outlet />
      </Box>
      <ErrorSnackbar />
      {/* </Box> */}
    </>
  );
}
