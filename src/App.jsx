import { createBrowserRouter, RouterProvider } from "react-router";
import Home from "./page/home/home";
import ClanStats from "./page/clan/clan";
import PlayerStatsWrapper from "./page/player/player";
import ErrorPage from "./page/error/error";
import Auth from "./features/auth";
import WebhookWrapper from "./page/player/web_socket_player";
import axios from "axios";

// Установить глобальный параметр
axios.defaults.withCredentials = true;
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
      path: ":region/clan/:name",
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
      v7_fetcherPersist: true,
    },
  }
);

function App() {
  return (
    <>
      {
        <RouterProvider
          router={router}
          future={{
            v7_startTransition: true,
          }}
        />
      }
    </>
  );
}

export default App;
