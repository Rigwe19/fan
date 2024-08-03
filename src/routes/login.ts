import express, { NextFunction, Request, Response } from "express";
import { getLogger } from "../utils/loggers";
import User from "../models/User";
import bcrypt from "bcryptjs";
import { check, validationResult } from "express-validator";

const router = express.Router();
const jwt = require("jsonwebtoken");
const logger = getLogger("LOGIN_ROUTE");
// const bcrypt = require("bcryptjs");

/* POST login page. */
router.post(
  "/",
  [
    check("email").isEmail().withMessage("must be an Email").trim(),
    // .normalizeEmail()
    // .custom((value) => {
    //   User.findOne({ email: value }).then((user) => {
    //     if (user) throw new Error("this email is already in use");
    //   });
    // }),
    check("password", "Password Must be at least 6 characters").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("login Express");
    console.log(req.body);
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }
    let { email, password } = req.body;

    let existingUser;
    try {
      existingUser = await User.findOne({ email: email });
    } catch {
      console.log("first");
      const error = new Error("User not found");
      return next(error);
    }
    if (existingUser) {
      bcrypt.compare(password, existingUser.password, function (err, result) {
        if (result) {
          try {
            let token;
            //Creating jwt token
            token = jwt.sign(
              {
                userId: existingUser.id,
                email: existingUser.email,
              },
              "FindANurseSecret",
              { expiresIn: "1h" }
            );
            return res.status(200).json({
              success: true,
              data: {
                user: {
                  userId: existingUser.id,
                  email: existingUser.email,
                  name: existingUser.name,
                  password: existingUser.password,
                  phone: existingUser.phone,
                  isVerified: existingUser.isVerified,
                  token,
                },
              },
            });
            // console.log(result, err);
            // return next();
          } catch (errs: any) {
            console.log(errs);
            const error = new Error(errs);
            return next(error);
          }
        } else {
          const error = Error("Wrong details please check at once");
          return next(error);
        }
      });
    } else {
      const error = new Error();
      error.message = "User not found";
      // error.stack.
      return next(error);
    }
  }
);

export default router;
