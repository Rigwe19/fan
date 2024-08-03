/**
 * Module dependencies.
 */

import "module-alias/register";
import { config } from "dotenv";
config();

import app from "./app";
import Debug from "debug";
import http from "http";

const debug = Debug("server:server");
import { bootstrapLogger } from "./utils/loggers";
import { connect, set } from "mongoose";
bootstrapLogger();

/**
 * Get port from environment and store in Express.
 */

const port = normalizePort(process.env.PORT ?? "3003");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */
// mongodb://127.0.0.1:27017/employees_db
set("strictQuery", false);
// mongodb+srv://igwereinhard:o6BrYdFI8LpjlQ3N@fan-cluster.49uvi1o.mongodb.net/
const mongodb =
  // process.env.MONGODB_CONNECTION_STRING ??
  "mongodb+srv://igwereinhard:o6BrYdFI8LpjlQ3N@fan-cluster.49uvi1o.mongodb.net/fan_db?retryWrites=true&w=majority";
console.log(mongodb);
// "mongodb+srv://igwereinhard:atXkGWWoxbfDGu52@fan-cluster.49uvi1o.mongodb.net/?retryWrites=true&w=majority&appName=fan-cluster";
connect(mongodb).then(async () => {
  server.listen(port, () =>
    console.log("💥🚀💖 ~ server launch  ~ port", port)
  );
  server.on("error", onError);
  server.on("listening", onListening);
  console.log("Mongo Connected");
});

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val: string) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error: { syscall: string; code: string }) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  debug("Listening on " + bind);
}
