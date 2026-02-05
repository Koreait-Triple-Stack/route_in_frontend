import { useCourseMap } from "../../hooks/useCourseMap";
import { useEffect, useState } from "react";
import { Button, Divider, IconButton, Paper, Typography } from "@mui/material";
import { Box, Stack } from "@mui/system";
import CourseEdit from "./CourseEdit";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import Loading from "../../components/Loading";
import DialogComponent from "../../components/DialogComponent";

function DetailRow({ label, value, valueColor }) {
    return (
        <Box
            sx={{
                display: "flex",
                alignItems: "center",
                py: 0.8,
            }}>
            <Typography variant="body1" sx={{ color: "text.secondary" }}>
                {label}
            </Typography>

            <Typography
                variant="body1"
                sx={{
                    fontWeight: 600,
                    color: valueColor ?? "text.primary",
                    px: 5,
                }}>
                {valueColor ? value / 1000 + "km" : value}
            </Typography>
        </Box>
    );
}

function CourseDetail({ course, onDelete, onChecked, checked }) {
    const [isEditing, setIsEditing] = useState(false);
    const [openDelete, setOpenDelete] = useState(false);
    const { mapRef, map, kakaoObj, setPoints } = useCourseMap({
        enableClickAdd: false,
    });

    useEffect(() => {
        if (!kakaoObj || !map || !course) return;

        const { centerLat, centerLng } = course;

        if (typeof centerLat === "number" && typeof centerLng === "number") {
            const center = new kakaoObj.maps.LatLng(centerLat, centerLng);
            map.panTo(center);
        }
    }, [kakaoObj, map, course]);

    useEffect(() => {
        if (!course?.points) return;
        setPoints(
            course?.points.map((point) => ({
                lat: Number(point.lat),
                lng: Number(point.lng),
            })),
        );
    }, [course]);

    const deleteClick = () => {
        onDelete(course);
    };

    const ckeckedClick = () => {
        onChecked(course);
    };

    if (!course) return <Loading />;

    return (
        <Paper
            elevation={0}
            sx={{
                borderRadius: 2,
                overflow: "hidden",
                bgcolor: "#F3F8FF",
                border: "1px solid",
                borderColor: "divider",
                width: "100%",
                maxWidth: { xs: "100%" },
                mx: { xs: 0, sm: "auto" },
            }}>
            <Box
                sx={{
                    position: "relative",
                    width: "100%",
                    height: "clamp(220px, 35vh, 280px)",
                    bgcolor: "grey.200",
                }}>
                <Box
                    ref={mapRef}
                    sx={{
                        position: "absolute",
                        inset: 0,
                    }}
                />
            </Box>
            <Box>
                <Box sx={{ p: { xs: 2, sm: 2.5 } }}>
                    <Stack direction="row" justifyContent="space-between">
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 800,
                                lineHeight: 1.2,
                                wordBreak: "keep-all",
                            }}>
                            {course.courseName}
                        </Typography>
                        <IconButton
                            onClick={ckeckedClick}
                            disableRipple
                            sx={{ pr: 2.5 }}>
                            {checked ? (
                                <StarIcon sx={{ color: "warning.light" }} />
                            ) : (
                                <StarBorderIcon
                                    sx={{ color: "warning.light" }}
                                />
                            )}
                        </IconButton>
                    </Stack>
                    <Divider />
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                        <DetailRow
                            label="거리"
                            value={course.distanceM}
                            valueColor="primary.main"
                        />
                        <Button
                            variant="contained"
                            onClick={() => setIsEditing(true)}
                            sx={{ my: 1 }}>
                            수정
                        </Button>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                        }}>
                        <DetailRow label="지역" value={course.region} />
                        <Button
                            variant="outlined"
                            color="error"
                            onClick={() => setOpenDelete(true)}>
                            삭제
                        </Button>
                    </Box>
                </Box>
            </Box>
            {isEditing && (
                <Box>
                    <CourseEdit
                        key={course.courseId}
                        course={course}
                        isEditing={() => setIsEditing(false)}
                    />
                </Box>
            )}

            <DialogComponent
                open={openDelete}
                setOpen={setOpenDelete}
                title="코스 삭제"
                content={"코스를 삭제하시겠습니까?"}
                onClick={deleteClick}
                color="error"
                ment="삭제"
            />
        </Paper>
    );
}

export default CourseDetail;
