import { useLocation, useNavigate } from "react-router";
import axios from "axios";
import { useEffect } from "react";

function Auth() {
  const location = useLocation();
  const navigate = useNavigate();

  const fetch_request = async () => {
    const queryParams = new URLSearchParams(location.search);
    try {
      const response = await axios.get(`/api/auth?${queryParams.toString()}`, {
        withCredentials: true,
      });
      navigate(`/${response.data.region}/player/${response.data.nickname}`);
    } catch (error) {
      console.error("Ошибка при выполнении запроса:", error);
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

export default Auth;
