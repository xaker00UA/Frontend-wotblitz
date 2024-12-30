import { useState } from "react";
import {
  Route,
  Routes,
  Link,
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from "./page/Home";
import ClanStats from "./page/Clan";
import PlayerStatsWrapper from "./page/player";
import ErrorPage from "./page/error";
import Auth from "./components/auth";
import WebhookWrapper from "./page/web_socket_player";

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Home />,
    },
    {
      path: ":region/player/:name",
      element: <PlayerStatsWrapper key={location.pathname} />,
    },
    {
      path: ":region/clan",
      element: <ClanStats />,
    },
    {
      path: "/auth",
      element: <Auth />,
    },
    {
      path: "/:region/player/:name/webhook",
      element: <WebhookWrapper />,
    },
    {
      path: "*",
      element: <ErrorPage />,
    },
  ],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    },
  }
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
