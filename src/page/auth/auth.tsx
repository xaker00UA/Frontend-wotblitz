import { useLocation, useNavigate } from "react-router-dom";
import { AuthApiFp } from "../../api/generated";
import { useEffect } from "react";

export default function Auth() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);

  const fetch_request = async () => {
    const accessToken = queryParams.get("access_token");
    const nickname = queryParams.get("nickname");
    const accountId = Number(queryParams.get("account_id"));

    if (!accessToken || !nickname || !accountId) {
      navigate("/");
      return;
    }

    try {
      const request = await AuthApiFp().authAuthGet(
        accessToken,
        nickname,
        accountId
      );
      const response = await request();
      navigate(`/${response.data.region}/player/${response.data.name}`);
    } catch (e) {
      console.error("Ошибка при обработке запроса auth:", e);
      // navigate("/");
    }
  };

  useEffect(() => {
    fetch_request();
  }, [location.search]);

  return (
    <div>
      <p>Обработка запроса...</p>
    </div>
  );
}
