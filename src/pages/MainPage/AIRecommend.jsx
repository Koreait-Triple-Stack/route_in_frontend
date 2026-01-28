import { Paper } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getAIContext } from "../../apis/aiRecommend/aiRecommendService";

function AIRecommend({userId}) {
    const { data: response } = useQuery({
        queryKey: ["getAIContext", userId],
        queryFn: () => getAIContext(userId),
        enabled: !!userId,
    });

    console.log(response)

    return (
        <Paper>

        </Paper>
    );
}

export default AIRecommend;
