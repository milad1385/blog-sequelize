const express = require("express");
const cors = require("cors");
const cookie = require("cookie-parser");
const path = require("path");
const { errorHandler } = require("./middlewares/errorHandler");
const { setHeaders } = require("./middlewares/headers");
const authRoutes = require("./routes/auth.routes");
const articleRoutes = require("./routes/article.routes");
const passport = require("passport");

const localStrategy = require("./strategies/localStrategy");
const { showLoginView } = require("./controllers/auth.controller");
const jwtAccessTokenStrategy = require("./strategies/jwtAccessTokenStrategy");
const googleStrategy = require("./strategies/googleStrategy");
const jwtRefreshTokenStrategy = require("./strategies/jwtRefreshTokenStrategy");

const app = express();

//* middlewares

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookie());

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

//* Cors Policy
app.use(setHeaders);

passport.use(localStrategy);
passport.use("accessToken", jwtAccessTokenStrategy);
passport.use(googleStrategy);
passport.use("refreshToken", jwtRefreshTokenStrategy);

//* Static Folders
app.use(express.static(path.join(__dirname, "public")));

app.use("/auth", authRoutes);
app.use("/article", articleRoutes);

app.get("/login", showLoginView);

app.use((req, res) => {
  console.log("this path is not found:", req.path);
  return res
    .status(404)
    .json({ message: "404! Path Not Found. Please check the path/method" });
});

app.use(errorHandler);
// routes
module.exports = app;
