const express = require("express");
const { multerStorage } = require("../middlewares/multer");
const controller = require("../controllers/article.controller");
const validate = require("../middlewares/validate");
const { articleSchema } = require("../validators/article.validators");
const passport = require("passport");

const router = express.Router();

const multer = multerStorage("public/images/article");

router
  .route("/")
  .post(
    validate(articleSchema),
    passport.authenticate("accessToken", { session: false }),
    multer.single("cover"),
    controller.create
  );

router.route("/:slug").get(controller.findBySlug);

router
  .route("/:id")
  .delete(
    passport.authenticate("accessToken", { session: false }),
    controller.delete
  );

module.exports = router;
