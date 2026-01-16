import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { usePrincipalState } from "../../store/usePrincipalState";

export default function BoardDetailPage() {
  const { boardId } = useParams(); // /board/:boardId

  if (boardId === "routine") return <RoutineDetailPage />;
  if (boardId === "running") return <RunningDetailPage />;
  return <Box></Box>;
}

// RoutineDetailPage 연결
function RoutineDetailPage() {
  const navigate = useNavigate();
  const {principal} = usePrincipalState();
}



function RunningDetailPage() {}
