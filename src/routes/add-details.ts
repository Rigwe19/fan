import express, { NextFunction, Request, Response } from "express";
import { getLogger } from "../utils/loggers";
const router = express.Router();
const jwt = require("jsonwebtoken");
const logger = getLogger("REGISTER_ROUTE");
import { check, matchedData, validationResult } from "express-validator";
import Detail from "@/models/Detail";
import { expressjwt } from "express-jwt";

/* POST Register page. */
router.post(
  "/",
  expressjwt({ secret: "FindANurseSecret", algorithms: ["HS256"] }),
  [
    check("gender").isString(),
    check("marital").isString(),
    check("religion").isString(),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Register Express");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }
    console.log(req);
    // if (!req.auth.admin) return res.sendStatus(401);
    const { gender, marital, religion } = matchedData(req);

    const newDetail = new Detail({
      gender,
      marital,
      religion,
    });

    try {
      //   await newDetail.save();
    } catch (err: any) {
      const errors = Object.keys(err.errors).map((key) => {
        return { [key]: err.errors[key].message };
      });
      return res.status(422).json({ error: errors });
    }
    res.status(201).json({
      success: true,
      data: {
        userId: newDetail.user_id,
        gender: newDetail.gender,
        marital: newDetail.marital,
        religion: newDetail.religion,
        id: newDetail._id,
      },
    });
  }
);

export default router;
