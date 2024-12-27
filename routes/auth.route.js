const express = require("express");
const controller = require("../controllers/auth.controller");
const router = express.Router();

router.route("/register").post(controller.register);
router.route("/login").post(controller.login);
router.route("/me").get(controller.getMe);

module.exports = router;
