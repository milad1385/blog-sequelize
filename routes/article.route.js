const express = require("express");
const controller = require("../controllers/article.controller");
const validate = require("../middlewares/validate");
const { articleSchema } = require("../validators/article.validators");
const passport = require("passport");

const router = express.Router();

router
  .route("/")
  .post(
    validate(articleSchema),
    passport.authenticate("accessToken", { session: false }),
    controller.create
  );

module.exports = router;
