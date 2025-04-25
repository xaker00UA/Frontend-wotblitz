// routes.tsx
import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Layout from "./components/Layout";
import Auth from "./page/auth/auth";
import { AuthProvider } from "./hooks/AuthContext";
import Profile from "./page/profile/Profile";
import Player from "./page/player/Player";

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
      { index: true, element: <App /> },
      { path: ":region/player/:nickname", element: <Player /> },
      { path: ":region/clan/:name", element: <div>clan</div> },
      { path: "profile", element: <Profile /> },
      { path: "players", element: <div>players</div> },
      { path: "clans", element: <div>clans</div> },
      { path: "auth", element: <Auth /> },
      {
        path: "admin",
        children: [
          { index: true, element: <div>admin</div> },
          { path: "login", element: <div>login</div> },
        ],
      },
      { path: "*", element: <div>404</div> },
    ],
  },
]);
