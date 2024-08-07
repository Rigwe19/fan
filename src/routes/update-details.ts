import express, { NextFunction, Request, Response } from "express";
import { getLogger } from "../utils/loggers";
const router = express.Router();
const logger = getLogger("REGISTER_ROUTE");
import { check, matchedData, validationResult } from "express-validator";
import Detail from "../models/Detail";
import verifyToken from "../utils/authJWT";
import { ObjectId } from "mongodb";

/* POST Register page. */
router.post("/", verifyToken, async (req: Request, res: Response) => {
  logger.info("Register Express");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.mapped() });
  }
  console.log(req.user._id);
  // if (!req.auth.admin) return res.sendStatus(401);
  try {
    let detail = await Detail.findOneAndUpdate(
      { user_id: new ObjectId(req.user._id) },
      {
        ...req.body,
      }
    );
    return res.status(201).json({
      success: true,
      data: {
        detail: detail,
        // gender: newDetail.gender,
        // marital: newDetail.marital,
        // religion: newDetail.religion,
        // id: newDetail._id,
      },
    });
  } catch (err: any) {
    const errors = Object.keys(err.errors).map((key) => {
      return { [key]: err.errors[key].message };
    });
    return res.status(422).json({ error: errors });
  }
});

export default router;
