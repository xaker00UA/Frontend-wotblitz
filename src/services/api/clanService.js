import axios from "axios";

export const clan_session = async (region, name) => {
  try {
    const response = await axios.get(`/api/${region}/clan/?name=${name}`);
    const { tag, name: name_clan, members, time } = response.data;
    return { tag, name_clan, members, time };
  } catch (error) {
    console.error(error.response);
    console.error(error.response.data);
  }
};
export const clan_search = async (name) => {
  try {
    const response = await axios.get(`/api/clan/search?name=${name}`);
    const options = response.data.map((clan, index) => ({
      value: clan.tag,
      label: clan.tag,
      region: clan.region,
      key: "clan-" + clan.name,
      player: false,
    }));
    return options;
  } catch (error) {
    return [];
  }
};
