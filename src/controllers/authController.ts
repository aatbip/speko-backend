import { Request, Response } from "express";
import { asyncWrapper } from "../utils/asyncWrapper";
import { success, failure } from "../utils/responseMessage";

const example = asyncWrapper(async (req: Request, res: Response) => {
  return res.status(200).json(success("hello"));
});

export { example };
