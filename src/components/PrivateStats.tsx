import React from "react";
import styled from "styled-components";
import Gold_img from "../assets/gold.png";
import Credits from "../assets/credits.png";
import Free_xp from "../assets/free_xp.png";
import { APIRestPrivate } from "../api/generated";
// Типы для данных info
// interface APIRestPrivate {
//   gold: number;
//   credits: number;
//   free_xp: number;
// }

// interface UpdateData {
//   gold?: number;
//   credits?: number;
//   free_xp?: number;
// }

interface PrivateInfoProps {
  info: {
    now: APIRestPrivate | null;
    update: APIRestPrivate | null;
  };
}

// Стилизация компонентов
const ResourceWrapper = styled.div`
  margin-top: 20px;
  display: grid;
  align-self: end;
  grid-template-rows: repeat(3, auto); /* Два ряда с высотой под контент */
  grid-template-columns: repeat(2, 1fr); /* Три равные колонки */
  align-items: start; /* Выравнивание контента по вертикали */
  justify-items: start; /* Выравнивание контента по горизонтали */
  /* background: #f5f5f5; */
  border: 1px solid #dcdcdc;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ResourceRow = styled.div`
  display: flex;
  align-items: center;
  font-size: 14px;
  height: 24px;
`;

const ResourceValue = styled.span`
  /* color: #333; */
  font-weight: bold;
`;

const ResourceUpdate = styled.span<{ value: number }>`
  margin-left: 10px;
  color: ${(props) =>
    props.value > 0 ? "green" : props.value < 0 ? "red" : "#888"};
`;

const IconImage = styled.img`
  width: 20px;
  height: 24px;
  margin-right: 5px;
`;

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
