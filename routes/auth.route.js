const express = require("express");
const controller = require("../controllers/auth.controller");
const passport = require("passport");
const validate = require("../middlewares/validate");
const { loginSchema } = require("../validators/auth.validators");
const router = express.Router();

router.route("/register").post(controller.register);
router
  .route("/login")
  .post(
    validate(loginSchema),
    passport.authenticate("local", { session: false }),
    controller.login
  );
router.route("/me").get(controller.getMe);

module.exports = router;
