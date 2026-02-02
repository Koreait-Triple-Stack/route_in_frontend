import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, Typography, Box, Skeleton, Alert } from "@mui/material";
import WaterDropIcon from "@mui/icons-material/WaterDrop";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { getWeather } from "../../apis/weather/weatherService";
import ErrorComponent from "../../components/ErrorComponent";
import Loading from "../../components/Loading";

function Weather() {
    const [coords, setCoords] = useState(null);
    const [locationError, setLocationError] = useState(null);

    // 2. 컴포넌트가 켜지자마자 브라우저에게 위치 물어보기
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError("위치 정보를 지원하지 않는 브라우저입니다.");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                // 성공 시 좌표 저장
                setCoords({
                    lat: position.coords.latitude,
                    lon: position.coords.longitude,
                });
            },
            (error) => {
                // 실패 시 (거부 등)
                console.error("위치 확보 실패:", error);
                setLocationError("위치 권한이 필요합니다.");
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

    const { temp, description, icon } = weatherResp.data;
    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    return (
        <Box display="flex" alignItems="center">
            <Typography
                variant="h5"
                fontWeight="bold"
                color="primary.dark"
                sx={{
                    lineHeight: 1,
                    mr: 0.5,
                    pt: 0.3
                }}
            >
                {Math.round(temp)}°C
            </Typography>

            <Box
                component="img"
                src={iconUrl}
                alt={description}
                sx={{
                    width: 44, 
                    height: 44,
                    filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.2))",
                }}
            />
        </Box>
    );
}

export default Weather;
