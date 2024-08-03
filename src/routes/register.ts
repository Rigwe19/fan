import express, { NextFunction, Request, Response } from "express";
import { getLogger } from "../utils/loggers";
import User from "@/models/User";
const router = express.Router();
const jwt = require("jsonwebtoken");
const logger = getLogger("REGISTER_ROUTE");
import bcrypt from "bcryptjs";
import { check, matchedData, validationResult } from "express-validator";
import { getDigitalCode } from "node-verification-code";
import sendMail from "@/mail/verification";

/* POST Register page. */
router.post(
  "/",
  [
    check("name").isString(),
    check("email").isEmail(),
    check("password").isStrongPassword({ minLength: 8 }),
    check("phone").isMobilePhone("any"),
  ],
  async (req: Request, res: Response, next: NextFunction) => {
    logger.info("Register Express");
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }
    const { name, email, password, phone } = matchedData(req);
    const code = getDigitalCode(4).toString();
    // console.log(code);

    // let user = await User.findOne({ email });
    // if (user) return res.status(400).send("User already registered.");
    const hashPassword = bcrypt.hashSync(password, 10);
    const hashCode = bcrypt.hashSync(code, 10);
    const newUser = new User({
      name,
      email,
      phone,
      code: hashCode,
      password: hashPassword,
    });
    await User.deleteMany();

    try {
      // setTimeout(async () => {
      await newUser.save();
      await sendMail(newUser, code);
      // }, 1000);
    } catch (err: any) {
      const errors = Object.keys(err.errors).map((key) => {
        return { [key]: err.errors[key].message };
      });
      return res.status(422).json({ error: errors });
    }
    let token;
    try {
      token = jwt.sign(
        {
          userId: newUser.id,
          email: newUser.email,
        },
        "FindANurseSecret",
        { expiresIn: "1h" }
      );
    } catch (err) {
      const error = new Error("Error! Something went wrong.");
      return next(error);
    }
    res.status(201).json({
      success: true,
      data: {
        userId: newUser.id,
        email: newUser.email,
        phone: newUser.phone,
        isVerified: newUser.isVerified,
        id: newUser._id,
        token: token,
      },
    });
  }
);

export default router;
