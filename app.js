const config = require("./utils/config.js");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const cors = require("cors");
const notesRouter = require("./controllers/notes");
const middleware = require("./utils/middleware");
const mongoose = require("mongoose");
const logger = require("./utils/logger.js");
const usersRouter = require("./controllers/users.js");
const loginRouter = require('./controllers/login')

mongoose
  .connect(config.MONGODB_URI, { useNewUrlParser: true })
  .then(() => {
    logger.info("connected to MongoDB");
  })
  .catch(error => {
    logger.error("error connection to MongoDB:", error.message);
  });

app.use(cors());
app.use(express.static("build"));
app.use(bodyParser.json());
app.use(middleware.requestLogger);

app.use("/api/login", loginRouter);
app.use("/api/users", usersRouter);
app.use("/api/notes", notesRouter);

app.use(middleware.unknownEndpoint);
app.use(middleware.errorHandler);

//Error Handling

module.exports = app;
