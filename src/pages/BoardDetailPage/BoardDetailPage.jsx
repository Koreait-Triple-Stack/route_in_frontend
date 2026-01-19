import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";

function BoardDetailPage() {
  const [boardData, setBoardData] = useState({});
  const navigate = useNavigate();
  const { boardId } = useParams();
  const qeueryClient = useQueryClient();
  const userId = principal?.userId;

  const removeOnClickHandler = () => {};

  return <Box></Box>;
}

export default BoardDetailPage;
