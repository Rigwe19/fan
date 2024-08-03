import express, { NextFunction, Request, Response } from "express";
import { getLogger } from "../utils/loggers";
import User from "../models/User";
const router = express.Router();
const logger = getLogger("USER_ROUTE");

/* GET users listing. */
router.get(
  "/",
  async function (_req: Request, res: Response, _next: NextFunction) {
    logger.info("respond with a resource");
    const users = await User.find();
    res.status(200).json({ users: users });
  }
);

export default router;
