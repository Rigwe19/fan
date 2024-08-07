import { Document, Model, Types } from "mongoose";
import { IUser } from "../../src/models/User";
import { IRequest } from "express";
declare global {
  namespace Express {
    export interface Request extends IRequest {
      user?: any;
    }
  }
}
