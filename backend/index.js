//jos ajaa manuaalisesti backend kansiosta:
require("dotenv").config({ path: "../.env" });

// require("dotenv").config();
const express = require("express");
const app = express();
var cors = require("cors");
app.use(cors());
//When frontend has been built
//app.use(express.static("./frontend/dist"));
const port = 8080;
const wordsRouter = require("./routes/words");
const connectionFunctions = require("./database/repository");
app.use(express.json());

let server = undefined;

connectionFunctions
  .connect()
  .then(() => {
    console.log("MySQL connection successful.");

    app.use("/api/words", wordsRouter);

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

//Graceful shutdown
const gracefulShutdown = () => {
  console.log("Starting graceful shutdown...");
  // Close the server
  if (server) {
    console.log("Server was opened, so we can close it...");
    // Give error message if server closing does not work
    server.close((err) => {
      if (err) {
        console.error("Error closing server:", err);
      } else {
        console.log("Server closed");
        // Try to close db, give errors is that does not work
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
