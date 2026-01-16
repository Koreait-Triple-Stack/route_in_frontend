import { addBoardRequest } from "./boardApi";

export const addBoard = async (data) => {
  const result = await addBoardRequest(data);

  if (result.data.status !== "success") throw new Error(result.data.message);

  return result.data;
};
