import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Tabs,
  Tab,
  Button,
  Box,
  Switch,
  styled,
  Drawer,
  IconButton,
  useMediaQuery,
  ListItemText,
  ListItem,
  List,
  Divider,
} from "@mui/material";
import { useThemeMode } from "../hooks/ThemeContext"; // Импорт функции useThemeMode из контекста темы
import { useLocation, useNavigate } from "react-router-dom";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useAuth } from "../hooks/AuthContext";
import Search from "./Search";
import RegionSelectModal from "./ModalWindow";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import MenuIcon from "@mui/icons-material/Menu";
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
  const { mode, toggleMode } = useThemeMode();
  const { isAuthenticated, logout, reset } = useAuth();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<string | false>(location.pathname);
  const [openModal, setOpenModal] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleTabChange = (_: any, value: string) => {
    setActiveTab(value);
    navigate(value);
  };

  const handleProfile = () => navigate("/profile");
  const toggleDrawer = () => setDrawerOpen((prev) => !prev);

  useEffect(() => {
    if (!navItems.some((item) => item.path === location.pathname)) {
      setActiveTab(false);
    } else {
      setActiveTab(location.pathname);
    }
  }, [location]);

  const navItems = [
    { label: "Дом", path: "/" },
    { label: "Игроки", path: "/players" },
    { label: "Кланы", path: "/clans" },
    { label: "О проекте", path: "/about" },
  ];

  const drawerContent = (
    <Box
      sx={{
        width: 200,
        p: 2,
        height: "100%",
        bgcolor: "background.default",
      }}
    >
      <List sx={[{ display: "flex", flexDirection: "column", gap: 1 }]}>
        {navItems.map((item) => (
          <ListItem
            sx={(theme) => ({ bgcolor: theme.palette.background.paper })}
            key={item.path}
            onClick={() => {
              navigate(item.path);
              setDrawerOpen(false);
            }}
          >
            <ListItemText primary={item.label} />
          </ListItem>
        ))}
        <Divider></Divider>
        {/* <Box sx={{ mt: 2 }}> */}
        {!isAuthenticated ? (
          <>
            <ListItem
              sx={(theme) => ({ bgcolor: theme.palette.background.paper })}
              onClick={() => {
                setOpenModal(true);
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Login" />
            </ListItem>
          </>
        ) : (
          <>
            <ListItem
              sx={(theme) => ({ bgcolor: theme.palette.background.paper })}
              onClick={() => {
                handleProfile();
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Profile" />
            </ListItem>
            <ListItem
              sx={(theme) => ({ bgcolor: theme.palette.background.paper })}
              onClick={() => {
                reset();
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Reset Session" />
            </ListItem>
            <ListItem
              sx={(theme) => ({ bgcolor: theme.palette.background.paper })}
              onClick={() => {
                logout();
                setDrawerOpen(false);
              }}
            >
              <ListItemText primary="Logout" />
            </ListItem>
          </>
        )}
        {/* </Box> */}
        <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}>
          <LightModeIcon />
          <Switch checked={mode === "dark"} onChange={toggleMode} />
          <DarkModeIcon />
        </Box>
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          maxWidth: "1440px", // Ограничиваем максимальную ширину
          width: "100%", // Заполняем доступное пространство
          left: "50%", // Ставим левую сторону по центру экрана
          transform: "translateX(-50%)", // Сдвигаем на половину ширины для точного центрирования
          margin: "auto", // Автоматические отступы по бокам
        }}
      >
        <Toolbar>
          {isDesktop ? (
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
            >
              {navItems.map((item) => (
                <Tab key={item.path} value={item.path} label={item.label} />
              ))}
            </Tabs>
          ) : (
            <IconButton
              onClick={toggleDrawer}
              sx={{ color: "white", ":focus": { outline: "none" } }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Поиск */}
          <Box
            sx={{
              minHeight: "inherit",
              display: "flex",
              // borderRadius: 1,
              bgcolor: "background.default",
              alignItems: "center",
              mx: 2,
            }}
          >
            <Search />
          </Box>

          {/* Desktop: кнопки авторизации и тема */}
          {isDesktop && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {!isAuthenticated ? (
                <>
                  <HoverButton
                    sx={{ color: "white" }}
                    endIcon={<LoginIcon />}
                    onClick={() => setOpenModal(true)}
                  >
                    Login
                  </HoverButton>
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

              <Box sx={{ display: "flex", alignItems: "center" }}>
                <LightModeIcon sx={{ color: "white" }} />
                <Switch checked={mode === "dark"} onChange={toggleMode} />
                <DarkModeIcon sx={{ color: "white" }} />
              </Box>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <Toolbar />
      <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer}>
        {drawerContent}
      </Drawer>

      <RegionSelectModal open={openModal} onClose={() => setOpenModal(false)} />
    </>
  );
}
