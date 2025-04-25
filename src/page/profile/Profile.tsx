import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import PlayerStack from "../../components/Player";

export default function Profile() {
  const navigate = useNavigate();
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState<string[] | null>(null);
  //   const [general, setGeneral] = useState<APIRestUser | null>(null);
  //   const [details, setDetails] = useState<APIRestUser | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }
  }, [user, navigate]);
  if (user) {
    return (
      <>
        <PlayerStack nickname={user?.name} region={user?.region} />
      </>
    );
  }
}
