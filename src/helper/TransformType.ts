import { APIItemTank } from "../api/generated";
import { Tank } from "../components/GridTanks";

export const transformTankData = (
  apiTanks: APIItemTank[] | null | undefined
): Tank[] => {
  if (!apiTanks) return [];

  return apiTanks.map((apiTank) => {
    if (apiTank.tank_id === undefined) {
      throw new Error("Отсутствует обязательное свойство tank_id");
    }

    return {
      tank_id: apiTank.tank_id, // Обязательное поле
      name: apiTank.name ?? "Unknown", // Значение по умолчанию для name, если оно отсутствует
      images: apiTank.images, // Можно добавить значения по умолчанию для images
      all: {
        battles: apiTank.all?.battles ?? 0,
        winrate: apiTank.all?.winrate ?? 0,
        damage: apiTank.all?.damage ?? 0,
        accuracy: apiTank.all?.accuracy ?? 0,
        survival: apiTank.all?.survival ?? 0,
      },
      level: String(apiTank.level) ?? "unknown", // Можно установить значение по умолчанию для level
    };
  });
};
