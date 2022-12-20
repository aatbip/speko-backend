import express, { Response, Request, NextFunction } from "express";

import { example } from "../controllers/authController";

const router = express.Router();

router.post("/example", example);

export default router;
