import express, { NextFunction, Request, Response } from "express";
import { getLogger } from "../utils/loggers";
import User from "../models/User";
import { check, matchedData, validationResult } from "express-validator";
import { compare } from "bcryptjs";
const router = express.Router();
const logger = getLogger("VERIFY_CODE_ROUTE");

router.post(
  "/",
  [
    check("email").isEmail(),
    check("code").isNumeric().isLength({ min: 4, max: 4 }),
  ],
  async function (req: Request, res: Response, _next: NextFunction) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.mapped() });
      }
      const { email, code } = matchedData(req);
      const user = await User.findOne({ email });
      console.log(user);
      if (user) {
        await compare(code, user.code, async (err, result) => {
          if (result) {
            user.isVerified = true;
            await user.save().then((resp) => {
              return res.status(200).json({ user: user });
            });
          } else {
            return res.status(422).json({ error: "Invalid verification code" });
          }
        });
      }
    } catch (th) {
      return res.status(500).json({ error: "error verifying code" });
    }
  }
);

export default router;
