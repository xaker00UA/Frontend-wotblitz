// routes.tsx
import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import Auth from "./page/auth/auth";
import { AuthProvider } from "./hooks/AuthContext";
import Profile from "./page/profile/Profile";
import Player from "./page/player/Player";
import TopPlayersPage from "./page/topPlayers/TopPlayers";
import TopClanPage from "./page/topClans/TopClans";
import ClanPage from "./page/clan/ClanPage";
import AdminLogin from "./page/admin/LoginAdmin";
import AdminPanel from "./page/admin/AdminPanel";
import HomePage from "./page/home/Home";
import FaqPage from "./page/faq/FaqPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <AuthProvider>
          <Layout />
        </AuthProvider>
      </>
    ),
    children: [
      { path: "/", element: <HomePage /> },
      { path: ":region/player/:nickname", element: <Player /> },
      { path: ":region/clan/:name", element: <ClanPage /> },
      { path: "profile", element: <Profile /> },
      { path: "players", element: <TopPlayersPage /> },
      { path: "clans", element: <TopClanPage /> },
      { path: "auth", element: <Auth /> },
      { path: "about", element: <FaqPage /> },
      { path: "admin", element: <AdminPanel /> },
      { path: "admin/login", element: <AdminLogin /> },
      { path: "*", element: <div>404</div> },
    ],
  },
]);
