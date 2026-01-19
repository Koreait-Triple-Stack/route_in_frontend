import { useQuery } from "@tanstack/react-query";
import { getCourseFavoriteByUserId } from "../apis/course/courseService";
import CourseDetail from "../components/Course/CourseDetail";
import { Box } from "@mui/system";
import CourseEdit from "../components/Course/CourseEdit";
import { usePrincipalState } from "../store/usePrincipalState";

export default function MapView() {
    const { principal } = usePrincipalState();
    const {
        data: response,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["getCourseFavoriteByUserId", principal?.userId],
        queryFn: () => getCourseFavoriteByUserId(principal.userId),
        staleTime: 30000,
    });

    if (isLoading) return <Box>로딩중...</Box>;
    if (error) return <Box>{error.message}</Box>;

    return <CourseDetail course={response.data} />;
}
