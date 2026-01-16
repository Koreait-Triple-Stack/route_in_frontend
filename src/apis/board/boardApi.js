import { instance } from "../utils/instance";

export const addBoardRequest = async (data) => {
  return instance.post("/board/add", data);
};
