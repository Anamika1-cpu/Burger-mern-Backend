import express, { urlencoded } from "express";
import dotenv from "dotenv";
import session from "express-session";
import cookieParser from "cookie-parser";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
const app = express();
export default app;
import userRoute from "./routes/user.js";
import ordrRoute from "./routes/order.js";
import { connectPassport } from "./utils/Provider.js";
import passport from "passport";

dotenv.config({
  path: "./config/config.env",
});

//using middlewares
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(
  urlencoded({
    extended: true,
  })
);
app.use(passport.authenticate("session"));
app.use(passport.initialize());
app.use(passport.session());
connectPassport();

//importing routes
app.use("/api/v1", userRoute);
app.use("/api/v1", ordrRoute);

//using error middleware
app.use(errorMiddleware);
