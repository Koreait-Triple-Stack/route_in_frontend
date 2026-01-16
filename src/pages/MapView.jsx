import { useQuery } from "@tanstack/react-query";
import { getCourseFavoriteByUserId } from "../apis/course/courseService";
import CourseDetail from "../components/Course/CourseDetail";
import { Box } from "@mui/system";
import CourseEdit from "../components/Course/CourseEdit";

export default function MapView() {
    const userId = 20;
    const {
        data: response,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["getCourseFavoriteByUserId"],
        queryFn: () => getCourseFavoriteByUserId(userId),
        staleTime: 30000,
    });

    if (isLoading) return <Box>로딩중...</Box>;
    if (error) return <Box>{error.message}</Box>;

    console.log(response)

    return <CourseDetail course={response.data} />;
}
