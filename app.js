const express = require("express");
const cors = require("cors");
const cookie = require("cookie-parser");
const path = require("path");
const { errorHandler } = require("./middlewares/errorHandler");
const { setHeaders } = require("./middlewares/headers");
const authRoutes = require("./routes/auth.route");
const passport = require("passport");
const strategy = require("./middlewares/strategy");

const app = express();

//* middlewares

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

//* Cors Policy
app.use(setHeaders);

passport.use(strategy);

//* Static Folders
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);

app.use((req, res) => {
  console.log("this path is not found:", req.path);
  return res
    .status(404)
    .json({ message: "404! Path Not Found. Please check the path/method" });
});

app.use(errorHandler);
// routes
module.exports = app;
