import React from "react";
import { styled } from "@mui/material";
import Gold_img from "../assets/gold.png";
import Credits from "../assets/credits.png";
import Free_xp from "../assets/free_xp.png";
import { APIRestPrivate } from "../api/generated";

interface PrivateInfoProps {
  info: {
    now: APIRestPrivate | null;
    update: APIRestPrivate | null;
  };
}

// Стилизация компонентов
const ResourceWrapper = styled("div")(({ theme }) => ({
  marginTop: 20,
  display: "grid",
  alignSelf: "end",
  gridTemplateRows: "repeat(3, auto)",
  gridTemplateColumns: "repeat(2, 1fr)",
  alignItems: "start",
  justifyItems: "start",
  backgroundColor: theme.palette.background.paper,
  border: "1px solid #dcdcdc",
  borderRadius: 8,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
}));

const ResourceRow = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  fontSize: 14,
  height: 24,
}));

const ResourceValue = styled("span")(({ theme }) => ({
  fontWeight: "bold",
  color: theme.palette.text.primary,
}));

const ResourceUpdate = styled("span", {
  shouldForwardProp: (prop) => prop !== "value",
})<{ value: number }>(({ value, theme }) => ({
  marginLeft: 10,
  color:
    value > 0
      ? theme.palette.success.main
      : value < 0
      ? theme.palette.error.main
      : theme.palette.grey[600],
}));

const IconImage = styled("img")(() => ({
  width: 20,
  height: 24,
  marginRight: 5,
}));

const PrivateInfo: React.FC<PrivateInfoProps> = ({ info }) => {
  if (!info || !info.now) {
    return null;
  }

  const { gold = 0, credits = 0, free_xp = 0 } = info.now ?? {};
  const update_gold = info.update?.gold || 0;
  const update_credits = info.update?.credits || 0;
  const update_free_xp = info.update?.free_xp || 0;

  return (
    <ResourceWrapper>
      <ResourceRow>
        <IconImage src={Gold_img} alt="gold" />
        <ResourceValue>{gold.toLocaleString("ru-RU")}</ResourceValue>
      </ResourceRow>
      <ResourceRow>
        <ResourceUpdate value={update_gold}>
          {update_gold > 0
            ? `+${update_gold.toLocaleString("ru-RU")}`
            : update_gold}
        </ResourceUpdate>
      </ResourceRow>

      <ResourceRow>
        <IconImage src={Credits} alt="credits" />
        <ResourceValue>{credits.toLocaleString("ru-RU")}</ResourceValue>
      </ResourceRow>
      <ResourceRow>
        <ResourceUpdate value={update_credits}>
          {update_credits > 0
            ? `+${update_credits.toLocaleString("ru-RU")}`
            : update_credits}
        </ResourceUpdate>
      </ResourceRow>

      <ResourceRow>
        <IconImage src={Free_xp} alt="free xp" />
        <ResourceValue>{free_xp.toLocaleString("ru-RU")}</ResourceValue>
      </ResourceRow>
      <ResourceRow>
        <ResourceUpdate value={update_free_xp}>
          {update_free_xp > 0
            ? `+${update_free_xp.toLocaleString("ru-RU")}`
            : update_free_xp}
        </ResourceUpdate>
      </ResourceRow>
    </ResourceWrapper>
  );
};

export default PrivateInfo;
