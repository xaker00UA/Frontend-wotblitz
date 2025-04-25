import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Button,
  Box,
  Switch,
  styled,
} from "@mui/material";
import { useThemeMode } from "../hooks/ThemeContext"; // Импорт функции useThemeMode из контекста темы
import { useNavigate } from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAuth } from "../hooks/AuthContext";
import Search from "./Search";
import RegionSelectModal from "./ModalWindow";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";

const HoverButton = styled(Button)(({ theme }) => ({
  transition: "background-color 0.2s ease",
  "&:hover": {
    backgroundColor: theme.palette.action.focus,
  },
  "&:active": {
    backgroundColor: "#eb0000",
    transform: "scale(0.98)",
    transition: "background-color 0.5s ",
  },
  "&:focus": {
    outline: "none",
  },
}));

export default function Header() {
  const { mode, toggleMode } = useThemeMode(); // Получаем текущий режим и функцию для переключения темы
  const navigate = useNavigate();
  const { isAuthenticated, logout, reset } = useAuth();
  const [activeTab, setActiveTab] = useState("/");

  const [open, setOpen] = React.useState(false);
  const handleTabChange = (_, value: string) => {
    setActiveTab(value);
    navigate(value || "/");
  };

  const handleProfile = () => {
    navigate("/profile");
  };

  return (
    <AppBar
      position="sticky"
      sx={{
        height: "60px",
        width: "100%",
        borderRadius: 10,
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          height: "60px",
          minHeight: "60px !important",
          overflow: "hidden",
        }}
      >
        {/* Навигация */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          textColor="secondary"
          indicatorColor="secondary"
          sx={{
            "& .MuiTab-root:focus": {
              outline: "none",
            },
          }}
          // sx={{ flexGrow: 1, color: "red", border: "none" }}
        >
          <Tab value="/" label="Дом" />
          <Tab value="/players" label="Игроки" />
          <Tab value="/clans" label="Кланы" />
          <Tab value="/about" label="О проекте" />
        </Tabs>

        {/* Поиск */}
        <Box
          sx={{
            display: "flex",
            borderRadius: 1,
            bgcolor: "background.default",
            alignItems: "center",
            gap: 1,
            p: 0,
            mr: 5,
          }}
        >
          <Search />
        </Box>

        {/* Кнопки авторизации (пока без функционала) */}
        <Box>
          {!isAuthenticated ? (
            <>
              <HoverButton
                sx={{ color: "white" }}
                endIcon={<LoginIcon />}
                onClick={() => {
                  setOpen(true);
                }}
              >
                Login
              </HoverButton>
              <RegionSelectModal
                open={open}
                onClose={() => {
                  setOpen(false);
                }}
              ></RegionSelectModal>
            </>
          ) : (
            <>
              <HoverButton onClick={handleProfile} sx={{ color: "white" }}>
                Profile
              </HoverButton>
              <HoverButton onClick={reset} sx={{ color: "white" }}>
                Reset Session
              </HoverButton>
              <HoverButton
                endIcon={<LogoutIcon />}
                onClick={logout}
                sx={{ color: "white" }}
              >
                Logout
              </HoverButton>
            </>
          )}
        </Box>

        {/* Смена темы */}
        <Box sx={{ ml: 5, display: "flex", alignItems: "center" }}>
          <LightModeIcon sx={{ color: "white" }} />
          <Switch checked={mode === "dark"} onChange={toggleMode} />
          <DarkModeIcon sx={{ color: "white" }} />
        </Box>
      </Toolbar>
    </AppBar>
  );
}
