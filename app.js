import express from "express";
import path, { dirname } from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import { fileURLToPath } from "url";

import indexRouter from "./routes/index.js";
import authRouter from "./routes/auth.js";

import session from "express-session";
import passport from "passport";

// ES6 modules don't have __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "front", "dist")));

app.use(
  session({
    secret: "my_secret_key",
    resave: false,
    saveUninitialized: true,
  }),
);

app.use(passport.authenticate("session"));

app.use("/", indexRouter);
app.use("/", authRouter);

export default app;
