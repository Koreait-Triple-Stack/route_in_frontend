import React from "react";
import { Box, Container, Stack } from "@mui/system";
import { useNavigate } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getCourseListByUserIdRequest } from "../../apis/course/courseApi";
import { useQuery } from "@tanstack/react-query";
import { Divider, IconButton, Typography } from "@mui/material";
import CourseDetail from "../../components/Course/CourseDetail";

function CourseListPage() {
    const navigate = useNavigate();
    const { principal } = usePrincipalState(); 

    const { data: response, isLoading } = useQuery({
        queryKey: ["getCourseListByUserId", principal?.userId],
        queryFn: () => getCourseListByUserIdRequest(principal?.userId),
        staleTime: 30000,
        enabled: !!principal?.userId,
    });

    const respData = response?.data.data || [];

    if (isLoading) return <div>로딩중...</div>;

    return (
        <CourseDetail />
    );
}

export default CourseListPage;
