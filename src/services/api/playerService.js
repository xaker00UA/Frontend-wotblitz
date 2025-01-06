import axios from "axios";

export const player_general = async (region, name) => {
  try {
    const response = await axios.get(
      `/api/${region}/player/get_general?name=${name}`
    );
    const { general, name: nickname, private: privateField } = response.data;
    const { now } = general;

    return { now, nickname, privateField };
  } catch (error) {
    console.error("Error fetching player general data:", error);
    return null; // Возвращаем null в случае ошибки
  }
};

export const player_session_and_update = async (region, name) => {
  try {
    const response = await axios.get(
      `/api/${region}/player/get_session?name=${name}`
    );

    const { update, session } = response.data.general;
    const { tanks } = response.data;
    return { update, session, tanks };
  } catch (error) {
    console.error("Error fetching player session and update:", error);
  }
};

export const player_search = async (name) => {
  try {
    const response = await axios.get(`/api/search?player_name=${name}`);
    const options = response.data.map((user, index) => ({
      value: user.name,
      label: user.name,
      region: user.region,
      key: "player-" + user.name,
      player: true,
    }));
    return options;
  } catch (error) {
    return [];
  }
};
