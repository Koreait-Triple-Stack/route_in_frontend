import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Typography, Box, Alert } from "@mui/material";
import { getWeather } from "../../apis/weather/weatherService";
import ErrorComponent from "../../components/ErrorComponent";
import { MoonLoader } from "react-spinners";
import { useToastStore } from "../../store/useToastStore";

const DEFAULT_SEOUL = { lat: 37.5665, lon: 126.978 };

function Loading() {
    return (
        <Box
            sx={{
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <MoonLoader size={30} />
        </Box>
    );
}

function Weather() {
    const { show } = useToastStore();
    const [coords, setCoords] = useState(null);
    const [locationError, setLocationError] = useState(null);

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError("위치 정보를 지원하지 않는 브라우저입니다.");
            setCoords(DEFAULT_SEOUL);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCoords({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            (error) => {
                show(
                    "위치 정보를 가져올 수 없습니다. 기본 위치(서울)로 설정합니다.",
                    "error",
                );
                setCoords(DEFAULT_SEOUL);
            },
        );
    }, []);

    const {
        data: weatherResp,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["weather", coords],
        queryFn: () => getWeather(coords),
        enabled: !!coords,
        staleTime: 1000 * 60 * 10,
    });

    if (locationError) {
        return (
            <Alert severity="warning" sx={{ mb: 2 }}>
                {locationError}
            </Alert>
        );
    }

    if (!coords || isLoading) {
        return <Loading />;
    }

    if (error) return <ErrorComponent error={error} />;

    const { temp, description, icon, city } = weatherResp.data;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    return (
        <Box display="flex" alignItems="center">
            <Typography
                variant="h6"
                fontWeight="bold"
                color="primary.dark"
                sx={{
                    lineHeight: 1,
                    mr: 0.5,
                    pt: 0.3,
                }}>
                {city} {Math.round(temp)}°C
            </Typography>

            <Box
                component="img"
                src={iconUrl}
                alt={description}
                sx={{
                    width: 38,
                    height: 38,
                    filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.2))",
                }}
            />
        </Box>
    );
}

export default Weather;
