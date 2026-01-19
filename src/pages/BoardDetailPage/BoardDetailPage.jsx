import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { removeBoardRequest } from "../../apis/board/boardApi";

function BoardDetailPage() {
  const [boardData, setBoardData] = useState({});
  const navigate = useNavigate();
  const { type, boardId } = useParams();
  const queryClient = useQueryClient();
  const userId = principal?.userId;

  const removeBoardmutation = useMutation({
    mutationKey: ["removeBoard", boardId],
    mutationFn: (payload) => removeBoardRequest(payload),
    onSuccess: (res) => {
      if (userId) {
        queryClient.invalidateQueries({
          queryKey: ["getBoardListByUserId", userId],
        });
      }
      queryClient.invalidateQueries({
        queryKey: ["getBoardByBoardId", boardId],
      });
      alert(res?.message ?? "게시물 삭제 완료");
      navigate("/board");
    },
    onError: (error) => {
      alert(error);
    },
  });

  const removeOnClickHandler = () => {
    if (!boardId) return alert("게시글 정보가 없습니다.");
    if (!userId) return alert("로그인이 필요합니다.");
    if (!window.confirm("게시물을 삭제하시겠습니까?")) return;

    removeBoardMutation.mutate({
      boardId: boardId,
      userId,
    });
  };
  const updateBoardmutation = useMutation({

  })
  return <Box></Box>;
}

export default BoardDetailPage;
