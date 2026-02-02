import { instance } from "../utils/instance";

export const getWeatherRequest = async ({lat, lon}) => {
    return await instance.get("/api/weather", {
        params: {lat, lon}
    });
};