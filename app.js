const express = require("express");
const dotenv = require("dotenv");
const Database = require("./storage/mongoDb");
const helmet = require("helmet");
const xss = require("xss-clean");
const bodyParser = require("body-parser");
const upload = require("express-fileupload");
cookieParser = require("cookie-parser");

const usersRouter = require("./api/v1/routes/user.router");

const app = express();

// Set security HTTP headers
app.use(helmet());
app.use(upload());
app.use(cookieParser());
app.use(express.json());
dotenv.config();
app.use(
  cors({
    origin: `http://localhost:3000`, //react's address
    credentials: true,
  })
);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());

// Database Connection
const newDatabase = new Database();
newDatabase.creatDatabase();

// Data sanitization against XSS
app.use(xss());

app.use("/api/v1/users", usersRouter);

module.exports = app;
