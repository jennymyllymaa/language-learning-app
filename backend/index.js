/**
 * Configuration setup for environment variables.
 * Loads environment variables from the specified file.
 */
require("dotenv").config();

/**
 * Express application for the backend server.
 */
const express = require("express");

/**
 * Utilizes the Express framework for handling HTTP requests and responses.
 */
const app = express();

/**
 * Enables CORS.
 */
var cors = require("cors");
app.use(cors());


/**
 * Use dist(build) instead of actual frontend.
 */
app.use(express.static("./frontend/dist"));

/**
 * Port number for server to listen to.
 * @type {number}
 */
const port = 8080;

/**
 * Router for handling words routes.
 * @type {object}
 */
const wordsRouter = require("./routes/words");

/**
 * Router for handling tests routes.
 * @type {object}
 */
const testsRouter = require("./routes/tests");

/**
 * Functions for the database connection.
 * @type {object}
 */
const connectionFunctions = require("./database/repository");

/**
 * Middleware to parse incoming JSON requests
 */
app.use(express.json());

/**
 * Establishing the server object.
 * @type {object}
 */
let server = undefined;

/**
 * Establishing connection to database.
 */
connectionFunctions
  .connect()
  .then(() => {
    console.log("MySQL connection successful.");

    app.use("/api/words", wordsRouter);
    app.use("/api/tests", testsRouter);

    server = app
      .listen(port, () => {
        console.log(`Server listening on port ${port}`);
      })
      .on("error", (err) => {
        console.error("Error starting server:", err);
        process.exit(1);
      });
  })
  .catch((err) => {
    console.error("Error connecting to MySQL:", err);
    process.exit(1);
  });

/**
 * Graceful shutdown function to handle server and database closure.
 */
const gracefulShutdown = () => {
  console.log("Starting graceful shutdown...");
  if (server) {
    console.log("Server was opened, so we can close it...");
    server.close((err) => {
      if (err) {
        console.error("Error closing server:", err);
      } else {
        console.log("Server closed");
        connectionFunctions.close((err) => {
          if (err) {
            console.error("Error closing database:", err);
          } else {
            console.log("Database connection closed");
          }
          process.exit(0);
        });
      }
    });
  } else {
    console.log("Server was not opened, exiting...");
    process.exit(0);
  }
};

// Handle process signals for graceful shutdown
process.on("SIGTERM", gracefulShutdown); // Some other app requires shutdown.
process.on("SIGINT", gracefulShutdown); // ctrl-c
