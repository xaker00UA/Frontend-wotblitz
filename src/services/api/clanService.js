import axios from "axios";

export const clan_session = async (region, name) => {
  try {
    const response = await axios.get(`/api/${region}/clan/?name=${name}`);
    const { tag, name: name_clan, members } = response.data;
    return { tag, name_clan, members };
  } catch (error) {
    console.error(error.response);
    console.error(error.response.data);
  }
};
