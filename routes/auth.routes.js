const express = require("express");
const controller = require("../controllers/auth.controller");
const passport = require("passport");
const validate = require("../middlewares/validate");
const { loginSchema } = require("../validators/auth.validators");
const captcha = require("../middlewares/captcha");
const router = express.Router();

router.route("/register").post(controller.register);
router
  .route("/login")
  .post(
    validate(loginSchema),
    captcha,
    passport.authenticate("local", { session: false }),
    controller.login
  );
router
  .route("/me")
  .get(
    passport.authenticate("accessToken", { session: false }),
    controller.getMe
  );

router.route(
  "/logout",
  passport.authenticate("accessToken", { session: false }),
  controller.logout
);

router
  .route("/google")
  .get(passport.authenticate("google", { scope: ["profile", "email"] }));

router
  .route("/google/callback")
  .get(passport.authenticate("google", { session: false }), controller.login);

router.route("/captcha").get(controller.getCaptcha);

module.exports = router;
