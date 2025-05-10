import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/AuthContext";
import PlayerStack from "../../components/Player";
import { StatsProvider, useStats } from "../../hooks/StatsContext";
import PrivateInfo from "../../components/PrivateStats";
import { Box } from "@mui/system";

export default function Profile() {
  const navigate = useNavigate();
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/");
      return;
    }
  }, [user, isLoading, navigate]);

  return (
    <>
      <StatsProvider>
        <ProfileContext />
      </StatsProvider>
    </>
  );
}

function ProfileContext() {
  const { generalData, detailsData } = useStats();
  const { user } = useAuth();
  if (user) {
    return (
      <>
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <PrivateInfo
            info={{
              now: generalData?.private ?? null,
              update: detailsData?.private ?? null,
            }}
          />
          <PlayerStack nickname={user?.name} region={user?.region} />
        </Box>
      </>
    );
  }
  return null;
}
