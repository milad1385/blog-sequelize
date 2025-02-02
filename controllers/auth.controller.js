const { User } = require("../configs/db");
const redis = require("../configs/redis");
const constant = require("../constants/constant");
const { registerSchema } = require("../validators/auth.validators");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const svgCaptcha = require("svg-captcha");
const UUID = require("uuid").v4;

exports.register = async (req, res, next) => {
  try {
    const { name, username, email, password } = req.body;
    await registerSchema.validate(req.body, { abortEarly: false });

    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(password, salt);

    const usersCount = await User.count({});

    const user = await User.create({
      name,
      username,
      email,
      password: hashedPassword,
      role: usersCount > 0 ? "user" : "admin",
    });

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      constant.auth.accessTokenKey,
      { expiresIn: constant.auth.accessTokenExpire + "s" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      constant.auth.refreshTokenKey,
      { expiresIn: constant.auth.refreshTokenExpire + "s" }
    );

    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await redis.set(
      `refreshToken:${user.id}`,
      hashedRefreshToken,
      "EX",
      constant.auth.refreshTokenExpire
    );

    return res.status(201).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const user = req.user;

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      constant.auth.accessTokenKey,
      { expiresIn: constant.auth.accessTokenExpire + "s" }
    );

    const refreshToken = jwt.sign(
      { id: user.id },
      constant.auth.refreshTokenKey,
      { expiresIn: constant.auth.refreshTokenExpire + "s" }
    );

    const salt = await bcrypt.genSalt(12);
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    await redis.set(
      `refreshToken:${user.id}`,
      hashedRefreshToken,
      "EX",
      constant.auth.refreshTokenExpire
    );

    return res.status(201).json({
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    const user = req.user;

    return res.json(user);
  } catch (error) {
    next(error);
  }
};

exports.getCaptcha = async (req, res, next) => {
  try {
    const { data, text } = svgCaptcha.create({
      noise: 5,
      size: 5,
    });

    const uuid = UUID();

    await redis.set(`captcha:${uuid}`, text.toLowerCase(), "EX", 60 * 3);

    return res.json({ data, uuid });
  } catch (error) {
    next(error);
  }
};

exports.showLoginView = async (req, res, next) => {
  try {
    return res.render("index");
  } catch (error) {
    next(error);
  }
};
