import passport from "passport";
import express from "express";
import { logout, myProfile } from "../controllers/user.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.get(
  "/googleLogin",
  passport.authenticate("google", {
    scope: ["profile"],
  })
);

router.get(
  "/login",
  passport.authenticate("google"),
  // {
  //     scope: ["profile"],
  //     successRedirect: process.env.FRONTEND_URL,
  //   })
  (req, res) => {
    res.send("Logged In");
  }
);

router.get("/me", isAuthenticated, myProfile);

router.get("/logout", logout);

export default router;
