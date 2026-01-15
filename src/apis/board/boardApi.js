import { instance } from "../utils/instance";

export const addBoardRequest = async (data) => {
  const response = await instance.post("/board/add", data);
  return response; 
};
