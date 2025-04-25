import React, { useState, useEffect } from "react";
import { createTheme, styled, Switch } from "@mui/material";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const StyledApp = styled("div")(({ theme }) => ({
  minHeight: "100px",
  textAlign: "center",
  paddingTop: "10rem",
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
}));
