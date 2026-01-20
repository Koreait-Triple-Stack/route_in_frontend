import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBoardByBoardIdRequest } from "../../apis/board/boardApi";
import { useMutation } from "@tanstack/react-query";

function BoardEditPage() {
  const { boardId } = useParams();
  const boardIdNum = Number(boardId);

  const usenavigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    content: "",
  });




  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 1.기존 게시글 조회 
  const { data: boardResp, isLoading } = useQuery({
    queryKey: ["getBoardByBoardId", boardIdNum],
    queryFn: () => getBoardByBoardIdRequest(boardIdNum),
    enabled: Number.isFinite(boardIdNum) && boardIdNum > 0,
  });

  const updateMutation = useMutation({
    mutationKey: ["updateBoard"],
    mutation
  })
}
