import express, { NextFunction, Request, Response } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";
import logger from "morgan";
import fileupload from "express-fileupload";
// import database

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";
import loginRouter from "./routes/login";
import registerRouter from "./routes/register";
import verifyCodeRouter from "./routes/verifyCode";
import addDetailRouter from "./routes/add-details";
import updateDetailRouter from "./routes/update-details";
import errorHandler from "api-error-handler";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
// import compression from "compression";

class App {
  public server;

  constructor() {
    this.server = express();

    this.middlewares();

    this.routes();
  }
  private jsonErrorHandler(
    err: any,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    res.status(err.status ?? 500).json({ error: err });
    // console.log("error", err);

    // return next();
  }
  // Set up rate limiter: maximum of twenty requests per minute
  // RateLimit = require("express-rate-limit");
  limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 20,
  });
  private middlewares() {
    this.server.enable("trust proxy");
    this.server.use(express.json());
    this.server.use(logger("dev"));
    this.server.use(cors());
    this.server.use(express.urlencoded({ extended: false }));
    this.server.use(cookieParser());
    this.server.use(fileupload());
    this.server.use(express.static(path.join(__dirname, "public")));
    this.server.use(express.static("./upload"));
    // this.server.use(compression);
    // Add helmet to the middleware chain.
    // Set CSP headers to allow our Bootstrap and Jquery to be served
    this.server.use(
      helmet.contentSecurityPolicy({
        directives: {
          "script-src": ["'self'", "code.jquery.com", "cdn.jsdelivr.net"],
        },
      })
    );
    this.server.use(this.limiter);
  }

  private routes() {
    this.server.use("/", indexRouter);
    this.server.use("/users", usersRouter);
    // this.server.use("/employees", employeesRouter);
    this.server.use("/auth/login", loginRouter);
    this.server.use("/auth/register", registerRouter);
    this.server.use("/auth/verify-code", verifyCodeRouter);
    this.server.use("/auth/add-detail", addDetailRouter);
    this.server.use("/auth/update-detail", updateDetailRouter);
    this.server.use(errorHandler);
    this.server.use(this.jsonErrorHandler);
    this.server.use("*", (req: Request, res: Response, next: NextFunction) => {
      // console.log(res.statusCode);
      // if (res.statusCode === 404) {
      // const err = new Error("File not found");
      return res.status(404).json({ message: "Route Not Found" });
      // next(err);
      // } else {
      //   next();
      // }
    });
  }
}

export default new App().server;
