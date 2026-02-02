import { getWeatherRequest } from "./weatherApi";

export const getWeather = async ({lat, lon}) => {
    const result = await getWeatherRequest({lat, lon});
    if (result.data.status !== "success") throw new Error(result.data.message);
    return result.data;
};