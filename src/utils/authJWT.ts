import User from "../models/User";
import { NextFunction, Request, Response } from "express";
import jwt, { Jwt } from "jsonwebtoken";

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers?.authorization?.split(" ")[1];
  //Authorization: 'Bearer TOKEN'
  if (!token) {
    return res.status(200).json({
      success: false,
      message: "Error!Token was not provided.",
    });
  }
  if (token) {
    const decodedToken: any = jwt.verify(
      token,
      "FindANurseSecret",
      (err, decoded) => {
        if (err) {
          return res.status(419).json({
            success: false,
            message: "Error! Token has expire login.",
          });
        }
      }
    );
    const user = await User.findById(decodedToken.userId);
    req.user = user;
  }
  next();
};
export default verifyToken;
