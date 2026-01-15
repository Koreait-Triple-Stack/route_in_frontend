import React from "react";
import { useParams } from "react-router-dom";

export default function BoardDetailPage() {
  const { boardId } = useParams(); // /board/:boardId

  if (boardId === "routine") return <RoutineDetailInner />;
  if (boardId === "running") return
  <RunningDetailInner />;

  return <div>BoardDetailPage</div>;
}
